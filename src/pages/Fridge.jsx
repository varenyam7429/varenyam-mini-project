import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const FridgeItem = ({ item, onRemove }) => {
  const getExpiryStatus = (dateStr) => {
    if (!dateStr) return { label: '', cls: '' };
    const diff = new Date(dateStr) - Date.now();
    const days = Math.floor(diff / 86400000);
    if (days < 0) return { label: 'Expired', cls: 'expiry-bad' };
    if (days <= 3) return { label: `${days}d left`, cls: 'expiry-soon' };
    return { label: dateStr, cls: 'expiry-ok' };
  };

  const exp = getExpiryStatus(item.expiry);

  return (
    <div className="fridge-item">
      <div>
        <div className="fridge-item-name">{item.name}</div>
        <div className="fridge-item-meta">{item.qty} {item.unit}</div>
      </div>
      <div className="flex gap8" style={{ alignItems: 'center' }}>
        {exp.label && <span className={`fridge-item-expiry ${exp.cls}`}>{exp.label}</span>}
        <button className="btn btn-sm btn-danger" onClick={() => onRemove(item.id)}>Remove</button>
      </div>
    </div>
  );
};

const Fridge = () => {
  const { fridge, addFridgeItem, removeFridgeItem } = useApp();
  const [form, setForm] = useState({ name: '', qty: '', unit: 'g', expiry: '' });

  const handleAdd = () => {
    if (!form.name) return;
    addFridgeItem({
      name: form.name.toLowerCase(),
      qty: parseFloat(form.qty) || 1,
      unit: form.unit,
      expiry: form.expiry
    });
    setForm({ name: '', qty: '', unit: 'g', expiry: '' });
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex-between">
          <div>
            <div className="page-title">My Fridge</div>
            <div className="page-subtitle">Track what you have — with expiry dates</div>
          </div>
          <button className="btn btn-accent" onClick={() => document.getElementById('add-fridge-form').scrollIntoView({ behavior: 'smooth' })}>+ Add item</button>
        </div>
      </div>

      <div className="card mb16" id="add-fridge-form">
        <div className="section-title">Add fridge item</div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 2 }}>
            <label>Ingredient name</label>
            <input 
              type="text" 
              placeholder="e.g. Eggs, Tomatoes, Butter" 
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input 
              type="number" 
              placeholder="200" 
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Unit</label>
            <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
              <option>g</option><option>kg</option><option>ml</option><option>l</option>
              <option>tsp</option><option>tbsp</option><option>cup</option>
              <option>whole</option><option>oz</option>
            </select>
          </div>
          <div className="form-group">
            <label>Expiry date</label>
            <input 
              type="date" 
              value={form.expiry}
              onChange={(e) => setForm({ ...form, expiry: e.target.value })}
            />
          </div>
          <button className="btn btn-accent" style={{ marginBottom: 0, alignSelf: 'flex-end' }} onClick={handleAdd}>Add</button>
        </div>
      </div>

      <div className="card">
        <div className="section-title">Current inventory</div>
        <div id="fridge-list">
          {fridge.length === 0 ? (
            <div className="empty-state"><div className="big">🥦</div><div>Your fridge is empty — add some items above</div></div>
          ) : (
            fridge.map(item => <FridgeItem key={item._id} item={item} onRemove={removeFridgeItem} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Fridge;
