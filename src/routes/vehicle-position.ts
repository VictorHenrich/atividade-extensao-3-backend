import WebSocket from "ws";
import Server, { Route } from "@/core/server.js";
import { SuccessResponse } from "@/core/responses.js";


interface VehiclePositionData{
    latitude: string,
    longitude: string,
    vehicleId: string
}

interface VehiclePositionResponseData extends VehiclePositionData{

}

export default class VehiclePositionRoute extends Route<VehiclePositionData>{
    handle(server: Server, socket: WebSocket, data: VehiclePositionData): Promise<void> | void {
        const response: SuccessResponse<VehiclePositionResponseData> = new SuccessResponse(data);

        server.broadcast("client-connection", response.toJSON());
    }

    get routeName(){
        return "/vehicle-position";
    }
}