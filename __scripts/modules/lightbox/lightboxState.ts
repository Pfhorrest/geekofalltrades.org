/**
 * Global variables for lightbox
 *
 * Each gets its variable if accessed with no argument,
 * or sets its value if an argument is passed
 */

export const slides = (() => {
  let v: NodeListOf<HTMLAnchorElement>;
  return (n?: NodeListOf<HTMLAnchorElement>) => (n && n.length > 0 ? (v = n) : v);
})();

export const slideIndex = (() => {
  let v: number = 0;
  return (n?: number) => (n != null ? (v = n) : v);
})();

export const slideDuration = (() => {
  let v: number = 500;
  return (n?: number) => (n != null ? (v = n) : v);
})();
