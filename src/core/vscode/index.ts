import { StringToken } from "../types";
import { ExtensionContext, TreeDataProvider, ViewColumn, WebviewOptions, WebviewPanel, WebviewPanelOptions } from 'vscode'
export const VSCODE_EXTENSION_CONTEXT: StringToken<ExtensionContext> = `VSCODE_TOKEN`
export const VSCODE_TREE_DATA_PROVIDER: StringToken<TreeDataProvider<any>> = `VSCODE_TREE_DATA_PROVIDER`

export abstract class VscodeWebView { 
    abstract get viewType(): string;
    abstract get title(): string;
    abstract get showOptions(): ViewColumn | {
        readonly viewColumn: ViewColumn;
        readonly preserveFocus?: boolean;
    };
    abstract get options(): WebviewPanelOptions & WebviewOptions;
    abstract setContent(panel: WebviewPanel): Promise<void>;
    abstract onDidReceiveMessage(msg: any, ...args: any[]): void;
}
export const VSCODE_WEB_VIEW: StringToken<VscodeWebView[]> = `VSCODE_WEB_VIEW`