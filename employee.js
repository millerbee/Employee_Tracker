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

//***********************************************************************************************//
// Main Menu Actions
//**********************************************************************************************//
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
 //*******************************************************************************************//
  // Employee Actions
  //*******************************************************************************************//
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
        connection.query("Select * FROM emp_data order by dept, employee", function(err, res){
            if (err) throw err;
            console.log(err);
            console.table(res);
            getEmpOptions();
        })
      }
    
      function addEmployee(){
        connection.query("SELECT * FROM roles", function (err, res) {
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
                    message: "Select employee's role (use arrow keys)"
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
        function removeEmp(){
          connection.query("SELECT name FROM emp_view or by name", function (err, res) {
            if (err) throw err;  
          })
          inquirer
         .prompt([
             {
                 name: "empId",
                 type: "input", 
                 message: "Select Department to remove:",
                               
               }
             ]).then(function(answer) {
                                                          
               connection.query(
               "DELETE from emp_view WHERE ?",
               {
                   empd_id: answer.empId
               }
               );
               connection.query("SELECT name FROM emp_view", function (err, res) {
                 if (err) throw err;          
                   console.log("Employee has been removed");
                   getDept();
                 })
               })
         }
          
     function updateEmp(){
       connection.query("Select * from emp_data", function (err, res) {
          if(err) throw err;


       })
     }


//********************************************************************************************//
//Department Actions
//*******************************************************************************************//
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
          connection.query("Select name FROM department order by name", function(err, res){
              if (err) throw err;
              console.log(err);
              console.table(res);
              getDept();
          })
        }
      //add a department
         function addDepartment(){
         
         inquirer
        .prompt([
            {
                name: "depName",
                type: "input", 
                message: "Enter department name to add:",
                              
              }
            ]).then(function(answer) {
                                                         
              connection.query(
              "INSERT INTO department SET ?",
              {
                  name: answer.depName
              }
              );
              connection.query("SELECT name FROM department", function (err, res) {
                if (err) throw err;          
                  console.log("Depatment has been added.");
                  getDept();
                })
              })
        }
          
      //remove a department  
        function removeDept(){
          connection.query("SELECT name FROM department", function (err, res) {
            console.table(res);
            if (err) throw err; 
          inquirer
         .prompt([
             {
                 name: "depName",
                 type: "input", 
                 message: "Enter Department to remove:",
                               
               }
             ]).then(function(answer) {
                                                          
               connection.query(
               "DELETE from department WHERE ?",
               {
                   name: answer.depName
               }
               );
               connection.query("SELECT name FROM department", function (err, res) {
                 if (err) throw err;          
                   console.log("Depatment has been removed");
                   getDept();
                 })
               })
         })
        }
          
 //******************************************************************************************************//      
     // Manager Actions
 //*****************************************************************************************************//

 function  getManager(){

    inquirer.prompt(
      {
        type: "list",
        message: "Select an action:",
        name: "managerAction",
        choices: ["View Managers", "View Employees By Manager", "Update Employee Manager","Main Menu"]           
       },

      ).then(function({managerAction}) {
        if(managerAction === "View Managers"){   
          getManagerNames();

        }else if(managerAction === "View Employees By Manager"){           
          viewEmpManagers(); 

        }else if(managerAction === "Update Employee Manager"){
          updateEmpManager();
        
        }else if (managerAction  === "Main Menu"){
          userInfo();
    }
  });  
 }
     
//  return list of managers
       
        function getManagerNames(){     
          connection.query("Select manager FROM manager_view", function(err, res){
              if (err) throw err;
              console.log(err);
              console.table(res);
              getManager();
          })
        }

         function viewEmpManagers(){
           connection.query("Select employee, manager from manager_view order by manager", function(err, res){
             if(err) throw err;
             console.log(err);
             console.table(res);
             getManager();
           })
   }
//*********************************************************************************//
//  Budget
//*********************************************************************************//
  function getBudget() {
    connection.query("select concat('$', FORMAT(budget,0)) as Budget, dept from budget_view order by dept",
    function(err, res){
      if (err) throw err;
      console.log(err);
      console.table(res);
       userInfo();
    })
  }