import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
export enum IHandlerStatus {
    starting = 1,
    started = 2,
    runing = 3,
    stoping = 4,
    stoped = 5,
    destoring = 6,
    destoried = 7,
    resuming = 8,
    resumed = 9,
}
const App: React.FC<{}> = ({ }) => {
    const [deviceId, setDeviceId] = useState((window as any).deviceId);
    const [tasks, setTasks] = useState<any[]>([])
    const loadTasks = async () => {
        const res = await axios.post(`http://43.240.223.138:3001/rpc/v1/${deviceId}/taskAll`, {}).then(res => res.data)
        if (res.success) {
            setTasks(res.data)
            console.log(res.data)
        }
    }
    const getTaskStatus = (status: number) => {
        switch (status) {
            case IHandlerStatus.starting:
                return `正在启动`
            case IHandlerStatus.started:
                return `已启动`
            case IHandlerStatus.runing:
                return `运行中`
            case IHandlerStatus.stoping:
                return `停止中`
            case IHandlerStatus.stoped:
                return `已停止`
            case IHandlerStatus.destoring:
                return `销毁中`
            case IHandlerStatus.destoried:
                return `已销毁`
            case IHandlerStatus.resuming:
                return `恢复中`
            case IHandlerStatus.resumed:
                return `已恢复`
            default:
                return '未知'
        }
    }

    const getTaskTitle = (name: string) => {
        switch (name) {
            case 'setVsCodeId':
                return `日志同步`
            case "runCode":
                return `执行代码`
            case "runScript":
                return `执行文件`
            default:
                return `未知`
        }
    }
    useEffect(() => {
        if (!deviceId) return;
        loadTasks()
    }, [deviceId])
    return <div className="p-4">
        <div className="flex flex-row">
            <div className="flex-1"></div>
            <div className='p-1 text-blue-500 cursor-pointer' onClick={e => {
                loadTasks()
            }}>刷新</div>
        </div>
        <ul className='p-1'>
            {tasks.map(task => {
                return <li key={task.id}>
                    <div className='flex flex-row'>
                        <div className="flex flex-col m-1 p-2 border-1 border-blue-100">
                            <div className='p-1'>任务ID：{task.id}</div>
                            <div className='p-1'>任务名：{getTaskTitle(task.name)}</div>
                            <div className='p-1'>状态：{getTaskStatus(task.status)}</div>
                        </div>
                        <div className="flex-1"></div>
                        <div className='flex flex-row p-1 items-center'>
                            <span className='flex-1 mr-1 p-1 cursor-pointer'>暂停</span>
                            <span className='flex-1 p-1 text-red-300 cursor-pointer'>销毁</span>
                        </div>
                    </div>
                </li>
            })}
        </ul>
    </div>
}
const root = createRoot(document.getElementById('root')!)
root.render(<App />)