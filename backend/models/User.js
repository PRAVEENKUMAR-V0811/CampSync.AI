// // backend/models/User.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto'); // for password reset token

// // Define schema
// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     gender: { type: String, enum: ['male', 'female', 'other'], required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true }, // Hashed password
//     phone: { type: String, required: true, unique: true },
//     education: { type: String, required: true },
//     college: { type: String, required: true },
//     branch: { type: String, required: true },
//     passingYear: { type: Number, required: true },
//     role: {
//       type: String,
//       enum: ['user', 'admin'], // User types
//       default: 'user', // Default role
//     },
//     resetPasswordToken: String, // For password reset
//     resetPasswordExpire: Date,  // Token expiry time
//   },
//   {
//     timestamps: true, // Adds createdAt and updatedAt
//     collection: 'users'
//   }
// );

// // ✅ Hash password before saving
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // ✅ Compare entered password with hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// // ✅ Generate and hash password reset token
// userSchema.methods.getResetPasswordToken = function () {
//   // Generate raw reset token
//   const resetToken = crypto.randomBytes(20).toString('hex');

//   // Hash token and store in DB
//   this.resetPasswordToken = crypto
//     .createHash('sha256')
//     .update(resetToken)
//     .digest('hex');

//   // Token expires in 11 hours
//   const hours = 11;
//   this.resetPasswordExpire = Date.now() + hours * 60 * 60 * 1000;

//   // Return unhashed token (to send via email)
//   return resetToken;
// };

// // --- CRITICAL FIX: Check if the model already exists before defining it ---
// const User = mongoose.models.User || mongoose.model('User', userSchema);

// module.exports = User;


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    education: { type: String, required: true },
    college: { type: String, required: true },
    branch: { type: String, required: true },
    passingYear: { type: Number, required: true },

    regNo: { type: String, unique: true, sparse: true },

    cgpa: { type: Number, default: 0 },
    historyOfArrear: { type: String, enum: ['Yes', 'No'], default: 'No' },
    currentBacklog: { type: Number, default: 0 },
    currentSemester: { type: Number, default: 1 },

    academicUpdatePending: { type: Boolean, default: false },
    pendingData: {
      cgpa: { type: Number },
      historyOfArrear: { type: String },
      currentBacklog: { type: Number },
      currentSemester: { type: Number }
    },

    managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    placementStatus: {
      type: String,
      enum: ['Placed', 'Not Placed'],
      default: 'Not Placed'
    },
    recentCompany: { type: String, default: '' },
    packageLPA: { type: Number, default: 0 },
    jobType: {
      type: String,
      enum: ['Full Time', 'Intern + Full Time', 'N/A'],
      default: 'N/A'
    },
    internStipend: { type: Number, default: 0 },
    offersCount: { type: Number, default: 0 },

    role: {
      type: String,
      enum: ['user', 'faculty', 'admin'],
      default: 'user'
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true,
    collection: 'users'
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 11 * 60 * 60 * 1000;

  return resetToken;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
