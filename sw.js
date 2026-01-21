self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // 🔴 DO NOT intercept manifest or icons
  if (
    event.request.url.includes("manifest.json") ||
    event.request.url.includes("icon-")
  ) {
    return;
  }
});
