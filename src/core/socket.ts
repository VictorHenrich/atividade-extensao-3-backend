import { Server as IOServer, Socket } from "socket.io";
import express from "express";
import { WEBSOCKET_HOST, WEBSOCKET_PORT } from "@/core/config.js";
import { Route, Server } from "@/core/interfaces.js";
import { createServer, Server as HTTPServer } from "http";

export interface SocketServerParameters {
    port?: number | string;
    host?: string;
    routes: AbstractSocketRoute<any>[];
}

export abstract class AbstractSocketRoute<T>
  implements Route<SocketServer, Socket, T> {

    readonly type: string = "socket";

    abstract get routeName(): string;

    abstract handle(
        broker: SocketServer,
        socket: Socket,
        data: T
    ): Promise<void> | void;
}

export default class SocketServer implements Server {
    private readonly io: IOServer;
    private readonly app = express();
    private server: HTTPServer = createServer(this.app);
    private readonly routes: AbstractSocketRoute<any>[];
    private readonly port: number;
    private readonly host: string;

    constructor({
        port = WEBSOCKET_PORT,
        host = WEBSOCKET_HOST,
        routes = [],
    }: SocketServerParameters) {
        this.host = host;

        this.port = parseInt(`${port}`);

        this.routes = routes;

        this.io = new IOServer(this.server, {
            cors: {
                origin: "*"
            }
        });
    }

    public broadcast(event: string, payload: any, room?: string): void {
        if(room)
            this.io.to(room).emit(event, payload);
        else
            this.io.emit(event, payload);
    }

    private configureSocketConnection(socket: Socket) {
        socket.on("disconnect", () => {
            console.log("Cliente desconectado:", socket.id);
        });

        for(const route of this.routes){
            socket.on(route.routeName, (data)=> route.handle(this, socket, data));
        }
    }

    public run(): void {
        this.io.on("connection", (socket) =>{
            console.log("Cliente conectado:", socket.id);

            this.configureSocketConnection(socket)
        });

        this.server.listen(8000);

        console.log(
            `...Servidor Socket.IO Rodando: PORT=${this.port} | HOST=${this.host}...`
        );
    }

}