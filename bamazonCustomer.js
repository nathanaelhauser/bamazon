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

async function start() {
  let response = await new Promise((resolve, reject) => {
    db.query('SELECT * FROM products', (e, data) => {
      if (e) {
        reject(e)
      }
      resolve(data)
    })
  })

  return response
}

// const start = _ => {
//   db.query('SELECT * FROM products', (e, data) => {
//     if (e) {
//       console.log(e)
//     }
//     // console.log(data)
//     displayData(data)
//     db.end()
//   })

// }

const displayData = data => {
  const products = data.reduce(
    (displayTable, { item_id, product_name, department_name, price, stock_quantity }) => {
      displayTable.push([item_id, product_name, department_name, price, stock_quantity])
      return displayTable
    }, [[
      chalk.red('ID'),
      chalk.red('NAME'),
      chalk.red('DEPARTMENT'),
      chalk.red('PRICE'),
      chalk.red('STOCK')
    ]]
  )

  console.log(table(products))
}


start()
  .then(data => {
    displayData(data)
  })
  .catch(e => console.log(e))