import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const STORAGE_KEY_FRIDGE = 'fm_fridge';
const STORAGE_KEY_RECIPES = 'fm_recipes';
const STORAGE_KEY_SHOPPING = 'fm_shopping';

const INGREDIENT_LIB = [
  { id: 'i1', name: 'eggs', aliases: ['egg'], substitutes: [{ id: 'i12', name: 'flax eggs', ratio: 1 }], category: 'protein' },
  { id: 'i2', name: 'butter', aliases: ['unsalted butter'], substitutes: [{ id: 'i13', name: 'margarine', ratio: 1 }], category: 'dairy' },
  { id: 'i3', name: 'milk', aliases: ['whole milk'], substitutes: [{ id: 'i14', name: 'oat milk', ratio: 1 }, { id: 'i2', name: 'cream', ratio: 0.5 }], category: 'dairy' },
  { id: 'i4', name: 'flour', aliases: ['plain flour', 'all-purpose flour'], substitutes: [], category: 'baking' },
  { id: 'i5', name: 'tomatoes', aliases: ['tomato', 'cherry tomatoes'], substitutes: [], category: 'vegetable' },
  { id: 'i6', name: 'garlic', aliases: ['garlic cloves'], substitutes: [], category: 'vegetable' },
  { id: 'i7', name: 'cheese', aliases: ['parmesan', 'cheddar', 'mozzarella'], substitutes: [], category: 'dairy' },
  { id: 'i8', name: 'pasta', aliases: ['spaghetti', 'penne', 'fettuccine'], substitutes: [], category: 'carbs' },
  { id: 'i9', name: 'chicken', aliases: ['chicken breast', 'chicken thigh'], substitutes: [{ id: 'i15', name: 'tofu', ratio: 1 }], category: 'protein' },
  { id: 'i10', name: 'onion', aliases: ['red onion', 'white onion'], substitutes: [{ id: 'i16', name: 'shallots', ratio: 1 }], category: 'vegetable' },
  { id: 'i11', name: 'olive oil', aliases: ['oil'], substitutes: [{ id: 'i2', name: 'butter', ratio: 0.8 }], category: 'oil' },
  { id: 'i12', name: 'flax eggs', aliases: [], substitutes: [], category: 'baking' },
  { id: 'i13', name: 'margarine', aliases: [], substitutes: [], category: 'dairy' },
  { id: 'i14', name: 'oat milk', aliases: [], substitutes: [], category: 'dairy' },
  { id: 'i15', name: 'tofu', aliases: [], substitutes: [], category: 'protein' },
  { id: 'i16', name: 'shallots', aliases: [], substitutes: [], category: 'vegetable' },
  { id: 'i17', name: 'breadcrumbs', aliases: ['panko'], substitutes: [], category: 'baking' },
  { id: 'i18', name: 'lemon', aliases: ['lemon juice'], substitutes: [], category: 'fruit' },
  { id: 'i19', name: 'spinach', aliases: [], substitutes: [], category: 'vegetable' },
  { id: 'i20', name: 'cream', aliases: ['heavy cream', 'double cream'], substitutes: [{ id: 'i3', name: 'milk', ratio: 1.2 }], category: 'dairy' },
];

const API_URL = 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [fridge, setFridge] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [shopping, setShopping] = useState([]);
  const [ingredientLib, setIngredientLib] = useState([]);
  const [matches, setMatches] = useState([]);
  const [toast, setToast] = useState(null);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fridgeRes, recipesRes, shoppingRes, ingRes] = await Promise.all([
          fetch(`${API_URL}/fridge`),
          fetch(`${API_URL}/recipes`),
          fetch(`${API_URL}/shopping`),
          fetch(`${API_URL}/ingredients`)
        ]);
        
        const fridgeData = await fridgeRes.json();
        const recipesData = await recipesRes.json();
        const shoppingData = await shoppingRes.json();
        const ingData = await ingRes.json();

        setFridge(fridgeData);
        setRecipes(recipesData);
        setShopping(shoppingData);
        setIngredientLib(ingData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const addFridgeItem = async (item) => {
    const res = await fetch(`${API_URL}/fridge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    const newItem = await res.json();
    setFridge(prev => [newItem, ...prev]);
    showToast(`Added ${newItem.name} to fridge`);
  };

  const removeFridgeItem = async (id) => {
    await fetch(`${API_URL}/fridge/${id}`, { method: 'DELETE' });
    setFridge(prev => prev.filter(i => i._id !== id));
  };

  const addRecipe = async (recipe) => {
    const res = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    });
    const newRecipe = await res.json();
    setRecipes(prev => [newRecipe, ...prev]);
    showToast(`Recipe saved: ${newRecipe.title}`);
  };

  const removeRecipe = async (id) => {
    await fetch(`${API_URL}/recipes/${id}`, { method: 'DELETE' });
    setRecipes(prev => prev.filter(r => r._id !== id));
  };

  const addShoppingItems = async (items) => {
    const res = await fetch(`${API_URL}/shopping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    const newItems = await res.json();
    setShopping(prev => [...prev, ...newItems]);
    showToast(`Added items to shopping list`);
  };

  const toggleShoppingItem = async (id, checked) => {
    const res = await fetch(`${API_URL}/shopping/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checked })
    });
    const updated = await res.json();
    setShopping(prev => prev.map(i => i._id === id ? updated : i));
  };

  const removeShoppingItem = async (id) => {
    await fetch(`${API_URL}/shopping/${id}`, { method: 'DELETE' });
    setShopping(prev => prev.filter(i => i._id !== id));
  };

  const clearCheckedShopping = async () => {
    await fetch(`${API_URL}/shopping`, { method: 'DELETE' });
    setShopping(prev => prev.filter(i => !i.checked));
  };

  const generateAIRecipes = async () => {
    if (fridge.length === 0) {
      showToast('Add some ingredients to your fridge first!');
      return [];
    }
    showToast('AI is dreaming up recipes...');
    try {
      const res = await fetch(`${API_URL}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: fridge })
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      return data;
    } catch (err) {
      showToast('Failed to generate recipes. Check your API key.');
      return [];
    }
  };

  const runMatch = () => {
    const now = Date.now();
    const win = 72 * 60 * 60 * 1000;

    const newMatches = recipes.map(recipe => {
      let scoreSum = 0;
      const missing = [];
      const subs = [];
      const matchedItems = [];

      recipe.ingredients.forEach(ri => {
        const rname = ri.name.toLowerCase();
        const directMatch = fridge.find(f => f.name.toLowerCase() === rname);
        if (directMatch) {
          scoreSum += 1;
          matchedItems.push(directMatch);
          return;
        }

      const ingDef = ingredientLib.find(l => l.name === rname || l.aliases.includes(rname));
      let subFound = false;
      if (ingDef && ingDef.substitutes.length) {
        for (const sub of ingDef.substitutes) {
          const subMatch = fridge.find(f => f.name.toLowerCase() === sub.name.toLowerCase());
          if (subMatch) {
            scoreSum += 0.7;
            subs.push({ original: ri.name, substitute: sub.name });
            matchedItems.push(subMatch);
            subFound = true;
            break;
          }
        }
      }
      if (!subFound) missing.push({ name: ri.name, qty: ri.qty, unit: ri.unit });
    });

    const total = recipe.ingredients.length || 1;
    let score = Math.round((scoreSum / total) * 100);
    const expiryBoosted = matchedItems.some(it => it.expiry && (new Date(it.expiry) - now) < win && new Date(it.expiry) > now);
    if (expiryBoosted) score = Math.min(100, score + 10);

    return { recipe, score, expiryBoosted, missing, subs };
  });

  setMatches(newMatches);
  showToast(`Match complete — ${newMatches.length} recipes scored`);
};

const value = {
  fridge, addFridgeItem, removeFridgeItem,
  recipes, addRecipe, removeRecipe,
  shopping, addShoppingItems, toggleShoppingItem, removeShoppingItem, clearCheckedShopping,
  generateAIRecipes,
  matches, setMatches,
  runMatch,
  ingredientLib,
  toast, showToast
};

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
