const Formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product.js");
const { errorHandler } = require("../helper/dbErrorHandler.js");

exports.productById = (req, res, next, id) => {
  console.log("Product");
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "product not found",
      });
    }
    req.product = product;
    next();
  });
};

exports.read = (req, res) => {
  console.log(req.product);
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Product deleted Successfully",
    });
  });
};
exports.create = (req, res) => {
  const form = new Formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    // check for all fields
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }
    let product = new Product(fields);
    // 1kb=1000
    // 1mb=1000000
    if (files.photo) {
      // console.log("files.photo", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should  be less than 1mb in size",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json({
        result,
      });
    });
  });
};
exports.update = (req, res) => {
  const form = new Formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    // check for all fields
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required.",
      });
    }
    // getting the product from the productbyid which is req.product
    let product = req.product;
    product = _.extend(product, fields);
    // 1kb=1000
    // 1mb=1000000
    if (files.photo) {
      // console.log("files.photo", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should  be less than 1mb in size",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.mimetype;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json({
        result,
      });
    });
  });
};

// **
// sell/arrival
// by sell vanyera muni ko parameter le sold agadiko dekhauxa descendung order ma (descing ko thauma asending garyera asending ma garna ni milyo)
//**/////////////////////////////////////////////////////// // by sell=/products?sortBy=sold&order=desc&limit=4

// by arrivak vanyera muni ko parameter le latest create vako(createdAt) agadiko dekhauxa descendung order ma (descing ko thauma asending garyera asending ma garna ni milyo)
/////////////////////////////////////////////////////////
//by arrival=/products?sortBy=createdAt&order=desc&limit=4
// if no params are sent, then all products are returnes

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).send({
          error: "Product not found",
        });
      }
      res.json(products);
    });
};

// it will find the products based on the req product category
// other products that has the same category, will be returned
// hamle yesma product vetra ko category ko base ma product find garna khojyeko 
exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  // $ne vanyeko dont select. product vetra ko category ko find gar ani le vanya xa. anif frontend ma productid ko marfat search garda related category ko product matra khoj vanxa
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({ errror: "Product not found" });
      }
      res.json(products);
    });
};

// it find the category and show the category id which is used by product
exports.listCategories= (req, res) => {
  Product.distinct("category",{},(err, products) => {
    if (err) {
      return res.status(400).json({ errror: "Product not found" });
    }
    res.json(products);
  })
}
// list product by search
// we will implemet product seaarch in react frontend
// we will show categories in checkbox and price range in radio buttons
// as the user clics on those checkbox and radio buttons
// we eill make api request and show the products to users based on what he wants
exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);
// grabbing the key out of object(req.body that we get)
  for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
          if (key === "price") {
              // gte -  greater than price [0-10]
              // lte - less than
              findArgs[key] = {
                // grabbing the keywhich is greater than 0
                  $gte: req.body.filters[key][0],
                  // grabbing the keywhich is less than 1
                  $lte: req.body.filters[key][1]
              };
          } else {
              findArgs[key] = req.body.filters[key];
          }
      }
  }

  Product.find(findArgs)
      .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, data) => {
          if (err) {
              return res.status(400).json({
                  error: "Products not found"
              });
          }
          res.json({
              size: data.length,
              data
          });
      });
};
