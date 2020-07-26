# employee-manager-mini-project
Mini project which consist of creating a simple (NodesJs express) Api and carry out CRUD operations and interact with MongoDb database, also the Api is secured with the JWT library and uses other libraries such as validator in order to sanitize and validate data....

To use this project :
- First you have to load the needed dependencies via npm install.
- Install mongoDb, see manual https://docs.mongodb.com/manual/installation/
- Check the right path to your DB, and set it in the ./src/db/mongoose.js.

Once completed, you can use Postman to perform the several api calls.

Example : 

1 - Start by creating a new user.
POST -> localhost:3000/employees
body -> 
{
	"email": "toto.example@gmail.com",
	"password":"6777UUUUJS",
	"name" : "Mr toto",
	"age": 27
}
2- Once the user is created, you have to call the login in order to get valid token
POST -> localhost:3000/employees/login
{
  "email": "toto.example@gmail.com",
	"password":"6777UUUUJS"
}
3- Once you have the token, you can use it as 'Authorization' header and you can perform the other operations.

Enjoy !!!
