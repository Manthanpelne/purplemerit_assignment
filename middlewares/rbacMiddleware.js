const mongoose = require('mongoose');
const Workspace = require('../models/Workspace');

const checkPermission = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { workspaceId } = req.params;

      // 1. Validate if the string is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
        return res.status(400).json({ 
          status: 'fail', 
          message: 'Invalid Workspace ID format' 
        });
      }

     
      const workspace = await Workspace.findById(workspaceId);
      
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      const member = workspace.members.find(
        (m) => m.user.toString() === req.user.id
      );

      if (!member || !allowedRoles.includes(member.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Server error during permission check" });
    }
  };
};

module.exports = checkPermission;