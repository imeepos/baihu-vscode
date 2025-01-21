import { useInjector } from "./factory";
import { StringToken } from "./types";
export interface Payload {
    [key: string]: any;
}
export interface ApiPayload extends Payload {
    action: string;
    data: any;
}
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
export type IHandlerType =
    | "start"
    | "stop"
    | "resume"
    | "destory"
    | "error"
    | "finish";

export type IHandlerCategory = `sync` | `async` | "task";
let RUNING_HANDLER: IHandler[] = [];

export function getAllHandler() {
    return RUNING_HANDLER;
}
export abstract class IHandler {
    id: number = Date.now();
    category: IHandlerCategory = `task`;
    events: { [key: string]: Function } = {};
    status: IHandlerStatus = IHandlerStatus.destoried;
    abstract get payload(): ApiPayload;
    abstract start(): Promise<void> | void;
    __stop() {
        return this.stop();
    }
    abstract stop(): Promise<void> | void;
    abstract resume(): Promise<void> | void;
    abstract destory(): Promise<void> | void;
    abstract error(e: Error): Promise<void> | void;
    abstract on(type: IHandlerType, fn: Function): void;
    abstract until(): void;
}

export abstract class IHandlerFactory {
    action: string = ``;
    abstract create(payload: ApiPayload): IHandler;
}

export const ON_WS_MESSAGE: StringToken<IHandlerFactory[]> = `ON_WS_MESSAGE`;
export function createHandler(action: string, payload: ApiPayload) {
    const factories = useInjector().get(ON_WS_MESSAGE);
    const factory = factories.find((it) => it.action === action);
    if (factory) return factory.create(payload);
}

export function startHandler(handler: IHandler) {
    try {
        // 同步
        if (handler.category === "sync") {
            handler.start();
            return true;
        }
        // 异步 可以多个同时运行
        if (handler.category === "async") {
            handler.start();
            return true;
        }
        // 脚本任务
        if (RUNING_HANDLER.length > 0) {
            const toStopHandler = RUNING_HANDLER[RUNING_HANDLER.length - 1];
            stopHandler(toStopHandler);
        }
        RUNING_HANDLER.push(handler);
        handler.status = IHandlerStatus.starting;
        handler.start();
        handler.events.start && handler.events.start(true);
        handler.status = IHandlerStatus.started;
        return true;
    } catch (e) {
        handler.error(e as Error);
        return false;
    }
}

export function getHandlerById(id: number) {
    return RUNING_HANDLER.find((it) => it.id === id);
}

export function stopHandler(handler: IHandler) {
    try {
        handler.status = IHandlerStatus.stoping;
        handler.__stop();
        handler.events.stop && handler.events.stop(true);
        handler.status = IHandlerStatus.stoped;
        return true;
    } catch (e) {
        handler.error(e as Error);
        return false;
    }
}

export function resumeHandler(handler: IHandler) {
    try {
        if (RUNING_HANDLER.length > 0) {
            const toStopHandler = RUNING_HANDLER[RUNING_HANDLER.length - 1];
            stopHandler(toStopHandler);
        }
        handler.status = IHandlerStatus.resuming;
        handler.resume();
        handler.events.resume && handler.events.resume(true);
        handler.status = IHandlerStatus.resumed;
        RUNING_HANDLER = [
            ...RUNING_HANDLER.filter((it) => it !== handler),
            handler,
        ];
        return true;
    } catch (e) {
        handler.error(e as Error);
        return false;
    }
}

export function destoryHandler(handler: IHandler) {
    try {
        handler.status = IHandlerStatus.destoring;
        handler.destory();
        handler.events.destory && handler.events.destory(true);
        handler.status = IHandlerStatus.destoried;
        // 移除
        RUNING_HANDLER = RUNING_HANDLER.filter((it) => it !== handler);
        return true;
    } catch (e) {
        handler.error(e as Error);
        return false;
    }
}

export function destoryAllHandler() {
    for (; ;) {
        let handler = RUNING_HANDLER.pop();
        if (handler) {
            destoryHandler(handler);
            continue;
        }
        break;
    }
}
