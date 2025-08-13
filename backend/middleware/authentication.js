const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors'); 

const auth = async (req, res, next) => {
  // Check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // FIX #1: Throw your custom error. This will be caught by an error-handling middleware.
    throw new UnauthenticatedError('Authentication invalid: No token provided');
  }
  
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user to the request object
    req.user = { userId: payload.userId, name: payload.name };
    next(); // Pass to the next middleware or controller
  } catch (error) {
    // FIX #2: Throw an error if the token is invalid (expired, wrong signature, etc.)
    throw new UnauthenticatedError('Authentication invalid: Token is not valid');
  }
};

module.exports = auth;