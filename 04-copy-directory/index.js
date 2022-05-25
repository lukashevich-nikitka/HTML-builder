const fs = require('fs');

fs.mkdir('./04-copy-directory/files-copy', {recursive: true}, (err) => {
  if (err) throw err;
});

const files = fs.promises.readdir('./04-copy-directory/files-copy', {withFileTypes: true});
for (let file in files) {
  fs.rmdir('./04-copy-directory/files-copy' + '/' + file.name, (err) => {
    if (err) throw err;
  });
}

async function copyDir() {
  const files = await fs.promises.readdir('./04-copy-directory/files', {withFileTypes: true});
  for (let file of files) {
    const writeStream = fs.createWriteStream('./04-copy-directory/files-copy' + '/' + file.name);
    const readableStream = fs.createReadStream('./04-copy-directory/files' + '/' + file.name);
    readableStream.on('data', function (chunk) {
      writeStream.write(chunk);
    });
  }
}

copyDir();
