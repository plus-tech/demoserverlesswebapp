import React, { Component,  useState, useEffect } from 'react';
import { useNavigate, } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import {
  Menu,
  MenuButton,
  MenuItem,
  Divider,
  useAuthenticator,
  View,
  Label,
} from '@aws-amplify/ui-react';
import {
  fetchUserAttributes,
} from 'aws-amplify/auth';

/*
function signOut(){
  console.log("do nothing");
}
const user = {
  username: "test"
}
*/
/*
  Get preferred username
*/
async function GetPreferredUserName(){
  let pusername = '';
  try{
    const res = await fetchUserAttributes();
    pusername = res['preferred_username'];
  } catch (err) {
    console.log(err);
  }

  return pusername;
}

/*
  Render the header menu
*/
export function MenuComponent() {
    const { user, signOut } = useAuthenticator((context) => [context.user]);

    const [pusername, setPusername] = useState(null);

    useEffect(() => {
      GetPreferredUserName().then(res => {
        setPusername(res);
      })
    }, [])

    const username = pusername != ''? pusername : user.username;

    const navigate = useNavigate();

    return (
      <Menu menuAlign="start" trigger={
        <MenuButton id="mainMenuBtn" variation="primary" className="colorful-button">
          {username}
        </MenuButton>
      }>
      <MenuItem onClick={()=>{navigate("/viewproduct");}}>
        View Product
      </MenuItem>
        <MenuItem onClick={()=>{navigate("/viewcart");}}>
          View Cart
        </MenuItem>
        <Divider />
        <MenuItem onClick={signOut}>
          Sign Out
        </MenuItem>
      </Menu>
    );
}
