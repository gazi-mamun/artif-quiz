"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: [true, `Please enter username`],
        trim: true,
        unique: true,
        maxlength: [30, `Username must have less or equal than 30 characters`],
        minlength: [4, `Username must have more or equal than 4 characters`],
        match: [
            /^[A-Za-z][A-Za-z0-9_]{3,30}$/,
            'Username should start with an alphabet and can be alphabets, numbers or an underscore of minimum 4 and maximum 40 characters',
        ],
    },
    email: {
        type: String,
        required: [true, `Please provide your email`],
        unique: true,
        validate: [validator_1.default.isEmail, `Please provide a valid email`],
    },
    role: {
        type: String,
        enum: [`user`, 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, `Please provide a password`],
        minlength: 8,
        match: [
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{8,}$/,
            'Password should be at least 8 characters long which contains at least one letter and one number',
        ],
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, `Please confirm your password`],
        validate: {
            // this only work on create and save
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!',
        },
        select: false,
    },
    passwordChangeAt: Date,
    passwordResetOtpCode: String,
    passwordResetExpires: Date,
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
});
// hashing password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
    this.passwordConfirm = '';
    next();
});
// checking password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcryptjs_1.default.compare(candidatePassword, userPassword);
};
// Not writting otp sending and reset password method because I will host them on a free hosting
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=userModel.js.map