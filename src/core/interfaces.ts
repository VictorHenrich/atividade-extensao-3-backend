export interface Server{
    run(): void;
}

export interface Service<T>{
    execute(): T;
}

export interface Response<T>{
    message: string,
    statusCode: number,
    data: T,
}

export interface Route<B, S, T>{
    type: string;
    
    get routeName(): string;

    handle(broker: B, socket: S, data: T): Promise<void> | void;
}