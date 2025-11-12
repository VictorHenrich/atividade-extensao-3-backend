import Server from "@/core/manager.js";
import VehiclePositionRoute from "@/routes/vehicle-position.js";
import ClientConnectionRoute from "./routes/client-connection.js";
import Manager from "@/core/manager.js";

const server: Server = new Manager({
    routes: [
        new VehiclePositionRoute(),
        new ClientConnectionRoute()
    ]
});

server.run();