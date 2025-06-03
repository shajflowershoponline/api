import { DeliveryService } from "src/services/delivery.service";
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ApiResponseModel } from "src/core/models/api-response.model";

@ApiTags("delivery")
@Controller("delivery")
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post("calculate")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        pickupCoords: {
          type: "object",
          properties: {
            lat: { type: "number", example: 123.456 },
            lng: { type: "number", example: 78.91 },
          },
          required: ["lat", "lng"],
        },
        dropoffCoords: {
          type: "object",
          properties: {
            lat: { type: "number", example: 321.654 },
            lng: { type: "number", example: 98.765 },
          },
          required: ["lat", "lng"],
        },
      },
      required: ["pickupCoords", "dropoffCoords"],
    },
  })
  async search(
    @Body()
    body: {
      pickupCoords: {
        lat: number;
        lng: number;
      };
      dropoffCoords: {
        lat: number;
        lng: number;
      };
    }
  ) {
    const res = {} as ApiResponseModel<any>;
    try {
      res.data = await this.deliveryService.calculateDeliveryFee(
        body.pickupCoords,
        body.dropoffCoords
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
