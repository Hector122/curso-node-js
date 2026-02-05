const http = require("http");

const NAMES = ["Alice", "Bob", "Charlie", "Diana", "Eve"];

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      const contentType = req.headers["content-type"] || "";
      if (contentType.includes("application/json")) {
        try {
          resolve(JSON.parse(body || "{}"));
        } catch {
          resolve({});
        }
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const data = {};
        for (const pair of body.split("&")) {
          const [key, val] = pair.split("=");
          if (key)
            data[decodeURIComponent(key)] = val ? decodeURIComponent(val) : "";
        }
        resolve(data);
      } else {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/names") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(NAMES));
    return;
  }

  if (req.method === "POST" && req.url === "/register") {
    try {
      const body = await parseBody(req);
      const { name, email, password } = body;
      if (!name || !email || !password) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: false,
            message: "Missing required fields: name, email, password",
          }),
        );
        return;
      }
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "User registered successfully",
          user: { name, email },
        }),
      );
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Server error" }));
    }
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`  GET  /names    - list of names`);
  console.log(`  POST /register - register form (name, email, password)`);
});
