import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
const LoaderContext = createContext();

// Proveedor del contexto
export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Funciones para mostrar y ocultar el loader
 
  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

// Hook personalizado para usar el contexto de Loader
export const useLoader = () => {
  return useContext(LoaderContext);
};
