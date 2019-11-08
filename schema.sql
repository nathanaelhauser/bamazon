DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;
CREATE TABLE products(
  item_id INT(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  price FLOAT(10,2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  product_sales FLOAT(16, 2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY(item_id)
);

USE bamazon;
CREATE TABLE departments(
  department_id INT(10) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  over_head_costs INT(10) NOT NULL,
  PRIMARY KEY(department_id)
);