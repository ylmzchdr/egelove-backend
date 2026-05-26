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
exports.TwofaController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const twofa_service_1 = require("./twofa.service");
let TwofaController = class TwofaController {
    twofaService;
    constructor(twofaService) {
        this.twofaService = twofaService;
    }
    async generate(user) {
        return this.twofaService.generateSecret(user.sub);
    }
    async enable(user, token) {
        return this.twofaService.enable(user.sub, token);
    }
    async disable(user, token) {
        return this.twofaService.disable(user.sub, token);
    }
    async verify(user, token) {
        const valid = await this.twofaService.verifyToken(user.sub, token);
        return { valid };
    }
};
exports.TwofaController = TwofaController;
__decorate([
    (0, common_1.Post)("generate"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TwofaController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)("enable"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TwofaController.prototype, "enable", null);
__decorate([
    (0, common_1.Post)("disable"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TwofaController.prototype, "disable", null);
__decorate([
    (0, common_1.Post)("verify"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TwofaController.prototype, "verify", null);
exports.TwofaController = TwofaController = __decorate([
    (0, common_1.Controller)("2fa"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [twofa_service_1.TwofaService])
], TwofaController);
//# sourceMappingURL=twofa.controller.js.map