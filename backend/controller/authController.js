const User = require('../models/user');


const register = async (req, res) => {
  try {
    const newUser = await User.create({ ...req.body });

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });

  } catch (error) {
    if (error.code === 11000) { // E11000 is the code for a duplicate key error
      return res.status(400).json({ message: 'Email already exists' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Use 401 for auth errors
    }

    // Compare password using the new method
    const isMatch = await user.passwordCompare(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token using the new method
    const token = user.createJWT();
    
    res.status(200).json({ 
        message: 'Login successful', 
        token, 
        user
    });

  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { register, login };