
import SocketServer, {SocketRoute} from "@/core/socket.js";
import MQTTServer, {MQTTRoute} from "@/core/mqtt.js";
import { Server } from "@/core/interfaces.js";

export interface ServerParameters{
    routes: (SocketRoute<any> | MQTTRoute<any>)[]
}

export default class Manager implements Server{
    private readonly websocketServer: SocketServer;

    private readonly mqttServer: MQTTServer;

    constructor({
        routes = []
    }: ServerParameters){
        this.websocketServer = new SocketServer({
            routes: routes.filter(route => route.type == "socket")
        });

        this.mqttServer = new MQTTServer({
            routes: routes.filter(route => route.type == "mqtt")
        });
    }

    public run(): void{
        console.log("...Iniciando serviços...");

        const servers: Server[] = [this.mqttServer, this.websocketServer];

        for(const server of servers)
            server.run();
    }
}