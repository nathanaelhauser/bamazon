const inquirer = require('inquirer')
const { table } = require('table')
const chalk = require('chalk')
const mysql = require('mysql2')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'groot',
  database: 'bamazon'
})

const start = _ => {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: ['View Product Sales by Department', 'Create New Department']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View Product Sales by Department':
          viewSales()
          break
        case 'Create New Department':
          createDepartment()
          break
        default:
          console.log('You do not have permission to be here!')
          db.end()
          break
      }
    })
    .catch(e => console.log(e))
}

const viewSales = _ => {

  db.query(`SELECT departments.department_id, departments.department_name, 
                   departments.over_head_costs, SUM(products.product_sales) AS product_sales
            FROM departments
            LEFT JOIN products ON departments.department_name = products.department_name
            GROUP BY products.department_name`,
    (e, data) => {
      if (e) {
        console.log(e)
      }
      console.log(data)
      db.end()
    })
}

start()