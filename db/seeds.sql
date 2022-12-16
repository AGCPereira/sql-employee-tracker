-- departments
INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Legal'),
    ('Finance');

-- roles
INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Lead', 90000.00, 1),
    ('Salesperson', 65000.00, 1),
    ('Lead Engineer', 175000.00, 2),
    ('Software Engineer', 125000.00, 2),
    ('Hardware Engineer', 150000.00, 2),
    ('Account Manager', 160000.00, 4),
    ('Accountant', 125000.00, 4),
    ('Legal Team Lead', 250000.00, 3),
    ('Lawyer', 150000.00, 3);

-- employees
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Mike', 'Gaveston', 1, NULL),
    ('Beth', 'Harper', 2, 1),
    ('Dave', 'Croft', 3, NULL),
    ('Harmony', 'Kelper', 4, 3),
    ('Karl', 'Parks', 5, 3),
    ('Leslie', 'Burlap', 6, NULL),
    ('Lynn', 'Carp', 7, 6),
    ('Park', 'Yeung', 8, NULL),
    ('Chris', 'Chan', 9, 8);