import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        emailVerificationSent: boolean;
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        requires2FA: boolean;
        tempToken: string;
    } | {
        accessToken: string;
        refreshToken: string;
        user: any;
        requires2FA?: undefined;
        tempToken?: undefined;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    logout(user: any): Promise<void>;
    verifyEmail(token: string): Promise<{
        verified: boolean;
    }>;
    resendVerification(user: any): Promise<{
        sent: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        sent: boolean;
    }>;
    resetPassword(email: string, code: string, newPassword: string): Promise<{
        reset: boolean;
    }>;
}
