import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { EmailService } from "src/services/email.service";

@ApiTags("email")
@Controller("email")
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post("/send")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
        email: { type: "string" },
        subject: { type: "string" },
        message: { type: "string" },
      },
      required: ["name", "email", "subject", "message"],
    },
  })
  //   @UseGuards(JwtAuthGuard)
  async getPagination(
    @Body()
    paginationParams: {
      name: string;
      email: string;
      subject: string;
      message: string;
    }
  ) {
    const res: ApiResponseModel<any> = {} as any;
    try {
      res.data = await this.emailService.sendEmailFromContact(paginationParams);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
