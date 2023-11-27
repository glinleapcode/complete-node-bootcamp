const fs = require('fs');
const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // clean up queryObj
    //shallow copy
    const queryObj = { ...req.query };
    // exclude some fields from queryObj
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(element => delete queryObj[element]);

    // advanced filtering
    // console.log(queryObj);
    let queryStr = JSON.stringify(queryObj); // convert to string first
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(queryStr);

    //Build query
    //Convert the string to object
    let query = Tour.find(JSON.parse(queryStr));
    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // default sorting
      query = query.sort('-createdAt'); // sort by createdAt in descending order, recent first
    }

    // Execute query
    const tours = await query;
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }

  // method 1: using query string and find()
  // const tours = await Tour.find({
  //   duration: req.query.duration,
  //   difficulty: req.query.difficulty
  // });

  // const tours = await Tour.find(req.query);
  // method 2: using mongoose query operators

  // const tours = await Tour.find()
  //   .where('duration')
  //   .equals(req.query.duration)
  //   .where('difficulty')
  //   .equals(req.query.difficulty);
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne(req.params.id)
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   next();
// };
