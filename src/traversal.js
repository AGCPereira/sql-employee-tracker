const {introPrompt, addDepartmentPrompt, addRolePrompt, addEmployeePrompt, updateEmployeePrompt} = require("./prompts");
const {populateDepartments, populateRoles, populateEmployees} = require("./prompts");
const {db_addDepartment, db_addRole, db_addEmployee, db_updateEmployee, db_getDepartment, db_getRole, db_getEmployee} = require("../util/queries");
const table = require("console.table");
const db = require("../util/connection");

// introduction screen
async function presentChoices() {
    const choice = await introPrompt();
    // switch case for choice
    switch (choice.options) {
        case "View all departments":
            displayDepartments();
            break;
        case "View all roles":
            displayRoles();
            break;
        case "View all employees":
            displayEmployees();
            break;
        case "Add a department":
            addDepartment();
            break;
        case "Add a role":
            addRole();
            break;
        case "Add an employee":
            addEmployee();
            break;
        case "Update an employee's role":
            updateEmployee();
            break;
        default:
            db.end();
            console.log("Goodbye");
            break;
    }
}

// display departments
async function displayDepartments() {
    const departments = await populateDepartments();
    // generate columns
    columns = departments.map(dept => {
        entry = {
            Name: dept.name,
            ID: dept.value.id
        }
        return entry;
    });
    console.table(columns);

    presentChoices();
}

// display roles
async function displayRoles() {
    const roles = await populateRoles();
    // generate columns
    columns = await Promise.all(roles.map(async role => {
        let dept = await db_getDepartment(role.value.department);
        entry = {
            Title: role.value.title,
            Salary: role.value.salary,
            Department: dept,
            ID: role.value.id
        }
        return entry;
    }));
    console.table(columns);
    
    presentChoices();
}

// display employees
async function displayEmployees() {
    const employees = await populateEmployees(false);
    // generate columns
    columns = await Promise.all(employees.map(async emp => {
        let role = await db_getRole(emp.value.role);
        let manager = await db_getEmployee(emp.value.manager);
        if (!manager) {
            manager = "NO MANAGER";
        } else {
            manager = manager.first_name + " " + manager.last_name;
        }

        entry = {
            "First Name": emp.value.firstName,
            "Last Name": emp.value.lastName,
            Role: role,
            Manager: manager,
            ID: emp.value.id
        }
        return entry;
    }));
    console.table(columns);
    
    presentChoices();
}

// add a department
async function addDepartment() {
    const dept = await addDepartmentPrompt();

    // add to database
    let result = await db_addDepartment(dept.name);
    if (result) {
        console.log("Department added to database");
    } else {
        console.log("Error; department not added");
    }

    presentChoices();
}

// add a role
async function addRole() {
    const role = await addRolePrompt();

    // add to database
    let result = await db_addRole(role.title, role.salary, role.department.id);
    if (result) {
        console.log("Role added to database");
    } else {
        console.log("Error; role not added");
    }

    presentChoices();
}

async function addEmployee() {
    const employee = await addEmployeePrompt();

    // add to database
    let result = await db_addEmployee(employee.firstName, employee.lastName, employee.role.id, employee.manager.id);
    if (result) {
        console.log("Employee added to database");
    } else {
        console.log("Error; employee not added");
    }

    presentChoices();
}

async function updateEmployee() {
    const employee = await updateEmployeePrompt();

    // update in database
    let result = await db_updateEmployee(employee.role.id, employee.employee.id);
    if (result) {
        console.log("Employee updated");
    } else {
        console.log("Error; employee not updated");
    }

    presentChoices();
}

module.exports = {presentChoices};