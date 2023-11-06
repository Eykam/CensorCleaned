const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://driven-fowl-privately.ngrok-free.app/",
      changeOrigin: true,
    })
  );
};
