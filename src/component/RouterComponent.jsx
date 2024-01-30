import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import MainPage from "./MainPage";
import { ShoppingList } from "../ui-components/index.js";

const AppRouter = () => {
  return(
    <div>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<ShoppingList onSubmit={fields => { /* Handle form submission */}}/>} />
              <Route path="/mainpage" element={<MainPage />} />
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRouter;
