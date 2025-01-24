import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '../../comments/canvas';


const App = () => {
    return <Canvas deviceId='25d2627a4ba6429b' onSuccess={e => {
        console.log(e)
    }}></Canvas>
}
const root = createRoot(document.getElementById('root')!)
root.render(<App />)