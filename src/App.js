import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Amplify } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

import { BrowserRouter } from 'react-router-dom';
import RouterComponent from './navigation/RouterComponent';
import { MenuComponent, CurrentPageName} from './navigation/MenuComponent';

import {
  ChakraBaseProvider,
  theme as chakraTheme,
} from '@chakra-ui/react';

Amplify.configure(awsExports);

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <ChakraBaseProvider theme={chakraTheme}>
          <BrowserRouter>
            <main>
              <header className="App-header">
                <MenuComponent />
              </header>
              <RouterComponent />
            </main>
          </BrowserRouter>
        </ChakraBaseProvider>
      )}
    </Authenticator>
  );
}

export default App;
