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
    
    // Academic Mapping Fields
    education: { type: String, required: true }, // e.g., B.E
    branch: { type: String, required: true },    // e.g., CSE
    passingYear: { type: Number, required: true }, 
    section: { type: String, required: false },   // Added Section (A, B, C)

    college: { type: String, default: "Sri Krishna Instution" },
    regNo: { type: String, unique: true, sparse: true },

    // Assignment Logic

    // Stats & Data
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

    role: {
      type: String,
      enum: ['user', 'faculty', 'admin'],
      default: 'user'
    },

    // Placement Data
    placementStatus: { type: String, enum: ['Placed', 'Not Placed'], default: 'Not Placed' },
    recentCompany: { type: String, default: '' },
    placedDate: { type: Date },
    packageLPA: { type: Number, default: 0 },
    jobType: { type: String, enum: ['Full Time', 'Intern + Full Time', 'N/A'], default: 'N/A' },
    internStipend: { type: Number, default: 0 },
    offersCount: {
      type: Number,
      default: 0 // This ensures new students start with 0, not undefined
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true, collection: 'users' }
);

// Encrypt password
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
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 11 * 60 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);