import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { fromEvent, map, switchMap, takeLast, takeUntil } from 'rxjs';

const initClipCanvasEvent = (ele: HTMLCanvasElement, container: HTMLDivElement, image: HTMLImageElement, onSuccess: (buf: any) => void) => {
    const onmousedown = fromEvent(ele, 'mousedown')
    const onmousemove = fromEvent(ele, 'mousemove')
    const onmouseup = fromEvent(ele, 'mouseup')
    const ctx = ele.getContext('2d')
    const canvas: HTMLCanvasElement = ele;
    const rect = canvas.getBoundingClientRect();

    const getCurrentXY = (e: any) => {
        const scrollTop = container.scrollTop;
        const scrollLeft = container.scrollLeft;
        const x = e.clientX - rect.left + scrollLeft;
        const y = e.clientY - rect.top + scrollTop;
        return { x, y }
    }
    image.onload = () => loadImage()
    const loadImage = () => {
        if (ctx) {
            ctx.drawImage(image, 0, 0, ele.width, ele.height)
        }
    }
    onmousedown.pipe(
        switchMap((downEvent: any) => {
            const { x, y } = getCurrentXY(downEvent)
            return onmousemove.pipe(
                map((moveEvent: any) => {
                    const { x: x1, y: y1 } = getCurrentXY(moveEvent)
                    const position = {
                        x, y, x1, y1
                    };
                    if (ctx) {
                        ctx.clearRect(0, 0, ele.width, ele.height)
                        ctx.drawImage(image, 0, 0, ele.width, ele.height)
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(position.x, position.y, position.x1 - position.x, position.y1 - position.y)
                    }
                    return position;
                }),
                takeUntil(onmouseup),
                takeLast(1)
            );
        })
    ).subscribe({
        next: (position) => {
            //实现图片裁切
            const ctx = ele.getContext('2d')
            if (ctx) {
                const width = position.x1 - position.x;
                const height = position.y1 - position.y;
                ele.width = width;
                ele.height = height;
                ctx.clearRect(0, 0, width, height)
                ctx.drawImage(image, position.x, position.y, width, height, 0, 0, width, height)
                ele.toBlob((blob) => {
                    if (!blob) return;
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var arrayBuffer = event.target?.result as any;
                        var uint8Array = new Uint8Array(arrayBuffer);
                        onSuccess({
                            ...position,
                            data: uint8Array,
                        })
                    };
                    reader.readAsArrayBuffer(blob!);
                });
            }
        },
        error: () => { },
        complete: () => {
            console.log(`complete `)
        }
    });
}

const takeScreenUrl = (did: string) => {
    return `http://43.240.223.138:3001/rpc/v1/${did}/takeScreen?t=${Date.now()}`
}

const deviceInfoUrl = (did: string) => {
    return `http://43.240.223.138:3001/rpc/v1/${did}/deviceInfo`
}

const getDeviceInfo = (did: string) => {
    return axios.post(deviceInfoUrl(did), {}, { timeout: 5 * 1000 }).then(res => res.data)
}
export const Canvas: React.FC<{
    deviceId: string,
    onSuccess: (payload: { x: number, y: number, x1: number, y1: number, data: any }) => void
}> = ({ deviceId, onSuccess }) => {
    const ref = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [url, setUrl] = useState<string>(``)
    const [result, setResult] = useState<any>()
    const [fileName, setFilename] = useState<any>()
    const [deviceInfo, setDeviceInfo] = useState<any>()

    function resetDevice(dinfo?: any) {
        const info = dinfo || deviceInfo;
        const canvas = ref.current;
        const image = imgRef.current
        if (canvas && image) {
            if (info.orientation === 1) {
                canvas.width = info.width;
                canvas.height = info.height;
            } else {
                canvas.width = info.height;
                canvas.height = info.width;
            }
        }
        setUrl(takeScreenUrl(deviceId))
    }

    useEffect(() => {
        if (!deviceId) return;
        getDeviceInfo(deviceId).then(deviceInfo => {
            setDeviceInfo(deviceInfo)
            if (ref.current && imgRef.current) {
                const canvas = ref.current;
                const image = imgRef.current;
                resetDevice(deviceInfo)
                return initClipCanvasEvent(canvas, containerRef.current!, image, (payload) => {
                    setResult(payload)
                })
            }
        })
    }, [deviceId])

    return <div ref={containerRef} style={{ overflow: "auto", height: "600px" }}>
        <div className="flex flex-row mb-1" style={{ display: result ? 'flex' : 'none' }}>
            <input className="p-1 flex-1 m-1 border-none" value={fileName} placeholder="请输入文件名" onChange={e => {
                setFilename(e.target.value)
            }} />
            <div className="p-1 m-1 text-blue-500 cursor-pointer" onClick={e => {
                if (result) {
                    onSuccess({...result, fileName: fileName})
                    resetDevice();
                    setResult(null)
                }
            }} >保存截图</div>
            <div className="p-1 m-1 text-red-500 cursor-pointer" onClick={e => {
                resetDevice();
                setResult(null)
            }} >重新截图</div>
        </div>
        <img crossOrigin="anonymous" src={url} ref={imgRef} style={{ display: 'none' }} />
        <canvas ref={ref} className="m-1" style={{ backgroundColor: "#000" }}></canvas>
    </div>
}
