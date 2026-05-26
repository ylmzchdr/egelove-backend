export interface AuditEntry {
    action: string;
    userId?: string;
    targetId?: string;
    metadata?: Record<string, any>;
    ip?: string;
}
export declare class AuditService {
    private readonly logger;
    log(entry: AuditEntry): void;
}
