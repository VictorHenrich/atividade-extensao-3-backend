import { SuccessResponse } from "@/core/responses.js";
import Server, { Route } from "@/core/server.js";
import WebSocket from "ws";



export default class ClientConnectionRoute extends Route<void>{
    get routeName(): string {
        return "client-connection";
    }

    handle(server: Server, socket: WebSocket, data: void): Promise<void> | void {
        const response: SuccessResponse<void> = new SuccessResponse();

        socket.send(response.toJSON());
    }
}