import { WebSocketServer, WebSocket } from "ws";
import { WEBSOCKET_HOST, WEBSOCKET_PORT } from "@/core/config.js";
import { ServerError } from "./exceptions.js";
import { NotFoundResponse } from "./responses.js";


interface ServerParameters{
    routes: Route<any>[];
}

interface ExtendedWebSocket extends WebSocket {
  route?: string;
}

export abstract class Route<T>{
    abstract get routeName(): string;

    abstract handle(server: Server, socket: WebSocket, data: T): Promise<void> | void;
}

export default class Server{
    private readonly websocketServer: WebSocketServer = new WebSocketServer({
        port: WEBSOCKET_PORT,
        host: WEBSOCKET_HOST
    });

    private routes: Route<any>[];

    constructor({
        routes = []
    }: ServerParameters){
        this.routes = routes;
    }

    public addRoutes(...routes: Route<any>[]): void{
        this.routes.push(...routes);
    }

    private configureMessageRoutingOnWebsocketServer(ws: WebSocket, buffer: Buffer){
        try{
            const { route: routeName, data } = JSON.parse(buffer.toString());

            const route: Route<any> | void = this.routes.find((routeObject)=> routeObject.routeName == routeName);

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
        console.log(`Rodando servidor websocket: ws://${WEBSOCKET_HOST}:${WEBSOCKET_PORT}`);
    }

    private configureWebsocketServerError(error: Error){
        throw new ServerError(error);
    }

    private configureWebsocketServerRouting(ws: WebSocket){
        ws.on("message", (buffer: Buffer)=> this.configureMessageRoutingOnWebsocketServer(ws, buffer));
    }

    public run(): void{
        console.log("...Iniciando servidor...");

        this.websocketServer.on("connection", this.configureWebsocketServerRouting);

        this.websocketServer.on("listening", this.configureWebsocketServerListening);

        this.websocketServer.on("error", this.configureWebsocketServerError);
    }
}