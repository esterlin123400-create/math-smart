import React, { createContext, useContext, useState, useEffect } from 'react';
import { screensCatalog } from '../data/screensCatalog';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Read initial screen from URL hash if available (e.g. #01, #hub)
  const getInitialScreen = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash === 'hub' || screensCatalog.some(s => s.id === hash)) {
        return hash;
      }
    }
    return 'hub';
  };

  const [currentScreen, setCurrentScreenState] = useState(getInitialScreen);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickSwitcherOpen, setIsQuickSwitcherOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);

  // Sync hash on change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash === 'hub' || screensCatalog.some(s => s.id === hash)) {
        setCurrentScreenState(hash);
      } else if (!hash) {
        setCurrentScreenState('hub');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const navigateTo = (screenId) => {
    setCurrentScreenState(screenId);
    if (typeof window !== 'undefined') {
      window.location.hash = screenId === 'hub' ? '' : screenId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen: navigateTo,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isQuickSwitcherOpen,
        setIsQuickSwitcherOpen,
        isSidebarOpen,
        setIsSidebarOpen,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

