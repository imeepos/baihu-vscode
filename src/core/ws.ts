import { ApiPayload, createHandler, IHandler, startHandler } from "./api";

export abstract class WebSocket {
    id: number = Date.now();
    currenRuning: IHandler | null = null;
    abstract send(text: string): boolean;
    abstract close(code: number, reason: string): boolean;
    abstract start(): void;
    abstract destory(): void;
    abstract toBuffer(str: string): any;
    _onMessage(payload: ApiPayload) {
        try {
            const { action } = payload;
            const handler = createHandler(action, payload);
            if (handler) {
                startHandler(handler);
            } else {
                this.response(payload, { success: false, message: "404 not found" });
            }
        } catch (e) {
            this.response(payload, {
                success: false,
                error: (e as Error).toString(),
                message: "error",
            });
        }
    }
    response(payload: ApiPayload, msg: any = {}, type?: string) {
        if (!payload.replyTo) {
            return;
        }
        if (!payload.correlationId) {
            return;
        }
        if (!type) {
            this.send(
                JSON.stringify({
                    path: "request_ack",
                    replyTo: payload.replyTo,
                    data: this.toBuffer(JSON.stringify(msg)),
                    correlationId: payload.correlationId,
                    headers: {
                        "content-type": "application/json; charset=utf-8",
                    },
                })
            );
            return;
        }
        if (type.startsWith("text")) {
            this.send(
                JSON.stringify({
                    path: "request_ack",
                    replyTo: payload.replyTo,
                    data: this.toBuffer(msg),
                    correlationId: payload.correlationId,
                    headers: {
                        "content-type": type,
                    },
                })
            );
            return;
        }
        this.send(
            JSON.stringify({
                path: "request_ack",
                replyTo: payload.replyTo,
                data: msg,
                correlationId: payload.correlationId,
                headers: {
                    "content-type": type,
                },
            })
        );
        return;
    }
}
