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

### Importing Development Data Into Database

The following steps are used to import development data into DB so that the API can start with some data in DB and for testing purposes.

- create a new file called `dev-data/data/tours-simple.json` and add some data to it.
- create a new file called `dev-data/import-dev-data.js` and import the data from `tours-simple.json` to DB.
- run `node dev-data/import-dev-data.js --import` to import the data to DB.
- run `node dev-data/import-dev-data.js --delete` to delete all documents in the collection.

```javascript
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"));

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// use command line arguments to decide whether to import or delete data
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
```

# Section 9: Error Handling with Express
