// create gdoApp express mini application
const express = require("express");
const gdoApp = express.Router();

// import verifyGDOToken
const verifyGDOToken = require("../middlewares/verifyGDOToken");

// import controllers from gdo

const {
  assignProject,
  rasieResourcingRequest,
  getProjects,
  getSpecificProjectDetails,
  getProjectsUnderGdo,
  getProjectsUnderGdos,
} = require("../controllers/gdo.controller");

// Routes for GDO

// Assign project to employees
gdoApp.post("/gdo/projectTeam", verifyGDOToken, assignProject);

// raise resourcing request by gdo
gdoApp.post("/gdo/resourcingRequest", verifyGDOToken, rasieResourcingRequest);

// get all projects under his maintanance
gdoApp.get("/:gdoId/portfolioDashboard", verifyGDOToken, getProjects);

// get specific project details
gdoApp.get(
  "/:gdoId/portfolioDashboard/:projectId",
  verifyGDOToken,
  getSpecificProjectDetails
);
gdoApp.get("/gdo/:projectId/get-projects",getProjectsUnderGdo)
gdoApp.get("/gdo/get-projects",getProjectsUnderGdos)

// exports
module.exports = gdoApp;
