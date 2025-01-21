import { IHandler } from "./api";
import { useInjector } from "./factory";
import { Console } from "./tokens";
import { WebSocket } from "./ws";

export abstract class CoreHandler extends IHandler {
    thread: any;
    response(msg: any = {}, type?: string) {
        const ws = useInjector().get(WebSocket);
        ws.response(this.payload, msg, type);
        if (this.category === `async`) {
            this.__stop();
        }
        return;
    }

    recyle(img: any) {
        if (img) {
            img.recycle();
            img = null;
        }
    }

    get data() {
        return this.payload.data;
    }

    log(...args: any[]) {
        const console = useInjector().get(Console);
        console.log(...args);
    }

    on(
        type: "start" | "stop" | "resume" | "destory" | "error" | "finish",
        fn: Function
    ): void {
        this.events[type] = fn;
    }

    until(timeout: number = 0): void {
        if (this.thread) {
            this.thread.join(timeout);
        }
    }
}
