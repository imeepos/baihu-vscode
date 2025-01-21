import { ViewColumn, WebviewPanelOptions, WebviewOptions, Uri, WebviewPanel } from "vscode";
import { VSCODE_EXTENSION_CONTEXT, VscodeWebView } from "../vscode";
import { useInjector } from "../factory";
import { join } from "path";
import axios from 'axios'
import { useToken } from "../useToken";
import { CONNECT_DEVICE_ID, DEVICE_ID, Storage } from "../tokens";
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
            localResourceRoots: [
                Uri.parse(join(ctx.extensionPath, 'public/docs/'))
            ]
        }
    }
    async setContent(panel: WebviewPanel) {
        const deviceId = useToken(CONNECT_DEVICE_ID, "cce281c8f5dfa637");
        console.log(`device id is`, deviceId.get())
        const html = await axios.get(`http://43.240.223.138:3001/rpc/v1/25d2627a4ba6429b/getHtml`).then(res => res.data)
        panel.webview.html = html;
    }
    onDidReceiveMessage(msg: any): void {
        console.log(msg)
    }
}