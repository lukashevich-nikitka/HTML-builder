const fs = require('fs/promises');
const path = require('path');

async function findInfo() {
  const files = await fs.readdir('./03-files-in-folder/secret-folder', {withFileTypes: true});
  for (let file of files) {
    if (file.isFile()) {
      let link = path.join(file.name);
      let info = await fs.stat('./03-files-in-folder/secret-folder' + '/' + link);
      let ext = (path.extname(link)).split('').slice(1).join('');
      let arrName = link.split('');
      let index = arrName.indexOf('.');
      let fileName = arrName.slice(0, index).join('');
      console.log(fileName + ' - ' + ext + ' - ' + info.size);
    }
  }
}

findInfo();