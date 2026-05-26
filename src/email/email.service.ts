import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      this.logger.warn("SMTP ayarları eksik - e-postalar log'a yazılacak");
    }
  }

  async send(options: { to: string; subject: string; html: string }) {
    if (this.transporter) {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || "noreply@egelove.com",
        ...options,
      });
    } else {
      this.logger.log(`[EMAIL SIMULATION] To: ${options.to}, Subject: ${options.subject}`);
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    const baseUrl = process.env.CORS_ORIGIN || "http://localhost:3001";
    const link = `${baseUrl}/verify-email?token=${token}`;

    await this.send({
      to: email,
      subject: "Egelove - E-posta Doğrulama",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:20px;background:#1a0a1e;border-radius:12px;color:white">
          <h1 style="color:#ec4899">egelove</h1>
          <p>E-posta adresini doğrulamak için aşağıdaki butona tıkla:</p>
          <a href="${link}" style="display:inline-block;background:#ec4899;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0">
            E-postamı Doğrula
          </a>
          <p style="color:#a1a1aa;font-size:12px">Bu link 24 saat geçerlidir.</p>
        </div>
      `,
    });
  }

  async send2FABackupCode(email: string, backupCode: string) {
    await this.send({
      to: email,
      subject: "Egelove - 2FA Yedek Kodunuz",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:20px;background:#1a0a1e;border-radius:12px;color:white">
          <h1 style="color:#ec4899">egelove</h1>
          <p>2FA yedek kodunuz:</p>
          <div style="background:#222;padding:16px;border-radius:8px;font-size:24px;text-align:center;letter-spacing:4px;font-family:monospace">
            ${backupCode}
          </div>
          <p style="color:#a1a1aa;font-size:12px">Bu kodu güvenli bir yerde sakla. Telefonuna erişemezsen kurtarma kodu olarak kullanılır.</p>
        </div>
      `,
    });
  }
}
