DROP DATABASE IF EXISTS employeedb;

CREATE DATABASE employeedb;

USE employeedb;

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR (30) NOT NULL
  last_name VARCHAR(45) NOT NULL,
  last_name VARCHAR(20) NULL,
  role_id INTEGER ,
  manager_id INTEGER,
  
  PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary decimal,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Elena", "Brodie",role_id, manager_id);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Matt", "savage",role_id,manager_id);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Big", "Bertha", role_id, manager_id);

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Quotician",50000, department_id);


