import { ApiPayload, IHandler, IHandlerFactory } from "../api";
import { CoreHandler } from "../coreHandler";
import { writeFileSync } from "fs";
import { join } from "path";
import { useInjector } from "../factory";
import { ROOT } from "../tokens";
export class PutLogHandler extends CoreHandler {
    constructor(private readonly __payload: ApiPayload) {
        super();
    }
    get payload(): ApiPayload {
        return this.__payload;
    }
    start(): Promise<void> | void {
        const content = this.payload.data?.content
        if (content) {
            const root = useInjector().get(ROOT)
            const logFile = join(root, `log.txt`)
            writeFileSync(logFile, content)
        }
        this.response({ success: true })
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