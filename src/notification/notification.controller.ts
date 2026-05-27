import { Controller, Get, Post, Patch, Param, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { NotificationService } from "./notification.service";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async findAll(@CurrentUser() user: any, @Query("page") page?: string, @Query("limit") limit?: string) {
    return this.notificationService.findByUser(user.sub, Number(page) || 1, Number(limit) || 20);
  }

  @Get("unread-count")
  async unreadCount(@CurrentUser() user: any) {
    const count = await this.notificationService.countUnread(user.sub);
    return { count };
  }

  @Patch(":id/read")
  async markRead(@CurrentUser() user: any, @Param("id") id: string) {
    return this.notificationService.markAsRead(id, user.sub);
  }

  @Post("read-all")
  async readAll(@CurrentUser() user: any) {
    return this.notificationService.markAllAsRead(user.sub);
  }
}
