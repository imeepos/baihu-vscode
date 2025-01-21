import { Injector } from "./types";
import {
    ROOT,
    SET_UP_TOKEN,
    Storage,
} from "./tokens";
import { createFactory } from "./factory";
import { WebSocket } from "./ws";
import { WebSocketVscode } from "./v1/websocket";
import { StorageVscode } from "./v1/storage";
import { VSCODE_EXTENSION_CONTEXT, VSCODE_TREE_DATA_PROVIDER, VSCODE_WEB_VIEW } from "./vscode";
import { BaihuTreeDataProvider } from "./v1/treeDataProvider";
import { AppManagerWebView } from "./v1/appManagerWebView";
import { DocsWebView } from "./v1/docsWebView";
import { AstWebView } from "./v1/AstWebView";
import { LogWebView } from "./v1/logWebView";
import { ScriptWebView } from "./v1/scriptWebView";
import { OcrWebView } from "./v1/ocrWebView";
import { TakeScreenWebView } from "./v1/takeScreenWebView";

export const platformV1 = createFactory([
    {
        provide: Storage,
        useClass: StorageVscode
    },
    {
        provide: WebSocket,
        useClass: WebSocketVscode
    },
    {
        provide: VSCODE_WEB_VIEW,
        multi: true,
        useClass: AppManagerWebView
    },
    {
        provide: VSCODE_WEB_VIEW,
        multi: true,
        useClass: DocsWebView
    },
    {
        provide: VSCODE_WEB_VIEW,
        multi: true,
        useClass: AstWebView
    },
    {
        provide: VSCODE_WEB_VIEW,
        multi: true,
        useClass: LogWebView
    },
    {
        provide: VSCODE_WEB_VIEW,
        multi: true,
        useClass: ScriptWebView
    },
    {
        provide: VSCODE_WEB_VIEW,
        multi: true,
        useClass: OcrWebView
    },
    {
        provide: VSCODE_WEB_VIEW,
        multi: true,
        useClass: TakeScreenWebView
    },
    {
        provide: ROOT,
        useFactory: (injector: Injector)=>{
            return injector.get(VSCODE_EXTENSION_CONTEXT).extensionPath
        }
    },
    {
        provide: VSCODE_TREE_DATA_PROVIDER, useClass: BaihuTreeDataProvider
    },
    {
        provide: SET_UP_TOKEN,
        useValue: (injector: Injector) => {
            console.log(`插件启动成功`)
        },
        multi: true,
    },
]);
