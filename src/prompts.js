const db = require("../util/connection");
const inquirer = require('inquirer');

// regular expression
const letterExpression = /[a-zA-Z]/;
const specialExpression = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

async function populateDepartments() {
    // construct query
    const sql = `SELECT name, id FROM department ORDER BY name`;

    // get info from database
    let departments = await db.promise().query(sql);

    departments = departments[0].map(department => {
        const obj = {
            name: department.name,
            value: {
                name: department.name,
                id: department.id
            }
        }
        return obj;
    });
    return departments;
}

async function populateRoles() {
    // construct query
    const sql = `SELECT title, salary, department_id, id FROM role ORDER BY title`;

    // get info from database
    let roles = await db.promise().query(sql);

    roles = roles[0].map(role => {
        const obj = {
            name: role.title,
            value: {
                title: role.title,
                salary: role.salary,
                department: role.department_id,
                id: role.id
            }
        }
        return obj;
    });
    return roles;
}

async function populateEmployees(returnEmpty) { 
    
    const sql = `SELECT first_name, last_name, role_id, manager_id, id FROM employees ORDER BY last_name`;

    // get info from database
    let employees = await db.promise().query(sql);

    employees = employees[0].map(employee => {
        const obj = {
            name: employee.first_name + " " + employee.last_name,
            value: {
                firstName: employee.first_name,
                lastName: employee.last_name,
                role: employee.role_id,
                manager: employee.manager_id,
                id: employee.id
            }
        }
        return obj;
    });

    if (returnEmpty) {
        employees.push({
            name: "NO MANAGER",
            value: {
                id: null 
            }
        });
    }

    return employees;
}

// define the prompts
async function introPrompt() {
    return await inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Please make a selection.",
            choices: ["View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee's role",
                "EXIT APPLICATION"]
        }
    ]);
}

// shown when a department needs to be added
async function addDepartmentPrompt() {
    return await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter a name for the department you are adding: ",
            validate: nameInput => {
                if (nameInput || nameInput.length > 30) {
                    return true;
                } else {
                    console.log("Enter a name for the department that is under 30 characters");
                    return false;
                }
            }
        }
    ]);
}

// shown when a role needs to be added
async function addRolePrompt() {
    const departments = await populateDepartments();
    return await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Enter a title for the role you are adding: ",
            validate: nameInput => {
                if (nameInput || nameInput.length > 30) {
                    return true;
                } else {
                    console.log("Enter a name for the role that is under 30 characters");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "salary",
            message: "Enter a salary for this role: ",
            validate: salaryInput => {
                if (letterExpression.test(salaryInput) || specialExpression.test(salaryInput) || salaryInput.length > 12) {
                    console.log(" | Remove any letters or special characters from your input and ensure the salary is within 10 figures");
                    return false;
                } else {
                    return true;
                }
            }
        },
        {
            type: "list",
            name: "department",
            message: "Select a department for this role",
            choices: departments 
        }
    ]);
}

// shown when an employee needs to be added
async function addEmployeePrompt() {
    // employees array
    const employees = await populateEmployees(true);
    // roles array
    const roles = await populateRoles();
    return await inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Enter the employee's first name: ",
            validate: nameInput => {
                if (nameInput || nameInput.length > 30) {
                    return true;
                } else {
                    console.log("Enter a first name that is less than 30 characters");
                    return false;
                }
            }
        },
        {
            type: "input",
            name: "lastName",
            message: "Enter the employee's last name: ",
            validate: nameInput => {
                if (nameInput || nameInput.length > 30) {
                    return true;
                } else {
                    console.log("Enter a last name that is less than 30 characters");
                    return false;
                }
            }
        },
        {
            type: "list",
            name: "role",
            message: "Select the employee's role from the list",
            choices: roles
        },
        {
            type: "list",
            name: "manager",
            message: "Select the employee's manager from the list",
            choices: employees
        }
    ]);
}

// shown when an employee needs to be updated
async function updateEmployeePrompt() {
    // employees array
    const employees = await populateEmployees(false);
    // roles array
    const roles = await populateRoles();
    return await inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Select an employee to update from the list",
            choices: employees 
        },
        {
            type: "list",
            name: "role",
            message: "Select the employee's new role from the list",
            choices: roles 
        }
    ]);
}


module.exports = {introPrompt, addDepartmentPrompt, addRolePrompt, addEmployeePrompt, updateEmployeePrompt,
                  populateDepartments, populateRoles, populateEmployees};