import { GlobalInjectorNotFoundError } from "./errors";
import { SET_UP_TOKEN } from "./tokens";
import {
    Injector,
    isClassProvider,
    isExistingProvider,
    isFactoryProvider,
    isTypeProvider,
    isValueProvider,
    NotFoundToken,
    Provider,
    Token,
} from "./types";

let __globalInjector: Injector | null;

export function useInjector() {
    if (__globalInjector) {
        return __globalInjector;
    }
    throw new GlobalInjectorNotFoundError();
}
export function setInjector(injector: Injector) {
    __globalInjector = injector;
}
export function createFactory(provides: Provider[]) {
    const providerMap: Map<any, Provider | Provider[]> = new Map();
    const cacheMap: Map<any, any> = new Map();
    function createProviderInstance(provider: Provider) {
        if (isTypeProvider(provider)) {
            return new provider(inject);
        } else if (isClassProvider(provider)) {
            return new provider.useClass(inject);
        } else if (isValueProvider(provider)) {
            return provider.useValue;
        } else if (isFactoryProvider(provider)) {
            // deps
            return provider.useFactory(inject as Injector);
        } else if (isExistingProvider(provider)) {
            return inject(provider.useExisting);
        } else {
            // deps
            return new provider.provide(inject);
        }
    }

    function inject<T>(token: Token<T>): T {
        if (cacheMap.has(token)) {
            return cacheMap.get(token);
        }
        const provider = providerMap.get(token);
        if (provider) {
            if (Array.isArray(provider)) {
                const instance = provider.map((p) => createProviderInstance(p)) as any;
                cacheMap.set(token, instance);
                return instance;
            }
            const instance = createProviderInstance(provider);
            cacheMap.set(token, instance);
            return instance;
        }
        throw new NotFoundToken(`not found token`, token);
    }
    (inject as Injector).get = inject;

    return (extras: Provider[]): Injector => {
        const allProviders = [...provides, ...extras];
        allProviders.map((provider) => {
            if (isTypeProvider(provider)) {
                providerMap.set(provider, provider);
                return;
            } else {
                if (provider.multi) {
                    const list = providerMap.get(provider.provide) || [];
                    if (Array.isArray(list)) {
                        providerMap.set(provider.provide, [...list, provider]);
                        return;
                    }
                } else {
                    providerMap.set(provider.provide, provider);
                }
            }
        });
        setInjector(inject as Injector);
        const setups = inject(SET_UP_TOKEN);
        if (Array.isArray(setups)) {
            setups.reverse().map((setup) => setup(inject as Injector));
        }
        return inject as Injector;
    };
}
