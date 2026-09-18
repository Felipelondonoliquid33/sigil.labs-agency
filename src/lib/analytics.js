export function trackContactClick(method) {
  if (typeof window === "undefined") return;

  // `transport_type: "beacon"` makes gtag use navigator.sendBeacon, so the
  // event survives the page navigation that mailto:, tel: and WhatsApp links
  // trigger. Without it the in-flight GA4 request gets aborted and the
  // conversion is silently lost.
  const payload = {
    contact_method: method,
    transport_type: "beacon",
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "contact_click", ...payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", "contact_click", payload);
  }
}
