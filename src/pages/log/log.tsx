import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const getLogUrl = (did: string) => {
    return `http://43.240.223.138:3001/rpc/v1/${did}/getLog`
}


const clearLogUrl = (did: string) => {
    return `http://43.240.223.138:3001/rpc/v1/${did}/logClear`
}


const showLogUrl = (did: string) => {
    return `http://43.240.223.138:3001/rpc/v1/${did}/logShow`
}


const hideLogUrl = (did: string) => {
    return `http://43.240.223.138:3001/rpc/v1/${did}/logHide`
}


const setVsCodeIdUrl = (did: string) => {
    return `http://43.240.223.138:3001/rpc/v1/${did}/setVsCodeId`
}
const App = () => {
    const [deviceId, setDeviceId] = useState((window as any).deviceId)
    const [logs, setLogs] = useState<string[]>([])
    const getLog = async () => {
        return axios.post(getLogUrl(deviceId), {}).then(res => res.data).then(res => {
            if (res.success) {
                const text: string = res.data;
                setLogs(text.split('\n'));
            } else {
                setLogs([])
            }
        })
    }

    const clearLog = async () => {
        return axios.post(clearLogUrl(deviceId), {}).then(res => {
            return getLog()
        })
    }

    const showLog = async () => {
        return axios.post(showLogUrl(deviceId), {})
    }

    const hideLog = async () => {
        return axios.post(hideLogUrl(deviceId), {})
    }

    const setVsCodeId = async () => {
        return axios.post(setVsCodeIdUrl(deviceId), {
            uuid: (window as any).vscodeId
        })
    }

    const refreshLog = async () => {
        return await getLog();
    }

    useEffect(() => {
        refreshLog()
    }, [])
    return <div className="app">
        <div className='p-1 m-1'>
            {logs.map((log) => {
                return (
                    <div className="m-1 p-1" key={log}>
                        {log}
                    </div>
                );
            })}
        </div>
        <div className="fixed bottom-0 left-0 right-0" style={{ zIndex: 999 }}>
            <div className="flex flex-row justify-center items-center">
                <div className='p-1 m-1 bg-blue-500 text-white cursor-pointer' onClick={refreshLog}>
                    刷新日志
                </div>
                <div className='p-1 m-1 bg-blue-500 text-white cursor-pointer' onClick={clearLog}>
                    清空日志
                </div>
                <div className='p-1 m-1 bg-blue-500 text-white cursor-pointer' onClick={showLog}>
                    显示日志
                </div>
                <div className='p-1 m-1 bg-blue-500 text-white cursor-pointer' onClick={hideLog}>
                    隐藏日志
                </div>
                <div className='p-1 m-1 bg-blue-500 text-white cursor-pointer' onClick={setVsCodeId}>
                    日志同步
                </div>
            </div>
        </div>

    </div>
}
const root = createRoot(document.getElementById('root')!)
root.render(<App />)