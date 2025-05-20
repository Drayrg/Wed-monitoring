import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type UpdateInterval = 1 | 2 | 3 | 5 | 10; // интервалы в секундах

interface UpdateIntervalContextType {
  interval: UpdateInterval;
  setUpdateInterval: (interval: UpdateInterval) => void;
}

const UpdateIntervalContext = createContext<UpdateIntervalContextType | undefined>(undefined);

interface UpdateIntervalProviderProps {
  children: ReactNode;
}

export const UpdateIntervalProvider: React.FC<UpdateIntervalProviderProps> = ({ children }) => {
  const [interval, setInterval] = useState<UpdateInterval>(3 as UpdateInterval);

  // Загрузка сохраненного интервала при монтировании компонента
  useEffect(() => {
    const savedInterval = localStorage.getItem('updateInterval');
    if (savedInterval) {
      setInterval(Number(savedInterval) as UpdateInterval);
    }
  }, []);

  // Функция для изменения интервала
  const setUpdateInterval = (newInterval: UpdateInterval) => {
    setInterval(newInterval);
    localStorage.setItem('updateInterval', newInterval.toString());
  };

  return (
    <UpdateIntervalContext.Provider value={{ interval, setUpdateInterval }}>
      {children}
    </UpdateIntervalContext.Provider>
  );
};

// Хук для использования интервала обновления в компонентах
export const useUpdateInterval = (): UpdateIntervalContextType => {
  const context = useContext(UpdateIntervalContext);
  if (context === undefined) {
    throw new Error('useUpdateInterval must be used within an UpdateIntervalProvider');
  }
  return context;
};