export function trackContactClick(method) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "contact_click", {
    contact_method: method,
  });
}
