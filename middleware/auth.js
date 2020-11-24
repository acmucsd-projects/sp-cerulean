const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  try {
    //tag onto request
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    console.log(decoded);
    next();
  } catch (err) {
    res.status(401).send("Access Denied");
  }
};
module.exports = auth;
