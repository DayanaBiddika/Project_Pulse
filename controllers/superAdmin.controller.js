// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

// import user controller
const {User} = require("../models/user.model")

const roleMapping = expressAsyncHandler(async (req, res) => {
 // get the role and userId
  let { userId, role } = req.body;
  // check the user
  let user_record = await User.findOne({
    where: {
      userId: userId,
    },
  });
  // if userRecord is empty means no user found
  if (user_record == undefined) {
    res.send({ message: "User not found to assign the role" });
  }
  // if user found
  else {
    let updatedUser = await User.update(
      { role: role },
      {
        where: {
          userId: userId,
        },
      }
    );
    res.status(200).send({ message: `Role is mapped to ${userId}` });
  }
});

//get dashboard of super admin
const getSuperAdmin=expressAsyncHandler(async(req,res)=>{
  //get all the users 
  let users=await User.findAll({attributes:{exclude:['password']}})
  //send res
  res.status(200).send({message:"users",payload:users})
})

// exports
module.exports = {roleMapping,getSuperAdmin};
