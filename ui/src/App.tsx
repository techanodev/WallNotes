import React from 'react';
import './resources/styles/style.scss'
import 'react-toastify/dist/ReactToastify.css';

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <div className='background'></div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div >
  );
}

export default App;
