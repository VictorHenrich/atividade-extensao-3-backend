import dotenv from "dotenv";

dotenv.config();

export const WEBSOCKET_PORT: number = parseInt(process.env.WEBSOCKET_PORT || "");

export const WEBSOCKET_HOST: string = process.env.WEBSOCKET_HOST || "";
