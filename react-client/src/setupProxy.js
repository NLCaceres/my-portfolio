/* Original issue was package.json proxy sent 'http://localhost:3001/' as ORIGIN
  While Ruby on Rails detected the base_url was actually 'http://localhost:3000/'
  Naturally due to the port, the Rails' comparison would fail
  Using the proxy w/ recommended changeOrigin setting equal to 'true' causes
  Origin to be 'http://localhost:3000/' WHILE the base_url becomes 'http://localhost:3001/'
  BUT Setting the changeOrigin setting to its default 'false' WORKS!
  By making the base url match the original 'http://localhost:3000/'
  Even though, I expected both the origin and base URL to ultimately be 'http://localhost:3001/'
  this fix should be fine for testing POST requests in development via Rails' protect_from_forgery + X-CSRF-TOKEN
  In production, the origin & base URL should match w/out problem since no proxy'ing is actually happening
  Rails just sends the React 'main.html' w/ the CSRF cookie, letting React grab it, add the value to the header, then run the POST */

//? React's development server auto-recognizes this file by name 'setupProxy.js' in the src directory
//? Naming this file anything else makes the dev server proxy based on the package.json 'proxy' setting OR
//? if 'proxy' not set in package.json, the dev server will default to normal proxy-less behavior
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001/',
      changeOrigin: false,
    })
  );
};