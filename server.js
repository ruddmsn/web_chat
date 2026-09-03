const http = require("http");
const fs = require("fs");
const path = require("path");

const HOST = "localhost";
const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    return res.end("Method Not Allowed");
  }
  let urlPath;
  try {
    urlPath = decodeURIComponent(
      new URL(req.url, `http://${req.headers.host}`).pathname,
    );
  } catch {
    res.writeHead(400);
    return res.end("Bad Request");
  }
  const filePath = path.resolve(
    ROOT,
    `.${urlPath === "/" ? "/index.html" : urlPath}`,
  );
  if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      return res.end("Not Found");
    }
    const headers = {
      "Content-Type":
        TYPES[path.extname(filePath).toLowerCase()] ||
        "application/octet-stream",
      "Cache-Control": "no-cache",
    };
    res.writeHead(200, headers);
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, HOST, () =>
  console.log(`Static server running at http://${HOST}:${PORT}`),
);
