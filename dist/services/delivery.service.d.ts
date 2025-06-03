import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { SystemConfig } from "src/db/entities/SystemConfig";
import { SystemConfigService } from "./system-config.service";
export declare class DeliveryService {
    private readonly config;
    private readonly systemConfigService;
    private readonly httpService;
    private OPENROUTESERVICE_API_KEY;
    private OPENROUTESERVICE_API_URL;
    private DELIVERY_RATE;
    systemConfig: SystemConfig[];
    constructor(config: ConfigService, systemConfigService: SystemConfigService, httpService: HttpService);
    loadSystemConfig(): Promise<void>;
    calculateDeliveryFee(pickupCoords: {
        lat: number;
        lng: number;
    }, dropoffCoords: {
        lat: number;
        lng: number;
    }): Promise<{
        distanceInKm: number;
        deliveryFee: number;
    }>;
    getAddressNameFromCoordinates(lat: number, lon: number): Promise<string | null>;
}
