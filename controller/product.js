const Formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product.js");
const { errorHandler } = require("../helper/dbErrorHandler.js");

exports.productById= (req, res,next,id) => {
  console.log("Product")
  Product.findById(id).exec((err, product) => {
    if(err ||!product) {
      return res.status(400).json({
        error: "product not found",
      });}
      req.product=product;
      next()
    });
  }

exports.read= (req, res) => {
  console.log(req.product);
  req.product.photo=undefined;
 return  res.json(req.product);
}

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
