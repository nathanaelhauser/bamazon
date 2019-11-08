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
    choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
  })
    .then(({ action }) => {
      switch (action) {
        case 'View Products for Sale':
          viewAll()
          db.end()
          break
        case 'View Low Inventory':
          viewLow()
          db.end()
          break
        case 'Add to Inventory':
          addInventory()
          break
        case 'Add New Product':
          addProduct()
          break
        default:
          console.log('You do not have permission to be here!')
          db.end()
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

async function grabAll () {
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

const viewAll = _ => {
  grabAll()
    .then(data => {
      displayTable(data)
        .then(output => console.log(output))
        .catch(e => console.log(e))
    })
    .catch(e => console.log(e))
}

const viewLow = _ => {
  db.query('SELECT * FROM products WHERE stock_quantity < 5', (e, data) => {
    console.log(data)
    displayTable(data)
      .then(output => {
        console.log(output)
      })
      .catch(e => console.log(e))
  })
}

const addInventory = _ => {
  grabAll()
    .then(data => {
      displayTable(data)
        .then(output => {
          console.log(output)
          inquirer.prompt([
            {
              type: 'list',
              name: 'id',
              message: 'Which item do you want to add inventory to?',
              choices: data.map(({ item_id }) => item_id)
            }, {
              type: 'number',
              name: 'amount',
              message: 'How much do you want to order?'
            }
          ])
            .then(({ id, amount }) => {
              console.log(`Shipping ${amount} of item ${id}...`)
              const [{ stock_quantity: currentStock }] = data.filter(({ item_id }) => item_id === id)
              db.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?',
                [currentStock + amount, id],
                (e, data) => {
                  console.log('Product arrived!!')
                  db.end()
                })
            })
            .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
    })
    .catch(e => console.log(e))
}

const addProduct = _ => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter product name:'
    }, {
      type: 'input',
      name: 'department',
      message: 'Enter product department:'
    }, {
      type: 'number',
      name: 'price',
      message: 'Enter product price:'
    }, {
      type: 'number',
      name: 'stock',
      message: 'Enter initial inventory:'
    }
  ])
    .then(({ name, department, price, stock }) => {
      const fixedPrice = Math.round(price*100) / 100.0
      const fixedStock = Math.trunc(stock)
      db.query('INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)',
        [name, department, fixedPrice, fixedStock],
        (e, data) => {
          if (e) {
            console.log(e)
          }
          console.log(`${name} is now in stock!`)
          db.end()
        })
    })
}

start()