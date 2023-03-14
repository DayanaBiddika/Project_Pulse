// import sequelize from dbconfig
const sequelize = require("../DB/db.config");

const { DataTypes } = require("sequelize");
// employee model
const { Employee } = require("./employee.model");
// create schema/model for employee

exports.User = sequelize.define("users",{
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkEmail(email) {
          let email_domain = email.slice(-18);
          console.log(email_domain);
          if (email_domain != "@westagilelabs.com") {
            throw new Error("only westagilelabs emails are allowed");
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
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
