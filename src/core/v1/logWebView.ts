import { ViewColumn, WebviewPanelOptions, WebviewOptions, Uri, WebviewPanel } from "vscode";
import { VSCODE_EXTENSION_CONTEXT, VscodeWebView } from "../vscode";
import { useInjector } from "../factory";
import { join } from "path";
import axios from 'axios'
import { useToken } from "../useToken";
import { CONNECT_DEVICE_ID, DEVICE_ID, Storage } from "../tokens";
import { readFileSync } from "fs";
export class LogWebView extends VscodeWebView {
    get viewType(): string {
        return `LogWebView`
    }
    get title(): string {
        return `白虎开发助手-运行日志`
    }
    get showOptions(): ViewColumn | { readonly viewColumn: ViewColumn; readonly preserveFocus?: boolean; } {
        return ViewColumn.Two;
    }
    get options(): WebviewPanelOptions & WebviewOptions {
        const ctx = useInjector().get(VSCODE_EXTENSION_CONTEXT);
        return {
            enableScripts: true,
            localResourceRoots: []
        }
    }
    async setContent(panel: WebviewPanel) {
        const ctx = useInjector().get(VSCODE_EXTENSION_CONTEXT);
        const jsUrl = readFileSync(
            join(ctx.extensionPath, 'build', 'log.js'), 'utf-8'
        );
        const cssUrl = readFileSync(
            join(ctx.extensionPath, 'build', 'style.css'), 'utf-8'
        );
        panel.webview.html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>${this.title}</title>
                            <style>${cssUrl}</style>
                        </head>
                        <body>
                            <div id="root"></div>
                            <script>${jsUrl}</script>
                        </body>
                        </html>`
    }
    onDidReceiveMessage(msg: any): void {
        console.log(msg)
    }
}