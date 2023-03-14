// import sequelize from dbcoonfig
const sequelize = require("../DB/db.config");
//importing datatypes
const { DataTypes } = require("sequelize");
// create schema for employee
exports.Employee = sequelize.define("employees",{
    empId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    empName: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt:false,
    updatedAt:false,
    freezeTableName: true,
    timestamps: false
  }
);
