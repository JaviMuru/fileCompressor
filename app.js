const inquirer = require('inquirer');
const fs = require('fs');
const archiver = require('archiver');

const questions = [
  {
    message: 'Introduce el nombre del primer fichero a comprimir',
    type: 'input',
    name: 'file1'
  },
  {
    message: 'Introduce el nombre del segundo fichero a comprimir',
    type: 'input',
    name: 'file2'
  },
  {
    message: 'Introduce el nombre del tercer fichero a comprimir',
    type: 'input',
    name: 'file3'
  },
  {
    message: 'Introduce el nombre del fichero comprimido',
    type: 'input',
    name: 'outputZip'
  },
  {
    message: 'Quieres inicializar la aplicación?',
    type: 'confirm',
    default: false,
    name: 'runApp'
  }
]

async function runQuestions(questions) {
  return inquirer.prompt(questions)
  .then(answers => {
    return answers;
  })
}

function addFilesAndCompress(files, outputFileName) {
  let output = fs.createWriteStream(`./${outputFileName}.zip`);
  let archive = archiver('zip', {
      gzip: true,
      zlib: { level: 9 }
  });
  archive.on('error', (err) => {
    throw err;
  });
  archive.pipe(output);

  files.forEach((file) => {
    if (fs.existsSync(`./${file}`)) {
      console.log('exist');
      archive.file(`./${file}`, {name: `./${file}`});
    }
  })

  archive.finalize();  
}

async function main() {
  let answers = await runQuestions(questions);
  if (answers.runApp) {
    let files = [answers.file1,answers.file2,answers.file3]    
    addFilesAndCompress(files, answers.outputZip);
    console.log('Proceso finalizado');
  } else {
    console.log('Proceso Denegado por el usuario');
  }
  
}

main()
