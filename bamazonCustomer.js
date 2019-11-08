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

async function displayData(data) {
  let response = await new Promise((resolve, reject) => {
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

    resolve(table(display, config))
  })

  return response
}

const order = ({ stock_quantity: stock, item_id: id, price, product_sales: sales }, amount) => {
  if (stock < amount) {
    console.log('Insufficient quantity!')
    db.end()
    return
  }
  console.log('Ordering...')

  db.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', 
      [stock - amount, id], 
      (e, data) => {
        if (e) {
          console.log(e)
        }
        console.log('Successfully Ordered!')
        const totalPrice = chalk.red(`$${(price * amount).toFixed(2)}`)
        console.log(`You will be charged ${totalPrice}`)
        db.query('UPDATE products SET product_sales = ? WHERE item_id = ?',
            [price * amount],
            (e, data) => {
              if (e) {
                console.log(e)
              }
              db.end()
            })
    })
}

start()
  .then(data => {
    const products = data
    displayData(products)
      .then(display => {
        console.log(display)
        inquirer.prompt([
          {
            type: 'list',
            name: 'id',
            message: 'Choose the ID of the item you want',
            choices: products.map(product => product.item_id)
          }, {
            type: 'number',
            name: 'amount',
            message: 'Enter the amount you want:'
          }
        ])
          .then(({ id, amount }) => {
            const [product] = products.filter(prod => prod.item_id === id)
            order(product, Math.floor(amount))
          })
          .catch(e => console.log(e))
      })
      .catch(e => console.log(e))
  })
  .catch(e => console.log(e))