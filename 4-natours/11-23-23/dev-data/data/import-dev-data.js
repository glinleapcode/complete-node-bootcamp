const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB_URL = process.env.DATABASE;
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch(err => {
    console.log('DB connection failed!');
    console.log(err);
  });

// READ JSON FILE from tours-simple.json
// JSON.parse convert a JSON string into an object

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

console.log(__dirname, '**', __filename);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded to DB');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany(); // delete all the data in tours collection
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// console.log(process.argv);
// process.exit();

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
