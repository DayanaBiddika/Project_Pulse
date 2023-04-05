// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

// import Project Model
const { Project } = require("../models/project.model");
const {Op}=require('sequelize')
//import nodemailer
const nodemailer=require("nodemailer")
//transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dayyubiddika095@gmail.com",
    pass: "lscsslsurjfqrtab" // app password
  }
})

// import projectUpdatesModel
const { ProjectUpdates } = require("../models/projectUpdates.model");

// import projectconcerns model
const { ProjectConcern } = require("../models/projectConcerns.model");

// import TeamComposition model
const { TeamComposition } = require("../models/teamComposition.model");

// Association between Project and ProjectUpdates (one-to-many)
Project.ProjectUpdates = Project.hasMany(ProjectUpdates, {
  foreignKey: "projectId",
});

// Association between Project and Project Concern (one-to-many)
Project.ProjectConcern = Project.hasMany(ProjectConcern, {
  foreignKey: "projectId",
});

// projectUpdates updated by projectManager
const projectUpdate = expressAsyncHandler(async (req, res) => {
  // insert the data into projectupdates model
  await ProjectUpdates.create(req.body);
  //send response
  res.status(201).send({ message: "ProjectUpdates created" });
});

// raise project concerns by project manager
const raiseProjectConcern = expressAsyncHandler(async (req, res) => {
  // insert data into project concern model
  await ProjectConcern.create(req.body);
  res.status(201).send({ message: "Project Concern Raised...." });
});

// getProjectsForProjectManager
const getProjectsForProjectManager = expressAsyncHandler(async (req, res) => {
  // get the projectManagerId from url
  let projectManagerIdFromUrl = req.params.projectManagerId;
  // query to find all the projects under his maintanance
  let projectRecords = await Project.findAll({
    where: {
      projectManager: projectManagerIdFromUrl,
    },
    attributes: {
      exclude: [
        "gdoId",
        "projectManager",
        "hrManager",
        "domain",
        "typeOfProject",
      ],
    },
  });
  // if there are no projects for projectManager
  if (projectRecords.length == 0) {
    res.status(404).send({ message: "Sorry You don't have any  projects" });
  }
  // if there are projects
  else {
    res.status(200).send({
      message: `All projects for ${projectManagerIdFromUrl}`,
      payload: projectRecords,
    });
  }
});

//getSpecificProjectDetails
const getSpecificProjectDetails = expressAsyncHandler(async (req, res) => {
  // get the projectId from url
  let projectIdFromUrl = req.params.projectId;

  // query to get the particular projectId and its project updates and project concerns by associations
  let projectRecord = await Project.findOne({
    where: {
      projectId: projectIdFromUrl,
    },
    //include associations-eager loading
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
  let projectFitness = projectRecord.overAllProjectFitnessIndicator;
  // find team size
  let teamSize = projectRecord.employeeProjectDetails.length;
  // find number of concerns is active
  let concernIndicator = 0;
  projectRecord.projectConcerns.forEach((concern) => {
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
})


//raised concern and trigger a email
const raiseProjectConcerns = expressAsyncHandler(async (req, res) => {
  let mailOptions = {
    //from which mail raising the concern
    from: "dayyubiddika095@gmail.com",
    //to which mail
    to: "dayana.b@westagilelabs.com",
    //concern raised by
    subject: `Project concern is raised for project ${req.body.projectId} by ${req.body.raisedBy}`,
    //description about the concern
    text: `Hello Admin,
     A project concern is raised for the above project and the concern description is: ${req.body.concernDescription}
     severity of project concern:${req.body.severity} `,
  };
  //send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  //send response
  res.status(201).send({ message: "Project concern is raised" });
});
//update the project
const updateProject=expressAsyncHandler(async(req,res)=>{
  let {projectId,projectName}=req.body;
  let updates=await Project.findOne({where:{
    projectId: projectId
  }})
  //checking whether the project there or not
  if(updates==undefined){
    res.send({message:"project not found"})
  }
  else{
    //update
    await Project.update({projectName:projectName},{where:{projectId:projectId}})
    res.status(200).send({message:"project updated"})
  }
})
//update the concerns
const updateConcern=expressAsyncHandler(async(req,res)=>{
  //get the projectid and concern description from body
  let {projectId,concernDescription}=req.body;
  let concerns=await ProjectConcern.findOne({where:{
    projectId:projectId
  }})
  //check whether concerns are there or not
  if(concerns==undefined){
    res.status(404).send({message:"no concern is there to update"})
  }
  else{
    //update the concerns
    await ProjectConcern.update({concernDescription:concernDescription},{where:{projectId:projectId}})
    res.status(200).send({message:"concern updated"})
  }
})
//delete the raised concern
const deleteConcern=expressAsyncHandler(async(req,res)=>{
  let {projectId}=req.params;
  //delete the project with project id
  let concern=await ProjectConcern.destroy({where:{projectId:projectId}})
  //send response
  res.status(200).send({message:"concern deleted"})
})

//update the project updates
const updateProjectDetails=expressAsyncHandler(async(req,res)=>{
  let {projectId,projectStatusUpdate}=req.body;
  let concerns=await ProjectConcern.findOne({where:{
    projectId:projectId
  }})
  if(concerns==undefined){
    res.send({message:"no project is there to update"})
  }
  else{
    //update the project updates
    await ProjectUpdates.update({projectStatusUpdate:projectStatusUpdate},{where:{projectId:projectId}})
    res.status(200).send({message:"project details updated"})
  }
})
//delete the updated project details
const deleteProjectDetails=expressAsyncHandler(async(req,res)=>{
  let {projectId}=req.params;
  //delete the updated project details
  let concern=await ProjectUpdates.destroy({where:{projectId:projectId}})
  res.status(200).send({message:"project update deleted"})
})

// exports
module.exports = {
  projectUpdate,
  raiseProjectConcern,
  getProjectsForProjectManager,
  getSpecificProjectDetails,
  raiseProjectConcerns,
  updateProject,
  updateConcern,
  deleteConcern,
  updateProjectDetails,
  deleteProjectDetails
};
