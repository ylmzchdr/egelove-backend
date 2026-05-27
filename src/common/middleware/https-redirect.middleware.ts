import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    next();
  }
}
