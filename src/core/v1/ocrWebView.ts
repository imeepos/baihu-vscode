import { ViewColumn, WebviewPanelOptions, WebviewOptions, Uri, WebviewPanel } from "vscode";
import { VSCODE_EXTENSION_CONTEXT, VscodeWebView } from "../vscode";
import { useInjector } from "../factory";
import { join } from "path";
import { useToken } from "../useToken";
import { CONNECT_DEVICE_ID, DEVICE_ID, Storage } from "../tokens";
export class OcrWebView extends VscodeWebView {
    get viewType(): string {
        return `OcrWebView`
    }
    get title(): string {
        return `白虎开发助手-OCR分析`
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
        panel.webview.html = ``;
    }
    onDidReceiveMessage(msg: any): void {
        console.log(msg)
    }
}