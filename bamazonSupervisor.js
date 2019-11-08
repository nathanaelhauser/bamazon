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

async function displayData(data) {
  let response = await new Promise((resolve, reject) => {
    const display = data.reduce((departmentArr, department) => {
      const sales = department.product_sales ? department.product_sales : 0
      const net = sales - department.over_head_costs
      departmentArr.push([
          department.department_id, 
          department.department_name,
          department.over_head_costs.toFixed(2),
          sales.toFixed(2),
          net.toFixed(2)
        ])
      return departmentArr
    }, [[
      chalk.green('ID'),
      chalk.green('NAME'),
      chalk.green('OVERHEAD COST'),
      chalk.green('PRODUCT SALES'),
      chalk.green('NET PROFITS')
    ]])

    const config = {
      columns: {
        2: {
          alignment: 'right'
        },
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

const viewSales = _ => {

  db.query(`SELECT d.department_id, d.department_name, 
                   d.over_head_costs, SUM(p.product_sales) AS product_sales
            FROM departments AS d
            LEFT JOIN products AS p ON d.department_name = p.department_name
            GROUP BY p.department_name`,
    (e, data) => {
      if (e) {
        console.log(e)
      }
      displayData(data)
        .then(output => console.log(output))
        .catch(e => console.log(e))
      db.end()
    })
}

const createDepartment = _ => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What do you want to name the new department?'
    }, {
      type: 'number',
      name: 'costs',
      message: 'What is the overhead costs of this department?'
    }
  ])
    .then(({ name, costs }) => {
      console.log(`Hiring contractor to build department ${name}...`)
      db.query('INSERT INTO departments(department_name, over_head_costs) VALUES (?, ?)',
        [name, costs],
        (e, data) => {
          if (e) {
            console.log(e)
          }
          console.log(`Department ${name} successfully built!`)
          db.end()
        })
    })
    .catch(e => console.log(e))
}

start()