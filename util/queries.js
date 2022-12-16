db = require('./connection');


async function db_addDepartment(name) {
    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = [name];

    let result = await db.promise().query(sql, params);
    if (result[0].affectedRows) {
        return true;
    } else {
        return false;
    }
}

async function db_addRole(title, salary, department) {
    const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    const params = [title, salary, department];

    let result = await db.promise().query(sql, params);
    if (result[0].affectedRows) {
        return true;
    } else {
        return false;
    }
}

async function db_addEmployee(first, last, role, manager) {
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
    const params = [first, last, role, manager];

    let result = await db.promise().query(sql, params);
    if (result[0].affectedRows) {
        return true;
    } else {
        return false;
    }
}

async function db_updateEmployee(role, employee) {
    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
    const params = [role, employee];

    let result = await db.promise().query(sql, params);
    if (result[0].affectedRows) {
        return true;
    } else {
        return false;
    }
}


async function db_getDepartment(id) {
    const sql = `SELECT name FROM department WHERE id = ?`;
    const params = [id];

    let result = await db.promise().query(sql, params);
    return result[0][0].name; 
}


async function db_getRole(id) {
    const sql = `SELECT title FROM role WHERE id = ?`;
    const params = [id];

    let result = await db.promise().query(sql, params);
    return result[0][0].title;
}


async function db_getEmployee(id) {
    const sql = `SELECT first_name, last_name FROM employees WHERE id = ?`;
    const params = [id];

    let result = await db.promise().query(sql, params);
    return result[0][0]; 
}

module.exports = {db_addDepartment, db_addRole, db_addEmployee, db_updateEmployee, db_getDepartment, db_getRole, db_getEmployee};