const inquirer = require('inquirer');
const mysql = require('mysql');
const query = connection.query

const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: '',
    database: 'employeedb',
});

const afterConnection = () => {

    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;

        addaWorker();

        console.table(res);

        connection.end();
    });
};

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    afterConnection();
})



const addaWorker = () => {


    return inquirer.prompt([

        {
            type: 'list',
            message: 'please choose',
            name: 'init',
            choices: ['Add', 'View', 'Update']
            // make this the FIRST question. make switch case after.
        },
        {
            type: 'input',
            message: `What is the employee's name ?`,
            name: 'name',
            when: (input) => input.init == "Add"
        },
        {
            type: 'input',
            message: `What is the employee's last name`,
            name: 'lastname',
            when: (input) => input.init == "Add"
        },
        {
            type: 'input',
            message: 'What is the salary of the employee?',
            name: 'salary',
            when: (input) => input.init == "Add"
        },
        {
            type: 'input',
            message: 'What is the department? ',
            name: 'department',
            

            when: (input) => input.init == "Add"

        },
        {
            type: 'list',
            message: 'What is their role? ',
            name: 'role_id',
            choices: ['Quotician', 'Sales', 'HR','Accounting'],
            when: (input) => input.init == "Add"

        }
    ])

        .then(employeeAnswers => {
          
            'INSERT INTO employee SET ?',
            {
                first_name: `${answer.first_name}`,
                last_name: `${answer.last_name}`,
                role_id: `${answer.role_id}`,
                manager_id: `${answer.manager_id}`
            }


        })

};

// const viewEmployees = () => {
    
// }


const updateEmployee = () => {
 query('update * FROM employeedb.employee WHERE id =?',
 [answers.id]


 );

 (err, res) => {
     if (err) throw err;
     console.table(res)
 }
};


const fireEmployee = () => {
    query('delete * FROM employeedb.employee WHERE id =?',
    [answers.id]
   
   
    );
   
    (err, res) => {
        if (err) throw err;
        console.table(res)
    }
   };