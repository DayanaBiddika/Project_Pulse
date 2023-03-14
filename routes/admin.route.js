// create admin mini express application
const express = require("express");
const adminApp = express.Router();

// import verifyAdminToken
const verifyAdminToken = require("../middlewares/verifyAdminToken");

// import admin controllers
const {
  getProjects,
  getSpecificProjectDetails,
  createProject,
  deleteProject,
  updateProjectByAdmin,
} = require("../controllers/admin.controller");

// routes for admin after login

// get all projects on clicking portfolioDashboard
adminApp.get("/admin/portfolioDashboard", verifyAdminToken, getProjects);

// get specific project details by clicking on specific project
adminApp.get(
  "/admin/portfolioDashboard/:projectId",
  verifyAdminToken,
  getSpecificProjectDetails
);

// create project
adminApp.post("/admin/project", verifyAdminToken,createProject);
//delete project
adminApp.delete("/admin/project/:projectId",deleteProject)
adminApp.put("/admin/project/:projectId",updateProjectByAdmin)

// export adminApi
module.exports = adminApp;
