import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import 'antd/dist/antd.css'
import 'antd/dist/antd.min.css'
import { BrowserRouter } from 'react-router-dom';
//import "@ant - design/flowchart/dist/index.css";
import "./antd.css";
import "./styles.css";
import "./components/Home/home.css";
import "./components/Structure/structure.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
);


