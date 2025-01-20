import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto
const LogInContext = createContext();

// Proveedor del contexto
export const LogInProvider = ({ children }) => {
    const [isName, setIsName] = useState('');
    const [isType, setIsType] = useState('');
  
    // Usa useEffect para establecer los valores al montar el componente
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            const authTokenArr = JSON.parse(authToken);
            setIsName(authTokenArr?.nombre);
            setIsType(authTokenArr?.tipo);
    
        }
    }, []); // Solo se ejecuta una vez

    return (
      <LogInContext.Provider value={{ isName, isType }}>
        {children}
      </LogInContext.Provider>
    );
};

// Hook personalizado para usar el contexto de LogIn
export const useLogIn = () => {
    return useContext(LogInContext);
};
