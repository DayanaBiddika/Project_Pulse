//create superUserApp mini express application
const express = require("express");

const superAdminApp = express.Router();

// import verifySuperAdminToken
const verifySuperAdminToken = require("../middlewares/verifySuperAdminToken");

// import controller
const {roleMapping,getSuperAdmin} = require("../controllers/superAdmin.controller");


// Routes for superUserApp

superAdminApp.put("/user/role", verifySuperAdminToken, roleMapping);
//get super admin dashboard
superAdminApp.get("/superadmin",verifySuperAdminToken,getSuperAdmin);

// export superUserApp
module.exports = superAdminApp;
