// src/routes/projectRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // Important to access :workspaceId
const projectController = require('../controllers/projectController');
const protect = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/rbacMiddleware');

// All project routes require a logged-in user
router.use(protect);

// Create Project: Owners & Collaborators
router.post('/', 
    checkPermission(['owner', 'collaborator']), 
    projectController.createProject
);

// Update Project: Owners & Collaborators
router.patch('/:projectId', 
    checkPermission(['owner', 'collaborator']), 
   projectController.updateProject
);

// Delete Project: ONLY Owners
router.delete('/:projectId', 
    checkPermission(['owner']), 
    projectController.deleteProject
);

module.exports = router;