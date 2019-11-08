const inquirer = require('inquirer')
const table = require('table')
const mysql = require('mysql2')

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'groot',
  database: 'bamazon'
})

const start = _ => {
  db.query('SELECT * FROM products', (e, data) => {
    if (e) {
      console.log(e)
    }
    console.log(data)
    // displayData(data)
  })

}
