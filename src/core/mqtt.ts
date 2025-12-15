import aedes from "aedes";
import { createServer } from "net";
import { Route } from "@/core/interfaces.js";
import { MQTT_HOST, MQTT_PORT } from "@/core/config.js";
import { Server } from "@/core/interfaces.js";
import SocketServer from "./socket.js";

export interface MQTTServerParameters{
    port?: number | string,
    host?: string,
    routes: AbstractMQTTRoute<any>[];
    socketServer: SocketServer
}

export abstract class AbstractMQTTRoute<T> implements Route<MQTTServer, aedes.Client | null, T>{
    readonly type: string = "mqtt";

    abstract get routeName(): string;

    abstract handle(broker: MQTTServer, socket: aedes.Client | null, data: T): Promise<void> | void;
}

export default class MQTTServer implements Server{
    private readonly broker: aedes.default = aedes.createBroker();

    private readonly server = createServer(this.broker.handle);

    private readonly host: string;

    private readonly port: number;

    private routes: AbstractMQTTRoute<any>[];

    public readonly socketServer: SocketServer;
    
    constructor({
        socketServer,
        host = MQTT_HOST,
        port = MQTT_PORT,
        routes = [],
    }: MQTTServerParameters){
        this.routes = routes;

        this.host = host;

        this.port = parseInt(`${port}`);

        this.socketServer = socketServer;
    }

    private onListening(): void{
        console.log(`...Servidor MQTT Rodando: PORT=${this.port} | HOST=${this.host}...`);
    }

    private onClientConnected(client: aedes.Client): void{
        console.log(`Cliente ${client.id} conectado!`);
    }

    private onClientDisconnected(client: aedes.Client): void{
        console.log(`Cliente ${client.id} disconectado!`);
    }

    private onPublish(packet: aedes.AedesPublishPacket, client: aedes.Client | null): void {
        const { topic: routeName, payload } = packet;

        console.log(`Mensagem recebida do tópico ${routeName}: ${payload}`)

        for(const route of this.routes){
            if(route.routeName == routeName){
                const data = JSON.parse(payload.toString());

                route.handle(this, client, data);

                return;
            }
        }

        const messageError: string = `Nenhuma rota '${routeName}' foi localizada no servidor.`;

        console.error(messageError);
    }

    public run(): void{
        this.broker.on("client", (client) => this.onClientConnected(client));

        this.broker.on("clientDisconnect", (client) => this.onClientDisconnected(client));

        this.broker.on("publish", (packet, client) => this.onPublish(packet, client));

        this.server.listen(this.port, this.host, ()=> this.onListening());
    }
}