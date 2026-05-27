const http = require("http");
const port = process.env.PORT || 10000;
const s = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
  }
});
s.listen(port, () => console.log("Test server on port", port));
