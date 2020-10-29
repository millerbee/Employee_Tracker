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
             getEmpData();

        }else if(empAction  === "Add Employees"){           
            addEmp(); 

        }else if(empAction === "Update Employees"){
          updateEmp();
               
        }else if (empAction === "Remove Employees"){
            removeEmp();

        }else if (empAction  === "Main Menu"){
          userInfo();
        }
      })  
    }; 

    function getEmpData(){
      var query ="Select * From empdata";
      connection.query(query, function(err, res){
        if (err) throw err,
        console.table(results), 
        getEmpOptions();
      })
    }
  
// //    //add data to database  going to use switch/case where needed from now on.
//      function addEmp(){
//       return inquirer.prompt([
//       { type: "list",
//         message: "Select the option you want to add",
//         name: "addOption",
//         choices: ["Employee", "Role", "Department"]
//       }    
      
//         ]).then(function(addOption){
//           if(addOption === "Employee"){
//           addEmp();
//         }else if (addOption === "Role"){
//           addRole();
//         }else if (options === "Department"){
//           addDept();
//         } 
//       })
//     }
  
//     async function addEmp() {
//       return inquirer.prompt([
//         {
//           type: "input",
//           message: "Enter employees first name",
//           name: "empFirst"
//         },

//         { tpye: "input",
//           message: "Enter employees last name",
//           name: "empLast"
//         }, 
//           {
//             type: "list",
//             message: "Select role id for employee",
//             name: "newRole",
//             choices:   connection.query("SELECT role_id, title FROM role", function (err, res) {
//               var roleArr = [];
//               for (let i = 0; i < res.length; i++) {
//                   roleArr.push(res[i].title);
//               }
//               return roleArr;
//             })
//           },
        
//       ])
//     }
  
