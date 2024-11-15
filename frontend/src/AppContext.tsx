import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of the context data
interface HomeFilterInterface {
  filter: {
    product_type: number;
    option: number[];
  };
  tax: number;  // Add tax field here
}

// Define the shape of the context value
interface AppContextType {
  homeFilter: HomeFilterInterface;
  setHomeFilter: (homeFilter: HomeFilterInterface) => void;
  updateProductType: (productType: number) => void;
  updateOption: (option: number[]) => void;
  updateTax: (tax: number) => void;  // Add updateTax function here

  clear: () => void; // Add clearHomeFilter function here
}

// Create the context with an initial value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Key used in localStorage
const LOCAL_STORAGE_KEY = 'homeFilter';
const APP_VERSION_KEY = 'appVersion';
const CURRENT_APP_VERSION = '0.0.1-beta'; // Set your app version here

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Load the initial state from localStorage or default to product_type: 1 and tax: 0
  const [homeFilter, setHomeFilter] = useState<HomeFilterInterface>(() => {
    const storedFilter = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedVersion = localStorage.getItem(APP_VERSION_KEY);

    // Check if stored version matches the current app version
    if (storedVersion !== CURRENT_APP_VERSION) {
      localStorage.clear(); // Clear localStorage if versions don't match
      localStorage.setItem(APP_VERSION_KEY, CURRENT_APP_VERSION); // Update stored version
      return { filter: { product_type: 1, option: [] }, tax: 7 }; // Default state
    }

    return storedFilter
      ? JSON.parse(storedFilter)
      : { filter: { product_type: 1, option: [] }, tax: 7 }; // Default tax: 0
  });

  const updateProductType = (productType: number) => {
    setHomeFilter((prev) => ({
      ...prev,
      filter: { ...prev.filter, product_type: productType },
    }));
  };

  const updateOption = (option: number[]) => {
    setHomeFilter((prev) => ({
      ...prev,
      filter: { ...prev.filter, option },
    }));
  };

  // Function to update the tax field
  const updateTax = (tax: number) => {
    setHomeFilter((prev) => ({
      ...prev,
      tax,
    }));
  };

  // Function to clear the homeFilter and localStorage
  const clear = () => {
    const defaultFilter = { filter: { product_type: 1, option: [] }, tax: 7 };
    setHomeFilter(defaultFilter);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  // Update localStorage whenever homeFilter changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(homeFilter));
  }, [homeFilter]);

  const value = { 
                  homeFilter, 
                  setHomeFilter, 
                  updateProductType, 
                  updateOption, 
                  updateTax,
                
                  clear}; // Include updateTax in value

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the AppContext
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};