const fs = require('fs');
const process = require('process'); 

const writableStream = fs.createWriteStream('./02-write-file/text.txt');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
readline.question('Hello, my dear friend. What\'s your name? \n', (name) => {
  if (name.toString() === 'exit') {
    console.log('bye');
    process.exit();
  } else {
    console.log('Continue' + ',' + ' ' + name);
    writableStream.write(name + '\n');
    readline.on('line', (input) => {
      if (input === 'exit') {
        console.log('bye' + ',' + ' ' + name);
        process.exit();
      } else {
        writableStream.write(input + '\n');
        console.log('Continue' + ',' + ' ' + name);
      }  
    });
  }
});
readline.on('SIGINT', () => {
  console.log('Bye');
  process.exit();
});