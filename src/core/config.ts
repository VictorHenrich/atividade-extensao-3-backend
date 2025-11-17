import dotenv from "dotenv";

dotenv.config();

export const WEBSOCKET_PORT: number = parseInt(process.env.WEBSOCKET_PORT || "0.0.0.0");

export const WEBSOCKET_HOST: string = process.env.WEBSOCKET_HOST || "";

export const MQTT_PORT: number = parseInt(process.env.MQTT_PORT || "");

export const MQTT_HOST: string = process.env.MQTT_HOST || "0.0.0.0";
