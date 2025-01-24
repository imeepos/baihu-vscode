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
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
    const [tab, setTab] = useState<number>(0)
    const loadTasks = async () => {
        const res = await axios.post(`http://43.240.223.138:3001/rpc/v1/${deviceId}/taskAll`, {}).then(res => res.data)
        if (res.success) {
            setTasks(res.data)
        } else {

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

    const getTaskCategory = (category: string) => {
        switch (category) {
            case "sync":
                return `同步`
            case "async":
                return `异步`
            case "task":
                return `任务`
            default:
                return `未知`
        }
    }

    const getTaskStopButton = (task: any) => {
        if ([IHandlerStatus.started, IHandlerStatus.runing, IHandlerStatus.resumed].includes(task.status)) {
            return <span className='flex-1 mr-1 p-1 cursor-pointer text-center' onClick={() => stop(task.id)}>暂停</span>
        }
    }

    const getTaskResumeButton = (task: any) => {
        if ([IHandlerStatus.stoped].includes(task.status)) {
            return <span className='flex-1 mr-1 p-1 cursor-pointer text-center' onClick={() => resume(task.id)}>继续</span>
        }
    }

    const getTaskDestoryButton = (task: any) => {
        if ([IHandlerStatus.stoped, IHandlerStatus.started, IHandlerStatus.runing, IHandlerStatus.resumed].includes(task.status)) {
            return <span className='flex-1 p-1 text-red-200 cursor-pointer text-center' onClick={() => desotry(task.id)}>销毁</span>
        }
    }

    const getTaskDetailButton = (task: any) => {
        return <span className='flex-1 p-1 cursor-pointer text-center' onClick={() => detail(task)}>详情</span>
    }

    const getTaskCloseButton = (task: any)=>{
        return <span className='flex-1 p-1 cursor-pointer text-center' onClick={() => setShowDetail(false)}>关闭</span>
    }


    const [showDetail, setShowDetail] = useState<boolean>(false)
    const [currentTask, setCurrentTask] = useState<any>()
    const detail = (task: any) => {
        setShowDetail(true);
        setCurrentTask(task);
    }

    const desotry = async (id: string) => {
        const res = await axios.post(`http://43.240.223.138:3001/rpc/v1/${deviceId}/destory`, { id }).then(res => res.data)
        if (res.success) {
            await loadTasks()
        } else {

        }
    }

    const stop = async (id: string) => {
        const res = await axios.post(`http://43.240.223.138:3001/rpc/v1/${deviceId}/stop`, { id }).then(res => res.data)
        if (res.success) {
            await loadTasks()
        } else {

        }
    }

    const resume = async (id: string) => {
        const res = await axios.post(`http://43.240.223.138:3001/rpc/v1/${deviceId}/resume`, { id }).then(res => res.data)
        if (res.success) {
            await loadTasks()
        } else {

        }
    }

    const renderTasks = () => {
        if (tasks && tasks.length > 0) {
            return <ul className='p-1 flex flex-col'>
                {tasks.map(task => {
                    return <li key={task.id} className='flex-1 m-1'>
                        <div className='flex flex-row bg-blue-600 text-white p-4 rounded-lg'>
                            <div className="flex flex-col m-1 p-2 border-1">
                                <div className='p-1'>任务ID：{task.id}</div>
                                <div className='p-1'>任务名：{getTaskTitle(task.name)}</div>
                                <div className='p-1'>状态：{getTaskStatus(task.status)}</div>
                                <div className="p-1">类型：{getTaskCategory(task.category)}</div>
                            </div>
                            <div className="flex-1"></div>
                            <div className='flex flex-row p-1 items-center'>
                                {getTaskDetailButton(task)}
                                {getTaskResumeButton(task)}
                                {getTaskStopButton(task)}
                                {getTaskDestoryButton(task)}
                            </div>
                        </div>
                    </li>
                })}
            </ul>
        }
        return <div className='flex flex-row items-center justify-center text-center p-2 text-gray-400 mt-5'>暂无任务</div>
    }

    function renderDetail() {
        return <div className='p-4'>
            <div className="flex flex-row">
                <div className="flex-1"></div>
                <div className='p-1 text-blue-500 cursor-pointer' onClick={e => {
                    setShowDetail(false)
                }}>关闭</div>
            </div>
            <div className="flex flex-col">
                <div className='flex flex-col bg-blue-600 text-white p-4 rounded-lg'>
                    <div className="flex flex-col m-1 p-2 border-1">
                        <div className='p-1'>任务ID：{currentTask.id}</div>
                        <div className='p-1'>任务名：{getTaskTitle(currentTask.name)}</div>
                        <div className='p-1'>状态：{getTaskStatus(currentTask.status)}</div>
                        <div className="p-1">类型：{getTaskCategory(currentTask.category)}</div>
                        <div className="p-1">参数: {JSON.stringify(currentTask.payload.data, null, 2)}</div>
                    </div>
                    <div className='flex flex-row p-1 items-center'>
                        {getTaskCloseButton(currentTask)}
                        {getTaskResumeButton(currentTask)}
                        {getTaskStopButton(currentTask)}
                        {getTaskDestoryButton(currentTask)}
                    </div>
                </div>
            </div>
        </div>
    }

    function renderTaskList() {
        return <div className="p-4">
            <div className="flex flex-row">
                <div className="flex-1"></div>
                <div className='p-1 text-blue-500 cursor-pointer' onClick={e => {
                    loadTasks()
                }}>刷新</div>
            </div>
            <div className="flex">
                <div className="flex-1 p-1 cursor-pointer" onClick={e => setTab(0)} style={{ opacity: tab === 0 ? 1 : .8 }}>全部</div>
                <div className="flex-1 p-1 cursor-pointer" onClick={e => setTab(1)} style={{ opacity: tab === 1 ? 1 : .8 }}>运行中</div>
                <div className="flex-1 p-1 cursor-pointer" onClick={e => setTab(2)} style={{ opacity: tab === 2 ? 1 : .8 }}>已暂停</div>
            </div>
            {renderTasks()}
        </div>
    }
    useEffect(() => {
        if (!deviceId) return;
        loadTasks()
    }, [deviceId])
    return showDetail ? renderDetail() : renderTaskList();
}
const root = createRoot(document.getElementById('root')!)
root.render(<App />)