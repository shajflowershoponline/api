import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { CoordinatesDto } from "src/core/dto/map/map.dto";
import { SystemConfig } from "src/db/entities/SystemConfig";
import { SystemConfigService } from "./system-config.service";

@Injectable()
export class DeliveryService {
  private OPENROUTESERVICE_API_KEY;
  private OPENROUTESERVICE_API_URL;
  private DELIVERY_RATE = 2; // ₱10 per KM
  private DELIVERY_FEE_MIN = 20; // ₱10 per KM

  systemConfig: SystemConfig[] = [];

  constructor(
    private readonly config: ConfigService,
    private readonly systemConfigService: SystemConfigService,
    private readonly httpService: HttpService
  ) {
    this.OPENROUTESERVICE_API_URL = this.config.get<string>(
      "OPENROUTESERVICE_API_URL"
    );
    this.OPENROUTESERVICE_API_KEY = this.config.get<string>(
      "OPENROUTESERVICE_API_KEY"
    );
  }

  async loadSystemConfig() {
    this.systemConfig = await this.systemConfigService.getAll();
    const deliveryRateConfig = this.systemConfig.find(
      (x) => x.key === "DELIVERY_RATE"
    );

    if (deliveryRateConfig) {
      const deliveryRate: { min: number; rateByKm: number } = JSON.parse(
        deliveryRateConfig?.value || "{}"
      );

      this.DELIVERY_FEE_MIN = deliveryRate ? Number(deliveryRate.min) : 10;
      this.DELIVERY_RATE = deliveryRate ? Number(deliveryRate.rateByKm) : 10;
    }
  }

  async calculateDeliveryFee(
    pickupCoords: { lat: number; lng: number },
    dropoffCoords: { lat: number; lng: number }
  ): Promise<{ distanceInKm: number; deliveryFee: number }> {
    await this.loadSystemConfig();
    const start = `${pickupCoords.lng},${pickupCoords.lat}`;
    const end = `${dropoffCoords.lng},${dropoffCoords.lat}`;

    const url = `${this.OPENROUTESERVICE_API_URL}/v2/directions/driving-car`;

    try {
      const response$ = this.httpService.get(url, {
        params: {
          start,
          end,
        },
        headers: {
          Authorization: this.OPENROUTESERVICE_API_KEY,
        },
      });

      const response = await lastValueFrom(response$);

      const summary = response.data?.features?.[0]?.properties?.summary;
      if (!summary) {
        throw new Error("No summary data found in route response");
      }

      const distanceInMeters = summary.distance;
      const distanceInKm = distanceInMeters / 1000;
      const deliveryFee =
        distanceInKm >= 1
          ? (distanceInKm - 1) * this.DELIVERY_RATE + this.DELIVERY_FEE_MIN
          : this.DELIVERY_FEE_MIN;

      return {
        distanceInKm: +distanceInKm.toFixed(2),
        deliveryFee: +deliveryFee.toFixed(2),
      };
    } catch (error) {
      console.error(
        "Error calculating delivery fee:",
        error.message,
        error.response?.data || ""
      );
      throw new Error("Failed to calculate delivery fee");
    }
  }

  async getAddressNameFromCoordinates(
    lat: number,
    lon: number
  ): Promise<string | null> {
    const url = `${this.OPENROUTESERVICE_API_URL}/geocode/reverse`;
    const params = {
      api_key: this.OPENROUTESERVICE_API_KEY,
      "point.lat": lat,
      "point.lon": lon,
    };

    try {
      const response$ = this.httpService.get(url, { params });
      const response = await lastValueFrom(response$);
      const features = response.data?.features;

      if (features && features.length > 0) {
        return features[0].properties?.label || null;
      }

      return null;
    } catch (error) {
      console.error("Reverse geocoding failed:", error.message);
      return null;
    }
  }
}
