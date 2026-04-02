import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import { store } from './redux/store.js'
import 'react-confirm-alert/src/react-confirm-alert.css';

const roundFavicon = (src) => {
  const canvas = document.createElement('canvas');
  const size = 32; // Standard favicon size
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = src;
  img.onload = () => {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, size, size);
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = canvas.toDataURL('image/png');
  };
};

roundFavicon('images/logo.png');

createRoot(document.getElementById('root')).render(
    <Provider  store={store}>
      <App />
    </Provider>
)
