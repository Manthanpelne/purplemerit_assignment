const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true 
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false 
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  
  refreshToken: {
    type: String,
    select: false
  },

  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true, 
  versionKey: false
});

// --- Middlewares ---

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  this.password = await bcrypt.hash(this.password, 12);
})


// Helper to compare passwords during login
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;