-- CreateTable
CREATE TABLE "Leads" (
    "leadId" INTEGER NOT NULL,
    "leadName" TEXT NOT NULL,
    "contactInformation" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "interestLevel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "assignedSalesPerson" TEXT NOT NULL,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("leadId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leads_contactInformation_key" ON "Leads"("contactInformation");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
