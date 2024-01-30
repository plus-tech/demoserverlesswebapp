import React, { Component } from 'react';
import { Menu, MenuItem, Divider } from '@aws-amplify/ui-react';

class MenuComponent extends Component {
  render() {
    return (
      <>
      <Menu
        menuAlign="start"
      >
        <MenuItem onClick={() => alert('Download')}>
          Download
        </MenuItem>
        <MenuItem onClick={() => alert('Create a Copy')}>
          Create a Copy
        </MenuItem>
        <MenuItem onClick={() => alert('Mark as Draft')}>
          Mark as Draft
        </MenuItem>
        <Divider />
        <MenuItem isDisabled onClick={() => alert('Delete')}>
          Delete
        </MenuItem>
        <MenuItem onClick={() => alert('Attend a workshop')}>
          Attend a workshop
        </MenuItem>
      </Menu>
      </>
    );
  }
}

export default MenuComponent;
