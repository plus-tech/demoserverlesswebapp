import logo from './logo.svg';
import './App.css';
import '@aws-amplify/ui-react/styles.css';

import ErrorBoundary from "./errorhandling/ErrorBoundary";
import { BrowserRouter } from 'react-router-dom';
import RouterComponent from './navigation/RouterComponent';
import { MenuComponent, CurrentPageName} from './navigation/MenuComponent';

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import {
  AmplifySignOut,
  withAuthenticator,
  Authenticator,
  useAuthenticator,
  View,
  Label,
 } from '@aws-amplify/ui-react';
 import {
   getCurrentUser,
   fetchAuthSession,
} from 'aws-amplify/auth';

import {
  ChakraBaseProvider,
  theme as chakraTheme,
} from '@chakra-ui/react';

Amplify.configure(awsconfig)

function App() {

  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <div className="App" >
        <ChakraBaseProvider theme={chakraTheme}>
          <BrowserRouter>
            <Authenticator loginMechanisms={['email']}>
              {
                ({ signOut, user }) => (
                  <main>
                    <header className="App-header">
                      <MenuComponent />
                    </header>
                    <RouterComponent />
                  </main>
                )
              }
            </Authenticator>
          </BrowserRouter>
        </ChakraBaseProvider>
      </div>
    </ErrorBoundary>
  );
}

export default withAuthenticator( App );
