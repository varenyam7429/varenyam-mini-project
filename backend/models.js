const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true },
  aliases: [String],
  category: String,
  substitutes: [{
    name: String,
    ratio: Number
  }]
});

const fridgeItemSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true },
  qty: Number,
  unit: String,
  expiry: Date,
  createdAt: { type: Date, default: Date.now }
});

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: [String],
  ingredients: [{
    name: { type: String, required: true, lowercase: true },
    qty: Number,
    unit: String
  }],
  steps: [String],
  createdAt: { type: Date, default: Date.now }
});

const shoppingItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: Number,
  unit: String,
  checked: { type: Boolean, default: false }
});

module.exports = {
  Ingredient: mongoose.model('Ingredient', ingredientSchema),
  FridgeItem: mongoose.model('FridgeItem', fridgeItemSchema),
  Recipe: mongoose.model('Recipe', recipeSchema),
  ShoppingItem: mongoose.model('ShoppingItem', shoppingItemSchema)
};
