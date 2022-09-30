const express = require("express");;
const morgan=require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const mongoose= require("mongoose");
const cors= require("cors");
require("dotenv").config();

// app
const app = express();


// middlewares
app.use(morgan('tiny'))
app.use(express.urlencoded({extended:false}))
app.use(express.json());
app.use(cookieParser())
app.use(expressValidator())
app.use(expressValidator())
app.use(cors())

// import routes
const authRoutes= require("./routes/auth.js");
const userRoutes= require("./routes/user.js"); 
const categoryRoutes= require("./routes/category.js"); 
const productRoutes= require("./routes/product.js"); 
const braintreeRoutes= require("./routes/braintree.js"); 

// Db

mongoose.connect(process.env.Database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }).then(()=>console.log("Db connected"))


// routes middleware
app.use("/api",userRoutes)
app.use("/api",authRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)
app.use("/api",braintreeRoutes)



const port = process.env.PORT || 8000;


app.listen(port,()=>{
    console.log(`Server listening on ${port}`);
})