import logo from './logo.svg';
import './App.css';
import '@aws-amplify/ui-react/styles.css';

import RouterComponent from './component/RouterComponent';
import MenuComponent from './component/MenuComponent';

import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator, Authenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsconfig)

function App() {
  return (
    <div className="App">
      <Authenticator loginMechanisms={['email']}>
        {({ signOut, user }) => (
          <main>
            <MenuComponent />

            <RouterComponent />
            <p>{user.username}</p>
            <button onClick={signOut}>Sign out</button>

          </main>
        )}
      </Authenticator>
    </div>
  );
}

export default withAuthenticator( App );
/*
<header className="App-header">

</header>
*/
