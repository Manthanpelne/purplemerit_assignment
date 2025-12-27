// src/models/Workspace.js
const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { 
      type: String, 
      enum: ['owner', 'collaborator', 'viewer'], 
      default: 'viewer' 
    }
  }],
}, { timestamps: true });

// Indexing 
workspaceSchema.index({ "members.user": 1 });

module.exports = mongoose.model('Workspace', workspaceSchema);