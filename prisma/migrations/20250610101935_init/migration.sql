-- CreateTable
CREATE TABLE "Number" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Number_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "class" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);
