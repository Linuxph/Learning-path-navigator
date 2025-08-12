const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
})

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    try{
        await this.validate();
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next();

    }catch(error){
        next(error);

    }
})

userSchema.methods.createJWT = function () {
    return jwt.sign(    
      { userId: this._id, name: this.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      }
    )
}

userSchema.methods.passwordCompare = async function  (candidatePassword) {
    const ismatch = await bcrypt.compare(candidatePassword,this.password);
    return ismatch;
}

const User = mongoose.model('User', userSchema);

module.exports = User;