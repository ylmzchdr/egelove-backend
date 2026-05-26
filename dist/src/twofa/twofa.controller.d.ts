import { TwofaService } from "./twofa.service";
export declare class TwofaController {
    private twofaService;
    constructor(twofaService: TwofaService);
    generate(user: any): Promise<{
        secret: string;
        qrCode: string;
    }>;
    enable(user: any, token: string): Promise<{
        enabled: boolean;
        backupCode: string;
    }>;
    disable(user: any, token: string): Promise<{
        disabled: boolean;
    }>;
    verify(user: any, token: string): Promise<{
        valid: boolean;
    }>;
}
