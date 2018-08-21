const fs = require('fs');
const util = require('util');
const path = require('path');
const settingsArgs = process.argv.slice(2);

const base = settingsArgs[0];
const newBase = settingsArgs[1];
const delDir = settingsArgs[2];

const addNewDir = util.promisify(fs.mkdir);
const delBaseDir = util.promisify(fs.rmdir);
const exsistDir = util.promisify(fs.access);
const readDir = util.promisify(fs.readdir);
const statDir = util.promisify(fs.stat);
const copyFile = util.promisify(fs.copyFile);
const delFile = util.promisify(fs.unlink);

let newFileBase = (fileBase) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(fileBase)) {
      addNewDir(fileBase)
        .then(
          () => resolve(),
          () => {
            return;
          }
        );
    }
  });
};

const scanDir = function (dir) {
  readDir(dir)
    .then(
      (files) => {
        files.forEach(file => {
          let innerFile = path.resolve(dir, file);
          let firstChar = file.charAt(0).toUpperCase();
          let pathFileFilter = path.join(newBase, firstChar);
          statDir(innerFile)
            .then((stats) => {
              if (stats.isDirectory()) {
                scanDir(innerFile);
              } else {
                newFileBase(pathFileFilter);
                copyFile(innerFile, path.join(pathFileFilter, file))
                  .then(
                    () => {
                      if (delDir === 'true') {
                        delFile(innerFile)
                          .then(
                            () => {
                              readDir(path.parse(innerFile).dir)
                                .then(
                                  (files) => {
                                    // console.log(files.length);
                                    if (!files.length) {
                                      delBaseDir(path.parse(innerFile).dir)
                                        .then(
                                          () => {
                                            readDir(base)
                                              .then(
                                                (files) => {
                                                  // console.log(files.length);
                                                  if (!files.length) {
                                                    delBaseDir(base)
                                                      .then(() => console.log(`${base} полностью удалена с вашего компьтера!\nВсе файлы скопированы в ${newBase}.`))
                                                      .catch(
                                                        () => {
                                                          return;
                                                        }
                                                      );
                                                  }
                                                }
                                              );
                                          }
                                        )
                                        .catch(
                                          () => {
                                            return;
                                          }
                                        );
                                    }
                                  }
                                );
                            }
                          );
                      } else {
                        return;
                      }
                    }
                  );
              }
            });
        });
      },
      () => {
        fs.rmdirSync(newBase);
        console.log(`${newBase} - удалена!`);
        console.log(`Уточните дирректорию. ${base} - не существует!`);
      }
    );
};

exsistDir(newBase)
  .then(
    () => console.log(`${newBase} уже есть! Укажите другую дирректорию`),
    () => {
      if (delDir && delDir === 'false' || delDir && delDir === 'true' || !delDir) {
        addNewDir(newBase)
          .then(() => {
            console.log(`${newBase} создана!`);
            scanDir(base);
          });
      } else {
        console.log(`${delDir} - не верный параметр! Укажите true/false или не вводите модификатор.`);
      }
    }
  )
  .catch(
    () => console.error('fatal Error!')
  );
