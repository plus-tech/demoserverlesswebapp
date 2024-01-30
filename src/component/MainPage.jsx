import React, { Component } from "react";

import { Amplify } from 'aws-amplify';
import { Authenticator, Button, Input, Label, Flex, PasswordField, Fieldset } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

class MainPage extends Component {
  render() {
    return (
      <div>
      <Flex direction="column" gap="small">
        <Fieldset direction="column">
          <Label htmlFor="first_name">First Name:</Label>
          <Input id="first_name" name="first_name" />

          <Label htmlFor="email">Email:</Label>
          <Input id="email" type="email" name="email" />

          <PasswordField
            label="Password"
            name="password"
            id="password"
            hideShowPassword="true"
          />

          <Button id="btnsignup" > Sign up </Button>
        </Fieldset>
      </Flex>
      </div>
    );
  }
}

export default MainPage;
