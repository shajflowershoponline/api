import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { AIService } from "src/services/ai.service";

@ApiTags("ai")
@Controller("ai")
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post("search")
  @ApiBody({
    description: "The query object for AI search",
    required: true,
    schema: {
      type: "object",
      properties: {
        customerUserId: { type: "string" },
        query: { type: "string", example: "red roses bouquet" },
      },
      required: ["query"],
    },
  })
  async create(@Body() dto: { query: string; customerUserId: string }) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.aiService.handleSearch(dto);
      res.success = true;
      res.message = `Query ${dto.query}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
