import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => <div className="app bg-blue-500 text-white p-4 rounded-lg">开发中，敬请期待!</div>
const root = createRoot(document.getElementById('root')!)
root.render(<App />)