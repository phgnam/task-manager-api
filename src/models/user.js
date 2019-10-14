const validator = require('validator');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./tasks');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        require: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        },
    },
    password: {
        type: String,
        trim: true,
        require: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password", remove it.');
            };
        },
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be postive.');
            }
        }
    },
    avatar: {
        type: Buffer,
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
}, { timestamps: true })

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
})

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 8);
    }
    next();
})

userSchema.pre('delete', async function(next) {
    const user = this;
    await Task.deleteMany({ owner: user._id });
    next();

})

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'nguyenphuongnam');

    user.tokens = user.tokens.concat({ token });

    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
}


const User = mongoose.model('User', userSchema);

module.exports = User;