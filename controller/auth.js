const User = require("../models/user.js");
const jwt = require("jsonwebtoken"); //to generate signed token
const {expressjwt} = require("express-jwt"); // for autorization check
const { errorHandler } = require("../helper/dbErrorHandler.js");

exports.signup = (req, res) => {
  console.log("req.body", req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err),
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({ user });
  });
};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with email does not exist.Please sighup",
      });
    }
    // if user is found make sure the email and password match
    // create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({ error: "email and password dont match" });
    }
    // generate a signed token with user id and secret

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // presist the token as't' in cookie with expire date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // return response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, email, name, role } });
  });
};


exports.signout=(req,res)=>{
    res.clearCookie('t')
    res.json({Messag:"Signout success"})
}


exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

// protect route from current authenticate user
exports.isAuth= (req, res,next ) => {
  let user=req.profile && req.auth && req.profile._id==req.auth._id
if(!user){
  return res.status(403).json({
    error:"Access denied"
  })
}

  next()
}


// / 
exports.isAdmin=(req,res,next)=>{
  if(req.profile.role===0){
    return res.status(403).json({
      error:"Admin resource! Access denied"
    })
  }
  next()
}