const inquirer = require("inquirer");
const console = require('console');
var mysql = require("mysql");
const consoleTable = require("console.table");

// I have created views in mysql so pulling data here is easier
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root2",
  database: "employee"
});



connection.connect(function(err) {
  if (err) throw err;
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
        "Employee",
        "Manager",
        "Department",
        "Budget",
        "Exit"]
      },
    ]).then(function(answer){
      if(answer.options === "Employee"){
        getEmpOptions();
      }else if (answer.options  === "Manager"){
        getManager();
      }else if (answer.options === "Department"){
        getDept();
      }else if (answer.options === "Budget"){
        getBudget();
      }else if (answer.options  === "Exit"){
        console.log("Goodbye")
        connection.end();
      }
    
    });
  }
 
  // to view emp, roles,dept or all
   function getEmpOptions() {

       inquirer.prompt(
         {
           type: "list",
           message: "Select an action:",
           name: "empAction",
           choices: ["View Employees", "Add Employee", "Update Employee", "Remove Employee", "Main Menu"]           
         },

        ).then(function({empAction}) {
        if(empAction === "View Employees"){   
             getEmpTable();

        }else if(empAction === "Add Employee"){           
            addEmployee(); 

        }else if(empAction === "Update Employees"){
          updateEmp();
               
        }else if (empAction === "Remove Employees"){
            removeEmp();

        }else if (empAction  === "Main Menu"){
          userInfo();
        }
      });  
    } 
  
    function getEmpTable(){     
        connection.query("Select * FROM empdata", function(err, res){
            if (err) throw err;
            console.log(err);
            console.table(res);
            getEmpOptions();
        })
      }
    
      function addEmployee(){
        connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
            inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input", 
                    message: "Enter employees fist name: ",
                },
                {
                    name: "last_name",
                    type: "input", 
                    message: "Enter employees last name: "
                },
                {
                    name: "role", 
                    type: "rawlist",
                    choices: function() {
                    var roleArray = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArray.push(res[i].title);
                    }
                    return roleArray;
                    },
                    message: "Select employee's role? "
                }
                ]).then(function(answer) {
                    var roleId;
                    for (var i= 0; i< res.length; i++) {
                    if (res[i].title == answer.role) {
                        roleId = res[i];
                        console.log(roleId)
                    }                  
                  }  
                    connection.query(
                    "INSERT INTO employees SET ?",
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: answer.roleId
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your employee has been added!");
                        userInfo();
                    })
                    
                })
            })
        }
        
//Department options



function getDept() {

  inquirer.prompt(
    {
      type: "list",
      message: "Select an action:",
      name: "depAction",
      choices: ["View Departments", "Add Department",  "Remove Department", "Main Menu"]           
    },

   ).then(function({depAction}) {
   if(depAction === "View Departments"){   
        getDeptNames();

   }else if(depAction === "Add Department"){           
       addDepartment(); 

   }else if(depAction === "Remove Department"){
       removeDept();

   }else if (depAction  === "Main Menu"){
       userInfo();
   }
 });  
}       //view current departments
        function getDeptNames(){     
          connection.query("Select name FROM department", function(err, res){
              if (err) throw err;
              console.log(err);
              console.table(res);
              getDept();
          })
        }
      //add a department
         function addDepartment(){
         connection.query("SELECT name FROM department", function (err, res) {
         if (err) throw err;
         inquirer
        .prompt([
            {
                name: "depName",
                type: "input", 
                message: "Enter department name to add",
                choices: function() {
                  var deptArray = [];
                  for (let i = 0; i < res.length; i++) {
                      deptArray.push(res[i].name);
                  }
                  return deptArray;
                },
              }
            ]).then(function(answer) {
              var deptId;
              for (var i= 0; i< res.length; i++) {
              if (res[i].name == answer.depName) {
                  deptId = res[i];
                  console.log(deptId)
              }                  
            }  
              connection.query(
              "INSERT INTO department SET ?",
              {
                  dept_id: answer.deptId
              },
              function (err) {
                  if (err) throw err;
                  console.log("Depatment has been added!");
                  userInfo();
              })
              
          })
      })
  }