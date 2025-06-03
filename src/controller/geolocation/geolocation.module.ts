import { Module } from "@nestjs/common";
import { GeolocationController } from "./geolocation.controller";
import { GeolocationService } from "src/services/geolocation.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [GeolocationController],
  providers: [GeolocationService],
  exports: [GeolocationService],
})
export class GeolocationModule {}
