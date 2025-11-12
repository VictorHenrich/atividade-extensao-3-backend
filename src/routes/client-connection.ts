import { SuccessResponse } from "@/core/responses.js";
import SocketServer, { AbstractSocketRoute } from "@/core/socket.js";
import WebSocket from "ws";



export default class ClientConnectionRoute extends AbstractSocketRoute<void>{
    get routeName(): string {
        return "client-connection";
    }

    handle(broker: SocketServer, socket: WebSocket, data: void): Promise<void> | void {
        const response: SuccessResponse<void> = new SuccessResponse();

        socket.send(response.toJSON());
    }
}