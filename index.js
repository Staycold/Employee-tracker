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

const viewDepartments = () => {
    connection.query('SELECT * FROM employeedb.department', (err, res) => {
        if (err) throw err;
        console.table(res);
        initQuestion();

    });
}


const viewEmployee = () => {
    connection.query('SELECT * FROM employeedb.employee', (err, res) => {
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
                return viewDepartments();
            case 'Roles':
                return viewRoles();
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


        }


    ])

    await connection.query('INSERT INTO employee SET ?',
        {
            first_name: `${addAnswers.firstname}`,
            last_name: `${addAnswers.lastname}`,
            role_id: `${addAnswers.role_id}`,
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
