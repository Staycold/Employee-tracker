const inquirer = require('inquirer');
const mysql = require('mysql');


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



const viewRoles = () => {
    connection.query('SELECT * FROM employeedb.role' , (err, res) => {
        if (err) throw err;
        console.table(res);
        // console.table(querry.sql)
        // connection.end();
        initQuestion();

    });
}

const viewDepartments = () => {
    connection.query('SELECT * FROM employeedb.department', (err, res) => {
        if (err) throw err;
        console.table(res);
        // console.table(querry.sql)
        // connection.end();
        initQuestion();

    });
}


const viewEmployee = () => {
    connection.query('SELECT * FROM employeedb.employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        // console.table(querry.sql)
        // connection.end();
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
                return addEmployee();
            case 'View':
                return view();
            case 'Update':
                return updateEmployee();
            case 'Leave':
                return connection.end;
            default:
                return "";
        }
    })
}


function getRoles(roles){
    const choices=roles.map(({title,id}) => {
        ({
            name:title,
            value:id
        })
    })
    return choices;
}


const view = () => {
    //title, id, efewfwna,      //role.title role.id
   
    //[{name,value},{name,value}]
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
    }})

}


const addEmployee = () => {
    connection.query('Select * from role',(err,res)=>{
        if (err) throw err;
        console.log(res)
        const roles=getRoles(res)
        console.log(roles)
        //make a function to getDepartment
        inquirer.prompt([

            {
                type: 'input',
                message: `What is the employee's first name`,
                name: 'firstname',
                // when: (input) => input.init == ""
            },
            {
                type: 'input',
                message: `What is the employee's last name`,
                name: 'lastname',
                // when: (input) => input.init == ""
            },
            {
                type: 'input',
                message: 'What is the salary of the employee?',
                name: 'salary',
                // when: (input) => input.init == "Add"
            },
            // {
            //     type: 'list',
            //     message: 'What is the department? ',
            //     name: 'department',
            //     choices: ['Sales', 'HR', 'Production', 'Scheduling']
    
            //     // when: (input) => input.init == "Add"
    
            // },
            {
                type: 'list',
                message: 'What is their role? ',
                name: 'role_id',
                choices:roles,
                // when: (input) => input.init == "Add"
    
            }
        ])
            .then(addAnswers => {
                console.log(addAnswers)
                connection.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: `${addAnswers.firstname}`,
                        last_name: `${addAnswers.lastname}`,
                        role_id:`${addAnswers.role_id}`,
                    },
                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} Added!\n`); 
                        initQuestion();                   
                    }
                );
                // connection.query(
                //     'INSERT INTO role SET ?',
                //     {
                //         title: `${addAnswers.title}`,
                //         salary: `${addAnswers.salary}`
                //     },
    
                //     (err, res) => {
                //         if (err) throw err;
                //         console.log(`${res.affectedRows} Added!\n`);
                //     }
                // );
    
                // connection.query(
                //     'INSERT INTO department SET ?',
                //     {
                //         name: `${addAnswers.department}`,
                //     },
                //     (err, res) => {
                //         if (err) throw err;
                //         console.log(`${res.affectedRows} Added!\n`);
                        
                //     }
                // );
            })

    })
    


};

// 'SELECT id from role where title = ?', [response.role]. (err, res) =>{
//     console.log(err);
//     console.table(res.id)
//     return response.role;
// }





initQuestion();






