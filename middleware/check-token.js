const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token in req->:"+token);
    const decodedToken=jwt.verify(token, "secret_this_should_be_longer_baraut_pizza");
    console.log("decodedToken in req->:"+JSON.stringify(decodedToken));
    req.userData = { msisdn: decodedToken.msisdn };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Auth failed!" ,status:"UNAUTHENTIC"});
  }
};
