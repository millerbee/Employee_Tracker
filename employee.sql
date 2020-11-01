--DROP DATABASE IF EXISTS employee;
--CREATE DATABASE employee;

USE employee;

CREATE TABLE employees(
  emp_id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (emp_id)
);


CREATE TABLE department(
  dept_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (dept_id)
);

CREATE TABLE roles(
  role_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL(10,2),
  dept_id INT,
  PRIMARY KEY (role_id)
);


INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("Sales");


INSERT INTO employees (first_name, last_name)
VALUES ("David", "Bowie");

INSERT INTO employees (first_name, last_name)
VALUES ("Sandra", "Smith");

INSERT INTO roles (title, salary)
VALUES ("Finance Manager", "100000");

INSERT INTO roles (title, salary)
VALUES ("Sales Director", "200000");

create view manager_view AS select `e`.`emp_id` AS `Emp_Id`,concat(`e`.`first_name`,' ',`e`.`last_name`) AS `Employee`,`m`.`emp_id` AS `Mgr_Id`,concat(`m`.`first_name`,' ',`m`.`last_name`) AS `Manager` from (`employee`.`employees` `e` join `employee`.`employees` `m` on((`e`.`manager_id` = `m`.`emp_id`)));
select * from department;

create view budget_view AS select sum(`employee`.`roles`.`salary`) AS `Budget`,`employee`.`employees`.`role_id` AS `erole`,`employee`.`roles`.`role_id` AS `roles`,`employee`.`roles`.`dept_id` AS `DDID`,`employee`.`department`.`dept_id` AS `dept_id`,`employee`.`department`.`name` AS `Dept` from ((`employee`.`employees` join `employee`.`roles`) join `employee`.`department`) where ((`employee`.`employees`.`role_id` = `employee`.`roles`.`role_id`) and (`employee`.`roles`.`dept_id` = `employee`.`department`.`dept_id`)) group by `employee`.`department`.`name`;

create view emp_data AS select distinct concat(`e`.`first_name`,' ',`e`.`last_name`) AS `Employee`,`r`.`title` AS `Role`,`d`.`name` AS `Dept` from (`employee`.`department` `d` join (`employee`.`roles` `r` left join `employee`.`employees` `e` on((`r`.`role_id` = `e`.`role_id`)))) where ((`r`.`dept_id` = `d`.`dept_id`) and (`e`.`role_id` = `r`.`role_id`));


create view emp_toupdate AS select concat(`employee`.`employees`.`first_name`,' ',`employee`.`employees`.`last_name`) AS `Employee`,`employee`.`employees`.`emp_id` AS `EmployeeID` from `employee`.`employees` where (`employee`.`employees`.`role_id` not in ('1','7','19','16','10'));

create view emp_view AS
SELECT `emp_view`.`EmployeeName`
FROM `employee`.`emp_view`;
 select concat(`employee`.`employees`.`first_name`,' ',`employee`.`employees`.`last_name`) AS `EmployeeName` from `employee`.`employees`;


create view emp_roledata AS
SELECT `emp_roledata`.`Employee`,
    `emp_roledata`.`RoleID`,
    `emp_roledata`.`Role`,
    `emp_roledata`.`EmployeeID`
FROM `employee`.`emp_roledata`;
