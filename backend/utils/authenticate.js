const jwt = require("jsonwebtoken");

const authenticate_request = (req, res, next) => {
  const reqHead = req.headers["authorization"];

  if (!reqHead) {
    return res.sendStatus(401);
  }

  const token = reqHead.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticate_request,
};
