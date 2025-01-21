export const version: string = `1.0.0`;

/**
 * 生命周期
 */
export interface OnInit {
    onInit(): void;
}

export function isOnInit(val: any): val is OnInit {
    return val && typeof val.onInit === 'function';
}

export interface OnDestory {
    onDestory(): void;
}

export function isOnDestory(val: any): val is OnDestory {
    return val && typeof val.onDestory === 'function';
}

export type StringToken<T> = string & { _type?: T };
export interface Type<T> extends Function {
    new(...args: any[]): T;
}
export interface AbstractType<T> extends Function {
    prototype: T;
}

export type Token<T> = StringToken<T> | Type<T> | AbstractType<T>;

export class NotFoundToken<T> extends Error {
    token: Token<T>;
    constructor(msg: string, token: Token<T>) {
        super(msg);
        this.token = token;
    }
}

export interface ValueSansProvider {
    useValue: any;
}
export interface ValueProvider extends ValueSansProvider {
    provide: any;
    multi?: boolean;
}
export function isValueProvider(val: any): val is ValueProvider {
    return val && val.useValue;
}
export interface StaticClassSansProvider {
    useClass: Type<any>;
}
export interface StaticClassProvider extends StaticClassSansProvider {
    provide: any;
    multi?: boolean;
}
export interface ConstructorSansProvider { }
export interface ConstructorProvider extends ConstructorSansProvider {
    provide: Type<any>;
    multi?: boolean;
}
export interface ExistingSansProvider {
    useExisting: any;
}
export interface ExistingProvider extends ExistingSansProvider {
    provide: any;
    multi?: boolean;
}
export function isExistingProvider(val: any): val is ExistingProvider {
    return val && val.useExisting;
}
export interface FactorySansProvider {
    useFactory: (injector: Injector) => any;
    deps?: any[];
}
export interface FactoryProvider extends FactorySansProvider {
    provide: any;
    multi?: boolean;
}

export function isFactoryProvider(val: any): val is FactoryProvider {
    return val && typeof val.useFactory === "function";
}

export type StaticProvider =
    | ValueProvider
    | ExistingProvider
    | StaticClassProvider
    | ConstructorProvider
    | FactoryProvider;

export interface TypeProvider extends Type<any> { }
export function isTypeProvider(val: any): val is TypeProvider {
    return val && typeof val === "function";
}
export interface ClassSansProvider {
    useClass: Type<any>;
}
export interface ClassProvider extends ClassSansProvider {
    provide: any;
    multi?: boolean;
}
export function isClassProvider(val: any): val is ClassProvider {
    return val && isTypeProvider(val.useClass);
}
export type Provider =
    | TypeProvider
    | ValueProvider
    | ClassProvider
    | ConstructorProvider
    | ExistingProvider
    | FactoryProvider;

export class ProviderMultiMustBeArrayError extends Error { }

export interface Injector {
    <T>(token: Token<T>): T;
    get<T>(token: Token<T>): T;
}
