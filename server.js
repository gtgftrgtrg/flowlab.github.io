const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : decodeURIComponent(req.url));
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(400);
    return res.end('Bad request');
  }
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      return res.end('Not found');
    }
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    fs.readFile(filePath, (error, content) => {
      if (error) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        return res.end('Server error');
      }
      res.writeHead(200, {'Content-Type': contentType});
      res.end(content);
    });
  });
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
