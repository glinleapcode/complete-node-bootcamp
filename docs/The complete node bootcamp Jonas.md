# Section 2: Introduction to Node.js and NPM

## Reading and Writing Files

### Read File

### Write File

```javascript
const fs = require("fs");
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
const textOut = `This is what we know about avocado: ${textIn}. \nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!");
```

# Section 4: How Node.js Works: A Look Behind the Scenes

# Section 5: Asynchronous JavaScript: Promises and Async/Await

## The Problem with Callbacks: Callback Hell

- Callback Hell is a situation where we have a lot of nested callbacks. This makes the code hard to read and maintain.

```javascript
const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.log(err.message);
      console.log(res.body.message);

      fs.writeFile('dog-img.txt', res.body.message, (err) => {
        console.log('Random dog image saved to file!');
      });
    });
});
```

- The first callback is passed to `fs.readFile()`. This function reads a file and then calls the provided callback function with the contents of the file when it is done.
- Inside the first callback, there is a second callback. The second callback is passed to `superagent.get()`. This function makes a HTTP request and then calls the provided callback function with the response when it is done.
- Again, inside the second callback, there is a third callback. There is a call to `fs.writeFile()`, which writes the response to a file and then calls the provided callback function when it is done.
- So the callbacks are nested because each one is defined inside the previous one. This is called callback hell.

## From Callback Hell to Promises

- A promise is an object that is used as a placeholder for the future result of an asynchronous operation.
- We can modify the code above to use promises instead of callbacks.

```javascript
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => {
      console.log(res.body.message);

      fs.writeFile('dog-img.txt', res.body.message, (err) => {
        console.log('Random dog image saved to file!');
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});
```

- This version uses Promises to handle the asynchronous HTTP request made with `superagent.get()`., which helps avoid callback hell for that part of the code. However, we still have callback hell for the `fs.writeFile()` part of the code.

## Building Promises

- We can rewrite the code above to use promises for the `fs.readFile()` and `fs.writeFile()` parts of the code.
- The trick to be able to chain all the `then` methods is to return a promise before calling them.
- The readFilePromise returns a promise and we call the then method on the promise returned by the readFilePromise and we have access to the data returned by the readFilePromise, which is the dog breed.
- Then we use the dog breed to make a HTTP request to get the dog image and return a promise. We call the `then` method on the promise returned by the superagent HTTP request and we have access to the image link from the superagent API.
- Then we write the image url to a file and return a promise.
- We call the then method on the promise returned by the writeFilePromise and we have access to the message "successfully write the image data to file" returned by the writeFilePromise.

```javascript
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
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`); // return a promise
  })
  .then((res) => {
    console.log(res.body.message); // we have access to the image link from the superagent API
    return writeFilePromise('dog-img.txt', res.body.message); // return a promise
  })
  .then((message) => {
      console.log(message); // successfully write the image data to file
  })
  .catch((err) => {
    console.log(err.message);
  });
```

## Consuming Promises with Async/Await

- The `async` keyword means that this is a special type of function that is asynchronous. Basically it keeps running in the background while the rest of the code keeps executing.
- The `async` keyword automatically returns a promise. So we don't need to create a promise manually.
- We can have multiple `await` statements in an `async` function. The `await` keyword is used to wait for a promise to be resolved or rejected. The `await` keyword can only be used inside an `async` function.
- The await stops the code execution until the promise is resolved or rejected. So we can use the result of the promise directly without using the `then` method.

```javascript
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

```

## Returning Values from Async Functions

## Waiting for Multiple Promises Simultaneously

# Section 6: Express

# Section 7: MongoDB

# Section 8: Using MongoDB with Mongoose

## Setting up Mongoose for Tour API

1. configure DB connection in env file
2. install mongoose and import in in server.js.
3. use the DB connection string saved in env file to connect to DB using mongoose.connect(url)
4. create tourSchema and tourModel in server.js. The model created is called `Tour` and the collection created in DB is called `tours`.
5. create a testTour object using the Tour model `new Tour({})` and save it to DB using the testTour.save() method.
6. Refactor the code to use the MVC pattern. Create a new folder called `models` and create a new file called `tourModel.js`. Move the tourSchema and tourModel to this file. Export the tourModel from this file.
7. clean up the controllers/tourController.js file. Import the tourModel from the models/tourModel.js file. Use the tourModel to create a new tour and save it to DB.

## Building the API

### Create Documents

1. use `Tour.create(req.body)` to create a new tour and save it to DB.
2. For data that are not defined in the schema, they will be ignored by mongoose. For example, if we have a `durationWeeks` field in the req.body but not in the schema, it will be ignored by mongoose.

```javascript
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
```

### Reading Documents

1. use `Tour.find()` to find all documents in the collection.
2. use `Tour.findById(req.params.id)` to find a document by id. This is a shorthand for `Tour.findOne({_id: req.params.id})`. The `req.params.id` is the id passed in the url.

```javascript
// tourController.js
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({});
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne(req.params.id)
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
```

### Updating Documents

- When we see `Model.prototype.methodname()`, it means that the method is available on all documents or instances created from the model. When we see `Model.methodname()`, it means that the method is available on the model itself.
- use `findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
})` to update a document by id. The `req.body` is the data to be updated. The `new: true` option means that the updated document will be returned. The `runValidators: true` option means that the validators defined in the schema will be run again.
- The request methods thta can be used to update a document is `patch` or `put`. The difference between `patch` and `put` is that `patch` is used to update only the fields that are specified in the request body, while `put` is used to update the entire document. We use `patch` in our case.

```javascript
// tourController.js
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// routes.js
// the patch method is used to update a document

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);
```

### Deleting Documents

- use `findByIdAndDelete(req.params.id)` to delete a document by id.
- best practice do not return the object that is deleted. So we use `null` as the data returned.

```javascript
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
```

### Modelling the Tours

The following steps are used to model the tours so that the API can have more complete data.

- add more fields to the tourSchema
- add validation to the fields in the tourSchema
- add default values to the fields in the tourSchema
- `enum` is used to specify the allowed values for a field. For example, the `difficulty` field can only have the values `easy`, `medium` or `difficult`.
- `max` and `min` are used to specify the maximum and minimum values for a field. For example, the `rating` field can only have values between 1 and 5.
- `minlength` and `maxlength` are used to specify the maximum and minimum length of a string field. For example, the `name` field can only have a length between 10 and 40.
- `trim` is used to remove the whitespace at the beginning and end of a string field.
- `required` is used to specify whether a field is required or not.
- `default` is used to specify the default value for a field.
- `validate` is used to specify a custom validator for a field. The validator function takes in the value of the field as the first argument and returns a boolean. If the validator returns false, an error message will be returned.
- `slug` field is used to provide a url friendly version of the `name` field. For example, if the `name` field is `The Forest Hiker`, the `slug` field will be `the-forest-hiker`.

```javascript
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
    maxlength: [40, "A tour name must have less or equal then 40 characters"],
    minlength: [10, "A tour name must have more or equal then 10 characters"],
    // validate: [validator.isAlpha, 'Tour name must only contain characters']
  },
  slug: String, // url friendly version of the name
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
    enum: {
      values: ["easy", "medium", "difficult"],
      message: "Difficulty is either: easy, medium, difficult",
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        // this only points to current doc on NEW document creation
        return val < this.price;
      },
      message: "Discount price ({VALUE}) should be below regular price",
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, "A tour must have a description"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false,
  },
});
```

## Importing Development Data Into Database

The following steps are used to import development data into DB so that the API can start with some data in DB and for testing purposes.

- create a new file called `dev-data/data/tours-simple.json` and add some data to it.
- create a new file called `dev-data/import-dev-data.js` and import the data from `tours-simple.json` to DB.
- run `node dev-data/import-dev-data.js --import` to import the data to DB.
- run `node dev-data/import-dev-data.js --delete` to delete all documents in the collection.
- use `process.argv` to get the command line arguments. `process.argv[0]` is the path to the node executable. `process.argv[1]` is the path to the file that is executed. `process.argv[2]` is the first argument passed in the command line.
- `__dirname` is the directory name of the current module. `__filename` is the file name of the current module.
- use `fs.readFileSync()` to read a file synchronously. use `fs.readFile()` to read a file asynchronously.
- use `JSON.parse()` to convert a JSON string into an object. use `JSON.stringify()` to convert an object into a JSON string.
- the `seeder.js` in the `devcamper-api` works almost the same as the `import-dev-data.js`.

```javascript
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");

dotenv.config({ path: "./config.env" });

const DB_URL = process.env.DATABASE;
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.log("DB connection failed!");
    console.log(err);
  });

// READ JSON FILE from tours-simple.json
// JSON.parse convert a JSON string into an object

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

console.log(__dirname, "**", __filename);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded to DB");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany(); // delete all the data in tours collection
    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// console.log(process.argv);
// process.exit();

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
```

## Filtering

There are two ways to filter the data returned by the API.

- `req.query` is used to get the query string in the url. For example, if the url is `http://localhost:3000/api/v1/tours?duration=5&difficulty=easy`, the `req.query` will be `{ duration: '5', difficulty: 'easy' }`. We can use the `req.query` to filter the data returned by the API. When we add `?` to the url, everything after the `?` will be the query string. The query string is a key value pair separated by `&`. For example, `http://localhost:3000/api/v1/tours?duration=5&difficulty=easy` has two key value pairs `duration=5` and `difficulty=easy`.
- Method 1: use `Tour.find(req.query)` to filter the data. This method is not recommended because it is not flexible. For example, if we want to filter the data by `duration` and `difficulty`, we have to use `Tour.find({ duration: req.query.duration, difficulty: req.query.difficulty })`. If we want to filter the data by `duration` and `price`, we have to use `Tour.find({ duration: req.query.duration, price: req.query.price })`. This method is not flexible because we have to hard code the fields that we want to filter.
- Method 2: use `Tour.find().where('duration').equals(req.query.duration).where('difficulty').equals(req.query.difficulty)` to filter the data. This method is more flexible because we can chain the `where` method to filter the data by different fields. For example, we can use `Tour.find().where('duration').equals(req.query.duration).where('price').equals(req.query.price)` to filter the data by `duration` and `price`.

```javascript
// tourController.js

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //method 1: using query string and find()
    const tours = await Tour.find({
      duration: req.query.duration,
      difficulty: req.query.difficulty,
    });
    // const tours = await Tour.find(req.query); // method 1 short hand
    //method 2: using mongoose query operators
    const tours = await Tour.find()
      .where("duration")
      .equals(req.query.duration)
      .where("difficulty")
      .equals(req.query.difficulty);
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
```

- The `limit`, `sort` and `page` in the query string are used to limit the number of documents returned, sort the documents and paginate the documents. But they are not part of the query string. So we need to remove them from the query string before we use the query string to filter the data.

  1. use `const queryObj = { ...req.query }` to create a new object from the `req.query`. This is a shallow copy. So we can modify the new object without affecting the original object. We can not just use `const queryObj = req.query` because this is a reference to the `req.query`. So if we modify the `queryObj`, the `req.query` will also be modified.
  2. use `const excludedFields = ['page', 'sort', 'limit', 'fields']` to specify the fields that we want to exclude from the query string.
  3. use `excludedFields.forEach(el => delete queryObj[el])` to delete the fields specified in the `excludedFields` from the `queryObj`.

- We first build the query and then execute the query with the await keyword. In this way, we can add more filters to the query. For example, we can add `sort`, `limit` and `select` to the query. This is more flexible than the method 1 and method 2 above.

```javascript
// tourController.js
// postman: http://localhost:3000/api/v1/tours/?duration=5&difficulty=easy&limit=5&page=3
exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query }; // shallow copy

    // exclude some fields from queryObj
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((element) => delete queryObj[element]);

    //Build query
    const query = Tour.find(queryObj);
    // execute query
    const tours = await query;
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
```

## Advanced Filtering

- use `gte`, `gt`, `lte`, `lt` to filter the data by `price`. For example, `http://localhost:3000/api/v1/tours/?price[gte]=1000&price[lte]=1500` will return the tours with price between 1000 and 1500.
- use `ne` to filter the data by `name`. For example, `http://localhost:3000/api/v1/tours/?name[ne]=The Snow Adventurer` will return the tours with name not equal to `The Snow Adventurer`.
- use `in` to filter the data by `difficulty`. For example, `http://localhost:3000/api/v1/tours/?difficulty[in]=easy,medium` will return the tours with difficulty equal to `easy` or `medium`.
- use `glt` to filter the data by `duration`. For example, `http://localhost:3000/api/v1/tours/?duration[gte]=6&difficulty=easy&limit=5&page=3` will return the tours with duration less than 6.
- Need to convert `gte`, `gt`, `lte`, `lt` to `$gte`, `$gt`, `$lte`, `$lt` and `ne` to `$ne` before we use them in the query. For example, `{ duration: { gte: '6' }, difficulty: 'easy', limit: '5', page: '3' }` need to be converted to `{ duration: { '$gte': '6' }, difficulty: 'easy', limit: '5', page: '3' }` before we use it in the query.
- Use `JSON.stringify()` to convert an object to a JSON string and then we can use `replace()` to replace `gte`, `gt`, `lte`, `lt` and `ne` with `$gte`, `$gt`, `$lte`, `$lt` and `$ne`.
- use regex to match `gte`, `gt`, `lte`, `lt` and `ne` and replace them with `$gte`, `$gt`, `$lte`, `$lt` and `$ne`. Syntax of a regular expression: `/pattern/modifiers;`

  ```javascript
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  ```

  - `\b` is used to match the word boundary. For example, `\bcat\b` will match `cat` but not `category`. It matches the entire word `cat`.

  - `g` is used to do a global match (find all matches rather than stopping after the first match). 4.`(gte|gt|lte|lt)` is used to match any of the alternatives separated with `|`. For example, `/(red|green|blue)/` matches any of the strings `red`, `green`, or `blue`.

  - `match` is the matched substring.

  - In postman we use `http://localhost:3000/api/v1/tours/?duration[gte]=6&difficulty=easy&limit=5&page=3` to test the API.

```javascript
// tourController.js
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    const queryObj = { ...req.query }; // make a copy of req.query
    console.log(req.query);
    // exclude some fields from queryObj
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((element) => delete queryObj[element]);
    // advanced filtering
    // We need { difficulty: 'easy', duration: { $gte: 5 } }
    // Now we have { duration: { gte: '5' }, difficulty: 'easy' } so need to convert gte to $gte
    console.log(queryObj);
    let queryStr = JSON.stringify(queryObj); // convert to string first
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(queryStr);
    //Build query
    // const query = Tour.find(queryObj);
    const query = Tour.find(JSON.parse(queryStr));
    // execute query
    const tours = await query;
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
```

## Sorting

- use `sort()` to sort the data. For example, `http://localhost:3000/api/v1/tours/?sort=price` will sort the data by price in ascending order. `http://localhost:3000/api/v1/tours/?sort=-price` will sort the data by price in descending order.
- sort by multiple fields: `http://localhost:3000/api/v1/tours/?sort=price,ratingsAverage` will sort the data by price in ascending order and then sort the data by ratingsAverage in ascending order.

  > [sort() API](<https://mongoosejs.com/docs/api/query.html#Query.prototype.sort()>)

  ```javascript
  // sort by "field" ascending and "test" descending
  query.sort({ field: "asc", test: -1 });
  // equivalent
  query.sort("field -test");
  // also possible is to use a array with array key-value pairs
  query.sort([["field", "asc"]]);
  ```

> Example 1: sort by price in ascending order

```javascript
const queryObj = { ...req.query };
// exclude some fields from queryObj
const excludedFields = ["page", "sort", "limit", "fields"];
excludedFields.forEach((element) => delete queryObj[element]);

// advanced filtering
console.log(queryObj);
let queryStr = JSON.stringify(queryObj); // convert to string first
queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
console.log(queryStr);
//Build query
//Convert the string to object
let query = Tour.find(JSON.parse(queryStr));
// sorting
if (req.query.sort) {
  query = query.sort(req.query.sort);
}
// Execute query
const tours = await query;
```

> Example 2: sort by price in ascending order and then sort by ratingsAverage in ascending order

```javascript
...
// sorting
// postman: http://localhost:3000/api/v1/tours/?sort=price,ratingAverage
if (req.query.sort) {
  const sortBy = req.query.sort.split(",").join(" ");
  query = query.sort(sortBy);
} else {
  // default sorting
  query = query.sort("-createdAt"); // sort by createdAt in descending order, recent first
}
// Execute query
const tours = await query;
```

## Limiting Fields

- use `select()` to select the fields that we want to return. For example, `http://localhost:3000/api/v1/tours/?fields=name,duration,difficulty,price` will return the tours with only the fields `name`, `duration`, `difficulty` and `price`.
- use `-` to exclude a field. For example, `http://localhost:3000/api/v1/tours/?fields=-name,-duration,-difficulty,-price` will return the tours with all the fields except `name`, `duration`, `difficulty` and `price`.

```javascript
// tourController.js
...
// sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // default sorting
      query = query.sort('-createdAt'); // sort by createdAt in descending order, recent first
    }
    // field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      // exclude __v field
      query = query.select('-__v');
    }
     // Execute query
    const tours = await query;
    ...
```

## Pagination

- use `skip()` and `limit()` to implement pagination. For example, `http://localhost:3000/api/v1/tours/?page=2&limit=10` will return the second page with 10 documents per page.
- use `const page = req.query.page * 1 || 1` to get the page number from the query string. If the page number is not specified in the query string, the default page number is 1.
- use `const limit = req.query.limit * 1 || 100` to get the limit from the query string. If the limit is not specified in the query string, the default limit is 100.

# Section 9: Error Handling with Express
