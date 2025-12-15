import SocketServer, { AbstractSocketRoute } from "@/core/socket.js";
import { Socket } from "socket.io";


export default class TestRoute extends AbstractSocketRoute<any>{
    handle(broker: SocketServer, socket: Socket, data: any): Promise<void> | void {
        console.log("MENSAGEM RECEBIDA", data);

        socket.emit("teste", data);
    }

    get routeName(): string {
        return "teste";
    }
}