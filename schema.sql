DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;
CREATE TABLE products(
  item_id INT(10) AUTO_INCREMENT NOT NULL;
  product_name VARCHAR(255) NOT NULL;
  department_name VAR_CHAR(255) NOT NULL;
  price FLOAT(10,2) NOT NULL;
  stock_quantity INT(10) NOT NULL;
);