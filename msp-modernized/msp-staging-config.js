/* msp-staging-config.js
 *
 * REMOVE THIS SCRIPT TAG before deploying to the live MSP site.
 *
 * Tells modern.js to fetch all frame content from the live MSP origin
 * instead of the current (staging/dev) origin, so you can test the
 * modernization shim without mirroring the entire site locally.
 *
 * Must be loaded BEFORE modern.js in the <head>.
 */
window.MSP_CONTENT_ROOT = "https://marathon.bungie.org/story/";

// Server-side CORS proxy for mobile mode (fetch() can't reach cross-origin).
// Point this at msp-proxy.php on your staging server.
window.MSP_PROXY = "/msp-modernized/msp-proxy.php";