// const dirs = [
//   'business/auth/role_changed/1.json',
//   'business/task_tracker/task_assigned/1.json',
//   'business/task_tracker/task_completed/1.json',
//
//   'streaming/task_tracker/task_created/1.json',
//   'streaming/task_tracker/task_updated/1.json',
//   'auth/user_created/1.json',
//   'auth/user_updated/1.json',
//   'auth/user_deleted/1.json',
// ]
const fs = require('fs');
const path = require('path');
const getAllFiles = (dirPath) => {
  const files = fs.readdirSync(dirPath);

  let arrayOfFiles = [];

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = arrayOfFiles.concat(getAllFiles(fullPath));
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
};

const files = getAllFiles('./libs/schema');

const schema = files.reduce((acc, file) => {
  let json;
  try {
    json = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`Error parsing ${file}`);
  }

  const key = json.title;

  if (acc[key]) {
    throw new Error(`Duplicate key ${key}`);
  }

  acc[key] = json;
  return acc;
}, {});

module.exports = schema;
