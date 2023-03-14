// import sequelize from dbconfig
const sequelize = require("../DB/db.config");
const { DataTypes } = require("sequelize");
// import PorjectModel
const { Project } = require("./project.model");
const { User } = require("./user.model");
// create projecct concern schema
exports.ProjectConcern = sequelize.define("projectConcerns",{
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        model: Project,
        key: "projectId",
      },
    },
    projectManager: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "userId",
      },
    },
    concernDescription: {
      type: DataTypes.STRING,
    },
    concernRaisedBy: {
      type: DataTypes.STRING,
    },
    onDate: {
      type: DataTypes.DATE,
    },
    severity: {
      type: DataTypes.STRING,
    },
    raisedInternallyOrNot: {
      type: DataTypes.STRING,
    },
    statusOfConcern: {
      type: DataTypes.STRING,
    },
    concernMitigatedOnDate: {
      type: DataTypes.DATE,
    },
  },
  {
    createdAt:false,
    updatedAt:false,
    freezeTableName: true,
    timestamps: false
  }
);
