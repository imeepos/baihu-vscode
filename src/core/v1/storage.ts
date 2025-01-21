import { ExtensionContext } from "vscode";
import { Storage } from "../tokens";
import { StringToken } from "../types";
import { useInjector } from "../factory";
import { VSCODE_EXTENSION_CONTEXT } from "../vscode";


export class StorageVscode extends Storage {
    map: Map<string, any> = new Map();
    id: number = Date.now()
    ctx: ExtensionContext;
    constructor() {
        super();
        this.ctx = useInjector().get(VSCODE_EXTENSION_CONTEXT)
    }
    get<T>(key: StringToken<T>): T | undefined {
        return this.ctx.globalState.get(key)
    }
    put<T>(key: StringToken<T>, val: T): void {
        this.ctx.globalState.update(key, val);
    }
}