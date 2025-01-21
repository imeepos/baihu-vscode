import { OnDestory, OnInit } from "../types";
import { CONNECT_DEVICE_ID, DEVICE_ID, WEB_SOCKET_URL } from "../tokens";
import { WebSocket } from "../ws";
import { useToken } from "../useToken";
import { WebSocket as WsWebSocket } from 'ws'
import { useInjector } from "../factory";
import { VSCODE_EXTENSION_CONTEXT } from "../vscode";
import { randomUUID } from "crypto";
import axios from "axios";
export class WebSocketVscode extends WebSocket implements OnInit, OnDestory {
    private ws: WsWebSocket | null = null;
    private isDestoried: boolean = false;
    static instance: WebSocket;
    private heartBeater: any;
    private timeouter: any;
    private timeout: number = 1000 * 5;
    private lastTime: number = Date.now();
    toBuffer(html: string) {
        return html
    }
    static create() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new WebSocketVscode();
        return this.instance;
    }
    constructor() {
        super();
        this.id = Date.now();
    }
    send(text: string): boolean {
        if (!this.ws) return false;
        this.ws.send(text);
        return true;
    }
    close(code: number, reason: string): boolean {
        if (!this.ws) return false;
        this.ws.close && this.ws.close(code, reason);
        return true;
    }

    start(): void {
        this.onInit();
        const deviceId = useToken(DEVICE_ID);
        let uuid = deviceId.get()
        if (!uuid) {
            uuid = randomUUID()
            deviceId.put(uuid);
        }
        const connectDeviceId = useToken(CONNECT_DEVICE_ID)
        axios.post(`http://43.240.223.138:3001/rpc/v1/${connectDeviceId.get()}/setVsCodeId`, {
            uuid: uuid
        }, {
            timeout: 3000
        }).then(res => res.data).then(res => {
            console.log(`from ${connectDeviceId.get()} put ${uuid}`, res)
        }).catch(e => {
            console.log(`日志同步开始失败`)
        });
    }

    onInit() {
        const deviceId = useToken(DEVICE_ID);
        let uuid = deviceId.get()
        if (!uuid) {
            uuid = randomUUID()
            deviceId.put(uuid);
        }
        const wsUrl = useToken(WEB_SOCKET_URL, `ws://43.240.223.138:3001/ws`);
        this.ws = new WsWebSocket(`${wsUrl.get()}?uuid=${uuid}&name=vscode`);
        this.ws.on('message', (data, isBinary) => {
            this.onMessage(data.toString('utf-8'), this.ws)
        })
        this.ws.on(`open`, async (res: any) => {
            this.onOpen(res);
        });
        this.ws.on('close', async (code: number, reason: string, ws: any) => {
            // 关闭
            if (this.isDestoried) {
                return;
            }
            this.onClosed();
        });
    }
    private onHeartBeat() {
        if (this.heartBeater) {
            clearInterval(this.heartBeater);
            this.heartBeater = null;
        }
        if (this.timeouter) {
            clearInterval(this.timeouter);
            this.timeouter = null;
        }
        this.heartBeater = setInterval(() => {
            this.send(JSON.stringify({ type: "ping" }));
        }, 1000);
        this.timeouter = setInterval(() => {
            const time = Date.now() - this.lastTime;
            if (time > this.timeout) {
                if (this.ws) {
                    this.ws.close(1000);
                }
            }
        }, this.timeout);
    }
    onOpen(res: any) {
        console.log(`ws opened`);
        this.onHeartBeat();
        this.send(
            JSON.stringify({
                type: `open`,
                payload: {},
            })
        );
    }

    async onClosed() {
        console.log(`ws closed`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * 5))
        this.onInit();
    }

    onMessage(msg: string, ws: any): void {
        this.lastTime = Date.now();
        try {
            const payload = JSON.parse(msg.toString());
            if (payload) {
                let { type, path, action, ...other } = payload;
                const _type = action || type || path;
                switch (_type) {
                    case "ping":
                        this.send(JSON.stringify({ type: "pong" }));
                        break;
                    case "pong":
                        break;
                    case "open_ack":
                        this.open_ack({ action: _type, ...other });
                        break;
                    default:
                        this._onMessage({ action: _type, ...other });
                        break;
                }
            }
        } catch (e) {
            // console.error(e);
        }
    }

    open_ack(payload: any) {
        if (!payload) {
            return;
        }
        const deviceId = useToken(DEVICE_ID);
        deviceId.put(payload.uuid);
        return async () => { };
    }

    onDestory() {
        if (this.isDestoried) {
            return;
        }
        if (this.heartBeater) {
            clearInterval(this.heartBeater);
            this.heartBeater = null;
        }
        if (this.timeouter) {
            clearInterval(this.timeouter);
            this.timeouter = null;
        }
        if (this.ws) {
            if (this.ws.close) this.ws.close(1000);
        }
        this.isDestoried = true;
    }

    destory(): void {
        this.onDestory();
    }
}
