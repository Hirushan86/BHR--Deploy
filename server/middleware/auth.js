const jwt = require('jsonwebtoken');
const User = require ('../models/UserModel'); 

module.exports = async (req, res, next) => {
  // Get the token from the request headers or cookies
  const token = req.headers.authorization || req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    // Verify the token
    const tokenWithoutBearer = token.replace('Bearer ', ''); //removing bearer prefix
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    // Check if the user exists and is valid
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user object to the request for use in protected routes
    req.user = user;
    next(); //move onto next route
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
