import { WebSocketServer, WebSocket } from "ws";
import { WEBSOCKET_HOST, WEBSOCKET_PORT } from "@/core/config.js";
import { Route } from "@/core/interfaces.js";
import { ServerError } from "@/core/exceptions.js";
import { NotFoundResponse, } from "@/core/responses.js";
import { Server } from "@/core/interfaces.js";

export interface SocketServerParameters{
    port?: number | string,
    host?: string,
    routes: AbstractSocketRoute<any>[];
}

interface ExtendedWebSocket extends WebSocket {
  route?: string;
}

export abstract class AbstractSocketRoute<T> implements Route<SocketServer, WebSocket, T>{
    readonly type: string = "socket";

    abstract get routeName(): string;

    abstract handle(broker: SocketServer, socket: WebSocket, data: T): Promise<void> | void;

}

export default class SocketServer implements Server{
    private readonly websocketServer: WebSocketServer;

    private routes: AbstractSocketRoute<any>[];

    private readonly port: number;

    private readonly host: string;

    constructor({
        port = WEBSOCKET_PORT,
        host = WEBSOCKET_HOST,
        routes = []
    }: SocketServerParameters){
        this.host = host;

        this.port = parseInt(`${port}`);

        this.routes = routes;

        this.websocketServer = new WebSocketServer({
            port: this.port,
            host: this.host
        });
    }
    
    private configureMessageRoutingOnWebsocketServer(ws: WebSocket, buffer: Buffer){
        try{
            const { route: routeName, data } = JSON.parse(buffer.toString());

            const route: AbstractSocketRoute<any> | void = this.routes.find((routeObject)=> routeObject.routeName == routeName);

            if(!route){
                const messageError: string = `Nenhuma rota '${routeName}' foi localizada no servidor.`;

                const notFoundResponse: NotFoundResponse = new NotFoundResponse(messageError);

                ws.send(notFoundResponse.toJSON());

                console.error(messageError);

                return;
            }

            route.handle(this, ws, data);

        }catch(error){
            if(error instanceof Error)
                throw new ServerError(error);

            throw error;
        }
    }

    public broadcast(routeName: string, payload: string | Buffer): void {
        for (const client of this.websocketServer.clients as Set<ExtendedWebSocket>) {
            if (client.readyState === WebSocket.OPEN && client.route === routeName)
                client.send(payload);
        }
    }

    private configureWebsocketServerListening(){
        console.log(`...Servidor Socket Rodando: PORT=${this.port} | HOST=${this.host}...`);
    }

    private configureWebsocketServerError(error: Error){
        throw new ServerError(error);
    }

    private configureWebsocketServerRouting(ws: WebSocket){
        ws.on("message", (buffer: Buffer)=> this.configureMessageRoutingOnWebsocketServer(ws, buffer));
    }

    public run(): void{
        this.websocketServer.on("connection", (websocket, _) => this.configureWebsocketServerRouting(websocket));

        this.websocketServer.on("listening", ()=> this.configureWebsocketServerListening());

        this.websocketServer.on("error", (error) => this.configureWebsocketServerError(error));
    }
}