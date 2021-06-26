const inquirer = require('inquirer');
const mysql = require('mysql');
const util = require('util')

const connection = mysql.createConnection({
    host: 'localhost',


    port: 3306,


    user: 'root',


    password: '',
    database: 'employeedb',
});
connection.query = util.promisify(connection.query)


const viewRoles = () => {
    connection.query('SELECT * FROM employeedb.role', (err, res) => {
        if (err) throw err;
        console.table(res);

        
        initQuestion();

    });
}

const viewEmployeebyRole = async() =>{
        const getRole= await connection.query('Select * from role')
    
        const roleAnswers = getRole.map(({title,id})=> {
            return ({
                name:title,
                value:id
            })
        })
        const getRoleAnswers =await inquirer.prompt([
            {
                type: 'list',
                message: `What role would you like to see?`,
                name: 'empbyRoles',
                choices: roleAnswers
            },
            
    ])
          const viewbyRoles =   await connection.query(`SELECT * FROM employee, role WHERE employee.role_id=role.id AND employee.role_id=?`, [(getRoleAnswers.empbyRoles)]
                        );
  
    console.table(viewbyRoles)

            initQuestion();     
    
    };


const viewDepartments = () => {
    connection.query('SELECT * FROM employeedb.department', (err, res) => {
        if (err) throw err;
        console.table(res);
        initQuestion();

    });
}

const viewEmployeebyDepartment = async() => {
    const getDepartments = await connection.query('SELECT * FROM department')

    const theDepartments = getDepartments.map(({name, id }) => {

        return ({
            name: `${name}`,
            value: id
        })
    })
    const departmentAnswersforReal = await inquirer.prompt([
        {
            type: 'list',
            message: "Which department would you like to view?",
            name: 'viewDept',
            choices: theDepartments
        }
    ])
    console.log(departmentAnswersforReal)
    // connection.query('SELECT * FROM employeedb.department ', (err, res) => {
    //     let getEmpDepartmets 
    //     if (err) throw err;
    //     console.table(res);
    //     initQuestion();
    viewEmployee(departmentAnswersforReal.viewDept);

    // });
}



const viewEmployee = (dept_id) => {
    // let myQuery = `SELECT person.first_name, person.last_name FROM employee AS person, role, employee AS manager WHERE person.role_id=role.id AND person.manager_id=manager.id;`;
    let myQuery = `SELECT employeeRole.first_name, employeeRole.last_name, employeeRole.title, employeeRole.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name, employeeRole.department_id FROM (select employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id, role.department_id from employee 
        LEFT JOIN role on employee.role_id= role.id) AS employeeRole LEFT JOIN employee AS manager  on employeeRole.manager_id = manager.id;`;

    if(dept_id) {
        myQuery = `SELECT employeeRole.first_name, employeeRole.last_name, employeeRole.title, employeeRole.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name, employeeRole.department_id FROM (select employee.first_name, employee.last_name, role.title, role.salary, employee.manager_id, role.department_id from employee 
            LEFT JOIN role on employee.role_id= role.id) AS employeeRole LEFT JOIN employee AS manager  on employeeRole.manager_id = manager.id WHERE department_id=${dept_id};`
    }


    connection.query(myQuery, (err, res) => {
        if (err) throw err;
        console.table(res);
        initQuestion();

    });


}

const initQuestion = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'please choose',
            name: 'init',
            choices: ['Add', 'View', 'Update', 'Leave']
            // make this the FIRST question. make switch case after.
        }
    ]).then(initialAnswer => {
        console.log(initialAnswer)
        switch (initialAnswer.init) {
            case 'Add':
                return add();
            case 'View':
                return view();
            case 'Update':
                return updateEmployeesRole();
            case 'Leave':
                return connection.end();
            default:
                return "";
        }
    })
}
// this is the overall add function, where you choose what you want to add, to which table.
const add = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to add?",
            name: "add",
            choices: ["Employee", "Role", "Department"]
        }
    ]).then(addResponse => {
        console.log(addResponse)
        switch (addResponse.add) {
            case 'Employee':
                return addEmployee();
            case 'Department':
                return addDepartment();
            case 'Role':
                return addRole();

            default:
                return "";
        }
    })
}


// this is the overal view function, where you choose which table you would like to view.
const view = () => {

    inquirer.prompt([
        {
            type: 'list',
            message: `What would you like to view?`,
            name: 'view',
            choices: ['Employee', 'Departments', 'Roles', 'Managers'],

        }
    ]).then(viewAnswer => {
        console.log(viewAnswer)
        switch (viewAnswer.view) {
            case 'Employee':
                return viewEmployee();
            case 'Departments':
                // return viewDepartments();
                return viewEmployeebyDepartment();
            case 'Roles':
                return viewEmployeebyRole();
            // case 'Managers':
            //     return viewManagers();
            default:
                return "";
        }
    })

}

const addDepartment = async () => {

    const getDepartmentAnswers = await inquirer.prompt([
        {
            type: 'input',
            message: `What is the department name?`,
            name: 'depName',

        }
    ])
    await connection.query('INSERT INTO department SET ?',
        {
            name: `${getDepartmentAnswers.depName}`,

        });

    initQuestion();

};

const addRole = async () => {

    const getRoleanswers = await inquirer.prompt([
        {
            type: 'input',
            message: `What is the role name?`,
            name: 'roleTitle',

        },
        {
            type: 'input',
            message: `What is the salary for this role?`,
            name: 'roleSalary',

        },
    ])
    await connection.query('INSERT INTO role SET ?',
        {
            title: `${getRoleanswers.roleTitle}`,
            salary: `${getRoleanswers.roleSalary}`,

        });

    initQuestion();

};


const addEmployee = async () => {
    const res = await connection.query('Select * from role')


    const roleChoices = res.map(({ title, id }) => {
        return ({
            name: title,
            value: id
        })
    })

    const res2 = await connection.query('Select * from employee')


    const managerChoices = res2.map(({ first_name, last_name, id }) => {
        return ({
            name: first_name + ' ' + last_name,
            value: id
        })
    })
    //make a function to getDepartment
    const addAnswers = await inquirer.prompt([

        {
            type: 'input',
            message: `What is the employee's first name`,
            name: 'firstname',

        },
        {
            type: 'input',
            message: `What is the employee's last name`,
            name: 'lastname',

        },
        {
            type: 'list',
            message: 'What is their role? ',
            name: 'role_id',
            choices: roleChoices,


        },
        {
            type: 'list',
            message: 'Wo is their manager? ',
            name: 'manager_id',
            choices: managerChoices,


        }


    ])

    await connection.query('INSERT INTO employee SET ?',
        {
            first_name: `${addAnswers.firstname}`,
            last_name: `${addAnswers.lastname}`,
            role_id: `${addAnswers.role_id}`,
            manager_id:addAnswers.manager_id
        });

    initQuestion();

};



const updateEmployeesRole = async () => {
    const uER = await connection.query('SELECT * FROM employee')

    const uERChoicess = uER.map(({ first_name, last_name, id }) => {

        return ({
            name: `${first_name} ${last_name}`,
            value: id
        })
    })
    const uERAnswers = await inquirer.prompt([
        {
            type: 'list',
            message: "Which emplpoyee would you like to update?",
            name: 'empNewRole',
            choices: uERChoicess
        }
    ])


    const getRole = await connection.query('Select * from role')

    const newRoleChoices = getRole.map(({ title, id },) => {
        return ({
            name: title,
            value: id
        })
    })
    const newRoleAnswers = await inquirer.prompt([
        {
            type: 'list',
            message: 'What role would you like to assign them?',
            name: 'updatedRole',
            choices: newRoleChoices
        }
    ])

    await connection.query('UPDATE employee SET role_id =? WHERE id=?', [newRoleAnswers.updatedRole, uERAnswers.empNewRole])


    initQuestion();
}
// this will start the appllication. 

initQuestion();
