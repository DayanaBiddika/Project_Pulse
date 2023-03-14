const sequelize = require("../DB/db.config");
const request = require("supertest");
const app=require("../server")
// const admin=require("../controllers/admin.controller")
// const gdo=require("../controllers/gdo.controller")
// const project_manager=require("../controllers/projectManager.controller")
// const super_admin=require("../controllers/superAdmin.controller")
// const user=require("../controllers/user.controller")






// beforeAll(async () => {
//     await sequelize.query("create table Employee(userId int primary key,email varchar(50),username varchar(50),password varchar(50))")
//   });
  
//   beforeEach(async () => {
//     await sequelize.query("insert into Employee(userId,email,username,password) values(800,'abcd@westagilelabs.com','abcd','abcd')");
//  });
  
//   afterEach(async () => {
//     console.log("after each")
// });
  
//   afterAll(async () => {
//     console.log("after all")
// });

test('should create table employee',async()=>{
    let result=await request(app).post("/user")
    expect(res.body.payload).toEqual([
        {
            userId:800,
            email:"abcd@westagilelabs.com",
            username:"abcd",
            password:"abcd"
        }
    ])
})



