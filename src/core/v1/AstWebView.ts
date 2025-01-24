import { ViewColumn, WebviewPanelOptions, WebviewOptions, Uri, WebviewPanel, window, env } from "vscode";
import { VSCODE_EXTENSION_CONTEXT, VscodeWebView } from "../vscode";
import { useInjector } from "../factory";
import { join } from "path";
import axios from 'axios'
import { useToken } from "../useToken";
import { CONNECT_DEVICE_ID, DEVICE_ID, Storage } from "../tokens";
import { readFileSync } from "fs";
export class AstWebView extends VscodeWebView {
    get viewType(): string {
        return `AstWebView`
    }
    get title(): string {
        return `白虎开发助手-界面分析`
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
            join(ctx.extensionPath, 'build', 'ast/ast.js'), 'utf-8'
        );
        const cssUrl = readFileSync(
            join(ctx.extensionPath, 'build', 'style.css'), 'utf-8'
        );
        const deviceId = useToken(CONNECT_DEVICE_ID)
        panel.webview.html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${this.title}</title>
            <style>${cssUrl}</style>
            <script>window.deviceId="${deviceId.get()}"</script>
        </head>
        <body>
            <div id="root"></div>
            <script>${jsUrl}</script>
        </body>
        </html>`
    }
    onDidReceiveMessage(msg: any): void {
        if (msg) {
            const data = JSON.parse(msg)
            const { action, payload } = data;
            if (action === 'ast') {
                let code = `selector().className("${payload.className}")`
                if (payload.clickable) {
                    code += ".clickable(true)"
                }
                if (payload.text) {
                    code += `.text("${payload.text}")`
                }
                if (payload.desc) {
                    code += `.desc("${payload.desc}")`
                }
                if (payload.id) {
                    code += `.id("${payload.id}")`
                }
                code += `.findOne(3000);\n`
                const editor = window.activeTextEditor
                if (editor) {
                    editor.edit(editorBuilder => {
                        editorBuilder.insert(editor.selection.active, code)
                    })
                } else {
                    env.clipboard.writeText(code)
                    window.showInformationMessage(`已复制到剪切板`)
                }
            }
            if (action === `error`) {
                console.log(payload)
            }
        }
    }
}