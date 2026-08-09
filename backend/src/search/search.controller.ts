import { Body, Controller, Get, Post } from "@nestjs/common";
import { SearchService } from "./search.service";
import { SearchDto } from "./dto/search.dto";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  test() {
    return {
      success: true,
      message: "EGELOVE Search API çalışıyor.",
    };
  }

  @Post()
  async search(@Body() dto: SearchDto) {
    return this.searchService.search(dto);
  }
}