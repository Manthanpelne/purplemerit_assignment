const express = require('express');
const router = express.Router();

const checkPermission = require('../middlewares/rbacMiddleware');
const { updateMemberRole, createWorkspace } = require('../controllers/workspaceController');
const protect = require('../middlewares/authMiddleware');


// Only owners can invite members
router.post('/:workspaceId/members', 
  protect, 
  checkPermission(['owner']), 
  updateMemberRole
);

router.post('/', protect, createWorkspace);

module.exports = router;