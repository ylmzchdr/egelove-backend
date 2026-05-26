import { Injectable, Logger } from "@nestjs/common";

export interface AuditEntry {
  action: string;
  userId?: string;
  targetId?: string;
  metadata?: Record<string, any>;
  ip?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger("Audit");

  log(entry: AuditEntry) {
    this.logger.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        ...entry,
      }),
    );
  }
}
