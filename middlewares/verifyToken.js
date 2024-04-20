const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalied Token" });
    }
  } else {
    res.status(401).json({ message: "No Token Provided" });
  }
}

// verify Token And Authorize user
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res
        .status(403) // forbiddin
        .json({
          message: "you are not allowed , you only can update your profile",
        });
    }
  });
}

// verify Token And Authorize Admin
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res
        .status(403) // forbiddin
        .json({
          message: "you are not allowed , only admin allowed",
          obj: req.user,
        });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
