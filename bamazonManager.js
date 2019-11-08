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
          viewAll()
          break
        case 'View Low Inventory':
          viewLow()
          break
        case 'Add to Inventory':
          addInventory()
          break
        case 'Add New Product':
          addProduct()
          break
        default:
          console.log('You do not have permission to be here!')
          break
      }
    })
    .catch(e => console.log(e))
}

async function displayTable (data) {
  const response = await new Promise((resolve, reject) => {
    const display = data.reduce((productsArr, product) => {
      productsArr.push([product.item_id, product.product_name,
      product.department_name, product.price.toFixed(2), product.stock_quantity])
      return productsArr
    }, [[
      chalk.green('ID'),
      chalk.green('NAME'),
      chalk.green('DEPARTMENT'),
      chalk.green('PRICE'),
      chalk.green('STOCK')
    ]])

    const config = {
      columns: {
        3: {
          alignment: 'right'
        },
        4: {
          alignment: 'right'
        }
      }
    }

    const output = table(display, config)

    resolve(output)
  })

  return response
}

const viewAll = _ => {
  db.query('SELECT * FROM products', (e, data) => {
    displayTable(data)
      .then(output => {
        console.log(output)
        db.end()
      })
      .catch(e => console.log(e))
  })
}

const viewLow = _ => {
  db.query('SELECT * FROM products WHERE stock_quantity < 5', (e, data) => {
    console.log(data)
    displayTable(data)
      .then(output => {
        console.log(output)
        db.end()
      })
      .catch(e => console.log(e))
  })
}

start()