import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import RecipeModal from '../components/RecipeModal';

const RecipeBox = () => {
  const { recipes, addRecipe, removeRecipe } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    tags: '',
    ingredients: [{ name: '', qty: '', unit: 'g' }],
    steps: ''
  });

  const handleAddIngredient = () => {
    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, { name: '', qty: '', unit: 'g' }]
    });
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...newRecipe.ingredients];
    updated[index][field] = value;
    setNewRecipe({ ...newRecipe, ingredients: updated });
  };

  const handleSaveRecipe = () => {
    if (!newRecipe.title) return;

    addRecipe({
      title: newRecipe.title,
      tags: newRecipe.tags.split(',').map(t => t.trim()).filter(Boolean),
      ingredients: newRecipe.ingredients.filter(i => i.name).map(i => ({
        ...i,
        qty: parseFloat(i.qty) || 1
      })),
      steps: newRecipe.steps.split('\n').map(s => s.trim()).filter(Boolean)
    });

    setShowAddForm(false);
    setNewRecipe({ title: '', tags: '', ingredients: [{ name: '', qty: '', unit: 'g' }], steps: '' });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    removeRecipe(id);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex-between">
          <div>
            <div className="page-title">Recipe Box</div>
            <div className="page-subtitle">All your saved recipes</div>
          </div>
          <button className="btn btn-accent" onClick={() => setShowAddForm(true)}>+ Add recipe</button>
        </div>
      </div>

      {showAddForm && (
        <div className="card mb16">
          <div className="flex-between mb16">
            <div className="section-title">New recipe</div>
            <button className="btn btn-sm btn-ghost" onClick={() => setShowAddForm(false)}>✕</button>
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 3 }}>
              <label>Recipe title</label>
              <input 
                type="text" 
                placeholder="e.g. Pasta Carbonara" 
                value={newRecipe.title}
                onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="pasta, italian, quick" 
                value={newRecipe.tags}
                onChange={(e) => setNewRecipe({ ...newRecipe, tags: e.target.value })}
              />
            </div>
          </div>
          <hr />
          <div className="section-title mt8">Ingredients</div>
          {newRecipe.ingredients.map((ing, idx) => (
            <div key={idx} className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <input 
                  type="text" 
                  placeholder="Ingredient name" 
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <input 
                  type="number" 
                  placeholder="Qty" 
                  value={ing.qty}
                  onChange={(e) => handleIngredientChange(idx, 'qty', e.target.value)}
                />
              </div>
              <div className="form-group">
                <select value={ing.unit} onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}>
                  <option>g</option><option>kg</option><option>ml</option><option>l</option>
                  <option>tsp</option><option>tbsp</option><option>cup</option><option>whole</option>
                </select>
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => {
                const updated = newRecipe.ingredients.filter((_, i) => i !== idx);
                setNewRecipe({ ...newRecipe, ingredients: updated });
              }}>✕</button>
            </div>
          ))}
          <button className="btn btn-sm mt8" onClick={handleAddIngredient}>+ Add ingredient</button>
          <hr />
          <div className="section-title">Steps (one per line)</div>
          <textarea 
            rows="4" 
            placeholder="Boil salted water&#10;Cook pasta al dente&#10;Mix eggs and cheese..."
            value={newRecipe.steps}
            onChange={(e) => setNewRecipe({ ...newRecipe, steps: e.target.value })}
          ></textarea>
          <div className="flex gap8 mt16">
            <button className="btn btn-accent" onClick={handleSaveRecipe}>Save recipe</button>
            <button className="btn" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="grid2">
        {recipes.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="big">📖</div>
            <div>No recipes yet — add one above or import from a URL</div>
          </div>
        ) : (
          recipes.map(r => (
            <div key={r._id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedRecipe(r)}>
              <div className="flex-between mb8">
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '15px', fontWeight: 600 }}>{r.title}</div>
                <button className="btn btn-sm btn-danger" onClick={(e) => handleDelete(e, r._id)}>✕</button>
              </div>
              <div className="flex gap8 flex-wrap mb8">
                {(r.tags || []).map((t, i) => <span key={i} className="tag tag-green">{t}</span>)}
              </div>
              <div className="text-sm text2">{r.ingredients.length} ingredients · {r.steps.length} steps</div>
            </div>
          ))
        )}
      </div>

      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
};

export default RecipeBox;
