export class AstNotFoundError extends Error {
    constructor(msg: string) {
        super(msg)
    }
}
export class GlobalInjectorNotFoundError extends Error{
    constructor(){
        super(`[GlobalInjectorNotFoundError]injector is undefined`)
    }
}