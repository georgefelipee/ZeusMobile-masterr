import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

const AppNavigationContainer = ({ children }) => {
  return (
    <NavigationContainer
      // Defina estilos globais aqui, como backgroundColor, etc.
      // Exemplo: style={{ backgroundColor: 'white' }}
      style={{ backgroundColor: 'white' }}
    >
      {children}
    </NavigationContainer>
  );
};

export default AppNavigationContainer;
