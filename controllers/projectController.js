// src/controllers/projectController.js
const Project = require('../models/Project');

// 1. Create Project
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const { workspaceId } = req.params;

        const project = await Project.create({
            name,
            description,
            workspace: workspaceId,
            createdBy: req.user.id
        });

        res.status(201).json({
            status: 'success',
            data: project
        });
    } catch (error) {
        res.status(400).json({ message: "Project creation failed", error: error.message });
    }
};

// 2. Update Project 
exports.updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            req.body, 
            { new: true, runValidators: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({
            status: 'success',
            data: updatedProject
        });
    } catch (error) {
        res.status(400).json({ message: "Update failed", error: error.message });
    }
};

// 3. Delete Project
exports.deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findByIdAndDelete(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ message: "Deletion failed" });
    }
};