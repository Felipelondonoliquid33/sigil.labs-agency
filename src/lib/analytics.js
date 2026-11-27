export const WHATSAPP_NUMBER = "573334016876";

/* wa.me opens the app on phones and WhatsApp Web on desktop. The old
   web.whatsapp.com link sent phone visitors to a browser page instead. */
export function whatsappHref(text) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/* contact_click is the property's key event (marked in GA4 admin), so every
   lead path should go through here. `source` says which button produced it:
   "dock", "contact", "menu"... — compare them in GA under the event params. */
export function trackContactClick(method, source = "unknown") {
  if (typeof window === "undefined") return;

  // `transport_type: "beacon"` makes gtag use navigator.sendBeacon, so the
  // event survives the page navigation that mailto:, tel: and WhatsApp links
  // trigger. Without it the in-flight GA4 request gets aborted and the
  // conversion is silently lost.
  const payload = {
    contact_method: method,
    contact_source: source,
    transport_type: "beacon",
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "contact_click", ...payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", "contact_click", payload);
  }
}
