import axios from 'axios';
import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
declare const acquireVsCodeApi: any;
const vscode = acquireVsCodeApi()
const App = () => {
    const [deviceId, setDeviceId] = useState((window as any).deviceId);
    const [url, setUrl] = useState<string>()
    const canvasRef = useRef<any>(null);
    const [style, setStyle] = useState<any>()
    const containerRef = useRef<any>(null)
    const imgRef = useRef<any>(null);
    const [ast, setAst] = useState<any>()
    const [type, setType] = useState<string>(`image`)
    const [activateId, setActivateId] = useState<string>()

    const getDeviceInfo = async () => {
        return axios.post(`http://43.240.223.138:3001/rpc/v1/${deviceId}/deviceInfo`, {}).then(res => res.data)
    }
    const getAstJson = async () => {
        return axios.post(`http://43.240.223.138:3001/rpc/v1/${deviceId}/getJson`, {}).then(res => res.data)
    }
    const getAstXml = async () => {
        return axios.post(`http://43.240.223.138:3001/rpc/v1/${deviceId}/getXml`, {}).then(res => res.data)
    }
    const refresh = async () => {
        const canvas: HTMLCanvasElement = canvasRef.current;
        const ctx = canvas.getContext('2d')
        if (!ctx) return;
        setUrl(`http://43.240.223.138:3001/rpc/v1/${deviceId}/takeScreen?time=${Date.now()}`)
        const deviceInfo = await getDeviceInfo();
        if (deviceInfo) {
            if (canvas) {
                if (deviceInfo.orientation === 1) {
                    canvas.width = deviceInfo.width;
                    canvas.height = deviceInfo.height;
                    setStyle({
                        width: deviceInfo.width + `px`,
                        height: deviceInfo.height + `px`
                    })
                } else {
                    canvas.width = deviceInfo.height;
                    canvas.height = deviceInfo.width;
                    setStyle({
                        width: deviceInfo.height + `px`,
                        height: deviceInfo.width + `px`
                    })
                }
            }
        }
    }

    const init = () => {
        const img: HTMLImageElement = imgRef.current;
        const canvas: HTMLCanvasElement = canvasRef.current;
        if (!img) return;
        if (!canvas) return;
        const ctx = canvas.getContext('2d')
        if (!ctx) return;
        img.onload = async () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0)
            // 然后执行 画狂狂图
            const ast = await getAstJson()
            if (ast.message) {
                vscode.postMessage(JSON.stringify({ action: 'error', payload: ast }));
                return;
            }
            if (ast) {
                setAst(ast)
            }
        }
        refresh()
    }

    useEffect(() => {
        init()
    }, [type])

    const Ast: React.FC<{ ast: any, activateId: string }> = ({ ast, activateId }) => {
        const [style, setStyle] = useState<any>()
        useEffect(() => {
            if (!ast) {
                return setStyle({})
            }
            setStyle({
                width: ast.width,
                height: ast.height,
                left: ast.left,
                top: ast.top,
                zIndex: 10000 * 10000 - ast.width * ast.height,
                border: `.5px solid red`,
                position: `absolute`,
                display: ast.visibleToUser ? 'inline-block' : 'none',
                backgroundColor: activateId === ast.__id ? '#f506063d' : 'none',
            } as CSSProperties);
        }, [ast, activateId])
        if (!ast) return <div></div>
        return <>
            <div style={style} key={ast.__id}></div>
            {ast.children.map((c: any, index: number) => {
                return <Ast ast={c} key={c.__id} activateId={activateId} />
            })}</>
    }
    const JsonAst: React.FC<{ ast: any, space: number, activateId: string, setActivate: (id: string) => void }> = ({ ast, space, setActivate, activateId }) => {
        const astToText = (ast: any) => {
            let text = ast.className;
            if (ast.text) {
                text += ` text:${ast.text}`
            }
            if (ast.desc) {
                text += ` desc:${ast.desc}`
            }
            if (ast.id) {
                text += ` id:${ast.id}`
            }
            return text;
        }
        if (!ast) return <div></div>
        return <>
            <div key={ast.__id} style={{ marginLeft: `${space * 1}px`, backgroundColor: activateId === ast.__id ? '#f506063d' : 'none' }}>
                <span className='cursor-pointer' onClick={e => {
                    setActivate(ast.__id)
                }}>{astToText(ast)}</span>
                {ast.children.map((c: any) => {
                    return <JsonAst key={c.__id} ast={c} space={space + 1} activateId={activateId} setActivate={setActivate}></JsonAst>
                })}
            </div>
        </>
    }
    return <div className="app p-1 m-1">
        <div className="flex flex-row fixed bottom-1 right-1">
            <div className='bg-blue-500 text-white p-1 cursor-pointer m-1' onClick={refresh}>刷新</div>
        </div>
        <div className="flex flex-row">
            <div style={{ overflow: 'auto', width: '220px', minWidth: '220px', height: "600px", zIndex: 9999999 }}>
                <JsonAst ast={ast} space={0} activateId={activateId!} setActivate={e => {
                    setActivateId(e)
                }} />
            </div>
            <div className='flex-1 flex relative' style={{ ...style, height: "600px", overflow: 'auto' }}>
                <img ref={imgRef} src={url} style={{ display: 'none' }} />
                <canvas ref={canvasRef} onClick={e => { }} style={style}></canvas>
                <Ast ast={ast} activateId={activateId!} />
            </div>
        </div>
    </div>
}
const root = createRoot(document.getElementById('root')!)
root.render(<App />)