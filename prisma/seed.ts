import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import crypto from "node:crypto"

import { SHIPPING_ZONES } from "./seeds/shipping-zones"
import { HOME_COLLECTIONS } from "./seeds/home-collections"
import { TRUST_BADGES } from "./seeds/trust-badges"

const prisma = new PrismaClient()

async function seedShippingZones() {
  for (const zone of SHIPPING_ZONES) {
    await prisma.shippingZone.upsert({
      where: { code: zone.code },
      update: zone,
      create: zone,
    })
  }
  console.log(`✓ Shipping zones: ${SHIPPING_ZONES.length} upserted`)
}

async function seedSettings() {
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      storeName: "Maraya Store",
      storeEmail: process.env.STORE_EMAIL ?? "pedidos@marayastore.com",
      adminEmail: process.env.ADMIN_EMAIL ?? "admin@marayastore.com",
    },
  })
  console.log("✓ Settings singleton ensured")
}

async function seedHomeCollections() {
  for (const c of HOME_COLLECTIONS) {
    await prisma.homeCollection.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    })
  }
  console.log(`✓ Home collections: ${HOME_COLLECTIONS.length} upserted`)
}

async function seedTrustBadges() {
  // Tabla sin clave natural; reseteamos solo si está vacía para no pisar ediciones del admin.
  const count = await prisma.trustBadge.count()
  if (count > 0) {
    console.log(`✓ Trust badges: ya hay ${count}, no se tocan`)
    return
  }
  for (const b of TRUST_BADGES) {
    await prisma.trustBadge.create({ data: b })
  }
  console.log(`✓ Trust badges: ${TRUST_BADGES.length} creados`)
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@marayastore.com"
  const existing = await prisma.admin.findUnique({ where: { email: adminEmail } })
  if (existing) {
    console.log(`✓ Admin ${adminEmail} ya existe — no se modifica`)
    return
  }
  const plain =
    process.env.ADMIN_INITIAL_PASSWORD ?? crypto.randomBytes(12).toString("base64url")
  const hash = await bcrypt.hash(plain, 12)
  await prisma.admin.create({
    data: { email: adminEmail, password: hash, name: "Admin" },
  })
  console.log("─".repeat(60))
  console.log("ADMIN INICIAL CREADO. APUNTA ESTAS CREDENCIALES AHORA:")
  console.log(`  email:    ${adminEmail}`)
  console.log(`  password: ${plain}`)
  console.log("Se mostrará SOLO esta vez. Cámbialo desde /admin/configuracion.")
  console.log("─".repeat(60))
}

async function main() {
  await seedShippingZones()
  await seedSettings()
  await seedHomeCollections()
  await seedTrustBadges()
  await seedAdmin()
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
