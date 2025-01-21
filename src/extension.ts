/**
 * 姓名: 杨明明
 * 微信：imeepos
 * 介绍：白虎vscode插件
 */

import * as vscode from 'vscode';
import { platformV1 } from './core/v1';
import { WebSocket } from './core/ws';
import { VSCODE_EXTENSION_CONTEXT, VSCODE_TREE_DATA_PROVIDER, VSCODE_WEB_VIEW } from './core/vscode';
import { useToken } from './core/useToken';
import { CONNECT_DEVICE_ID, DEVICE_ID } from './core/tokens';
/**
 * 当插件第一次激活时运行
 */
console.log(`vscode extension start`);

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "baihu" is now active!');

	const injector = platformV1([
		{ provide: VSCODE_EXTENSION_CONTEXT, useValue: context }
	]);
	/**
	 * 注册一个命令
	 */
	const disposable = vscode.commands.registerCommand('baihu.helloWorld', () => {
		vscode.window.showInputBox({
			prompt: "请输入设备ID",
			placeHolder: "输入设备的唯一标识符"
		}).then(d => {
			if (d) {
				const deviceId = useToken(CONNECT_DEVICE_ID)
				deviceId.put(d);
				const ws = injector.get(WebSocket)
				ws.start()
			}
		})
	});
	/**
	 * 注册一个菜单
	 */
	vscode.window.registerTreeDataProvider('baihu', injector.get(VSCODE_TREE_DATA_PROVIDER))
	const webViews = injector.get(VSCODE_WEB_VIEW)
	webViews.map(it => {
		const disposable = vscode.commands.registerCommand(`baihu.${it.viewType}`, (...args: any[]) => {
			const panel = vscode.window.createWebviewPanel(it.viewType, it.title, it.showOptions, it.options)
			it.setContent(panel);
			panel.webview.onDidReceiveMessage(msg => {
				it.onDidReceiveMessage(msg, ...args)
			}, undefined, context.subscriptions)
		})
		context.subscriptions.push(disposable);
	});

	context.subscriptions.push(disposable);
}

/**
 * 插件卸载时执行
 */
export function deactivate() {
	console.log(`白虎插件结束运行`);
}
