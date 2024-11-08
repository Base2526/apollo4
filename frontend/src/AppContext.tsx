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
}

// Create the context with an initial value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Key used in localStorage
const LOCAL_STORAGE_KEY = 'homeFilter';

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Load the initial state from localStorage or default to product_type: 1 and tax: 0
  const [homeFilter, setHomeFilter] = useState<HomeFilterInterface>(() => {
    const storedFilter = localStorage.getItem(LOCAL_STORAGE_KEY);
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

  // Update localStorage whenever homeFilter changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(homeFilter));
  }, [homeFilter]);

  const value = { homeFilter, setHomeFilter, updateProductType, updateOption, updateTax }; // Include updateTax in value

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