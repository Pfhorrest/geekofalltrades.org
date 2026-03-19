/* msp-staging-config.js — STAGING ONLY
 *
 * REMOVE THIS SCRIPT TAG before deploying to the live MSP site.
 *
 * Loads this script BEFORE modern.js in index.html:
 *   <script src="msp-staging-config.js"></script>
 *   <script src="modern.js"></script>
 *
 * Tells modern.js to pull content from the live MSP server rather than
 * the local/staging origin, so you can demo the modernization shim without
 * mirroring the entire MSP site locally.
 *
 * Your staging index.html <frame src> attributes should point directly at
 * the live MSP pages (e.g. src="https://marathon.bungie.org/story/mainpage.html")
 * so that desktop mode loads frames from the right place. Do NOT point frame
 * srcs at msp-proxy.php — the proxy is only for fetch() calls from modern.js
 * in mobile mode.
 */
window.MSP_CONTENT_ROOT = "https://marathon.bungie.org/story/";
window.MSP_PROXY        = "/msp-modernized/msp-proxy.php";