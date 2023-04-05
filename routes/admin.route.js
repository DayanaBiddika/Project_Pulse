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
  getRaisingRequest,
  getConcerns,
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
//update project
adminApp.put("/admin/project/:projectId",updateProjectByAdmin)
//get raising req
adminApp.get("/admin/project/raising-request",getRaisingRequest)
//get concerns
adminApp.get("/admin/project/get-concerns",getConcerns)

// export adminApi
module.exports = adminApp;
