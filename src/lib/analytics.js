export function trackContactClick(method) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "contact_click",
    contact_method: method,
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", "contact_click", {
      contact_method: method,
    });
  }
}
