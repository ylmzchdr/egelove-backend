import { Gender } from "@prisma/client";
export declare class RegisterDto {
    name: string;
    surname: string;
    email: string;
    phone?: string;
    password: string;
    birthDate: string;
    gender: Gender;
    turnstileToken: string;
}
