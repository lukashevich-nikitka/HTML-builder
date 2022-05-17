const fs = require('fs');

const readableStream =  fs.createReadStream('./01-read-file/text.txt');
readableStream.on('data', function (chunk) {
  console.log(chunk.toString());
});
