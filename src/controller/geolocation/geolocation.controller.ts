import { Controller, Get, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { GeolocationService } from "src/services/geolocation.service";

@ApiTags("geolocation")
@Controller("geolocation")
export class GeolocationController {
  constructor(private readonly geolocationService: GeolocationService) {}

  @Get("search")
  @ApiQuery({ name: "query", required: false, type: String })
  async search(@Query("query") query: string) {
    const res = {} as ApiResponseModel<any>;
    try {
      res.data = await this.geolocationService.search(query);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
