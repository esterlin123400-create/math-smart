import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { screensCatalog } from '../data/screensCatalog';

/**
 * @typedef {{ message: string, type: string, id: number } | null} ToastState
 * @typedef {{
 *   currentScreen: string,
 *   setCurrentScreen: (screenId: string) => void,
 *   selectedCategory: string,
 *   setSelectedCategory: React.Dispatch<React.SetStateAction<string>>,
 *   searchQuery: string,
 *   setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
 *   isQuickSwitcherOpen: boolean,
 *   setIsQuickSwitcherOpen: React.Dispatch<React.SetStateAction<boolean>>,
 *   isSidebarOpen: boolean,
 *   setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>,
 *   toast: ToastState,
 *   showToast: (message: string, type?: string) => void
 * }} AppContextValue
 */

/** @type {React.Context<AppContextValue>} */
const AppContext = createContext({
  currentScreen: 'hub',
  setCurrentScreen: () => {},
  selectedCategory: 'الكل',
  setSelectedCategory: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
  isQuickSwitcherOpen: false,
  setIsQuickSwitcherOpen: () => {},
  isSidebarOpen: true,
  setIsSidebarOpen: () => {},
  toast: null,
  showToast: () => {}
});

export const AppProvider = ({ children }) => {
  const getInitialScreen = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash === 'hub' || screensCatalog.some(s => s.id === hash)) {
        return hash;
      }
    }
    return 'hub';
  };

  const getInitialSidebar = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 900;
    }
    return true;
  };

  const [currentScreen, setCurrentScreenState] = useState(getInitialScreen);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickSwitcherOpen, setIsQuickSwitcherOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(getInitialSidebar);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  // Sync hash on browser history navigation
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
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, type, id: Date.now() });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 4000);
  }, []);

  const navigateTo = useCallback((screenId) => {
    setCurrentScreenState(screenId);
    if (typeof window !== 'undefined') {
      window.location.hash = screenId === 'hub' ? '' : screenId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.innerWidth <= 900) {
        setIsSidebarOpen(false);
      }
    }
  }, []);

  const value = useMemo(() => ({
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
  }), [
    currentScreen,
    navigateTo,
    selectedCategory,
    searchQuery,
    isQuickSwitcherOpen,
    isSidebarOpen,
    toast,
    showToast
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

/** @returns {AppContextValue} */
export const useApp = () => useContext(AppContext);
