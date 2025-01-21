import { useInjector } from "./factory";
import { IStorageItem, Storage } from "./tokens";
import { StringToken } from "./types";

export function useStorage() {
    return useInjector()(Storage);
}

export function useToken<T>(token: StringToken<T>, def?: T): IStorageItem<T> {
    const val = {
        get: () => {
            const val = useStorage().get(token);
            if (typeof val === "undefined") {
                return def!;
            }
            return val;
        },
        put: (val: T) => useStorage().put(token, val),
    };
    return val;
}
