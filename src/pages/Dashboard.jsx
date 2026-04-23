import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import RecipeModal from '../components/RecipeModal';

const StatCard = ({ label, value, sub, color }) => (
  <div className="card stat-card">
    <div className="text-sm text2 mb4">{label}</div>
    <div className="flex gap8" style={{ alignItems: 'baseline' }}>
      <div className="stat-value" style={{ color: color || 'var(--text)' }}>{value}</div>
      <div className="text-xs text3">{sub}</div>
    </div>
  </div>
);

const MatchCard = ({ match, onOpen, onAddMissing }) => (
  <div className="card match-card" onClick={onOpen} style={{ cursor: 'pointer' }}>
    <div className="flex-between mb8">
      <div style={{ fontFamily: 'var(--font-head)', fontSize: '15px', fontWeight: 600 }}>{match.recipe.title}</div>
      <div className="match-score">{match.score}%</div>
    </div>
    
    <div className="flex gap8 flex-wrap mb12">
      {match.recipe.tags.slice(0, 3).map(tag => <span key={tag} className="tag">{tag}</span>)}
      {match.expiryBoosted && <span className="tag tag-amber">Expiry boost ⚡</span>}
    </div>

    <div className="mb12">
      {match.missing.length === 0 ? (
        <div className="text-xs" style={{ color: 'var(--accent)' }}>✓ All ingredients matched</div>
      ) : (
        <div className="text-xs text2">Missing: {match.missing.map(m => m.name).join(', ')}</div>
      )}
    </div>

    <div className="flex gap8">
      <button className="btn btn-sm w-full" onClick={(e) => { e.stopPropagation(); onOpen(); }}>View Recipe</button>
      {match.missing.length > 0 && (
        <button className="btn btn-accent btn-sm w-full" onClick={(e) => { e.stopPropagation(); onAddMissing(match); }}>+ Shop List</button>
      )}
    </div>
  </div>
);

const Dashboard = () => {
  const { fridge, recipes, matches, runMatch, addShoppingItems, generateAIRecipes, addRecipe } = useApp();
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [sortBy, setSortBy] = useState('score');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = {
    fridge: fridge.length,
    recipes: recipes.length,
    bestMatch: matches.length ? Math.max(...matches.map(m => m.score)) : null,
    expiring: fridge.filter(i => {
      if (!i.expiry) return false;
      const diff = new Date(i.expiry) - Date.now();
      return diff < 72 * 60 * 60 * 1000 && diff > 0;
    }).length
  };

  const sortedMatches = [...matches].sort((a, b) => {
    if (sortBy === 'expiry') return b.expiryBoosted - a.expiryBoosted || b.score - a.score;
    if (sortBy === 'missing') return a.missing.length - b.missing.length || b.score - a.score;
    return b.score - a.score;
  });

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    const results = await generateAIRecipes();
    setAiSuggestions(results);
    setIsGenerating(false);
  };

  const handleSaveAIRecipe = (recipe) => {
    addRecipe(recipe);
    setAiSuggestions(prev => prev.filter(r => r.title !== recipe.title));
  };

  const handleAddMissing = (match) => {
    const newItems = match.missing.map(item => ({
      name: item.name,
      qty: item.qty || 1,
      unit: item.unit || 'whole',
      checked: false
    }));
    addShoppingItems(newItems);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Good evening 👋</div>
        <div className="page-subtitle">Here's what you can cook with what's in your fridge</div>
      </div>

      <div className="grid4 mb16">
        <StatCard label="Fridge items" value={stats.fridge} sub="items tracked" />
        <StatCard label="Recipes saved" value={stats.recipes} sub="in your box" />
        <StatCard label="Best match" value={stats.bestMatch !== null ? `${stats.bestMatch}%` : '—'} sub="top match score" color="var(--accent)" />
        <StatCard label="Expiring soon" value={stats.expiring} sub="within 3 days" color="var(--amber)" />
      </div>

      {aiSuggestions.length > 0 && (
        <div className="mb24">
          <div className="flex-between mb8">
            <div className="section-title" style={{ color: 'var(--accent)' }}>✨ AI Suggestions</div>
            <button className="btn btn-sm btn-ghost" onClick={() => setAiSuggestions([])}>Dismiss</button>
          </div>
          <div className="grid3">
            {aiSuggestions.map((r, i) => (
              <div key={i} className="card ai-card" style={{ border: '1px solid var(--accent-dim)' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>{r.title}</div>
                <div className="flex gap4 flex-wrap mb8">
                  {r.tags.map(t => <span key={t} className="tag tag-sm">{t}</span>)}
                </div>
                <button className="btn btn-accent btn-sm w-full" onClick={() => handleSaveAIRecipe(r)}>Save to Box</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-between mb8">
        <div className="section-title">Match results</div>
        <div className="flex gap8">
          <button className="btn btn-sm" onClick={handleGenerateAI} disabled={isGenerating}>
            {isGenerating ? 'Thinking...' : '✨ AI Generate'}
          </button>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ fontSize: '12px', padding: '5px 10px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 'var(--radius-sm)', color: 'var(--text2)', cursor: 'pointer' }}
          >
            <option value="score">Sort by score</option>
            <option value="expiry">Expiry boost first</option>
            <option value="missing">Fewest missing</option>
          </select>
          <button className="btn btn-accent btn-sm" onClick={runMatch}>Run match</button>
        </div>
      </div>

      <div className="grid3">
        {sortedMatches.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1/-1' }}>
            <div className="big">🥗</div>
            <div>No matches found. Try adding more ingredients or recipes!</div>
          </div>
        ) : (
          sortedMatches.map((m, i) => (
            <MatchCard 
              key={i} 
              match={m} 
              onOpen={() => setSelectedRecipe(m.recipe)} 
              onAddMissing={handleAddMissing}
            />
          ))
        )}
      </div>

      {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
};

export default Dashboard;
