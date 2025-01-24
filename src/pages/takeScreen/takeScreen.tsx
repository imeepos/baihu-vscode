import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '../../comments/canvas';
declare const acquireVsCodeApi: any;
const vscode = acquireVsCodeApi();
const App = () => {
    const [deviceId, setDeviceId] = useState((window as any).deviceId);

    return <div className="app p-1 m-1">
        <div className='flex'>
            <Canvas deviceId={deviceId} onSuccess={e => {
                vscode.postMessage(e)
            }}></Canvas>
        </div>
    </div>
}
const root = createRoot(document.getElementById('root')!)
root.render(<App />)