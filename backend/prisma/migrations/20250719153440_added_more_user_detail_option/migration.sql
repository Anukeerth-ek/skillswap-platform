-- CreateTable
CREATE TABLE "UserProfessionDetails" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserProfessionDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCurrentOrganization" (
    "id" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserCurrentOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserExperienceSummary" (
    "id" TEXT NOT NULL,
    "years" INTEGER NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserExperienceSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCurrentStatus" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserCurrentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSocialLinks" (
    "id" TEXT NOT NULL,
    "linkedin" TEXT,
    "github" TEXT,
    "twitter" TEXT,
    "leetcode" TEXT,
    "website" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserSocialLinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfessionDetails_userId_key" ON "UserProfessionDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCurrentOrganization_userId_key" ON "UserCurrentOrganization"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserExperienceSummary_userId_key" ON "UserExperienceSummary"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCurrentStatus_userId_key" ON "UserCurrentStatus"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSocialLinks_userId_key" ON "UserSocialLinks"("userId");

-- AddForeignKey
ALTER TABLE "UserProfessionDetails" ADD CONSTRAINT "UserProfessionDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCurrentOrganization" ADD CONSTRAINT "UserCurrentOrganization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserExperienceSummary" ADD CONSTRAINT "UserExperienceSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCurrentStatus" ADD CONSTRAINT "UserCurrentStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSocialLinks" ADD CONSTRAINT "UserSocialLinks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
