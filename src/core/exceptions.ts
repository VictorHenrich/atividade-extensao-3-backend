

export class ServerError extends Error{
    constructor(error: Error){
        const errorMessage: string = `Falha no servidor: ${error.message}`;

        super(errorMessage, {cause: error});
    }
}