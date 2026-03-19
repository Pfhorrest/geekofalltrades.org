/**
 * modern.js — Marathon's Story Page modernization shim
 *
 * Drop this (and modern.css) into the site root and add to index.html:
 *
 *   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 *   <link rel="stylesheet" href="modern.css" />
 *   <script src="modern.js"></script>
 *
 * What this does:
 *  1. ALL viewports: Renames <frameset> → <x-frameset> so CSS can actually
 *     hide it (browsers ignore display:none on real <frameset> elements).
 *     Intercepts target="main" link clicks and pushes ?~=page.html to the
 *     URL so pages are deep-linkable. On load, honours any existing ?~= param
 *     by loading it into the main frame.
 *
 *  2. MOBILE viewports (< MOBILE_THRESHOLD px wide): Hides <x-frameset> and
 *     <noframes>, builds a real <body> with a hamburger <nav> and a <main>,
 *     fetches both frame sources, sanitizes and injects their content, and
 *     wires up all navigation.
 *
 *  3. RESIZE: Crossing the threshold in either direction swaps visibility
 *     between the frameset and the mobile UI without re-fetching content.
 */

(function () {
  "use strict";

  // ─── Configuration ───────────────────────────────────────────────────────────

  /** Viewport width (px) below which mobile mode activates. */
  const MOBILE_THRESHOLD = 1024;

  /** Query-string key used for deep-linking, e.g. ?~=somepage.html */
  const DEEP_LINK_KEY = "~";

  /**
   * Optional content root override for staging/dev use.
   * Set window.MSP_CONTENT_ROOT = "https://marathon.bungie.org/story/" in a
   * separate config script (loaded before this one) to pull live MSP content
   * into a staging environment. Leave unset on the real MSP server.
   */
  const CONTENT_ROOT = (window.MSP_CONTENT_ROOT || "").replace(/\/?$/, "/");

  /**
   * Optional server-side proxy URL for staging, e.g. "/msp-modernized/msp-proxy.php".
   * When set, fetchPage() routes requests through it to avoid CORS errors.
   * Set window.MSP_PROXY in msp-staging-config.js. Leave unset on the real MSP server.
   */
  const PROXY_URL = window.MSP_PROXY || null;

  // ─── Utilities ───────────────────────────────────────────────────────────────

  /**
   * Resolve a site-relative path against CONTENT_ROOT if set, otherwise leave
   * it relative so the browser resolves it against the current origin.
   */
  function resolveUrl(path) {
    if (!CONTENT_ROOT) return path;
    if (/^https?:\/\//.test(path)) return path;
    return CONTENT_ROOT + path.replace(/^\//, "");
  }

  /** Read the deep-link param from the current URL, or null. */
  function getDeepLink() {
    return new URLSearchParams(location.search).get(DEEP_LINK_KEY);
  }

  /** Push (or replace) a deep-link param into the browser history. */
  function pushDeepLink(page, replace = false) {
    const url = new URL(location.href);
    if (page) {
      url.searchParams.set(DEEP_LINK_KEY, page);
    } else {
      url.searchParams.delete(DEEP_LINK_KEY);
    }
    if (replace) {
      history.replaceState(null, "", url);
    } else {
      history.pushState(null, "", url);
    }
  }

  /**
   * Rename <frameset> -> <x-frameset> (and <frame> -> <x-frame>) so that
   * display:none actually works on them -- browsers treat real <frameset>
   * elements specially and ignore CSS visibility rules entirely.
   * Idempotent: returns the existing <x-frameset> if already renamed.
   */
  function renameFrameset() {
    const existing = document.querySelector("x-frameset");
    if (existing) return existing;

    const frameset = document.querySelector("frameset");
    if (!frameset) return null;

    const xFrameset = document.createElement("x-frameset");

    for (const attr of frameset.attributes) {
      xFrameset.setAttribute(attr.name, attr.value);
    }

    for (const child of frameset.children) {
      if (child.tagName.toLowerCase() === "frame") {
        const xFrame = document.createElement("x-frame");
        for (const attr of child.attributes) {
          xFrame.setAttribute(attr.name, attr.value);
        }
        xFrameset.appendChild(xFrame);
      }
    }

    frameset.replaceWith(xFrameset);
    return xFrameset;
  }

  /**
   * Reverse of renameFrameset: restore <x-frameset> -> <frameset> (and
   * <x-frame> -> <frame>) so the browser treats it as a real frameset again
   * and reloads the frames. Idempotent: no-op if already a real <frameset>.
   */
  function unrenameFrameset() {
    const xFrameset = document.querySelector("x-frameset");
    if (!xFrameset) return;

    const frameset = document.createElement("frameset");

    for (const attr of xFrameset.attributes) {
      frameset.setAttribute(attr.name, attr.value);
    }

    for (const child of xFrameset.children) {
      if (child.tagName.toLowerCase() === "x-frame") {
        const frame = document.createElement("frame");
        for (const attr of child.attributes) {
          frame.setAttribute(attr.name, attr.value);
        }
        frameset.appendChild(frame);
      }
    }

    xFrameset.replaceWith(frameset);
  }

  /**
   * Fetch a same-origin HTML page and return its sanitized inner content:
   * body innerHTML with legacy body-attribute colours lifted to inline CSS
   * on a wrapper div, and wide/overflow elements clamped for mobile.
   */
  async function fetchPage(src) {
    const resolved = resolveUrl(src);
    // Route through the staging proxy when set, to avoid CORS errors on fetch().
    // The proxy accepts a bare relative path as ?url=..., so we need to reduce
    // whatever form src arrives in (absolute URL, root-relative, or bare) down
    // to just the path relative to the MSP story root.
    let url;
    if (PROXY_URL) {
      let proxyPath = src;
      // Strip absolute URL prefix if present (handles any origin)
      try {
        const u = new URL(src);
        proxyPath = u.pathname + u.search + u.hash;
      } catch (_) { /* not an absolute URL, leave as-is */ }
      // Strip the story root pathname prefix if present, e.g. /story/foo.html -> foo.html
      const storyPath = CONTENT_ROOT ? new URL(CONTENT_ROOT).pathname : "";
      if (storyPath && proxyPath.startsWith(storyPath)) {
        proxyPath = proxyPath.slice(storyPath.length);
      }
      // Strip any remaining leading slash
      proxyPath = proxyPath.replace(/^\//, "");
      url = `${PROXY_URL}?url=${encodeURIComponent(proxyPath)}`;
    } else {
      url = resolved;
    }
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status} fetching ${resolved}`);
    const raw = await resp.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, "text/html");

    // ── Lift legacy <body> presentation attributes to CSS ──────────────────
    const body = doc.body;
    const styleProps = [];

    const attrMap = {
      bgcolor: "background-color",
      text: "color",
      link: null,
      vlink: null,
    };

    const linkColor  = body.getAttribute("link");
    const vlinkColor = body.getAttribute("vlink");

    for (const [attr, prop] of Object.entries(attrMap)) {
      if (!prop) continue;
      const val = body.getAttribute(attr);
      if (val) styleProps.push(`${prop}:${val}`);
    }

    // ── Build scoped wrapper ───────────────────────────────────────────────
    const wrapper = doc.createElement("div");
    wrapper.setAttribute("data-msp-frame", "");
    if (styleProps.length) {
      wrapper.style.cssText = styleProps.join(";");
    }

    while (body.firstChild) wrapper.appendChild(body.firstChild);

    // body bgcolor/text/link/vlink are returned in the result object and
    // applied to the container element by applyBodyStyles() in the caller.

    // ── Responsiveness cleanup ─────────────────────────────────────────────
    // Philosophy: do as little as possible. CSS handles max-widths and overflow.
    // The only JS intervention needed is wrapping tables in scroll divs (CSS
    // cannot do this without changing layout), and marking pre/xmp blocks.

    // Wrap tables so they can scroll horizontally without blowing out the viewport
    wrapper.querySelectorAll("table").forEach((table) => {
      if (table.closest("[data-msp-scroll]")) return;
      const scroll = doc.createElement("div");
      scroll.setAttribute("data-msp-scroll", "");
      table.replaceWith(scroll);
      scroll.appendChild(table);
    });

    // Mark pre/xmp blocks so CSS can apply overflow:auto
    wrapper.querySelectorAll("pre, xmp").forEach((pre) => {
      pre.setAttribute("data-msp-pre", "");
    });

    // ── Absolutize relative URLs ──────────────────────────────────────────
    // Relative hrefs and srcs in fetched content would resolve against the
    // staging origin, causing 404s for linked pages and broken images.
    // Rewrite them to absolute MSP URLs so the browser resolves them correctly
    // regardless of which origin serves the shell page.
    // Note: <a href> links that wireMainLinks will intercept are absolutized
    // too -- wireMainLinks checks the resolved href, which still works fine.
    if (CONTENT_ROOT) {
      function absolutize(el, attr) {
        const val = el.getAttribute(attr);
        if (!val) return;
        if (/^(https?:|mailto:|javascript:|#)/.test(val)) return;
        try { el.setAttribute(attr, new URL(val, CONTENT_ROOT).href); }
        catch (_) {}
      }

      wrapper.querySelectorAll("a[href]").forEach(el => absolutize(el, "href"));
      wrapper.querySelectorAll("img[src]").forEach(el => absolutize(el, "src"));
      wrapper.querySelectorAll("video[src]").forEach(el => absolutize(el, "src"));
      wrapper.querySelectorAll("video source[src]").forEach(el => absolutize(el, "src"));
      wrapper.querySelectorAll("link[href]").forEach(el => absolutize(el, "href"));
      wrapper.querySelectorAll("script[src]").forEach(el => absolutize(el, "src"));
      // Legacy presentational attribute used on some 90s pages
      wrapper.querySelectorAll("[background]").forEach(el => absolutize(el, "background"));

      // srcset is a comma-separated "url descriptor" list, needs special handling
      wrapper.querySelectorAll("img[srcset]").forEach(el => {
        const rewritten = el.getAttribute("srcset").split(",").map(part => {
          const trimmed = part.trim();
          const space = trimmed.search(/\s/);
          const rawUrl = space === -1 ? trimmed : trimmed.slice(0, space);
          const descriptor = space === -1 ? "" : trimmed.slice(space);
          try { return new URL(rawUrl, CONTENT_ROOT).href + descriptor; }
          catch (_) { return part; }
        });
        el.setAttribute("srcset", rewritten.join(", "));
      });
    }

    const tmp = doc.createElement("div");
    tmp.appendChild(wrapper);

    // Return body presentation attributes alongside the HTML so the caller
    // can apply them to the container element (covering padding areas too)
    return {
      html:    tmp.innerHTML,
      bgcolor: body.getAttribute("bgcolor") || "",
      text:    body.getAttribute("text")    || "",
      link:    linkColor  || "",
      vlink:   vlinkColor || "",
    };
  }

  // Strip any proxy prefix from a frame src attribute value so the bare
  // content path can be extracted regardless of how the src was written.
  // e.g. "msp-proxy.php?url=mainpage.html" -> "mainpage.html"
  function stripProxyPrefix(frameSrc) {
    if (!frameSrc || !PROXY_URL) return frameSrc;
    const proxyFile = PROXY_URL.replace(/^.*\//, "");
    const escaped = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      "^(?:" + escaped(proxyFile) + "|" + escaped(PROXY_URL) + ")\\?url=", "i"
    );
    const match = frameSrc.match(pattern);
    if (match) {
      try { return decodeURIComponent(frameSrc.slice(match[0].length)); }
      catch (_) { return frameSrc.slice(match[0].length); }
    }
    return frameSrc;
  }

  // ─── Deep-linking for standard (desktop) frameset mode ────────────────────────────────────────

  // Guard so listeners are only attached once even if initFramesetDeepLinking
  // is called again after a mobile->desktop resize crossing.
  let frameDeepLinkingReady = false;

  // Called every time desktop mode becomes active (init and resize from mobile).
  // Navigates the main frame to the current deep-link page if one is set.
  function applyDesktopDeepLink() {
    const page = getDeepLink();
    if (!page) return;
    // Wait until the frameset is in the DOM and the frame is accessible
    const apply = () => {
      const mainFrameEl = document.querySelector('frame[name="main"]');
      if (!mainFrameEl) return;
      if (PROXY_URL) {
        mainFrameEl.src = `${PROXY_URL}?url=${encodeURIComponent(page)}`;
      } else {
        mainFrameEl.src = resolveUrl(page);
      }
    };
    // If called before window load, wait; otherwise act immediately
    if (document.readyState !== "complete") {
      window.addEventListener("load", apply, { once: true });
    } else {
      apply();
    }
  }

  // Attach all per-frame listeners and do the initial proxy load.
  // Called on first desktop init (from window load) and again whenever
  // we resize back to desktop (new <frame> elements need fresh listeners).
  function setupDesktopFrames() {
    const mainFrameEl = document.querySelector('frame[name="main"]');
    if (!mainFrameEl) return;

    const navFrameEl = Array.from(document.querySelectorAll("frame"))
    .find(f => f !== mainFrameEl);

    // ── Proxy-aware frame loading ──────────────────────────────────────────
    // When PROXY_URL is set, the browser has already loaded frame content
    // directly from its src attribute — before any JS ran — so images and
    // links resolve against the wrong origin. We take control by reloading
    // both frames through the proxy immediately, and rewriting all subsequent
    // navigations the same way.

    // Build a proxy URL for a given content path or absolute content URL.
    function proxyHref(src) {
      if (!PROXY_URL) return src;
      let path = src;
      // Strip absolute MSP URL prefix, preserving subdirectory structure.
      if (CONTENT_ROOT && path.startsWith(CONTENT_ROOT)) {
      // e.g. "https://marathon.bungie.org/story/_images/foo.jpg" -> "_images/foo.jpg"
      path = path.slice(CONTENT_ROOT.length);
      } else {
      try {
        const u = new URL(src);
        const storyPath = new URL(CONTENT_ROOT || location.href).pathname;
        if (u.pathname.startsWith(storyPath)) {
        // Strip just the story root prefix, keep the rest of the path
        // e.g. /story/_images/foo.jpg -> _images/foo.jpg
        path = u.pathname.slice(storyPath.length);
        } else {
        // Local origin with a different path prefix (e.g. /msp-modernized/_images/foo.jpg
        // from a proxy-served page). Strip the current page's directory prefix
        // so we're left with just the content-relative path.
        const pageDir = location.pathname.replace(/[^/]*$/, "");
        path = u.pathname.startsWith(pageDir)
          ? u.pathname.slice(pageDir.length)
          : u.pathname.replace(/^\//, "");
        }
      } catch (_) {}
      }
      path = path.replace(/^\//, "");
      return `${PROXY_URL}?url=${encodeURIComponent(path)}`;
    }

    // Rewrite links and images in a frame document so they resolve correctly.
    function rewriteFrameDoc(frameDoc, frameSrc) {
      if (!PROXY_URL || !frameDoc) return;
      try {
      const proxyBase = new URL(PROXY_URL, location.href);
      const contentOrigin = CONTENT_ROOT ? new URL(CONTENT_ROOT).origin : null;

      function fixAttr(el, attr) {
        const val = el.getAttribute(attr);
        if (!val || /^(https?:|mailto:|javascript:|#|data:)/.test(val)) return;
        // Already through the proxy
        if (val.startsWith(PROXY_URL) || val.includes("msp-proxy.php")) return;
        try {
        const resolved = new URL(val, frameDoc.baseURI || frameSrc);
        const isLocal = resolved.origin === proxyBase.origin;
        const isMsp = contentOrigin && resolved.origin === contentOrigin;
        if (isLocal || isMsp) {
          el.setAttribute(attr, proxyHref(resolved.href));
        }
        } catch (_) {}
      }

      frameDoc.querySelectorAll("a[href]").forEach(el => fixAttr(el, "href"));
      frameDoc.querySelectorAll("img[src]").forEach(el => fixAttr(el, "src"));
      // Video needs explicit reload after src rewrite since the browser
      // fetches it at parse time before our load listener can intercept it.
      frameDoc.querySelectorAll("video[src]").forEach(el => {
        fixAttr(el, "src");
        el.load(); // force reload with the corrected src
      });
      frameDoc.querySelectorAll("source[src]").forEach(el => {
        fixAttr(el, "src");
        // If the source is inside a video, reload the parent video element
        if (el.parentElement && el.parentElement.tagName.toLowerCase() === "video") {
          el.parentElement.load();
        }
      });
      frameDoc.querySelectorAll("[background]").forEach(el => fixAttr(el, "background"));
      } catch (_) {}
    }

    // Reload a frame through the proxy. Returns the proxy URL used.
    function loadFrameViaProxy(frameEl, contentSrc) {
      const url = proxyHref(stripProxyPrefix(contentSrc));
      frameEl.src = url;
      return url;
    }

    // ── Initial load: redirect both frames through proxy ──────────────────
    let defaultProxyUrl;
    if (PROXY_URL) {
      const initial = getDeepLink();
      const navRaw = navFrameEl ? navFrameEl.getAttribute("src") || "" : "";
      const mainRaw = mainFrameEl.getAttribute("src") || "";

      if (navFrameEl) loadFrameViaProxy(navFrameEl, navRaw);
      defaultProxyUrl = loadFrameViaProxy(mainFrameEl, initial || mainRaw);
    } else {
      // No proxy: honour deep-link by direct navigation
      const initial = getDeepLink();
      if (initial) mainFrameEl.src = resolveUrl(initial);
      defaultProxyUrl = new URL(mainFrameEl.getAttribute("src") || "", location.href).href;
    }

    // The resolved URL of the default main page — for clearing the ?~= param
    const defaultResolved = defaultProxyUrl;

    // ── Watch frames: rewrite doc content after each load ─────────────────
    function watchFrame(frameEl) {
      frameEl.addEventListener("load", () => {
      try {
        rewriteFrameDoc(frameEl.contentDocument, frameEl.contentWindow.location.href);
      } catch (_) {}
      });
    }
    if (navFrameEl) watchFrame(navFrameEl);
    watchFrame(mainFrameEl);

    mainFrameEl.addEventListener("load", () => {
      // The only reliable way to read a frame's current URL is
      // contentWindow.location.href, which requires same-origin access.
      // On the live MSP site (same origin throughout) this works perfectly.
      // On a cross-origin staging setup it will throw — in that case we
      // cannot read the URL and deep-linking on desktop is a no-op, but
      // mobile mode and incoming ?~= deep-link loading still work fine.
      let href;
      try {
      href = mainFrameEl.contentWindow.location.href;
      } catch (_) {
      return; // cross-origin staging: gracefully do nothing
      }

      if (!href) return;

      // Derive the bare content-relative page name from whatever URL the
      // frame currently has. Three possible forms:
      //
      //   a) Proxy:   http://local/msp-modernized/msp-proxy.php?url=foo.html
      //   b) MSP:     https://marathon.bungie.org/story/foo.html
      //   c) Local:   http://local/msp-modernized/foo.html  (followed relative
      //               link from proxy-served page — we rewrite these via the
      //               click interceptor below, but handle here as fallback)
      let page = null;

      if (PROXY_URL) {
      try {
        const frameUrl = new URL(href);
        const proxyUrl = new URL(PROXY_URL, location.href);
        if (frameUrl.origin === proxyUrl.origin
          && frameUrl.pathname === proxyUrl.pathname) {
        // Case (a): extract ?url= param
        const urlParam = frameUrl.searchParams.get("url");
        if (urlParam) page = decodeURIComponent(urlParam);
        } else if (frameUrl.origin === proxyUrl.origin) {
        // Case (c): same local origin but not the proxy path —
        // relative link was followed directly. Extract just the filename.
        page = frameUrl.pathname.replace(/^.*\//, "");
        }
      } catch (_) {}
      }

      if (page === null) {
      // Case (b): strip CONTENT_ROOT or current-page directory
      const base = CONTENT_ROOT
        || (location.origin + location.pathname.replace(/[^/]*$/, ""));
      page = href.startsWith(base) ? href.slice(base.length) : href;
      }

      // Strip any remaining CONTENT_ROOT prefix (e.g. if ?url= was absolute)
      if (CONTENT_ROOT && page.startsWith(CONTENT_ROOT)) {
      page = page.slice(CONTENT_ROOT.length);
      }

      // Determine the default page name for clearing the param
      const rawDefault = mainFrameEl.getAttribute("src") || "";
      const defaultPage = rawDefault.replace(/^.*\//, "").replace(/\?.*$/, "");
      const isDefault = page === defaultPage
      || page === rawDefault
      || href === defaultResolved;

      if (isDefault) {
      pushDeepLink(null, /* replace= */ true);
      } else {
      pushDeepLink(page);
      }
    });
  }

  function initFramesetDeepLinking() {
    if (frameDeepLinkingReady) return;
    frameDeepLinkingReady = true;
    window.addEventListener("load", setupDesktopFrames);
  }

  // ─── Mobile mode ─────────────────────────────────────────────────────────────

  // Track whether mobile UI has been initialised yet (we only fetch once)
  let mobileReady = false;

  async function initMobileMode(xFrameset) {
    // ── Read frame sources from the (already renamed) x-frameset ──────────
    const xFrames  = Array.from(xFrameset.querySelectorAll("x-frame"));
    const mainXFrame = xFrames.find((f) => f.getAttribute("name") === "main");
    const navXFrame  = xFrames.find((f) => f !== mainXFrame);

    if (!mainXFrame || !navXFrame) return;

    const navSrc  = stripProxyPrefix(navXFrame.getAttribute("src"));
    const mainSrc = stripProxyPrefix(mainXFrame.getAttribute("src"));

    // ── Build the mobile UI skeleton ───────────────────────────────────────
    const body = document.createElement("body");
    body.id = "msp-body";

    body.innerHTML = `
      <header id="msp-header">
        <button id="msp-hamburger" aria-label="Toggle navigation" aria-expanded="false" aria-controls="msp-nav">
          <span></span><span></span><span></span>
        </button>
        <span id="msp-site-title">Marathon's Story Page</span>
      </header>
      <nav id="msp-nav" aria-label="Site navigation">
        <div id="msp-nav-content"><p style="padding:1em;opacity:.5">Loading navigation…</p></div>
      </nav>
      <main id="msp-main">
        <div id="msp-main-content"><p style="padding:1em;opacity:.5">Loading…</p></div>
      </main>
    `;

    document.documentElement.appendChild(body);

    // ── Wire up hamburger ──────────────────────────────────────────────────
    const hamburger = body.querySelector("#msp-hamburger");
    const nav       = body.querySelector("#msp-nav");

    hamburger.addEventListener("click", () => {
      const open = nav.classList.toggle("msp-nav--open");
      hamburger.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("focusout", (e) => {
      if (!nav.contains(e.relatedTarget)) {
        nav.classList.remove("msp-nav--open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });

    // ── Helper: apply <body> presentation attrs to a container element ───
    // This covers the container's padding area too, unlike scoping to the
    // [data-msp-frame] wrapper div inside it.
    function applyBodyStyles(container, page) {
      if (page.bgcolor) container.style.backgroundColor = page.bgcolor;
      if (page.text)    container.style.color            = page.text;
      if (page.link)    container.style.setProperty("--msp-link",  page.link);
      if (page.vlink)   container.style.setProperty("--msp-vlink", page.vlink);
    }

    // ── Helper: load a page into <main> ───────────────────────────────────
    const mainContent = body.querySelector("#msp-main-content");

    async function loadMain(src, pushHistory = true) {
      mainContent.innerHTML = `<p style="padding:1em;opacity:.5">Loading…</p>`;
      nav.classList.remove("msp-nav--open");
      hamburger.setAttribute("aria-expanded", "false");

      try {
        const page = await fetchPage(src);
        mainContent.innerHTML = page.html;
        applyBodyStyles(mainContent, page);
        wireMainLinks(mainContent);
        if (pushHistory) {
          // Relativize against CONTENT_ROOT so the ?~= param stays tidy
          // (e.g. "newmar26today.html" not the full absolute MSP URL)
          let deepLinkPage = src;
          if (CONTENT_ROOT && deepLinkPage.startsWith(CONTENT_ROOT)) {
            deepLinkPage = deepLinkPage.slice(CONTENT_ROOT.length);
          }
          pushDeepLink(deepLinkPage);
        }
        body.querySelector("#msp-main").scrollTo(0, 0);
        window.scrollTo(0, 0);
      } catch (err) {
        mainContent.innerHTML = `
          <p style="padding:1em;color:#f66">
            Could not load <code>${src}</code>: ${err.message}.<br>
            <a href="${src}" target="_blank">Open directly ↗</a>
          </p>`;
      }
    }

    function wireMainLinks(container) {
      container.querySelectorAll('a[target="main"]').forEach((a) => {
        if (a.dataset.mspWired) return;
        a.dataset.mspWired = "1";
        a.addEventListener("click", (e) => {
          const href = a.getAttribute("href");
          if (!href || href.startsWith("javascript") || href.startsWith("#")) return;
          // Let through same-origin links and links to the MSP content origin
          const contentOrigin = CONTENT_ROOT ? new URL(CONTENT_ROOT).origin : null;
          if (/^https?:\/\//.test(href)
              && !href.startsWith(location.origin)
              && !(contentOrigin && href.startsWith(contentOrigin))) return;
          e.preventDefault();
          loadMain(href);
        });
      });
    }

    // ── Load nav ──────────────────────────────────────────────────────────
    const navContent = body.querySelector("#msp-nav-content");
    try {
      const navPage = await fetchPage(navSrc);
      navContent.innerHTML = navPage.html;
      applyBodyStyles(navContent, navPage);
      wireMainLinks(navContent);

      const contentOrigin = CONTENT_ROOT ? new URL(CONTENT_ROOT).origin : null;
      navContent.querySelectorAll("a:not([data-msp-wired])").forEach((a) => {
        const href = a.getAttribute("href");
        if (!href || /^(mailto:|javascript:|#)/.test(href)) return;
        // Skip truly external links (not same-origin and not the MSP content origin)
        if (/^https?:\/\//.test(href)
            && !href.startsWith(location.origin)
            && !(contentOrigin && href.startsWith(contentOrigin))) return;
        a.dataset.mspWired = "1";
        a.addEventListener("click", (e) => {
          e.preventDefault();
          loadMain(href);
        });
      });
    } catch (err) {
      navContent.innerHTML = `<p style="padding:1em;color:#f66">Nav failed to load. <a href="${navSrc}">Open ↗</a></p>`;
    }

    // ── Load main ─────────────────────────────────────────────────────────
    const deepLink = getDeepLink();
    await loadMain(deepLink || mainSrc, false);
    if (deepLink) pushDeepLink(deepLink, true);

    // ── Handle browser back/forward ────────────────────────────────────────
    window.addEventListener("popstate", () => {
      const page = getDeepLink() || mainSrc;
      loadMain(page, false);
    });

    mobileReady = true;
  }

  // ─── Visibility toggling (called on init and on resize) ──────────────────────

  /**
   * Show or hide the frameset vs. mobile body based on current viewport width.
   * - Going mobile:   rename frameset -> x-frameset, hide it, show mobile body
   *                   (building the mobile UI lazily on first crossing)
   * - Going desktop:  hide mobile body, unrename x-frameset -> frameset so the
   *                   browser re-parses it as a real frameset and loads frames
   */
  function applyMode(isMobile) {
    const mspBody = document.getElementById("msp-body");

    if (isMobile) {
      const xFrameset = renameFrameset(); // idempotent
      if (xFrameset) xFrameset.style.display = "none";
      document.querySelectorAll("noframes").forEach(el => el.style.display = "none");
      if (mspBody) {
        mspBody.style.display = "";
      } else if (!mobileReady) {
        initMobileMode(xFrameset);
      }
    } else {
      if (mspBody) mspBody.style.display = "none";
      document.querySelectorAll("noframes").forEach(el => el.style.display = "none");
      // Restore the real <frameset> so the browser loads the frames
      unrenameFrameset();
    }
  }

  // ─── Entry point ─────────────────────────────────────────────────────────────

  function init() {
    const isMobile = window.innerWidth < MOBILE_THRESHOLD;

    if (isMobile) {
      applyMode(true);
    } else {
      // Desktop: frameset is untouched, wire deep-linking and honour any incoming param
      document.querySelectorAll("noframes").forEach(el => el.style.display = "none");
      initFramesetDeepLinking();
      applyDesktopDeepLink();
    }

    // ── Resize listener ───────────────────────────────────────────────────
    let lastMobile = isMobile;
    window.addEventListener("resize", () => {
      const nowMobile = window.innerWidth < MOBILE_THRESHOLD;
      if (nowMobile === lastMobile) return;
      lastMobile = nowMobile;
      applyMode(nowMobile);
      if (!nowMobile) {
        initFramesetDeepLinking(); // no-op after first call, just sets guard flag
        setupDesktopFrames();      // re-attaches listeners to the fresh <frame> elements
                                   // and loads the current deep-link page if set
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();