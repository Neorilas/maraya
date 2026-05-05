-- AlterTable: alt-text para HomeCollection.imageUrl
ALTER TABLE "HomeCollection" ADD COLUMN "imageAlt" TEXT;

-- AlterTable: alt-text paralelo a Product.images (mismo índice)
ALTER TABLE "Product" ADD COLUMN "imagesAlt" TEXT[] DEFAULT ARRAY[]::TEXT[];
