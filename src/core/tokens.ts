import { Injector, StringToken } from "./types";
import { DebugConsole, Terminal, debug } from 'vscode'
export abstract class Storage {
    abstract get<T>(key: StringToken<T>): T | undefined;
    abstract put<T>(key: StringToken<T>, val: T): void;
}
export interface IStorageItem<T> {
    get(def?: T): T;
    put(val: T): void;
}
export const RUN_STEP: StringToken<number> = `RUN_STEP`;
export const RUN_TEST_STEP: StringToken<number> = `RUN_TEST_STEP`;
export const RUN_DAY_STEP: StringToken<number> = `RUN_DAY_STEP`;
export const DEV_DEBUGGER: StringToken<boolean> = `DEV_DEBUGGER`;
export type OcrType = `hraps` | `tomato` | `mlkit`;
export const OCR_TYPE_TOKEN: StringToken<OcrType> = `OCR_TYPE_TOKEN`;
export const FORCE_STOP: StringToken<boolean> = `FORCE_STOP`;
export const SET_UP_TOKEN: StringToken<ISetUp[]> = `SET_UP_TOKEN`;
export const ON_DESTORY_TOKEN: StringToken<ISetUp[]> = `ON_DESTORY_TOKEN`;
export const DEVICE_ID: StringToken<string> = `DEVICE_ID`;
export const CONNECT_DEVICE_ID: StringToken<string> = `CONNECT_DEVICE_ID`;
export const WEB_SOCKET_URL: StringToken<string> = `WEB_SOCKET_URL`;
export const ROOT: StringToken<string> = `ROOT`


export const VSCODE_TERMINAL: StringToken<Terminal> = `VSCODE_TERMINAL`
export const VSCODE_DEBUG_CONSOLE: StringToken<DebugConsole> = `VSCODE_TERMINAL`

export abstract class Auto {
    root: any;
    abstract waitFor(): void;
}

export abstract class App {
    abstract openUrl(url: string): any;
}

export interface ISetUp {
    (injector: Injector): void;
}

export abstract class AstHandler {
    classname: string = ``;
    abstract handler(ast: any, ctx: any): any;
}
export const AST_HANDLER: StringToken<AstHandler[]> = `AST_HANDLER`;
export abstract class PageHandler {
    abstract handler(ctx: any): void;
}
export const PAGE_HANDLER: StringToken<PageHandler[]> = `PAGE_HANDLER`;

export abstract class PageToHandler {
    from: string = ``;
    abstract handler(to: string, ctx: any): void;
}
export const PAGE_TO_HANDLER: StringToken<PageToHandler[]> = `PAGE_TO_HANDLER`;

export abstract class Console {
    abstract clear(): any;
    abstract show(): any;
    abstract hide(): any;
    abstract log(...args: any[]): any;
    abstract info(...args: any[]): any;
    abstract error(...args: any[]): any;
}

export abstract class Events {
    abstract on(ev: string, fn: Function): void;
}

export abstract class Visitor<Ast = any, Context = any> {
    abstract visit(ast: Ast, ctx: Context): any;
    abstract root(ctx?: any): any;
    toJson(ctx: any): any {
        if (!ctx) return;
        return JSON.stringify(ctx, null, 2);
    }
}
/**
 * xml无障碍节点扫描器
 */
export abstract class AstVisitor extends Visitor { }