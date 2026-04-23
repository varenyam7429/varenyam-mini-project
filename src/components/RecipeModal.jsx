import React from 'react';

const RecipeModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="btn btn-sm btn-ghost modal-close" onClick={onClose}>✕ Close</button>
        <div className="modal-title">{recipe.title}</div>
        <div className="flex gap8 mb16">
          {(recipe.tags || []).map((t, i) => (
            <span key={i} className="tag tag-green">{t}</span>
          ))}
        </div>
        <div className="section-title">Ingredients</div>
        <div className="mb16">
          {recipe.ingredients.map((i, idx) => (
            <div key={idx} className="flex gap8 mb8" style={{ alignItems: 'center' }}>
              <div className="dot dot-green"></div>
              <span style={{ fontSize: '13px' }}>{i.name} — <span className="text2">{i.qty} {i.unit}</span></span>
            </div>
          ))}
        </div>
        <div className="section-title">Steps</div>
        <ol className="step-list">
          {recipe.steps.map((s, idx) => (
            <li key={idx}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeModal;
