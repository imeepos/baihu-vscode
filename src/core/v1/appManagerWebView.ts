import { ViewColumn, WebviewPanelOptions, WebviewOptions, WebviewPanel } from "vscode";
import { VscodeWebView } from "../vscode";
import { useToken } from "../useToken";
import { CONNECT_DEVICE_ID, DEVICE_ID } from "../tokens";


export class AppManagerWebView extends VscodeWebView {
    get viewType(): string {
        return `AppManagerWebView`
    }
    get title(): string {
        return `白虎开发助手-应用管理`
    }
    get showOptions(): ViewColumn | { readonly viewColumn: ViewColumn; readonly preserveFocus?: boolean; } {
        return ViewColumn.Two;
    }
    get options(): WebviewPanelOptions & WebviewOptions {
        return {}
    }
    async setContent(panel: WebviewPanel) {
        const deviceId = useToken(CONNECT_DEVICE_ID, "cce281c8f5dfa637");
        console.log(`device id is `, deviceId.get())
        panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
</head>
<body>
    <h1>Hello, VSCode!</h1>
    <button id="myButton">Click Me</button>

    <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('myButton').addEventListener('click', () => {
            vscode.postMessage({
                command: 'alert',
                text: 'Button was clicked!'
            });
        });
    </script>
</body>
</html>`
    }
    onDidReceiveMessage(msg: any): void {
        console.log(msg)
    }
}