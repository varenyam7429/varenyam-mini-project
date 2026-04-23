import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Fridge from './pages/Fridge';
import RecipeBox from './pages/RecipeBox';
import { AppProvider } from './context/AppContext';

function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'fridge': return <Fridge />;
      case 'recipes': return <RecipeBox />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="flex">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="main">
          {renderPage()}
        </main>
        <Toast />
      </div>
    </AppProvider>
  );
}

export default App;
