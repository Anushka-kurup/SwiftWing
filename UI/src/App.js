import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import NotFound from './pages/notfound'; // For handling invalid routes
import Orders from "./pages/orders";
import './styles.css'; 

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="*" element={<NotFound />} />  {/* Catch-all for unmatched routes */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;

