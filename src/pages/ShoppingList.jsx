import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ShopItem = ({ item, onToggle, onRemove }) => (
  <div className="shop-item">
    <div className={`shop-check ${item.checked ? 'checked' : ''}`} onClick={() => onToggle(item._id, !item.checked)}></div>
    <div className={`shop-name ${item.checked ? 'done' : ''}`}>{item.name}</div>
    <div className="text-sm text2">{item.qty} {item.unit}</div>
    <button className="btn btn-sm btn-ghost" onClick={() => onRemove(item._id)}>✕</button>
  </div>
);

const ShoppingList = () => {
  const { shopping, addShoppingItems, toggleShoppingItem, removeShoppingItem, clearCheckedShopping, showToast } = useApp();
  const [form, setForm] = useState({ name: '', qty: '', unit: 'g' });

  const handleAdd = async () => {
    if (!form.name) return;
    await addShoppingItems([{
      name: form.name,
      qty: parseFloat(form.qty) || 1,
      unit: form.unit,
      checked: false
    }]);
    setForm({ name: '', qty: '', unit: 'g' });
  };

  const shareList = () => {
    const text = shopping.filter(i => !i.checked).map(i => `${i.name} (${i.qty} ${i.unit})`).join(', ');
    if (!text) {
      showToast('Nothing to share');
      return;
    }
    if (navigator.share) {
      navigator.share({ title: 'Shopping list', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => showToast('List copied to clipboard'));
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="flex-between">
          <div>
            <div className="page-title">Shopping List</div>
            <div className="page-subtitle">Ingredients you need to buy</div>
          </div>
          <div className="flex gap8">
            <button className="btn btn-sm" onClick={clearCheckedShopping}>Clear checked</button>
            <button className="btn btn-accent btn-sm" onClick={shareList}>Share list</button>
          </div>
        </div>
      </div>

      <div className="form-row mb16">
        <div className="form-group" style={{ flex: 2 }}>
          <label>Item name</label>
          <input 
            type="text" 
            placeholder="e.g. Parmesan" 
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input 
            type="number" 
            placeholder="100" 
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Unit</label>
          <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
            <option>g</option><option>kg</option><option>ml</option><option>l</option>
            <option>tsp</option><option>tbsp</option><option>cup</option><option>whole</option>
          </select>
        </div>
        <button className="btn btn-accent" style={{ alignSelf: 'flex-end' }} onClick={handleAdd}>Add</button>
      </div>

      <div className="card">
        <div id="shop-list">
          {shopping.length === 0 ? (
            <div className="empty-state"><div className="big">🛒</div><div>Your shopping list is empty</div></div>
          ) : (
            shopping.map(item => (
              <ShopItem key={item._id} item={item} onToggle={toggleShoppingItem} onRemove={removeShoppingItem} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
