const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  files: [{ name: String, content: String }] // Mocked payload 
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);