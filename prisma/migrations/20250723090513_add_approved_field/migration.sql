/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CourseCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HomeworkSubmission" ADD COLUMN     "approved" BOOLEAN;

-- CreateIndex
CREATE UNIQUE INDEX "CourseCategory_name_key" ON "CourseCategory"("name");
