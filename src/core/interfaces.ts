

export interface Service<T>{
    execute(): T;
}

export interface Response<T>{
    message: string,
    statusCode: number,
    data: T,
}