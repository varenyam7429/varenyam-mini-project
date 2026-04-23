import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const SAMPLE_IMPORTS = [
  { title: 'Shakshuka', tags: ['breakfast','vegetarian','middle-eastern'],
    ingredients: [{name:'eggs',qty:4,unit:'whole'},{name:'tomatoes',qty:400,unit:'g'},{name:'garlic',qty:3,unit:'whole'},{name:'olive oil',qty:2,unit:'tbsp'},{name:'cumin',qty:1,unit:'tsp'},{name:'feta cheese',qty:80,unit:'g'}],
    steps: ['Heat olive oil in a wide pan','Saute garlic and spices until fragrant','Add tomatoes and simmer 10 minutes','Make wells and crack eggs in','Cover and cook until whites set','Top with feta and serve with bread']
  },
  { title: 'Banana Pancakes', tags: ['breakfast','sweet','easy'],
    ingredients: [{name:'flour',qty:150,unit:'g'},{name:'eggs',qty:2,unit:'whole'},{name:'milk',qty:200,unit:'ml'},{name:'butter',qty:20,unit:'g'},{name:'banana',qty:1,unit:'whole'},{name:'honey',qty:2,unit:'tbsp'}],
    steps: ['Mash banana with a fork','Mix flour, eggs, milk, and mashed banana','Melt butter in pan over medium heat','Pour small rounds of batter','Cook until bubbles form, then flip','Serve with honey']
  },
];

const ImportRecipe = () => {
  const { setRecipes, showToast } = useApp();
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(null);

  const handleImport = () => {
    if (!url) {
      showToast('Please enter a URL');
      return;
    }
    setStatus('Fetching and parsing recipe…');
    setTimeout(() => {
      const result = SAMPLE_IMPORTS[Math.floor(Math.random() * SAMPLE_IMPORTS.length)];
      setPending(result);
      setStatus('Recipe parsed successfully from URL.');
    }, 900);
  };

  const confirmImport = () => {
    if (!pending) return;
    const recipe = {
      id: Math.random().toString(36).substr(2, 9),
      title: pending.title,
      tags: pending.tags,
      ingredients: pending.ingredients,
      steps: pending.steps
    };
    setRecipes(prev => [...prev, recipe]);
    setPending(null);
    setUrl('');
    setStatus('');
    showToast(`Imported: ${recipe.title}`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Import Recipe</div>
        <div className="page-subtitle">Paste a recipe URL — we'll scrape title, ingredients, and steps</div>
      </div>
      <div className="import-box">
        <div className="url-row">
          <input 
            type="url" 
            placeholder="https://www.allrecipes.com/recipe/..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', padding: '9px 13px', fontSize: '13px', color: 'var(--text)', fontFamily: 'var(--font-body)', outline: 'none' }}
          />
          <button className="btn btn-accent" onClick={handleImport}>Import</button>
        </div>
        <div className="text-sm text2" style={{ marginBottom: '1rem' }}>{status}</div>
        
        {pending && (
          <div className="import-preview">
            <div className="preview-title">{pending.title}</div>
            <div className="text-sm text2 mb8">{pending.ingredients.length} ingredients found</div>
            <div className="mb16">
              {pending.ingredients.map((i, idx) => (
                <div key={idx} className="flex gap8 mb8">
                  <div className="dot dot-green"></div>
                  <span className="text-sm">{i.name} — <span className="text2">{i.qty} {i.unit}</span></span>
                </div>
              ))}
            </div>
            <div className="flex gap8">
              <button className="btn btn-accent" onClick={confirmImport}>Save to recipe box</button>
              <button className="btn" onClick={() => setPending(null)}>Discard</button>
            </div>
          </div>
        )}

        <div className="card mt24">
          <div className="section-title">How the importer works</div>
          <div className="algo-block mt8">
            <div className="code-line">1. Fetch HTML from URL (server-side to avoid CORS)</div>
            <div className="code-line">2. Parse JSON-LD schema.org/Recipe first</div>
            <div className="code-line code-comment">   → Handles AllRecipes, NYT Cooking, BBC Food</div>
            <div className="code-line">3. Fallback: cheerio heuristic selector scraping</div>
            <div className="code-line">4. Normalise ingredients → fuzzy match to DB</div>
            <div className="code-line">5. Save recipe with matched ingredientIds</div>
          </div>
          <div className="text-xs text3 mt8">In this demo, import is simulated with sample data. In production, wire to POST /api/recipes/import</div>
        </div>
      </div>
    </div>
  );
};

export default ImportRecipe;
