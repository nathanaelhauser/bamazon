USE bamazon;
INSERT INTO products(product_name, department_name, price, stock_quantity)
  VALUES ('Banana Waterpods', 'Electronics', 8399.99, 100),
         ('Samurai Blender', 'Appliances', 56.88, 13),
         ('Fucci Purse', 'Clothing', 1.99, 5000),
         ('Diamond Necklace', 'Jewelry', 640.49, 7),
         ('6.5ft Nail', 'Hardware', 999999.99, 10),
         ('Classic Warfare: Stabbing 2.0', 'Video Games', 56.99, 30),
         ('Fusion Nuclear Bomb', 'Cleaning Supplies', 100.00, 50),
         ('Hadrion Collider', 'Industrial', 3.50, 42),
         ('Greenland', 'Land', 1099.99, 2),
         ('Lightning in a Bottle', 'Novelty Gifts', 199.99, 238),
         ('Goodyear Blimp', 'Aircraft', 1.99, 10),
         ('SammyBoy TV', 'Electronics', 42000, 24);

USE bamazon;
INSERT INTO departments(department_name, over_head_costs)
  VALUES ('Electronics', 1000),
         ('Appliances', 1000),
         ('Clothing', 1000),
         ('Jewelry', 1000),
         ('Hardware', 1000),
         ('Video Games', 1000),
         ('Cleaning Supplies', 1000),
         ('Industrial', 1000),
         ('Land', 1000),
         ('Novelty Gifts', 1000),
         ('Aircraft', 1000);