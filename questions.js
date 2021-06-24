const inquirer = require('inquirer');
const mysql = require('mysql');
const util=require('util')

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
connection.query=util.promisify(connection.query)


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

const add = () =>{
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to add?",
            name: "add",
            choices: ["Employee", "Role", "Department"]
        }
    ]).then(addResponse => {
        console.log(addResponse)
        switch(addResponse.add){
            case 'Employee':
                return addEmployee();
            case 'Department':
                return addDepartment();
            case 'Role':
                return addRole();
            // case 'Managers':
            //     return viewManagers();
            default:
                return "";
        }
    })
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

const addDepartment = async () => {
//     const getDepartment= await connection.query('Select * from department')

//     const departmentChoices = res.map(({name, id})=>{
//         return ({
//             name:name,
//             value:id
//     })
// })
    const getDepartmentAnswers =await inquirer.prompt([
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

const addRole =async () => {
    // const getRole= await connection.query('Select * from role')

    // const roleAnswers = res.map(({title,id})=> {
    //     return ({
    //         name:title,
    //         value:id
    //     })
    // })
    const getRoleanswers =await inquirer.prompt([
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
                        
                    },);

        initQuestion();     

};


const addEmployee =async () => {
   const res= await connection.query('Select * from role')
 
   //query for managers(employees)
  

    //mapping for employees too
   const roleChoices=res.map(({title,id}) => {
   return ({
        name:title,
        value:id
    })
})
        //make a function to getDepartment
       const addAnswers =await inquirer.prompt([

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
                type: 'list',
                message: 'What is their role? ',
                name: 'role_id',
                choices:roleChoices,
                // when: (input) => input.init == "Add"
    
            },
            // {
            //     type: 'list',
            //     message: 'Who is their manager? ',
            //     name: 'manager_id',
            //     choices:managerChoices,
              
    
            // }
        ])
           
        await connection.query('INSERT INTO employee SET ?',
                    {
                        first_name: `${addAnswers.firstname}`,
                        last_name: `${addAnswers.lastname}`,
                        role_id:`${addAnswers.role_id}`,
                    },);

        initQuestion();     
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
        

  
    


};






const updateEmployeesRole = async() => {
const uER = await connection.query('SELECT * FROM employee')
//[sql Object,sqlobject]
const uERChoicess= uER.map(({ first_name, last_name, id }) => {
    //const {firstname, lastname, id}
    return ({
        name:`${first_name} ${last_name}`,
        value:id
    })
})
const uERAnswers =await inquirer.prompt([
    {
        type:'list',
        message:"Which emplpoyee would you like to update?",
        name:'empNewRole',
        choices: uERChoicess
    }
])


const getRole= await connection.query('Select * from role')

    const newRoleChoices = getRole.map(({title,id},)=> {
        return ({
            name:title,
            value:id
        })
    })
    const newRoleAnswers =await inquirer.prompt([
        {
            type:'list',
            message:'What role would you like to assign them?',
            name:'updatedRole',
            choices:newRoleChoices
        }
    ])
    // console.log(`uERChoices = ${uERChoicess},
    //  uERAnswers = ${uERAnswers},
    // newRoleChoices = ${newRoleChoices},
    // newRoleAnswers = ${newRoleAnswers}.`)
    // console.log(JSON.stringify(newRoleAnswers))
     

    await connection.query('UPDATE employee SET role_id =? WHERE id=?', [newRoleAnswers.updatedRole, uERAnswers.empNewRole])
   

    initQuestion();
}

// JSON


// const updateManager







// 'SELECT id from role where title = ?', [response.role]. (err, res) =>{
//     console.log(err);
//     console.table(res.id)
//     return response.role;
// }





initQuestion();






