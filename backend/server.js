const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

// Initial data
const INITIAL_DATA = {
  fridge: [],
  recipes: [],
  shopping: [],
  ingredients: [
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
    { name: 'lemon', aliases: ['lemon juice'], substitutes: [], category: 'fruit' },
    { name: 'spinach', aliases: [], substitutes: [], category: 'vegetable' },
    { name: 'cream', aliases: ['heavy cream', 'double cream'], substitutes: [{ name: 'milk', ratio: 1.2 }], category: 'dairy' },
  ]
};

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
}

const getData = () => JSON.parse(fs.readFileSync(DB_PATH));
const saveData = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// ─── Fridge Routes ───────────────────────────────────────────────────────────
app.get('/api/fridge', (req, res) => {
  const data = getData();
  res.json(data.fridge);
});

app.post('/api/fridge', (req, res) => {
  const data = getData();
  const newItem = { ...req.body, _id: uuidv4(), createdAt: new Date() };
  data.fridge.unshift(newItem);
  saveData(data);
  res.status(201).json(newItem);
});

app.delete('/api/fridge/:id', (req, res) => {
  const data = getData();
  data.fridge = data.fridge.filter(i => i._id !== req.params.id);
  saveData(data);
  res.status(204).send();
});

// ─── Recipe Routes ───────────────────────────────────────────────────────────
app.get('/api/recipes', (req, res) => {
  const data = getData();
  res.json(data.recipes);
});

app.post('/api/recipes', (req, res) => {
  const data = getData();
  const newRecipe = { ...req.body, _id: uuidv4(), createdAt: new Date() };
  data.recipes.unshift(newRecipe);
  saveData(data);
  res.status(201).json(newRecipe);
});

app.delete('/api/recipes/:id', (req, res) => {
  const data = getData();
  data.recipes = data.recipes.filter(r => r._id !== req.params.id);
  saveData(data);
  res.status(204).send();
});

// ─── Shopping Routes ─────────────────────────────────────────────────────────
app.get('/api/shopping', (req, res) => {
  const data = getData();
  res.json(data.shopping);
});

app.post('/api/shopping', (req, res) => {
  const data = getData();
  if (Array.isArray(req.body)) {
    const newItems = req.body.map(i => ({ ...i, _id: uuidv4() }));
    data.shopping.push(...newItems);
    saveData(data);
    return res.status(201).json(newItems);
  }
  const newItem = { ...req.body, _id: uuidv4() };
  data.shopping.push(newItem);
  saveData(data);
  res.status(201).json(newItem);
});

app.patch('/api/shopping/:id', (req, res) => {
  const data = getData();
  const idx = data.shopping.findIndex(i => i._id === req.params.id);
  if (idx !== -1) {
    data.shopping[idx] = { ...data.shopping[idx], ...req.body };
    saveData(data);
    res.json(data.shopping[idx]);
  } else {
    res.status(404).send();
  }
});

app.delete('/api/shopping/:id', (req, res) => {
  const data = getData();
  data.shopping = data.shopping.filter(i => i._id !== req.params.id);
  saveData(data);
  res.status(204).send();
});

app.delete('/api/shopping', (req, res) => {
  const data = getData();
  data.shopping = data.shopping.filter(i => !i.checked);
  saveData(data);
  res.status(204).send();
});

// ─── Ingredient Lib ──────────────────────────────────────────────────────────
const axios = require('axios');

// ─── AI Routes ──────────────────────────────────────────────────────────────
app.post('/api/ai/generate', async (req, res) => {
  const { ingredients } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.length < 5) {
    return res.status(400).json({ error: 'OpenRouter API key not configured' });
  }

  const ingredientList = ingredients.map(i => `${i.qty} ${i.unit} ${i.name}`).join(', ');

  const prompt = `You are a creative chef. Based on these ingredients in the user's fridge: ${ingredientList}. 
  Generate 3 delicious recipes. 
  Return ONLY a JSON array of objects. Each object MUST have:
  - "title": string
  - "tags": string[] (e.g., ["vegetarian", "quick", "dinner"])
  - "ingredients": array of objects with "name", "qty" (number), and "unit" (string)
  - "steps": string[] (array of instruction steps)
  
  Do not include any other text or markdown formatting outside the JSON array.`;

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'google/gemini-2.0-flash-lite-001',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'FridgeMatch'
      }
    });

    const content = response.data.choices[0].message.content;
    // Sometimes models return markdown blocks, let's clean it
    const jsonStr = content.replace(/```json|```/g, '').trim();
    const recipes = JSON.parse(jsonStr);

    // If the model wrapped it in an object like { "recipes": [...] }
    const finalRecipes = Array.isArray(recipes) ? recipes : (recipes.recipes || recipes.results || []);

    res.json(finalRecipes);
  } catch (err) {
    console.error('AI Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on http://0.0.0.0:${PORT} (File DB)`));
