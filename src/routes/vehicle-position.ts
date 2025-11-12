import { SuccessResponse } from "@/core/responses.js";
import MQTTServer, { AbstractMQTTRoute } from "@/core/mqtt.js";
import { Client } from "aedes";


interface VehiclePositionData{
    latitude: string,
    longitude: string,
    vehicleId: string
}

interface VehiclePositionResponseData extends VehiclePositionData{

}

export default class VehiclePositionRoute extends AbstractMQTTRoute<VehiclePositionData>{
    handle(broker: MQTTServer, socket: Client | null, data: VehiclePositionData): Promise<void> | void {
        
    }

    get routeName(){
        return "/vehicle-position";
    }
}