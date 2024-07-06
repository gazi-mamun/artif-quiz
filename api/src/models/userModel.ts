import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
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
      validate: [validator.isEmail, `Please provide a valid email`],
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
        validator: function (el: string) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
      select: false,
    },
    passwordChangeAt: Date,
    passwordResetOtpCode: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

// hashing password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.passwordConfirm = '';
  next();
});

// checking password
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Not writting otp sending and reset password method because I will host them on a free hosting

const User = mongoose.model('User', userSchema);
export default User;
