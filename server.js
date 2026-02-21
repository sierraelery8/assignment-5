// import packages
const express = require("express");
const { body, validationResult } = require("express-validator");

// initialize express app
const app = express();

// define port
const PORT = 3000;

// middleware to parse JSON
app.use(express.json());

// custom logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

  if (req.method === "POST" || req.method === "PUT") {
    console.log("Request Body:", req.body);
  }

  next();
});

// validation rules
const menuValidationRules = [
  body("name")
    .isString().withMessage("Name must be a string")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

  body("description")
    .isString().withMessage("Description must be a string")
    .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

  body("price")
    .isFloat({ gt: 0 }).withMessage("Price must be a number greater than 0"),

  body("category")
    .isIn(["appetizer", "entree", "dessert", "beverage"])
    .withMessage("Category must be appetizer, entree, dessert, or beverage"),

  body("ingredients")
    .isArray({ min: 1 }).withMessage("Ingredients must be an array with at least 1 item"),

  body("available")
    .optional()
    .isBoolean().withMessage("Available must be true or false")
];

// validation error handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// data
let menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];

// GET all
app.get("/api/menu", (req, res) => {
  res.status(200).json(menuItems);
});

// GET by ID
app.get("/api/menu/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = menuItems.find(menuItem => menuItem.id === id);

  if (!item) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  res.status(200).json(item);
});

// POST
app.post("/api/menu", menuValidationRules, validate, (req, res) => {
  const newItem = {
    id: menuItems.length + 1,
    available: req.body.available ?? true,
    ...req.body
  };

  menuItems.push(newItem);
  res.status(201).json(newItem);
});

// PUT
app.put("/api/menu/:id", menuValidationRules, validate, (req, res) => {
  const id = parseInt(req.params.id);
  const index = menuItems.findIndex(menuItem => menuItem.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  menuItems[index] = {
    ...menuItems[index],
    ...req.body
  };

  res.status(200).json(menuItems[index]);
});

// DELETE
app.delete("/api/menu/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = menuItems.findIndex(menuItem => menuItem.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  const deletedItem = menuItems.splice(index, 1);

  res.status(200).json(deletedItem);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
