import { ViewColumn, WebviewPanelOptions, WebviewOptions, env, WebviewPanel, window, workspace, Uri } from "vscode";
import { VSCODE_EXTENSION_CONTEXT, VscodeWebView } from "../vscode";
import { useInjector } from "../factory";
import { join } from "path";
import { useToken } from "../useToken";
import { CONNECT_DEVICE_ID } from "../tokens";
import { readFileSync } from "fs";
export class TakeScreenWebView extends VscodeWebView {
    get viewType(): string {
        return `TakeScreenWebView`
    }
    get title(): string {
        return `白虎开发助手-截屏分析`
    }
    get showOptions(): ViewColumn | { readonly viewColumn: ViewColumn; readonly preserveFocus?: boolean; } {
        return ViewColumn.One;
    }
    get options(): WebviewPanelOptions & WebviewOptions {
        return {
            enableScripts: true,
            localResourceRoots: []
        }
    }
    async setContent(panel: WebviewPanel) {
        const ctx = useInjector().get(VSCODE_EXTENSION_CONTEXT);
        const jsUrl = readFileSync(
            join(ctx.extensionPath, 'build', 'takeScreen/takeScreen.js'), 'utf-8'
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
    async onDidReceiveMessage(data: any) {
        try {
            const workspaceFolders = workspace.workspaceFolders;
            if (workspaceFolders && workspaceFolders.length > 0) {
                const workspaceFolder = workspaceFolders[0];
                if (workspaceFolder) {
                    const root = workspaceFolder.uri;
                    try {
                        await workspace.fs.stat(Uri.joinPath(root, 'images'))
                    } catch (e) {
                        workspace.fs.createDirectory(Uri.joinPath(root, 'images'))
                    }
                    if (data.fileName) {
                        workspace.fs.writeFile(Uri.joinPath(root, `images/${data.fileName}.png`), data.data)
                    } else {
                        workspace.fs.writeFile(Uri.joinPath(root, `images/${Date.now()}_${data.x}_${data.y}_${data.x1}_${data.y1}.png`), data.data)
                    }
                    window.showInformationMessage(`截图已保存至：images/${Date.now()}_${data.x}_${data.y}_${data.x1}_${data.y1}.png`)
                }
            }
        } catch (e) {
            console.error(e)
        }
    }
}