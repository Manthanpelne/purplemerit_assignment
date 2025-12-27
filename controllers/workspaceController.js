const User = require("../models/User");
const Workspace = require("../models/Workspace");

// Create Workspace
exports.createWorkspace = async (req, res) => {
  const workspace = await Workspace.create({
    name: req.body.name,
    owner: req.user.id,
    members: [{ user: req.user.id, role: 'owner' }]
  });
  res.status(201).json(workspace);
};

// Invite Collaborator / Update Role
exports.updateMemberRole = async (req, res) => {
  const { workspaceId } = req.params;
  const { email, role } = req.body;

  const userToInvite = await User.findOne({ email });
  if (!userToInvite) return res.status(404).json({ message: "User not found" });

  const workspace = await Workspace.findById(workspaceId);
  
  // Logic: If user exists in workspace, update role. If not, add them.
  const memberIndex = workspace.members.findIndex(m => m.user.toString() === userToInvite._id.toString());

  if (memberIndex > -1) {
    workspace.members[memberIndex].role = role;
  } else {
    workspace.members.push({ user: userToInvite._id, role });
  }

  await workspace.save();
  res.status(200).json({ message: "Workspace permissions updated", workspace });
};