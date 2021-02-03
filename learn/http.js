const http = require('http')
const port = 2000;

const server = http.createServer((req, res) => {
  console.log(res.statusCode)
  res.end('hello world');
})

server.listen(port, () => {
  console.log('server start in ' + port);
})