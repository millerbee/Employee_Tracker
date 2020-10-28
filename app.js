var mysql = require("mysql"); 
const inquirer = require("inquirer");
const console = require('console');

// I have created views in mysql so pulling data here is easier
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root2",
  database: "employee"
});



connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  userInfo();
});


// start off asking what user wants to do
function userInfo() {

 return inquirer.prompt([
      {
      type: "list",
      message: "Choose an option: ",
      name: "options",
      choices: [
        "View Employee data",
        "Add Employee data",
        "Delete Employee data",
        "Update Employee Role",
        "Update Employee Manager",
        "View Department Budget", 
        "Exit"]
      },
    ]).then(function({options}){
      if(options === "View Employee data"){
        getEmpData();

      }else if (options === "Add Employee data"){
        addEmpData();
      }else if (options === "Delete Employee data"){
        deleteEmpData();
      }else if (options === "Update Employee Role"){
        updateEmpRole();

      }else if (options === "Update Employee Manager"){
        updateEmpManager();

      }else if (options === "View Department Budget"){
         viewBudget();
      }else if (options === "Exit"){
        closeApp();
      }
    
    });
  }
  // to view emp, roles,dept or all
  async function getEmpData() {

       return inquirer.prompt([
         {
           type: "list",
           message: "Select a View: ",
           name: "views",
           choices: ["View Employees", "View Roles", "View Departments", "View All", "Main Menu"]           
         },

       ]).then(function({views}) {
        if(views === "View Employees"){
          connection.query("Select * From empNames", function(err, res){
            if (err) throw err; 
            console.table(res); 
             getEmpData()});

        }else if(views === "View Roles"){
          connection.query("Select title from role", function(err, res){
            if (err) throw err; 
            console.table(res);
            getEmpData()}); 


        }else if(views === "View Departments"){
          connection.query("Select name from department", function(err, res){
            if (err) throw err; 
            console.table(res);
            getEmpData()}); 

        }else if (views === "View All"){
          connection.query("SELECT * from empData", function(err, res){
            if (err) throw err; 
            console.table(res); 
            getEmpData()}); 

        }else if (views === "Main Menu"){
          userInfo();
        }
      })  
    } 

   //add data to database
   async function addEmpData(){
    return inquirer.prompt([
      { type: "list",
        message: "Select the option you want to add",
        name: "addOption",
        choices: ["Employee", "Role", "Department"]
   }    
      
  ])
}

  
  

    
  
    

    



 

    

// function afterConnection() {
//   connection.query(`select e.first_name 'Frist Name', e.last_name 'Last Name', r.title 'Role', d.name 'Dept'
//   from department d, role r
//   join employees e on r.role_id = e.role_id
//   where r.dept_id = d.dept_id
//   group by e.first_name, e.last_name
//   order by d.name, e.last_name`)
  
  
  // function(err, rows) {
  //   if (err) throw err;
  //   //  Object.keys(result).forEach(function(key) {
  //   //      var rows = result[key];
  //        //console.log(row.first_name)
  //    })
   
  

  

