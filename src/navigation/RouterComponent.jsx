import React from 'react';
import {
  Route,
  Routes,
} from 'react-router-dom'

import { ViewCart } from "../custom-ui-components/ViewCart";
import { ViewProduct } from "../custom-ui-components/ViewProduct";
// import { ShoppingList } from "../ui-components/index.js";

const AppRouter = () => {
  return(
    <div>
      <Routes>
          <Route path="/" element={<ViewProduct />} />
           // onSubmit={fields => { /* Handle form submission */}}/>} />
          <Route path="/viewproduct" element={<ViewProduct />} />
          <Route path="/viewcart" element={<ViewCart />} />
      </Routes>
    </div>
  )
}

export default AppRouter;
