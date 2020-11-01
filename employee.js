const inquirer = require("inquirer");
const console = require('console');
var mysql = require("mysql");
const consoleTable = require("console.table");
const chalk = require('chalk');
let empidWhere;
let depidWhere;
let roleidWhere;
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
        console.log(chalk.red("Goodbye"))
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
           choices: ["View Employees", "Add Employee", "Update Employee Role", "Remove Employee", "Main Menu"]           
         },

        ).then(function({empAction}) {
        if(empAction === "View Employees"){   
             getEmpTable();

        }else if(empAction === "Add Employee"){           
            addEmployee(); 

        }else if(empAction === "Update Employee Role"){
          updateEmp();
               
        }else if (empAction === "Remove Employee"){
            removeEmp();

        }else if (empAction  === "Main Menu"){
          userInfo();
        }
      });  
    } 
  
    function getEmpTable(){     
        connection.query("Select * FROM emp_data order by dept, employee", function(err, res){
            if (err) throw err;
            console.table(res);
            getEmpOptions();
        });
      }
    
      function addEmployee(){
        
        connection.query("SELECT title, role_id FROM roles", function(err, res) {
          if(err) throw err;
          listRoles = res.map(role => ({ name: role.title, value: role.role_id }));

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
                    name: "roleName", 
                    type: "list",
                    message: "Select employee's role:",
                    choices: listRoles
                }                          
                ]).then(function(answer) { 
                   newrole=answer.roleName,
                   fname = answer.first_name,
                   lname = answer.last_name
                  connection.query("Select distinct Manager, Mgr_Id from manager_view", function(err,res) {
                    if(err) throw err;
                    listMan = res.map(manName => ({name: manName.Manager, value: manName.Mgr_Id}))
                    
                    inquirer.prompt([
                      {
                        name: "man_name",
                        type: "list",
                        message: "Select Manager",
                        choices: listMan
                      }
                    ]).then(function(answer) {
                    connection.query(
                    "INSERT INTO employees SET ? ",
                    {
                        first_name: fname,
                        last_name: lname,
                        role_id: newrole,
                        manager_id: answer.man_name
                    },  
                    function (err) {
                      
                        if (err) throw err;
                       
                        console.log("Employee has been added!");
                        userInfo();
                    }
                    )
                  })    
                })                
              })
            })
          
        
      }  

       //remove employee
        function removeEmp(){
            connection.query("SELECT emp_id, first_name, last_name FROM employees", function (err, res) {
              console.table(res);
              if (err) throw err; 
            inquirer
           .prompt([
               {
                   name: "empNameId",
                   type: "input", 
                   message: "Enter the Employee ID you wish to remove:",
                                 
                 }
               ]).then(function(answer) {
                                                            
                 connection.query(
                 "DELETE from employees WHERE ?",
                 {
                     emp_id: answer.empNameId
                 }
                 );
                 connection.query("SELECT EmployeeName FROM emp_view", function (err, res) {
                   if (err) throw err;          
                     console.log("Employee has been removed");
                     getEmpOptions();
                   })
                 })
           })
          }
            
     // update Employee Role    
            function updateEmp(){
              connection.query("SELECT Employee, Role, EmployeeID FROM emp_roledata", function(err, res) {
                if (err) throw err;
               //get employee name and role
                listEmpRole = res.map(empRole => ({name: empRole.Employee, value: empRole.EmployeeID}));
             
                  inquirer
                  .prompt([
                      {
                          name: "emp_role",
                          type: "list", 
                          message: "Select employee to update: ",
                          choices: listEmpRole
                      }
                    
                    ]).then(function(answer) {
                      empidRole = answer.emp_role
                      connection.query("Select distinct title, role_id from roles", function(err,res) {                   
                        if (err) throw err;
                       //get role id and role title
                        listroles = res.map(roleName => ({name: roleName.title, value: roleName.role_id}))
                       
                        inquirer
                        .prompt([
                          {
                              name: "roleId",
                              type: "list",
                              message: "Select new Role for Employee",
                              choices: listroles
                          }
                          ]).then(function(answer) {     
                                                 
                            connection.query(
                            "update employees set ? where ?",
                            [{
                                
                                role_id: answer.roleId
                                
                            },
                            {
                                emp_id: empidRole
                            }],                            
                            function (err) {
                              
                                if (err) throw err;
                                console.log(" Employee role has been updated!");
                                userInfo();
                            }
                            )                    
                        })
                      })
    
                    })
    
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
          connection.query("Select name AS Dept FROM department order by name", function(err, res){
              if (err) throw err;
              console.table(res);
              getDept();
          });
        }
          //add a department
         function addDepartment(){
         
         inquirer
        .prompt([
            {
                name: "depName",
                type: "input", 
                message: "Enter Department Name to add:",
                              
              }
            ]).then(function(answer) {
                                                         
              connection.query(
              "INSERT INTO department SET ?",
              {
                  name: answer.depName
              }
              );
              connection.query("SELECT name as Dept FROM department", function (err, res) {
                if (err) throw err;          
                  console.log("Department has been added!");
                  getDept();
                });
              })
        }
          
      //remove a department  
        function removeDept(){
          connection.query("SELECT name AS Dept FROM department", function (err, res) {
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
               connection.query("SELECT name AS Dept FROM department", function (err, res) {
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
          connection.query("select Employee, role as Role From emp_data where role like '%Manager' OR role like '%Director' OR role like '%Officer' ORDER BY Role",
           function(err, res){
              if (err) throw err
              console.table(res);
              getManager();
          });
        }

         function viewEmpManagers(){
           connection.query("Select employee, manager from manager_view order by manager", function(err, res){
             if(err) throw err;
             console.table(res);
             getManager();
           });
   }

        function updateEmpManager() {        
          connection.query("SELECT * FROM emp_toupdate", function(err, res) {
            if (err) throw err;
         
            listEmps = res.map(empName => ({name: empName.Employee, value: empName.EmployeeID}));
         
              inquirer
              .prompt([
                  {
                      name: "emp_name",
                      type: "list", 
                      message: "Select employee to update: ",
                      choices: listEmps
                  }
                
                ]).then(function(answer) {
                  empidWhere = answer.emp_name
                  connection.query("Select distinct Manager, Mgr_Id from manager_view", function(err,res) {                   
                    if (err) throw err;
                   
                    listMan = res.map(manName => ({name: manName.Manager, value: manName.Mgr_Id}))
                   
                    inquirer
                    .prompt([
                      {
                          name: "man_name",
                          type: "list",
                          message: "Select new manager for employee",
                          choices: listMan
                      }
                      ]).then(function(answer) {     
                                               
                        connection.query(
                        "update employees set ? where ?",
                        [{
                            
                            manager_id: answer.man_name
                            
                        },
                        {
                            emp_id: empidWhere
                        }],
                      
                        function (err) {
                            if (err) throw err;
                            console.log("Your employee has been updated!");
                            userInfo();
                        }
                        )                    
                    })
                  })

                })

              })
        
        }  





//*********************************************************************************//
//  Budget
//*********************************************************************************//

  function getBudget() {
    connection.query("select concat('$', FORMAT(budget,0)) as Budget, dept from budget_view order by dept",
    function(err, res){
      if(err) throw err;
      console.table(res);
       userInfo();
    });
  }

  


  