import { ApiPayload, IHandler, IHandlerFactory } from "../api";
import { CoreHandler } from "../coreHandler";
import { writeFileSync } from "fs";
import { join } from "path";
import { useInjector } from "../factory";
import { ROOT } from "../tokens";
import { Uri, workspace } from "vscode";
export class PutLogHandler extends CoreHandler {
    constructor(private readonly __payload: ApiPayload) {
        super();
    }
    get payload(): ApiPayload {
        return this.__payload;
    }
    start(): Promise<void> | void {
        try {
            const content = this.payload.data?.content
            if (content) {
                const workspaceFolders = workspace.workspaceFolders;
                if (workspaceFolders && workspaceFolders.length > 0) {
                    const workspaceFolder = workspaceFolders[0];
                    if (workspaceFolder) {
                        const root = workspaceFolder.uri
                        workspace.fs.writeFile(Uri.joinPath(root, 'log.txt'), Buffer.from(content))
                    }
                }
            }
            this.response({ success: true })
        } catch (e) {
            this.response({ success: false, message: `${(e as any).toString()}` })
        }
    }
    stop(): Promise<void> | void {
    }
    resume(): Promise<void> | void {
    }
    destory(): Promise<void> | void {
    }
    error(e: Error): Promise<void> | void {
    }
}
export class PutLogFactory extends IHandlerFactory {
    action: string = `putLog`
    create(payload: ApiPayload): IHandler {
        return new PutLogHandler(payload)
    }
}