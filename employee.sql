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