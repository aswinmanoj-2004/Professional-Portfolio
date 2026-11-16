/**
 * Tiny navigation bus. Instead of letting a route change happen instantly,
 * links announce themselves here so the curtain can wipe across first and the
 * real navigation runs once the screen is covered.
 */
const EVENT = 'portfolio:navigate';

export function requestNavigate(to) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { to } }));
}

export function onNavigateRequest(handler) {
  const listener = (event) => handler(event.detail?.to);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
