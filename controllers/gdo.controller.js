// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

// import TeamCompostion Model
const { TeamComposition } = require("../models/teamComposition.model");

//import Employee Model
const { Employee } = require("../models/employee.model");

// import project Model
const { Project } = require("../models/project.model");
const {ProjectUpdates}=require("../models/projectUpdates.model")
const {ProjectConcern}=require("../models/projectConcerns.model")

// import ResourcingRequest model
const { ResourcingRequest } = require("../models/resourcingRequest.model");

// Association between TeamCoposition and Employee(one-many)
TeamComposition.Employee = TeamComposition.hasMany(Employee, {
  foreignKey: "projectId",
});

// Association between project and team composition model (one-to-many)
Project.TeamComposition = Project.hasMany(TeamComposition, {
  foreignKey: "projectId",
});
// Association between Project and ProjectUpdates (one-to-many)
Project.ProjectUpdates = Project.hasMany(ProjectUpdates, {foreignKey: "projectId"});

// Association between Project and Project Concern (one-to-many)
Project.ProjectConcern = Project.hasMany(ProjectConcern, {foreignKey: "projectId"});


// Assigning projects
const assignProject = expressAsyncHandler(async (req, res) => {
  // insert the data into the Team Composition model
  await TeamComposition.create(req.body);
  res.status(201).send({ message: "Project assigned to Employee" });
});

// rasieResourcingRequest
const rasieResourcingRequest = expressAsyncHandler(async (req, res) => {
  // insert the data into resourcingRequest model
  await ResourcingRequest.create(req.body);
  res.status(201).send({ message: "resourcing request raised" });
});

// get all the projects under his maintance
const getProjects = expressAsyncHandler(async (req, res) => {
  // get the gdoId from url
  let gdoIdFromUrl = req.params.gdoId;
  // query to find all the projects for the gdoId
  let projectRecord = await Project.findAll({
    where: {
      gdoId: gdoIdFromUrl,
    },
    attributes: {
      exclude: [
        "projectId",
        "gdoId",
        "projectManager",
        "hrManager",
        "domain",
        "typeOfProject",
      ],
    },
  });
  // if there are no projects for gdo
  if (projectRecord.length == 0) {
    res.send({ message: "sorry No projects for You..." });
  }
  // if there are projects
  else {
    res.status(200).send({
      message: `All Projects for gdo ${gdoIdFromUrl}`,
      payload: projectRecord,
    });
  }
});

// get specificProjectDetails
const getSpecificProjectDetails = expressAsyncHandler(async (req, res) => {
  // get the projectId from url
  let projectIdFromUrl = req.params.projectId;
  let gdoIdFromUrl = req.params.gdoId;

  // query to get the particular projectId and its project updates and project concerns by associations
  let projectRecord = await Project.findOne({
    where: {
      projectId: projectIdFromUrl,
      gdoId: gdoIdFromUrl,
    },

    include: [
      {
        association: Project.ProjectUpdates,
      },

      {
        association: Project.ProjectConcern,
      },
      {
        association: Project.TeamComposition,
      },
    ],
  });

  // return project fitness, concern indicator ,Team members get these values from projectRecord
  let projectFitness = projectRecord.dataValues.overAllProjectFitnessIndicator;
  // find team size
  let teamSize = projectRecord.dataValues.employeeProjectDetails.length;
  // find number of concerns is active
  let concernIndicator = 0;
  projectRecord.dataValues.projectConcerns.forEach((concern) => {
    if (concern.statusOfConcern == "pending") concernIndicator++;
  });
  // send response
  res.status(200).send({
    message: `Project Detaitls for projectId ${projectIdFromUrl}`,
    projectFitness: projectFitness,
    teamSize: teamSize,
    concernIndicator: concernIndicator,
    payload: projectRecord,
  });
});
//get projects
const getProjectsUnderGdo=expressAsyncHandler(async(req,res)=>{
  let projects=await Project.findOne({where:{projectId:req.params.projectId},
    include:[
      {
        association:Project.TeamComposition
      },{
        association:Project.ProjectUpdates
      },{
        association:Project.ProjectConcern
      }
    ]
  })
  res.status(200).send({message:"projects under gdo",payload:projects})
})
//get all projects
const getProjectsUnderGdos=expressAsyncHandler(async(req,res)=>{
  let projects=await Project.findAll({include:[{
    association:Project.TeamComposition
},{
    association:Project.ProjectUpdates
      },{
        association:Project.ProjectConcern
      },
    ]})
  res.status(200).send({message:"projects under gdo",payload:projects})
})

// exports
module.exports = {
  assignProject,
  rasieResourcingRequest,
  getProjects,
  getSpecificProjectDetails,
  getProjectsUnderGdo,
  getProjectsUnderGdos
};
