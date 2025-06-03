import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { SystemConfig } from "src/db/entities/SystemConfig";
import { SystemConfigService } from "src/services/system-config.service";

@ApiTags("system-config")
@Controller("system-config")
export class SystemConfigController {
  constructor(private readonly systemConfigService: SystemConfigService) {}

  @Get("")
  //   @UseGuards(JwtAuthGuard)
  async getAll() {
    const res = {} as ApiResponseModel<SystemConfig[]>;
    try {
      res.data = await this.systemConfigService.getAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
