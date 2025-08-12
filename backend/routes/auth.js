const express = require('express');
const router = express.Router();

const {login,register} = require('../controller/authController');

// // Importing the auth controller
// const authController = require('../controllers/authController');
// // Importing the auth middleware
// const authMiddleware = require('../middlewares/authMiddleware');
// // Importing the validation middleware
// const validationMiddleware = require('../middlewares/validationMiddleware');
// // Importing the user validation schema
// const userValidationSchema = require('../validations/userValidation');
// // Importing the login validation schema
// const loginValidationSchema = require('../validations/loginValidation');
// // Importing the password reset validation schema
// const passwordResetValidationSchema = require('../validations/passwordResetValidation');
// // Importing the password change validation schema
// const passwordChangeValidationSchema = require('../validations/passwordChangeValidation');
// // Importing the email validation schema
// const emailValidationSchema = require('../validations/emailValidation');
// // Importing the password validation schema
// const passwordValidationSchema = require('../validations/passwordValidation');
// // Importing the email verification middleware

// const emailVerificationMiddleware = require('../middlewares/emailVerificationMiddleware');
// // Importing the password reset middleware
// const passwordResetMiddleware = require('../middlewares/passwordResetMiddleware');
// // Importing the password change middleware
// const passwordChangeMiddleware = require('../middlewares/passwordChangeMiddleware');
// // Importing the email sending middleware
// const emailSendingMiddleware = require('../middlewares/emailSendingMiddleware');
// // Importing the user profile middleware
// const userProfileMiddleware = require('../middlewares/userProfileMiddleware');
// // Importing the user profile validation schema
// const userProfileValidationSchema = require('../validations/userProfileValidation');
// // Importing the user profile update middleware
// const userProfileUpdateMiddleware = require('../middlewares/userProfileUpdateMiddleware');
// // Importing the user profile update validation schema
// const userProfileUpdateValidationSchema = require('../validations/userProfileUpdateValidation');
// // Importing the user deletion middleware
// const userDeletionMiddleware = require('../middlewares/userDeletionMiddleware');
// // Importing the user deletion validation schema
// const userDeletionValidationSchema = require('../validations/userDeletionValidation');
// // Importing the user logout middleware
// const userLogoutMiddleware = require('../middlewares/userLogoutMiddleware');
// // Importing the user logout validation schema
// const userLogoutValidationSchema = require('../validations/userLogoutValidation');
// // Importing the user registration middleware
// const userRegistrationMiddleware = require('../middlewares/userRegistrationMiddleware');
// // Importing the user registration validation schema
// const userRegistrationValidationSchema = require('../validations/userRegistrationValidation');
// // Importing the user login middleware
// const userLoginMiddleware = require('../middlewares/userLoginMiddleware');
// // Importing the user login validation schema
// const userLoginValidationSchema = require('../validations/userLoginValidation');
// // Importing the user logout middleware
// const userLogoutMiddleware = require('../middlewares/userLogoutMiddleware');
// // Importing the user logout validation schema
// const userLogoutValidationSchema = require('../validations/userLogoutValidation');


// Define routes for authentication
router.post('/register',register );
router.post('/login', login);


module.exports = router;