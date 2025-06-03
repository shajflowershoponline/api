import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
export declare class GeolocationService {
    private readonly config;
    private readonly httpService;
    private readonly MAXIM_LOCATION_SERVICE_URL;
    constructor(config: ConfigService, httpService: HttpService);
    search(query: string): Promise<{
        id: string;
        name: string;
    }[]>;
}
