DROP DATABASE IF EXISTS employeedb;

CREATE DATABASE employeedb;

USE employeedb;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30)
);
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary decimal,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES department(id),
    PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR (30) NOT NULL,
  last_name VARCHAR(45) NOT NULL,
  role_id INTEGER ,
  manager_id INTEGER,
   FOREIGN KEY (manager_id) REFERENCES employee(id),
  
  PRIMARY KEY (id)
);




INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Elena", "Brodie",1,null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Matt", "savage",1,1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Big", "Bertha", 1, 1);

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Quotician",50000, 1);


