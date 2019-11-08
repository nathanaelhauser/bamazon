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
    message: 'Choose an option:',
    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View Products for Sale':
          break
        case 'View Low Inventory':
          break
        case 'Add to Inventory':
          break
        case 'Add New Product':
          break
        default:
          break
      }
    })
}