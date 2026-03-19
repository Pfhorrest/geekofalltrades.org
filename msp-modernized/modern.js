/**
 * modern.js — Marathon's Story Page modernization shim
 *
 * Drop this (and modern.css) into the site root and add to index.html <head>:
 *
 *   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 *   <link rel="stylesheet" href="modern.css" />
 *   <script src="modern.js"></script>
 *
 * What this does:
 *
 *  ALL viewports:
 *    - Pushes ?~=page.html to the URL on frame navigation so any page is
 *      deep-linkable. Honours an incoming ?~= param on load.
 *    - On desktop, injects JS into same-origin frames to rewrite links/images
 *      through the proxy (staging only; no-op on the live server).
 *
 *  MOBILE (viewport width < MOBILE_THRESHOLD):
 *    - Renames <frameset> to <x-frameset> so CSS can hide it (browsers ignore
 *      display:none on real framesets).
 *    - Builds a real <body> with a drop-down hamburger nav and a <main>.
 *    - Fetches both frame sources, sanitizes, and injects their content.
 *    - Wires all navigation and handles browser back/forward.
 *
 *  RESIZE:
 *    - Crossing the threshold swaps between frameset and mobile UI without
 *      re-fetching content.
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
   * msp-staging-config.js (loaded before this script). Leave unset on the
   * live MSP server.
   */
  const CONTENT_ROOT = (window.MSP_CONTENT_ROOT || "").replace(/\/?$/, "/");

  /**
   * Optional server-side proxy URL for staging, e.g. "/msp-modernized/msp-proxy.php".
   * Allows fetch() to retrieve cross-origin MSP pages without CORS errors.
   * Set window.MSP_PROXY in msp-staging-config.js. Leave unset on the live server.
   */
  const PROXY_URL = window.MSP_PROXY || null;

  // ─── Utilities ───────────────────────────────────────────────────────────────

  /** Resolve a path against CONTENT_ROOT; leave absolute URLs alone. */
  function resolveUrl(path) {
    if (!CONTENT_ROOT) return path;
    if (/^https?:\/\//.test(path)) return path;
    return CONTENT_ROOT + path.replace(/^\//, "");
  }

  /** Read the ?~= deep-link param from the current URL, or null. */
  function getDeepLink() {
    return new URLSearchParams(location.search).get(DEEP_LINK_KEY);
  }

  /** Push (or replace) the ?~= param in the browser history. */
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
   * Strip any proxy prefix from a frame src attribute so we get the bare
   * content path regardless of how the src was written in index.html.
   * e.g. "msp-proxy.php?url=mainpage.html" -> "mainpage.html"
   */
  function stripProxyPrefix(frameSrc) {
    if (!frameSrc || !PROXY_URL) return frameSrc;
    const proxyFile = PROXY_URL.replace(/^.*\//, "");
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      "^(?:" + esc(proxyFile) + "|" + esc(PROXY_URL) + ")\\?url=", "i"
    );
    const match = frameSrc.match(pattern);
    if (match) {
      try { return decodeURIComponent(frameSrc.slice(match[0].length)); }
      catch (_) { return frameSrc.slice(match[0].length); }
    }
    return frameSrc;
  }

  // ─── Frameset rename ─────────────────────────────────────────────────────────

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
   * Reverse renameFrameset: restore <x-frameset> -> <frameset> so the browser
   * treats it as a real frameset and reloads the frames.
   * Idempotent: no-op if already a real <frameset>.
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

  // ─── fetchPage ───────────────────────────────────────────────────────────────

  /**
   * Fetch an MSP page and return sanitized content ready for injection.
   * Routes through PROXY_URL when set to avoid CORS errors in staging.
   *
   * Returns { html, bgcolor, text, link, vlink } so the caller can apply
   * the page's own body styles to the container element.
   */
  async function fetchPage(src) {
    const resolved = resolveUrl(src);

    // Build the fetch URL — proxy or direct
    let url;
    if (PROXY_URL) {
      let proxyPath = src;
      try {
        const u = new URL(src);
        const storyPath = CONTENT_ROOT ? new URL(CONTENT_ROOT).pathname : "";
        proxyPath = storyPath && u.pathname.startsWith(storyPath)
          ? u.pathname.slice(storyPath.length)
          : u.pathname + u.search + u.hash;
      } catch (_) {}
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
    const body = doc.body;

    // Lift bgcolor/text to inline CSS on the wrapper div
    const styleProps = [];
    if (body.getAttribute("bgcolor")) styleProps.push(`background-color:${body.getAttribute("bgcolor")}`);
    if (body.getAttribute("text"))    styleProps.push(`color:${body.getAttribute("text")}`);

    const linkColor  = body.getAttribute("link")  || "";
    const vlinkColor = body.getAttribute("vlink") || "";

    // Build scoped wrapper
    const wrapper = doc.createElement("div");
    wrapper.setAttribute("data-msp-frame", "");
    if (styleProps.length) wrapper.style.cssText = styleProps.join(";");
    while (body.firstChild) wrapper.appendChild(body.firstChild);

    // Wrap tables for horizontal scroll
    wrapper.querySelectorAll("table").forEach((table) => {
      if (table.closest("[data-msp-scroll]")) return;
      const scroll = doc.createElement("div");
      scroll.setAttribute("data-msp-scroll", "");
      table.replaceWith(scroll);
      scroll.appendChild(table);
    });

    // Mark pre/xmp for CSS overflow handling
    wrapper.querySelectorAll("pre, xmp").forEach((pre) => {
      pre.setAttribute("data-msp-pre", "");
    });

    // Absolutize relative URLs so they resolve against the MSP server,
    // not the staging origin
    if (CONTENT_ROOT) {
      const absolutize = (el, attr) => {
        const val = el.getAttribute(attr);
        if (!val || /^(https?:|mailto:|javascript:|#|data:)/.test(val)) return;
        try { el.setAttribute(attr, new URL(val, CONTENT_ROOT).href); }
        catch (_) {}
      };

      wrapper.querySelectorAll("a[href]").forEach(el => absolutize(el, "href"));
      wrapper.querySelectorAll("img[src]").forEach(el => absolutize(el, "src"));
      wrapper.querySelectorAll("video[src]").forEach(el => absolutize(el, "src"));
      wrapper.querySelectorAll("video source[src]").forEach(el => absolutize(el, "src"));
      wrapper.querySelectorAll("link[href]").forEach(el => absolutize(el, "href"));
      wrapper.querySelectorAll("script[src]").forEach(el => absolutize(el, "src"));
      wrapper.querySelectorAll("[background]").forEach(el => absolutize(el, "background"));
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

    return {
      html:    tmp.innerHTML,
      bgcolor: body.getAttribute("bgcolor") || "",
      text:    body.getAttribute("text")    || "",
      link:    linkColor,
      vlink:   vlinkColor,
    };
  }

  // ─── Desktop mode ────────────────────────────────────────────────────────────

  // Guard: the one-time window load listener is registered only once
  let frameDeepLinkingReady = false;

  /**
   * Navigate the main frame to the current deep-link page if one is set.
   * Safe to call before or after window load.
   */
  function applyDesktopDeepLink() {
    const page = getDeepLink();
    if (!page) return;
    const apply = () => {
      const mainFrameEl = document.querySelector('frame[name="main"]');
      if (!mainFrameEl) return;
      mainFrameEl.src = PROXY_URL
        ? `${PROXY_URL}?url=${encodeURIComponent(page)}`
        : resolveUrl(page);
    };
    if (document.readyState !== "complete") {
      window.addEventListener("load", apply, { once: true });
    } else {
      apply();
    }
  }

  /**
   * Attach per-frame listeners and perform initial proxy load.
   * Called both on first desktop init (via window load) and on every
   * resize back to desktop (new <frame> elements need fresh listeners).
   */
  function setupDesktopFrames() {
    const mainFrameEl = document.querySelector('frame[name="main"]');
    if (!mainFrameEl) return;

    const navFrameEl = Array.from(document.querySelectorAll("frame"))
      .find(f => f !== mainFrameEl);

    // Build a proxy URL for any content path or absolute URL
    function proxyHref(src) {
      if (!PROXY_URL) return src;
      let path = src;
      if (CONTENT_ROOT && path.startsWith(CONTENT_ROOT)) {
        path = path.slice(CONTENT_ROOT.length);
      } else {
        try {
          const u = new URL(src);
          const storyPath = new URL(CONTENT_ROOT || location.href).pathname;
          if (u.pathname.startsWith(storyPath)) {
            path = u.pathname.slice(storyPath.length);
          } else {
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

    // Rewrite links, images, and video in a frame document through the proxy
    function rewriteFrameDoc(frameDoc, frameSrc) {
      if (!PROXY_URL || !frameDoc) return;
      try {
        const proxyBase = new URL(PROXY_URL, location.href);
        const contentOrigin = CONTENT_ROOT ? new URL(CONTENT_ROOT).origin : null;

        function fixAttr(el, attr) {
          const val = el.getAttribute(attr);
          if (!val || /^(https?:|mailto:|javascript:|#|data:)/.test(val)) return;
          if (val.startsWith(PROXY_URL) || val.includes("msp-proxy.php")) return;
          try {
            const resolved = new URL(val, frameDoc.baseURI || frameSrc);
            const isLocal = resolved.origin === proxyBase.origin;
            const isMsp = contentOrigin && resolved.origin === contentOrigin;
            if (isLocal || isMsp) el.setAttribute(attr, proxyHref(resolved.href));
          } catch (_) {}
        }

        frameDoc.querySelectorAll("a[href]").forEach(el => fixAttr(el, "href"));
        frameDoc.querySelectorAll("img[src]").forEach(el => fixAttr(el, "src"));
        frameDoc.querySelectorAll("[background]").forEach(el => fixAttr(el, "background"));
        // Video must be reloaded explicitly after src is rewritten
        frameDoc.querySelectorAll("video[src]").forEach(el => {
          fixAttr(el, "src");
          el.load();
        });
        frameDoc.querySelectorAll("source[src]").forEach(el => {
          fixAttr(el, "src");
          if (el.parentElement?.tagName.toLowerCase() === "video") {
            el.parentElement.load();
          }
        });
      } catch (_) {}
    }

    // Load a frame through the proxy, returning the proxy URL used
    function loadFrameViaProxy(frameEl, contentSrc) {
      const url = proxyHref(stripProxyPrefix(contentSrc));
      frameEl.src = url;
      return url;
    }

    // Initial frame load
    let defaultProxyUrl;
    if (PROXY_URL) {
      const initial = getDeepLink();
      const navRaw  = navFrameEl ? (navFrameEl.getAttribute("src") || "") : "";
      const mainRaw = mainFrameEl.getAttribute("src") || "";
      if (navFrameEl) loadFrameViaProxy(navFrameEl, navRaw);
      defaultProxyUrl = loadFrameViaProxy(mainFrameEl, initial || mainRaw);
    } else {
      const initial = getDeepLink();
      if (initial) mainFrameEl.src = resolveUrl(initial);
      defaultProxyUrl = new URL(mainFrameEl.getAttribute("src") || "", location.href).href;
    }

    const defaultResolved = defaultProxyUrl;

    // Attach load listener to a frame to rewrite its doc after each navigation
    function watchFrame(frameEl) {
      frameEl.addEventListener("load", () => {
        try {
          rewriteFrameDoc(frameEl.contentDocument, frameEl.contentWindow.location.href);
        } catch (_) {}
      });
    }
    if (navFrameEl) watchFrame(navFrameEl);
    watchFrame(mainFrameEl);

    // Track main frame navigations and update the ?~= deep-link param
    mainFrameEl.addEventListener("load", () => {
      let href;
      try {
        href = mainFrameEl.contentWindow.location.href;
      } catch (_) {
        return; // cross-origin (staging without proxy): silently skip
      }
      if (!href) return;

      // Reduce the frame URL to a bare content-relative page name.
      // Three possible forms when in staging:
      //   (a) Via proxy:  http://local/msp-proxy.php?url=foo.html
      //   (b) MSP direct: https://marathon.bungie.org/story/foo.html
      //   (c) Local bare: http://local/msp-modernized/foo.html (fallback)
      let page = null;

      if (PROXY_URL) {
        try {
          const frameUrl = new URL(href);
          const proxyUrl = new URL(PROXY_URL, location.href);
          if (frameUrl.origin === proxyUrl.origin &&
              frameUrl.pathname === proxyUrl.pathname) {
            // (a) extract ?url= param
            const urlParam = frameUrl.searchParams.get("url");
            if (urlParam) page = decodeURIComponent(urlParam);
          } else if (frameUrl.origin === proxyUrl.origin) {
            // (c) bare local path — extract filename
            page = frameUrl.pathname.replace(/^.*\//, "");
          }
        } catch (_) {}
      }

      if (page === null) {
        // (b) strip CONTENT_ROOT or current-page directory
        const base = CONTENT_ROOT
          || (location.origin + location.pathname.replace(/[^/]*$/, ""));
        page = href.startsWith(base) ? href.slice(base.length) : href;
      }

      // Strip any remaining CONTENT_ROOT prefix
      if (CONTENT_ROOT && page.startsWith(CONTENT_ROOT)) {
        page = page.slice(CONTENT_ROOT.length);
      }

      // Clear the param when back at the default page; push it otherwise
      const rawDefault = mainFrameEl.getAttribute("src") || "";
      const defaultPage = rawDefault.replace(/^.*\//, "").replace(/\?.*$/, "");
      if (page === defaultPage || page === rawDefault || href === defaultResolved) {
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

    const hamburger  = body.querySelector("#msp-hamburger");
    const nav        = body.querySelector("#msp-nav");
    const navContent = body.querySelector("#msp-nav-content");
    const mainEl     = body.querySelector("#msp-main");
    const mainContent = body.querySelector("#msp-main-content");

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

    // Apply <body> presentation attributes to the container so that
    // bgcolor/text/link/vlink cover the padding area too
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

    // Intercept link clicks and load via fetchPage instead of navigating away.
    // In nav: only intercept target="main" links (they navigate the main frame).
    // In main content: intercept all MSP links (plain links navigate the frame
    // on the live site; in our mobile view they must be handled by loadMain).
    const contentOrigin = CONTENT_ROOT ? new URL(CONTENT_ROOT).origin : null;

    function isMspLink(href) {
      if (!href || /^(mailto:|javascript:|#)/.test(href)) return false;
      if (!/^https?:\/\//.test(href)) return true; // relative
      return href.startsWith(location.origin)
          || (contentOrigin && href.startsWith(contentOrigin));
    }

    function wireMainLinks(container, interceptAllMspLinks = false) {
      const selector = interceptAllMspLinks ? "a[href]" : 'a[target="main"]';
      container.querySelectorAll(selector).forEach((a) => {
        if (a.dataset.mspWired) return;
        if (!isMspLink(a.getAttribute("href"))) return;
        a.dataset.mspWired = "1";
        a.addEventListener("click", (e) => {
          const href = a.getAttribute("href");
          if (!isMspLink(href)) return;
          e.preventDefault();
          loadMain(href);
        });
      });
    }

    async function loadMain(src, pushHistory = true) {
      mainContent.innerHTML = `<p style="padding:1em;opacity:.5">Loading…</p>`;
      closeNav();
      try {
        const page = await fetchPage(src);
        mainContent.innerHTML = page.html;
        applyBodyStyles(mainContent, page);
        wireMainLinks(mainContent, /* interceptAllMspLinks= */ true);
        if (pushHistory) {
          let deepLinkPage = src;
          if (CONTENT_ROOT && deepLinkPage.startsWith(CONTENT_ROOT)) {
            deepLinkPage = deepLinkPage.slice(CONTENT_ROOT.length);
          }
          pushDeepLink(deepLinkPage);
        }
        mainEl.scrollTo(0, 0);
        window.scrollTo(0, 0);
      } catch (err) {
        mainContent.innerHTML = `
          <p style="padding:1em;color:#f66">
            Could not load <code>${src}</code>: ${err.message}.<br>
            <a href="${src}" target="_blank">Open directly ↗</a>
          </p>`;
      }
    }

    // Load nav
    try {
      const navPage = await fetchPage(navSrc);
      navContent.innerHTML = navPage.html;
      applyBodyStyles(navContent, navPage);
      wireMainLinks(navContent, /* interceptAllMspLinks= */ false);

      const contentOrigin = CONTENT_ROOT ? new URL(CONTENT_ROOT).origin : null;
      navContent.querySelectorAll("a:not([data-msp-wired])").forEach((a) => {
        const href = a.getAttribute("href");
        if (!href || /^(mailto:|javascript:|#)/.test(href)) return;
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

    // Load main (honour incoming deep-link)
    const deepLink = getDeepLink();
    await loadMain(deepLink || mainSrc, false);
    if (deepLink) pushDeepLink(deepLink, true);

    // Browser back/forward
    window.addEventListener("popstate", () => {
      loadMain(getDeepLink() || mainSrc, false);
    });

    mobileReady = true;
  }

  // ─── Mode switching ──────────────────────────────────────────────────────────

  function applyMode(isMobile) {
    const mspBody = document.getElementById("msp-body");
    if (isMobile) {
      const xFrameset = renameFrameset();
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
      unrenameFrameset();
    }
  }

  // ─── Entry point ─────────────────────────────────────────────────────────────

  function init() {
    const isMobile = window.innerWidth < MOBILE_THRESHOLD;

    if (isMobile) {
      applyMode(true);
    } else {
      document.querySelectorAll("noframes").forEach(el => el.style.display = "none");
      initFramesetDeepLinking();
      applyDesktopDeepLink();
    }

    let lastMobile = isMobile;
    window.addEventListener("resize", () => {
      const nowMobile = window.innerWidth < MOBILE_THRESHOLD;
      if (nowMobile === lastMobile) return;
      lastMobile = nowMobile;
      applyMode(nowMobile);
      if (!nowMobile) {
        initFramesetDeepLinking();
        setupDesktopFrames();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();