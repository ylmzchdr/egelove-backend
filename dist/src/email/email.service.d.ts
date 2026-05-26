export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    send(options: {
        to: string;
        subject: string;
        html: string;
    }): Promise<void>;
    sendVerificationEmail(email: string, token: string): Promise<void>;
    send2FABackupCode(email: string, backupCode: string): Promise<void>;
}
