const http = require("http");

const NAMES = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/names") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(NAMES));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/names`);
});
