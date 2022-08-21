const Category = require("../models/category.js");
const { errorHandler } = require("../helper/dbErrorHandler.js");

exports.categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.category = category;
    next();
  });
};
exports.create = (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

exports.read = (req, res) => {
  return res.json(req.category);
};

exports.update = (req, res) => {
  // updating the data in the category.
  const category = req.category;
//   updating the list of name inside of category.
// passing the new name in from frontend as req.body.name and passing inside the category and saving the new name
  category.name = req.body.name;
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};
exports.remove = (req, res) => {
  const category = req.category;
    category.remove((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json({
        message: "Category is deleted"
      });
    });
  };
// getting all the list of categories
exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
    })
};
