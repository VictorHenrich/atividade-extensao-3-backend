import SocketServer, { AbstractMQTTRoute } from "@/core/mqtt.js";
import { Client } from "aedes";

export default class VehiclePositionRoute extends AbstractMQTTRoute<any> {
    get routeName(): string {
        return "/vehicle-position";
    }

    handle(broker: SocketServer, socket: Client | null, data: any): Promise<void> | void {
        console.log("Dados recebidos do microcontrolador: ", data);

        broker.socketServer.broadcast(
            `vehicle-position:${data["vehicle_id"]}`,
            data
        );
    }
}
