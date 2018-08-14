const fs = require('fs');
const path = require('path');
const settingsArgs = process.argv.slice(2);

const base = settingsArgs[0];
const newBase = settingsArgs[1];
const delDir = settingsArgs[2];

fs.mkdir(newBase, function (e) {
});

function fileFilter (from, to, del) {
  return new Promise((resolve, reject) => {
  });
};

fileFilter(base, newBase, delDir).then(console.log('done'));
