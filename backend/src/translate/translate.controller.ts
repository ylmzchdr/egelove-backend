import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { TranslateService } from "./translate.service";

@Controller("translate")
@UseGuards(JwtAuthGuard)
export class TranslateController {
  constructor(private translateService: TranslateService) {}

  @Post()
  async translate(
    @Body("text") text: string,
    @Body("targetLang") targetLang: string,
  ) {
    return this.translateService.translate(text, targetLang);
  }
}