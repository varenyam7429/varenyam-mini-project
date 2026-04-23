const mongoose = require('mongoose');
require('dotenv').config();
const { Ingredient } = require('./models');

const INGREDIENTS = [
  { name: 'eggs', aliases: ['egg'], substitutes: [{ name: 'flax eggs', ratio: 1 }], category: 'protein' },
  { name: 'butter', aliases: ['unsalted butter'], substitutes: [{ name: 'margarine', ratio: 1 }], category: 'dairy' },
  { name: 'milk', aliases: ['whole milk'], substitutes: [{ name: 'oat milk', ratio: 1 }, { name: 'cream', ratio: 0.5 }], category: 'dairy' },
  { name: 'flour', aliases: ['plain flour', 'all-purpose flour'], substitutes: [], category: 'baking' },
  { name: 'tomatoes', aliases: ['tomato', 'cherry tomatoes'], substitutes: [], category: 'vegetable' },
  { name: 'garlic', aliases: ['garlic cloves'], substitutes: [], category: 'vegetable' },
  { name: 'cheese', aliases: ['parmesan', 'cheddar', 'mozzarella'], substitutes: [], category: 'dairy' },
  { name: 'pasta', aliases: ['spaghetti', 'penne', 'fettuccine'], substitutes: [], category: 'carbs' },
  { name: 'chicken', aliases: ['chicken breast', 'chicken thigh'], substitutes: [{ name: 'tofu', ratio: 1 }], category: 'protein' },
  { name: 'onion', aliases: ['red onion', 'white onion'], substitutes: [{ name: 'shallots', ratio: 1 }], category: 'vegetable' },
  { name: 'olive oil', aliases: ['oil'], substitutes: [{ name: 'butter', ratio: 0.8 }], category: 'oil' },
  { name: 'flax eggs', aliases: [], substitutes: [], category: 'baking' },
  { name: 'margarine', aliases: [], substitutes: [], category: 'dairy' },
  { name: 'oat milk', aliases: [], substitutes: [], category: 'dairy' },
  { name: 'tofu', aliases: [], substitutes: [], category: 'protein' },
  { name: 'shallots', aliases: [], substitutes: [], category: 'vegetable' },
  { name: 'breadcrumbs', aliases: ['panko'], substitutes: [], category: 'baking' },
  { name: 'lemon', aliases: ['lemon juice'], substitutes: [], category: 'fruit' },
  { name: 'spinach', aliases: [], substitutes: [], category: 'vegetable' },
  { name: 'cream', aliases: ['heavy cream', 'double cream'], substitutes: [{ name: 'milk', ratio: 1.2 }], category: 'dairy' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Ingredient.deleteMany({});
  await Ingredient.insertMany(INGREDIENTS);
  console.log('Database seeded!');
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
