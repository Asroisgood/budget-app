/*
  Warnings:

  - You are about to drop the column `type` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `type`;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
