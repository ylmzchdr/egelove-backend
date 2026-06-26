import { Injectable, BadRequestException } from "@nestjs/common";
import OpenAI from "openai";

const LANGUAGES: Record<string, string> = {
  TR: "Turkish",
  EN: "English",
  RU: "Russian",
  AR: "Arabic",
};

@Injectable()
export class TranslateService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async translate(text: string, targetLang: string) {
    if (!process.env.OPENAI_API_KEY) {
      throw new BadRequestException("OPENAI_API_KEY tanımlı değil");
    }

    const cleanText = String(text || "").trim();
    const lang = String(targetLang || "TR").toUpperCase();
    const target = LANGUAGES[lang];

    if (!cleanText) {
      throw new BadRequestException("Çevrilecek metin boş olamaz");
    }

    if (!target) {
      throw new BadRequestException("Desteklenen diller: TR, EN, RU, AR");
    }

    const result = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You are a professional dating app message translator. Translate only the message. Preserve meaning, tone, emojis, names and punctuation. Do not add explanations.",
        },
        {
          role: "user",
          content: `Translate this message to ${target}:\n\n${cleanText}`,
        },
      ],
    });

    return {
      sourceText: cleanText,
      targetLang: lang,
      translatedText: result.choices[0]?.message?.content?.trim() || "",
    };
  }
}