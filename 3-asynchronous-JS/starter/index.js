const fs = require('fs');
const superagent = require('superagent');

// callback hell
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         console.log('Random dog image saved to file!');
//       });
//     });
// });

// Promises
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         console.log('Random dog image saved to file!');
//       });
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// make readFile and writeFile into promises
/*
const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('Could not find the file');
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err, data) => {
      if (err) reject('Could not write the file');
      resolve('successfully write the image data to file');
    });
  });
};

readFilePromise(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePromise('dog-img.txt', res.body.message);
  })
  .then((message) => {
    // console.log('Random dog image saved to file');
    console.log(message);
  })
  .catch((err) => {
    console.log(err.message);
  });
*/

/* wrong code
const getDogPic = async () => {
  try {
    // 1. get the dog breed from the dog.txt
    const data = await fs.readFile(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    //2. send a http request to get dog picture
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    //3. write the picture link to dog-img.txt file
    await fs.writeFile('dog-img.txt', res.body.message);
    console.log('Successfully saved image link to file');
  } catch (err) {
    console.log(err);
  }
};

getDogPic();
*/

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('Could not find the file');
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err, data) => {
      if (err) reject('Could not write the file');
      resolve('successfully write the image data to file');
    });
  });
};

const getDogPic = async () => {
  try {
    // 1. get the dog breed from the dog.txt
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    //2. send a http request to get dog picture
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    //3. write the picture link to dog-img.txt file
    await writeFilePromise('dog-img.txt', res.body.message);
    console.log('Successfully saved image link to file');
  } catch (err) {
    console.log(err);
  }
};

getDogPic();
