import { ApiResponseModel } from "src/core/models/api-response.model";
import { GeolocationService } from "src/services/geolocation.service";
export declare class GeolocationController {
    private readonly geolocationService;
    constructor(geolocationService: GeolocationService);
    search(query: string): Promise<ApiResponseModel<any>>;
}
