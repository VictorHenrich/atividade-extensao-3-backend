import Server from "@/core/manager.js";
import VehiclePositionRoute from "@/routes/vehicle-position.js";
import Manager from "@/core/manager.js";
import TestRoute from "./routes/test.js";

export const server: Server = new Manager({
    routes: [
        new VehiclePositionRoute(),
        new TestRoute()
    ]
});

server.run();
