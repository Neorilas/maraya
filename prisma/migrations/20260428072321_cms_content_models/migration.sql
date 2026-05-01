-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "brandBannerBadge" TEXT DEFAULT 'Hecho con amor en España',
ADD COLUMN     "brandBannerCtaText" TEXT DEFAULT 'Conoce nuestra historia',
ADD COLUMN     "brandBannerCtaUrl" TEXT DEFAULT '/sobre-nosotros',
ADD COLUMN     "brandBannerEyebrow" TEXT DEFAULT 'desde 2024',
ADD COLUMN     "brandBannerText" TEXT NOT NULL DEFAULT 'Cada bolso pasa por las manos de nuestras artesanas. Materiales cuidados, costuras al detalle y diseños que cuentan algo de ti.',
ADD COLUMN     "brandBannerTitle" TEXT NOT NULL DEFAULT 'Brilla.
Destaca.
Sé Maraya.',
ADD COLUMN     "clubIntro" TEXT DEFAULT 'Acceso anticipado · Descuentos exclusivos · Regalos · Envíos gratis siempre',
ADD COLUMN     "heroCtaPrimaryText" TEXT NOT NULL DEFAULT 'Descubre la colección',
ADD COLUMN     "heroCtaPrimaryUrl" TEXT NOT NULL DEFAULT '/bolsos',
ADD COLUMN     "heroCtaSecondaryText" TEXT DEFAULT 'Ver novedades',
ADD COLUMN     "heroCtaSecondaryUrl" TEXT DEFAULT '/bolsos?filter=new',
ADD COLUMN     "heroEyebrow" TEXT DEFAULT 'Nueva colección',
ADD COLUMN     "heroHighlight" TEXT NOT NULL DEFAULT 'ÚNICA',
ADD COLUMN     "heroImageUrl" TEXT,
ADD COLUMN     "heroSubtitle" TEXT NOT NULL DEFAULT 'Bolsos artesanales con alma. Cada pieza, una historia.',
ADD COLUMN     "heroTitle" TEXT NOT NULL DEFAULT 'Atrévete a ser',
ADD COLUMN     "newsletterIntro" TEXT DEFAULT '-10% de descuento en tu primer pedido al suscribirte.',
ADD COLUMN     "topBarActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "topBarText" TEXT NOT NULL DEFAULT 'Envío gratis en pedidos superiores a 50 €',
ADD COLUMN     "twitterUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "HomeCollection" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tag" TEXT,
    "gradient" TEXT NOT NULL DEFAULT 'from-pink-primary to-pink-deep',
    "imageUrl" TEXT,
    "href" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustBadge" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Sparkles',
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustBadge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomeCollection_slug_key" ON "HomeCollection"("slug");
