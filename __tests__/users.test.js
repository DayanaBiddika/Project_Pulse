//const sequelize = require("../DB/db.config");
const request = require("supertest");
const app=require("../server")
const jwt=require("jsonwebtoken")

//test for registration 
test('should create a new user', async () => {
    const res = await request(app)
      .post('/user-api/user')
      .send({
          userId:'1100',
          username: 'kalpana',
          email: 'kalpana@westagilelabs.com',
          password: 'kalpana',
      });
    expect(res.status).toEqual(200);
})

//login
test('should return a 200 status code and a token when valid credentials are provided', async () => {
    // Perform a login request to get the bearer token
    const loginResponse = await request(app)
      .post('/user-api/user/login')
      .send({
        userId: 100,
        password: 'dayana'
      });
    const bearerToken = `Bearer ${loginResponse.body.token}`;
  
    // Make another request using the bearer token
    const response = await request(app)
      .get('/protected-route')
      .set('Authorization', bearerToken);
  
    // Perform your assertions
    expect(response.statusCode).toBe(200);
  });

//super admin
test('should assign roles to users',async()=>{
    const admin=await request(app)
    .put('/superAdmin-api/user/role')
    .send({
        userId:100,
        role:"superAdmin"
    });
    const bearerToken=`Bearer ${admin.body.token}`;
    const response=await request(app)
    .get('/protected-route')
    .set('Authorization',bearerToken)
    expect(response.statusCode).toBe(200)
})

//create project
test('create project by admin',async()=>{
    const project=await request(app)
    .post('/admin-api/admin/project')
    .send({
  projectId:6,
  projectName:"test-project",
  client:4000,
  gdoId:900,
  projectManager:400,
  hrManager:500,
  clientAccountManager:"dayyu",
  statusOfProject:"on going",
  startDate:"2023/10/31",
  endDate:"2023/12/30",
  overAllProjectFitnessIndicator:"Green",
  domain:".net",
  typeOfProject:"Development"
    })
    const bearerToken=`Bearer ${project.body.token}`;
    const response=await request(app)
    .get('/protected-route')
    .set('Authorization',bearerToken)
    expect(response.statusCode).toBe(201)
})








