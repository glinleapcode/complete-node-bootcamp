const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.7,
//   price: 497
// });

// testTour
//   .save()
//   .then(doc => {
//     console.log(doc);
//   })
//   .catch(err => {
//     console.log('Error 🔥', err);
//   });
