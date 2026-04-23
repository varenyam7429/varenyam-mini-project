import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const MatchEngine = () => {
  const { recipes, fridge, ingredientLib } = useApp();
  const [demoRecipeId, setDemoRecipeId] = useState(recipes[0]?._id || '');

  const demoRecipe = recipes.find(r => r._id === demoRecipeId);

  const getDemoScore = () => {
    if (!demoRecipe) return null;
    let scoreSum = 0;
    const lines = demoRecipe.ingredients.map(ri => {
      const rname = ri.name.toLowerCase();
      const direct = fridge.find(f => f.name.toLowerCase() === rname);
      if (direct) {
        scoreSum += 1;
        return { text: `✓ ${ri.name} — exact match → 1.0`, color: 'var(--accent)' };
      }
      const ingDef = ingredientLib.find(l => l.name === rname || l.aliases.includes(rname));
      let subFound = false;
      if (ingDef) {
        for (const sub of ingDef.substitutes) {
          if (fridge.find(f => f.name.toLowerCase() === sub.name.toLowerCase())) {
            scoreSum += 0.7;
            subFound = true;
            return { text: `~ ${ri.name} → substitute "${sub.name}" → 0.7`, color: 'var(--sky)' };
          }
        }
      }
      if (!subFound) return { text: `✗ ${ri.name} — missing → 0.0`, color: 'var(--red)' };
    });

    const total = demoRecipe.ingredients.length || 1;
    const score = Math.round((scoreSum / total) * 100);
    return { lines, scoreSum, total, score };
  };

  const demoResult = getDemoScore();

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">Match Engine</div>
        <div className="page-subtitle">How the scored matching algorithm works</div>
      </div>

      <div className="grid2 mb16">
        <div className="card">
          <div className="section-title">Scoring weights</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <div className="flex-between">
              <div className="flex gap8" style={{ alignItems: 'center' }}><div className="dot dot-green"></div><span className="fw6">Exact match</span></div>
              <span className="text-accent fw6">1.0 ×</span>
            </div>
            <div className="flex-between">
              <div className="flex gap8" style={{ alignItems: 'center' }}><div className="dot dot-amber"></div><span>Substitute match</span></div>
              <span style={{ color: 'var(--amber)' }}>0.7 ×</span>
            </div>
            <div className="flex-between">
              <div className="flex gap8" style={{ alignItems: 'center' }}><div className="dot dot-red"></div><span>Not found</span></div>
              <span style={{ color: 'var(--red)' }}>0.0 ×</span>
            </div>
            <hr />
            <div className="flex-between">
              <div>Expiry boost (item expires ≤72h)</div>
              <span style={{ color: 'var(--sky)' }}>+10 pts</span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="section-title">Formula</div>
          <div className="algo-block mt8">
            <div className="code-line">score = (Σ weights / total_ingredients) × 100</div>
            <div className="code-line code-comment mt8">Example — Pasta Carbonara:</div>
            <div className="code-line">eggs     → exact   → 1.0</div>
            <div className="code-line">pancetta → missing → 0.0</div>
            <div className="code-line">cheese   → exact   → 1.0</div>
            <div className="code-line">pepper   → exact   → 1.0</div>
            <div className="code-line code-comment">= (3.0 / 4) × 100 = 75%</div>
            <div className="code-line code-comment">+10 if any item expiring soon = 85%</div>
          </div>
        </div>
      </div>

      <div className="card mb16">
        <div className="section-title">Atlas Search fuzzy matching</div>
        <div className="algo-block mt8">
          <div className="code-line">db.ingredients.aggregate([</div>
          <div className="code-line">&nbsp;&nbsp;{'{'} $search: {'{'}</div>
          <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;index: "ingredient_search",</div>
          <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;text: {'{'} query: "tomatoe", path: ["name","aliases"],</div>
          <div className="code-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fuzzy: {'{'} maxEdits: 1 {'}'} {'}'}</div>
          <div className="code-line">&nbsp;&nbsp;{'}'} {'}'},</div>
          <div className="code-line">&nbsp;&nbsp;{'{'} $limit: 5 {'}'}</div>
          <div className="code-line">])</div>
          <div className="code-line code-comment mt8">Result: "tomatoes" ✓ — typo-tolerant search</div>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Live demo — simulate a match</div>
        <div className="text-sm text2 mb16">Select a recipe and see how the algorithm scores it against your fridge</div>
        <div className="form-row" style={{ maxWidth: '400px' }}>
          <div className="form-group">
            <label>Pick a recipe</label>
            <select value={demoRecipeId} onChange={(e) => setDemoRecipeId(e.target.value)}>
              {recipes.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
            </select>
          </div>
        </div>
        
        {demoResult && (
          <div className="algo-block mt8">
            {demoResult.lines.map((line, i) => (
              <div key={i} className="code-line" style={{ color: line.color }}>{line.text}</div>
            ))}
            <div className="code-line code-comment" style={{ marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
              = ({demoResult.scoreSum.toFixed(1)} / {demoResult.total}) × 100 = {demoResult.score}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchEngine;
