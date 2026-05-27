"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const match_service_1 = require("./match.service");
let MatchController = class MatchController {
    matchService;
    constructor(matchService) {
        this.matchService = matchService;
    }
    async likeUser(user, targetUserId) {
        return this.matchService.likeUser(user.sub, targetUserId);
    }
    async unlikeUser(user, targetUserId) {
        return this.matchService.unlikeUser(user.sub, targetUserId);
    }
    async getMyMatches(user, page, limit) {
        return this.matchService.getMyMatches(user.sub, Number(page) || 1, Number(limit) || 20);
    }
    async getMutualMatches(user, page, limit) {
        return this.matchService.getMutualMatches(user.sub, Number(page) || 1, Number(limit) || 20);
    }
};
exports.MatchController = MatchController;
__decorate([
    (0, common_1.Post)("like/:targetUserId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("targetUserId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "likeUser", null);
__decorate([
    (0, common_1.Post)("unlike/:targetUserId"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("targetUserId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "unlikeUser", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "getMyMatches", null);
__decorate([
    (0, common_1.Get)("mutual"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MatchController.prototype, "getMutualMatches", null);
exports.MatchController = MatchController = __decorate([
    (0, common_1.Controller)("matches"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [match_service_1.MatchService])
], MatchController);
//# sourceMappingURL=match.controller.js.map