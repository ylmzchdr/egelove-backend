-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."AlcoholStatus" AS ENUM ('NEVER', 'QUIT', 'OCCASIONAL', 'REGULAR');

-- CreateEnum
CREATE TYPE "public"."BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'ZERO_POSITIVE', 'ZERO_NEGATIVE');

-- CreateEnum
CREATE TYPE "public"."BodyType" AS ENUM ('SLIM', 'ATHLETIC', 'NORMAL', 'CURVY', 'PLUS');

-- CreateEnum
CREATE TYPE "public"."ChildrenStatus" AS ENUM ('HAS_LIVING_WITH', 'HAS_NOT_LIVING', 'NONE');

-- CreateEnum
CREATE TYPE "public"."EducationLevel" AS ENUM ('PRIMARY', 'SECONDARY', 'HIGH_SCHOOL', 'ASSOCIATE', 'BACHELOR', 'MASTER', 'DOCTORATE');

-- CreateEnum
CREATE TYPE "public"."EyeColor" AS ENUM ('BROWN', 'BLUE', 'GREEN', 'HAZEL', 'BLACK', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."HairColor" AS ENUM ('BLACK', 'BROWN', 'BLOND', 'RED', 'WHITE', 'BALD', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."IncomeLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "public"."MaritalStatus" AS ENUM ('NEVER_MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED');

-- CreateEnum
CREATE TYPE "public"."PhotoStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ReligionLevel" AS ENUM ('VERY_RELIGIOUS', 'RELIGIOUS', 'MODERATE', 'NOT_RELIGIOUS', 'ATHEIST');

-- CreateEnum
CREATE TYPE "public"."SmokingStatus" AS ENUM ('NEVER', 'QUIT', 'OCCASIONAL', 'REGULAR');

-- CreateTable
CREATE TABLE "public"."City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Conversation" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConversationRead" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."District" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Match" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "isMutual" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentWebhookLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platformOrderId" TEXT NOT NULL,
    "packageType" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "status" TEXT NOT NULL DEFAULT 'completed',
    "rawBody" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "ipAddress" TEXT,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentWebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "blurHash" TEXT,
    "status" "public"."PhotoStatus" NOT NULL DEFAULT 'PENDING',
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "rejectedReason" TEXT,
    "moderatedBy" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProfileVisit" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "visitedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "gender" "public"."Gender",
    "cityId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "isPremiumCandidate" BOOLEAN NOT NULL DEFAULT false,
    "premiumExpiresAt" TIMESTAMP(3),
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "turnstileToken" TEXT,
    "refreshToken" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifyToken" TEXT,
    "emailVerifySentAt" TIMESTAMP(3),
    "twoFactorSecret" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "education" "public"."EducationLevel",
    "income" "public"."IncomeLevel",
    "religion" "public"."ReligionLevel",
    "smoking" "public"."SmokingStatus",
    "alcohol" "public"."AlcoholStatus",
    "children" "public"."ChildrenStatus",
    "bodyType" "public"."BodyType",
    "maritalStatus" "public"."MaritalStatus",
    "height" INTEGER,
    "weight" INTEGER,
    "eyeColor" "public"."EyeColor",
    "hairColor" "public"."HairColor",
    "bloodType" "public"."BloodType",
    "occupation" TEXT,
    "hobbies" TEXT,
    "aboutMe" TEXT,
    "lookingFor" TEXT,
    "privacySettings" JSONB NOT NULL DEFAULT '{}',
    "matchingPreferences" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPresence" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPresence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_user1Id_idx" ON "public"."Conversation"("user1Id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_user1Id_user2Id_key" ON "public"."Conversation"("user1Id" ASC, "user2Id" ASC);

-- CreateIndex
CREATE INDEX "Conversation_user2Id_idx" ON "public"."Conversation"("user2Id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ConversationRead_userId_conversationId_key" ON "public"."ConversationRead"("userId" ASC, "conversationId" ASC);

-- CreateIndex
CREATE INDEX "Match_isMutual_idx" ON "public"."Match"("isMutual" ASC);

-- CreateIndex
CREATE INDEX "Match_receiverId_idx" ON "public"."Match"("receiverId" ASC);

-- CreateIndex
CREATE INDEX "Match_senderId_idx" ON "public"."Match"("senderId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Match_senderId_receiverId_key" ON "public"."Match"("senderId" ASC, "receiverId" ASC);

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "public"."Message"("conversationId" ASC);

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "public"."Message"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "public"."Message"("senderId" ASC);

-- CreateIndex
CREATE INDEX "PaymentWebhookLog_platformOrderId_idx" ON "public"."PaymentWebhookLog"("platformOrderId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentWebhookLog_platformOrderId_key" ON "public"."PaymentWebhookLog"("platformOrderId" ASC);

-- CreateIndex
CREATE INDEX "PaymentWebhookLog_userId_idx" ON "public"."PaymentWebhookLog"("userId" ASC);

-- CreateIndex
CREATE INDEX "Photo_status_idx" ON "public"."Photo"("status" ASC);

-- CreateIndex
CREATE INDEX "Photo_userId_idx" ON "public"."Photo"("userId" ASC);

-- CreateIndex
CREATE INDEX "ProfileVisit_createdAt_idx" ON "public"."ProfileVisit"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "ProfileVisit_visitedId_idx" ON "public"."ProfileVisit"("visitedId" ASC);

-- CreateIndex
CREATE INDEX "ProfileVisit_visitorId_idx" ON "public"."ProfileVisit"("visitorId" ASC);

-- CreateIndex
CREATE INDEX "User_cityId_idx" ON "public"."User"("cityId" ASC);

-- CreateIndex
CREATE INDEX "User_districtId_idx" ON "public"."User"("districtId" ASC);

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE INDEX "User_gender_idx" ON "public"."User"("gender" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UserPresence_userId_key" ON "public"."UserPresence"("userId" ASC);

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationRead" ADD CONSTRAINT "ConversationRead_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationRead" ADD CONSTRAINT "ConversationRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."District" ADD CONSTRAINT "District_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentWebhookLog" ADD CONSTRAINT "PaymentWebhookLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Photo" ADD CONSTRAINT "Photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileVisit" ADD CONSTRAINT "ProfileVisit_visitedId_fkey" FOREIGN KEY ("visitedId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProfileVisit" ADD CONSTRAINT "ProfileVisit_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPresence" ADD CONSTRAINT "UserPresence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
