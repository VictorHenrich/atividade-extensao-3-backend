import Server from "@/core/server.js";
import VehiclePositionRoute from "@/routes/vehicle-position.js";
import ClientConnectionRoute from "./routes/client-connection.js";

const server: Server = new Server({
    routes: [
        new VehiclePositionRoute(),
        new ClientConnectionRoute()
    ]
});

server.run();