import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";

const port = Number(process.env.PORT ?? 4173);
const distDir = join(process.cwd(), "apps", "web", "dist");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

const server = createServer((req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end();
    return;
  }

  const requestPath = req.url.split("?")[0];
  const filePath = join(distDir, decodeURIComponent(requestPath === "/" ? "/index.html" : requestPath));

  let targetPath = filePath;

  if (!existsSync(targetPath)) {
    const spaPath = join(distDir, "index.html");
    if (!existsSync(spaPath)) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    targetPath = spaPath;
  } else if (statSync(targetPath).isDirectory()) {
    const indexPath = join(targetPath, "index.html");
    if (existsSync(indexPath)) {
      targetPath = indexPath;
    } else {
      res.writeHead(403);
      res.end();
      return;
    }
  }

  const ext = extname(targetPath);
  const contentType = mimeTypes[ext] ?? "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  createReadStream(targetPath).pipe(res);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Static server running at http://0.0.0.0:${port}`);
});
