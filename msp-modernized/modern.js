/**
 * modern.js — Marathon's Story Page modernization shim
 *
 * Drop this (and modern.css) into the site root and add to index.html <head>:
 *
 *   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 *   <link rel="stylesheet" href="modern.css" />
 *   <script src="modern.js"></script>
 *
 * Staging: also load msp-staging-config.js before this script and deploy
 * msp-proxy.php alongside it. See those files for details.
 *
 * What this does:
 *
 *  ALL viewports:
 *    Deep-links — every navigation pushes ?~=page.html to the URL so any
 *    page can be bookmarked or shared. An incoming ?~= param is honoured
 *    on load. All link clicks are intercepted and routed through navigateTo()
 *    so the param is always in sync with the displayed page.
 *
 *  DESKTOP (viewport >= MOBILE_THRESHOLD):
 *    The <frameset> renders normally — the antique experience is preserved.
 *    When PROXY_URL is set (staging only), frame content is reloaded through
 *    the proxy so links and media resolve against the correct origin.
 *
 *  MOBILE (viewport < MOBILE_THRESHOLD):
 *    <frameset> is renamed to <x-frameset> so CSS can hide it (browsers
 *    ignore display:none on real framesets). A proper <body> is built with
 *    a drop-down hamburger nav and a <main>. Frame content is fetched,
 *    sanitized, and injected. Navigation and back/forward are fully wired.
 *
 *  RESIZE:
 *    Crossing the threshold swaps between frameset and mobile UI, restoring
 *    whatever page was last shown via the deep-link param.
 */

(function () {
  "use strict";

  // ─── Configuration ───────────────────────────────────────────────────────────

  /** Viewport width (px) below which mobile mode activates. */
  const MOBILE_THRESHOLD = 1024;

  /** Query-string key used for deep-linking, e.g. ?~=somepage.html */
  const DEEP_LINK_KEY = "~";

  /**
   * Optional content root for staging/dev.
   * Set window.MSP_CONTENT_ROOT = "https://marathon.bungie.org/story/" in
   * msp-staging-config.js (loaded before this script). Leave unset on the live server.
   */
  const CONTENT_ROOT = (window.MSP_CONTENT_ROOT || "").replace(/\/?$/, "/");

  /**
   * Optional server-side proxy URL for staging, e.g. "/msp-modernized/msp-proxy.php".
   * Set window.MSP_PROXY in msp-staging-config.js. Leave unset on the live server.
   */
  const PROXY_URL = window.MSP_PROXY || null;

  // ─── URL primitives ──────────────────────────────────────────────────────────

  /** File extensions treated as media — loaded directly by the browser, not proxied. */
  const MEDIA_EXTS = /\.(mp4|webm|ogv|ogg|mp3|wav|flac|mov|avi|mkv|jpg|jpeg|gif|png|webp|svg|ico)$/i;

  /** Prepend CONTENT_ROOT to a relative path; leave absolute URLs alone. */
  function resolveUrl(path) {
    if (!path || !CONTENT_ROOT) return path || "";
    if (/^https?:\/\//.test(path)) return path;
    return CONTENT_ROOT + path.replace(/^\//, "");
  }

  /**
   * Reduce any URL form to a bare MSP-content-relative path.
   *   "https://marathon.bungie.org/story/_images/foo.jpg" -> "_images/foo.jpg"
   *   "http://localhost:8000/msp-modernized/_images/foo.jpg" -> "_images/foo.jpg"
   *   "mainpage.html" -> "mainpage.html"
   *   "https://marathon.bungie.org/story/" -> "" (content root = home page)
   */
  function contentPath(src) {
    if (!src) return "";
    if (!/^https?:\/\//.test(src)) return src.replace(/^\//, "");
    try {
      const u = new URL(src);
      const storyPath = CONTENT_ROOT ? new URL(CONTENT_ROOT).pathname : "/story/";
      if (u.pathname.startsWith(storyPath)) return u.pathname.slice(storyPath.length);
      const pageDir = location.pathname.replace(/[^/]*$/, "");
      if (u.pathname.startsWith(pageDir)) return u.pathname.slice(pageDir.length);
      return u.pathname.replace(/^\//, "");
    } catch (_) { return src; }
  }

  /**
   * URL to use for actual network requests (fetch / frame src).
   *   Staging: HTML through the proxy; media directly to MSP (browser allows cross-origin).
   *   Live:    bare relative path.
   */
  function fetchHref(path) {
    if (!path || !PROXY_URL) return path || "";
    if (MEDIA_EXTS.test(path)) return resolveUrl(path);
    return `${PROXY_URL}?url=${encodeURIComponent(path)}`;
  }

  /**
   * URL to write into href/src attributes — looks correct on hover/inspect.
   *   HTML links: bare relative path (click interception handles the actual fetch).
   *   Media:      absolute MSP URL (browser loads cross-origin natively).
   */
  function displayHref(path) {
    if (!path) return "";
    if (MEDIA_EXTS.test(path)) return resolveUrl(path);
    return path;
  }

  /**
   * Strip any proxy prefix from a frame src attribute value so we get the
   * bare content path regardless of how the src was written in index.html.
   * "msp-proxy.php?url=mainpage.html" -> "mainpage.html"
   */
  function stripProxyPrefix(frameSrc) {
    if (!frameSrc || !PROXY_URL) return frameSrc || "";
    const proxyFile = PROXY_URL.replace(/^.*\//, "");
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp("^(?:" + esc(proxyFile) + "|" + esc(PROXY_URL) + ")\\?url=", "i");
    const match = frameSrc.match(pattern);
    if (match) {
      try   { return decodeURIComponent(frameSrc.slice(match[0].length)); }
      catch (_) { return frameSrc.slice(match[0].length); }
    }
    return frameSrc;
  }

  // ─── Deep-link param ─────────────────────────────────────────────────────────

  function getDeepLink() {
    return new URLSearchParams(location.search).get(DEEP_LINK_KEY) || null;
  }

  function pushDeepLink(page, replace = false) {
    const url = new URL(location.href);
    if (page) url.searchParams.set(DEEP_LINK_KEY, page);
    else      url.searchParams.delete(DEEP_LINK_KEY);
    if (replace) history.replaceState(null, "", url);
    else         history.pushState(null, "", url);
  }

  // ─── Frameset rename/unrename ─────────────────────────────────────────────────

  /**
   * Rename <frameset> -> <x-frameset> (and <frame> -> <x-frame>) so that
   * display:none works — browsers ignore CSS on real <frameset> elements.
   * Idempotent: returns the existing <x-frameset> if already renamed.
   */
  function renameFrameset() {
    const existing = document.querySelector("x-frameset");
    if (existing) return existing;
    const frameset = document.querySelector("frameset");
    if (!frameset) return null;
    const xFrameset = document.createElement("x-frameset");
    for (const attr of frameset.attributes) xFrameset.setAttribute(attr.name, attr.value);
    for (const child of frameset.children) {
      if (child.tagName.toLowerCase() === "frame") {
        const xFrame = document.createElement("x-frame");
        for (const attr of child.attributes) xFrame.setAttribute(attr.name, attr.value);
        xFrameset.appendChild(xFrame);
      }
    }
    frameset.replaceWith(xFrameset);
    return xFrameset;
  }

  /** Reverse renameFrameset so the browser re-parses it as a real frameset. */
  function unrenameFrameset() {
    const xFrameset = document.querySelector("x-frameset");
    if (!xFrameset) return;
    const frameset = document.createElement("frameset");
    for (const attr of xFrameset.attributes) frameset.setAttribute(attr.name, attr.value);
    for (const child of xFrameset.children) {
      if (child.tagName.toLowerCase() === "x-frame") {
        const frame = document.createElement("frame");
        for (const attr of child.attributes) frame.setAttribute(attr.name, attr.value);
        frameset.appendChild(frame);
      }
    }
    xFrameset.replaceWith(frameset);
  }

  // ─── URL rewriting ───────────────────────────────────────────────────────────

  /**
   * Rewrite all URL attributes in a subtree so they resolve correctly in the
   * current environment (staging or live).
   *
   * linkHref controls how <a href> is written:
   *   displayHref — bare relative path (used by both mobile and desktop)
   * All media attributes use resolveUrl (absolute MSP URL).
   */
  function rewriteUrls(root, baseUri, linkHref) {
    linkHref = linkHref || displayHref;

    function rewriteAttr(el, attr, hrefFn) {
      const val = el.getAttribute(attr);
      if (!val || /^(mailto:|javascript:|#|data:)/.test(val)) return;
      if (PROXY_URL && (val.startsWith(PROXY_URL) || val.includes("msp-proxy.php"))) return;
      // For absolute URLs, only rewrite those belonging to the MSP origin
      if (/^https?:/.test(val)) {
        try {
          const contentOrigin = CONTENT_ROOT ? new URL(CONTENT_ROOT).origin : null;
          if (!contentOrigin || new URL(val).origin !== contentOrigin) return;
        } catch (_) { return; }
      }
      try {
        const absolute = baseUri ? new URL(val, baseUri).href : resolveUrl(val);
        const path = contentPath(absolute);
        if (attr === "href" && path === "") {
          // Content root link — rewrite to the local page URL (no query string)
          el.setAttribute(attr, location.href.replace(/\?.*$/, ""));
          return;
        }
        el.setAttribute(attr, hrefFn(path));
      } catch (_) {}
    }

    root.querySelectorAll("a[href]").forEach(el => rewriteAttr(el, "href", linkHref));
    root.querySelectorAll("img[src]").forEach(el => rewriteAttr(el, "src", resolveUrl));
    root.querySelectorAll("video[src]").forEach(el => rewriteAttr(el, "src", resolveUrl));
    root.querySelectorAll("source[src]").forEach(el => rewriteAttr(el, "src", resolveUrl));
    root.querySelectorAll("[background]").forEach(el => rewriteAttr(el, "background", resolveUrl));
    root.querySelectorAll("link[href]").forEach(el => rewriteAttr(el, "href", resolveUrl));
    root.querySelectorAll("script[src]").forEach(el => rewriteAttr(el, "src", resolveUrl));
    root.querySelectorAll("img[srcset]").forEach(el => {
      const rewritten = el.getAttribute("srcset").split(",").map(part => {
        const t = part.trim(), sp = t.search(/\s/);
        const rawUrl = sp === -1 ? t : t.slice(0, sp);
        const desc   = sp === -1 ? "" : t.slice(sp);
        try {
          const abs = baseUri ? new URL(rawUrl, baseUri).href : resolveUrl(rawUrl);
          return resolveUrl(contentPath(abs)) + desc;
        } catch (_) { return part; }
      });
      el.setAttribute("srcset", rewritten.join(", "));
    });
  }

  // ─── Central navigation ───────────────────────────────────────────────────────

  let _navigateToMobile  = null; // set by initMobileMode
  let _navigateToDesktop = null; // set by setupDesktopFrames

  // Cached home page path — computed once from the original <frame> src attribute
  // before any proxy loading mutates it.
  let _homePath = null;

  function getHomePath() {
    if (_homePath !== null) return _homePath;
    const frameEl = document.querySelector('frame[name="main"], x-frame[name="main"]');
    _homePath = contentPath(resolveUrl(stripProxyPrefix(frameEl?.getAttribute("src") || "")));
    return _homePath;
  }

  /**
   * Universal navigation entry point — called by initial load, resize, link
   * clicks, and popstate. Sets the deep-link param then delegates to whichever
   * mode is currently active.
   *
   * path: bare content-relative path, e.g. "newmar26.html". Pass "" or null
   *       to navigate to the home page (clears the param).
   */
  function navigateTo(path, replace = false) {
    const homePath = getHomePath();
    const isHome   = !path || path === homePath;
    pushDeepLink(isHome ? null : path, replace);
    if (_navigateToMobile && document.getElementById("msp-body")?.style.display !== "none") {
      _navigateToMobile(isHome ? homePath : path);
    } else if (_navigateToDesktop) {
      _navigateToDesktop(isHome ? homePath : path);
    }
  }

  // ─── fetchPage ───────────────────────────────────────────────────────────────

  /**
   * Fetch an MSP page and return sanitized content ready for injection into
   * the mobile UI. Routes through PROXY_URL when set.
   *
   * Returns { html, bgcolor, text, link, vlink } so the caller can apply the
   * page's own body styles to the container element.
   */
  async function fetchPage(src) {
    const path = contentPath(resolveUrl(src));
    const resp = await fetch(fetchHref(path));
    if (!resp.ok) throw new Error(`HTTP ${resp.status} fetching ${path}`);
    const doc  = new DOMParser().parseFromString(await resp.text(), "text/html");
    const body = doc.body;

    // Lift bgcolor/text to inline style on the wrapper div
    const styleProps = [];
    if (body.getAttribute("bgcolor")) styleProps.push(`background-color:${body.getAttribute("bgcolor")}`);
    if (body.getAttribute("text"))    styleProps.push(`color:${body.getAttribute("text")}`);

    const wrapper = doc.createElement("div");
    wrapper.setAttribute("data-msp-frame", "");
    if (styleProps.length) wrapper.style.cssText = styleProps.join(";");
    while (body.firstChild) wrapper.appendChild(body.firstChild);

    // Wrap tables for horizontal scroll
    wrapper.querySelectorAll("table").forEach(table => {
      if (table.closest("[data-msp-scroll]")) return;
      const scroll = doc.createElement("div");
      scroll.setAttribute("data-msp-scroll", "");
      table.replaceWith(scroll);
      scroll.appendChild(table);
    });

    // Mark pre/xmp for CSS overflow handling
    wrapper.querySelectorAll("pre, xmp").forEach(pre => pre.setAttribute("data-msp-pre", ""));

    rewriteUrls(wrapper, CONTENT_ROOT || undefined, displayHref);

    const tmp = doc.createElement("div");
    tmp.appendChild(wrapper);
    return {
      html:    tmp.innerHTML,
      bgcolor: body.getAttribute("bgcolor") || "",
      text:    body.getAttribute("text")    || "",
      link:    body.getAttribute("link")    || "",
      vlink:   body.getAttribute("vlink")   || "",
    };
  }

  // ─── Desktop mode ────────────────────────────────────────────────────────────

  let frameDeepLinkingReady = false;

  /**
   * Attach per-frame listeners, rewrite frame content, and load initial pages.
   * Called on first desktop init (via window load) and again on every resize
   * back to desktop since unrenameFrameset creates fresh <frame> elements that
   * need new listeners.
   */
  function setupDesktopFrames() {
    const mainFrameEl = document.querySelector('frame[name="main"]');
    if (!mainFrameEl) return;
    const navFrameEl = Array.from(document.querySelectorAll("frame"))
      .find(f => f !== mainFrameEl);

    const navRaw  = navFrameEl ? (navFrameEl.getAttribute("src") || "") : "";
    const mainRaw = mainFrameEl.getAttribute("src") || "";

    // Register the desktop navigate function
    _navigateToDesktop = path => {
      mainFrameEl.src = fetchHref(contentPath(resolveUrl(path)));
    };

    function loadFrame(frameEl, src) {
      frameEl.src = fetchHref(contentPath(resolveUrl(stripProxyPrefix(src))));
    }

    // Rewrite a frame document's links and media, and attach click interceptors
    function rewriteFrameDoc(frameDoc, frameSrc) {
      if (!frameDoc) return;
      try {
        rewriteUrls(frameDoc, frameSrc, displayHref);

        // Video must be explicitly reloaded after its src attribute is rewritten
        frameDoc.querySelectorAll("video[src], video source[src]").forEach(el => {
          const video = el.tagName.toLowerCase() === "source" ? el.parentElement : el;
          if (video?.tagName.toLowerCase() === "video") video.load();
        });

        // Intercept all link clicks — route through navigateTo so the param
        // is always updated and proxy fetches are used when needed
        frameDoc.querySelectorAll("a[href]").forEach(a => {
          if (a.dataset.mspWired) return;
          const href = a.getAttribute("href");
          if (!href || /^(mailto:|javascript:|#)/.test(href)) return;
          const aTarget = (a.getAttribute("target") || "").toLowerCase();
          if (aTarget === "_blank") return; // open in new tab normally
          if (aTarget === "_top") {
            // _top links intentionally escape the frameset — let them navigate
            // the whole window, UNLESS they point to the content root itself
            // (which just means "go back to the start", handled in-place)
            const path = contentPath(resolveUrl(a.getAttribute("href") || ""));
            if (path !== "") {
              // Restore absolute MSP URL so the browser navigates to the live
              // site rather than a non-existent path on the staging server
              if (CONTENT_ROOT) a.setAttribute("href", resolveUrl(path));
              return;
            }
            // Root link — fall through to intercept as home navigation
          }
          a.dataset.mspWired = "1";
          a.addEventListener("click", e => {
            const h = a.getAttribute("href");
            if (!h || /^(mailto:|javascript:|#)/.test(h)) return;
            e.preventDefault();
            navigateTo(contentPath(resolveUrl(h)));
          });
        });
      } catch (_) {}
    }

    // Rewrite each frame's content as soon as it loads
    function watchFrame(frameEl) {
      frameEl.addEventListener("load", () => {
        try { rewriteFrameDoc(frameEl.contentDocument, frameEl.contentWindow.location.href); }
        catch (_) {}
      });
    }
    if (navFrameEl) watchFrame(navFrameEl);
    watchFrame(mainFrameEl);

    // Load both frames — main gets the deep-link page if one is set
    if (navFrameEl) loadFrame(navFrameEl, navRaw);
    loadFrame(mainFrameEl, getDeepLink() || mainRaw);
  }

  function initFramesetDeepLinking() {
    if (frameDeepLinkingReady) return;
    frameDeepLinkingReady = true;
    window.addEventListener("load", setupDesktopFrames);
  }

  // ─── Mobile mode ─────────────────────────────────────────────────────────────

  let mobileReady = false;

  async function initMobileMode(xFrameset) {
    const xFrames    = Array.from(xFrameset.querySelectorAll("x-frame"));
    const mainXFrame = xFrames.find(f => f.getAttribute("name") === "main");
    const navXFrame  = xFrames.find(f => f !== mainXFrame);
    if (!mainXFrame || !navXFrame) return;

    const navSrc  = stripProxyPrefix(navXFrame.getAttribute("src"));
    const mainSrc = stripProxyPrefix(mainXFrame.getAttribute("src"));

    // Build the mobile UI skeleton
    const body = document.createElement("body");
    body.id = "msp-body";
    body.innerHTML = `
      <header id="msp-header">
        <span id="msp-site-title">Marathon's Story Page</span>
        <button id="msp-hamburger" aria-label="Toggle navigation" aria-expanded="false" aria-controls="msp-nav">
          <span></span><span></span><span></span>
        </button>
      </header>
      <nav id="msp-nav" aria-label="Site navigation">
        <div id="msp-nav-content"><p style="padding:1em;opacity:.5">Loading navigation…</p></div>
      </nav>
      <main id="msp-main">
        <div id="msp-main-content"><p style="padding:1em;opacity:.5">Loading…</p></div>
      </main>
    `;
    document.documentElement.appendChild(body);

    const hamburger   = body.querySelector("#msp-hamburger");
    const nav         = body.querySelector("#msp-nav");
    const navContent  = body.querySelector("#msp-nav-content");
    const mainEl      = body.querySelector("#msp-main");
    const mainContent = body.querySelector("#msp-main-content");

    hamburger.addEventListener("click", () => {
      const open = nav.classList.toggle("msp-nav--open");
      hamburger.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("focusout", e => {
      if (!nav.contains(e.relatedTarget)) {
        nav.classList.remove("msp-nav--open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });

    // Apply <body> presentation attributes to the container so bgcolor/text/
    // link/vlink cover the padding area as well as the content
    function applyBodyStyles(container, page) {
      if (page.bgcolor) container.style.backgroundColor = page.bgcolor;
      if (page.text)    container.style.color = page.text;
      if (page.link)    container.style.setProperty("--msp-link",  page.link);
      if (page.vlink)   container.style.setProperty("--msp-vlink", page.vlink);
    }

    function closeNav() {
      nav.classList.remove("msp-nav--open");
      hamburger.setAttribute("aria-expanded", "false");
    }

    // Fetch and display a page in the main content area
    async function loadMain(path) {
      mainContent.innerHTML = `<p style="padding:1em;opacity:.5">Loading…</p>`;
      closeNav();
      try {
        const page = await fetchPage(path);
        mainContent.innerHTML = page.html;
        applyBodyStyles(mainContent, page);
        wireLinks(mainContent, /* interceptAll= */ true);
        mainEl.scrollTo(0, 0);
        window.scrollTo(0, 0);
      } catch (err) {
        mainContent.innerHTML = `
          <p style="padding:1em;color:#f66">
            Could not load <code>${path}</code>: ${err.message}.<br>
            <a href="${resolveUrl(path)}" target="_blank">Open directly ↗</a>
          </p>`;
      }
    }

    // Register the mobile navigate function
    _navigateToMobile = loadMain;

    // Intercept link clicks and route through navigateTo
    function wireLinks(container, interceptAll) {
      const selector = interceptAll ? "a[href]" : 'a[target="main"]';
      container.querySelectorAll(selector).forEach(a => {
        if (a.dataset.mspWired) return;
        const href = a.getAttribute("href");
        if (!href || /^(mailto:|javascript:|#)/.test(href)) return;
        const aTarget = (a.getAttribute("target") || "").toLowerCase();
        if (aTarget === "_blank") return; // open in new tab normally
        if (aTarget === "_top") {
          // _top links intentionally escape the frameset — let them navigate
          // the whole window, UNLESS they point to the content root itself
          const path = contentPath(resolveUrl(a.getAttribute("href") || ""));
          if (path !== "") {
            if (CONTENT_ROOT) a.setAttribute("href", resolveUrl(path));
            return;
          }
          // Root link — fall through to intercept as home navigation
        }
        a.dataset.mspWired = "1";
        a.addEventListener("click", e => {
          const h = a.getAttribute("href");
          if (!h || /^(mailto:|javascript:|#)/.test(h)) return;
          e.preventDefault();
          navigateTo(contentPath(resolveUrl(h)));
        });
      });
    }

    // Load nav content
    try {
      const navPage = await fetchPage(navSrc);
      navContent.innerHTML = navPage.html;
      applyBodyStyles(navContent, navPage);
      // target="main" links are the explicit nav links
      wireLinks(navContent, /* interceptAll= */ false);
      // Also wire any plain links in the nav that have no target attribute
      navContent.querySelectorAll("a:not([data-msp-wired])").forEach(a => {
        const href = a.getAttribute("href");
        if (!href || /^(mailto:|javascript:|#)/.test(href)) return;
        a.dataset.mspWired = "1";
        a.addEventListener("click", e => {
          e.preventDefault();
          navigateTo(contentPath(resolveUrl(a.getAttribute("href"))));
        });
      });
    } catch (err) {
      navContent.innerHTML = `<p style="padding:1em;color:#f66">Nav failed to load. <a href="${resolveUrl(navSrc)}">Open ↗</a></p>`;
    }

    // Load main — honour incoming deep-link if present
    await loadMain(getDeepLink() || mainSrc);

    // Browser back/forward
    window.addEventListener("popstate", () => {
      loadMain(getDeepLink() || mainSrc);
    });

    mobileReady = true;
  }

  // ─── Mode switching ──────────────────────────────────────────────────────────

  function applyMode(isMobile) {
    document.querySelectorAll("noframes").forEach(el => el.style.display = "none");
    const mspBody = document.getElementById("msp-body");

    if (isMobile) {
      const xFrameset = renameFrameset();
      if (xFrameset) xFrameset.style.display = "none";
      if (mspBody) {
        mspBody.style.display = "";
        // Re-load with the current deep-link (may have changed while in desktop mode)
        navigateTo(getDeepLink() || "", /* replace= */ true);
      } else if (!mobileReady) {
        initMobileMode(xFrameset);
      }
    } else {
      if (mspBody) mspBody.style.display = "none";
      unrenameFrameset();
    }
  }

  // ─── Entry point ─────────────────────────────────────────────────────────────

  function init() {
    document.querySelectorAll("noframes").forEach(el => el.style.display = "none");
    const isMobile = window.innerWidth < MOBILE_THRESHOLD;

    if (isMobile) {
      applyMode(true);
    } else {
      initFramesetDeepLinking(); // registers setupDesktopFrames on window load
    }

    let lastMobile = isMobile;
    window.addEventListener("resize", () => {
      const nowMobile = window.innerWidth < MOBILE_THRESHOLD;
      if (nowMobile === lastMobile) return;
      lastMobile = nowMobile;
      applyMode(nowMobile);
      if (!nowMobile) {
        initFramesetDeepLinking(); // no-op after first call; guard prevents double-registration
        setupDesktopFrames();      // re-attach listeners to the fresh <frame> elements
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();