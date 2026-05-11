<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Maraya Store — mapa del proyecto

> **Antes de leer ficheros, lee este mapa.** Su único objetivo es que NO tengas que abrir 20 archivos por sesión para localizar la lógica que necesitas tocar. Cada sección apunta al fichero exacto donde vive cada cosa.
>
> **Mantén este documento al día.** Cada vez que añadas un modelo nuevo, una nueva ruta, un patrón nuevo o cambies dónde vive una pieza de lógica, edita las secciones afectadas. Si dudas, añadir info > omitirla.

---

## 0. Estado y deploy

- **Producción staging:** https://maraya.91.107.235.70.nip.io (Caddy del proyecto `fundacion` hace reverse-proxy con SSL Let's Encrypt automático).
- **Repo:** `git@github.com:Neorilas/maraya.git` (rama `main`).
- **Hetzner:** alias SSH `maraya` (clave `~/.ssh/maraya_hetzner`). Postgres 16 + Next.js corren en Docker en `/root/maraya/`.
- **Pipeline auto:** `.git/hooks/post-commit` hace `git push` y luego `ssh maraya /root/maraya/deploy.sh` (que pull + build + up). Cada commit en `main` despliega solo. **No** introducir cambios sin commit cuando el dev server local está corriendo, o quedarán solo en local.
- **Admin demo:** `admin@marayastore.com` / `maraya2026` (bcrypt en BD).
- **Para más detalle:** `~/.claude/projects/C--proyectos-maraya/memory/reference_production_deploy.md`.

## 1. Stack

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Framework | Next.js 16 (App Router, Turbopack dev) | `output: "standalone"` para Docker |
| Lenguaje | TypeScript 5 strict | |
| Estilos | Tailwind v4 (CSS `@theme`) + design tokens en `app/globals.css` | NO `tailwind.config.*` |
| Tipografías | Google Fonts vía `next/font/google` (Playfair, Dancing Script, Nunito, Permanent Marker) | Todas en `app/layout.tsx` |
| BD | PostgreSQL 16 (Hetzner Docker, bind 127.0.0.1) | acceso local por túnel SSH |
| ORM | Prisma 6.x (NO subir a 7 — ver memory `project_prisma_v6_pinned.md`) | client en `lib/prisma.ts` |
| Auth | NextAuth v5 beta (Auth.js) credentials + bcryptjs | `lib/auth.ts` + `proxy.ts` |
| Pagos | Stripe (Payment Intent + Elements + webhook) | server en `lib/stripe.ts` |
| Email | Resend (con fallback console.log) | `lib/email/sender.ts` |
| Imágenes | Hetzner Object Storage S3-compatible (presigned PUT) | `lib/s3.ts` |
| Estado cliente | Zustand persist | `lib/store/cart.ts` |
| Validación | Zod 4 | en cada server action |
| Iconos | lucide-react v1 (sin brands — usar `components/store/SocialIcons.tsx`) | |

## 2. Rutas (URLs)

### Tienda pública — `app/(store)/`
| URL | Página |
|-----|--------|
| `/` | `app/(store)/page.tsx` (home: TopBar + Hero + Trust + Collections + Brand) |
| `/bolsos` | `app/(store)/bolsos/page.tsx` (catálogo + filtros) |
| `/bolsos/[slug]` | `app/(store)/bolsos/[slug]/page.tsx` (ficha producto) |
| `/carrito` | `app/(store)/carrito/page.tsx` |
| `/checkout` | `app/(store)/checkout/page.tsx` |
| `/pedido-confirmado/[orderNumber]` | `app/(store)/pedido-confirmado/[orderNumber]/page.tsx` |
| `/seguimiento/[orderNumber]` | `app/(store)/seguimiento/[orderNumber]/page.tsx` |
| `/contacto` | `app/(store)/contacto/page.tsx` |
| `/sobre-nosotros` | `app/(store)/sobre-nosotros/page.tsx` |

`app/(store)/layout.tsx` declara `dynamic = "force-dynamic"` y mete `<TopBar><Header><main>{children}</main><Footer>`.

### Admin protegido — `app/admin/`
| URL | Página | Notas |
|-----|--------|-------|
| `/admin/login` | `app/admin/login/page.tsx` | NO bajo el panel layout |
| `/admin` | `app/admin/(panel)/page.tsx` | Dashboard con KPIs |
| `/admin/pedidos` | `app/admin/(panel)/pedidos/page.tsx` | Lista + filtros |
| `/admin/pedidos/[id]` | `app/admin/(panel)/pedidos/[id]/page.tsx` | Detalle + cambio estado |
| `/admin/productos` | `app/admin/(panel)/productos/page.tsx` | Lista + editor categorías |
| `/admin/productos/nuevo` | `app/admin/(panel)/productos/nuevo/page.tsx` | |
| `/admin/productos/[id]` | `app/admin/(panel)/productos/[id]/page.tsx` | |
| `/admin/contenido` | `app/admin/(panel)/contenido/page.tsx` | TopBar/Hero/Brand + Menu + Trust + Collections |
| `/admin/configuracion` | `app/admin/(panel)/configuracion/page.tsx` | Tienda + Stripe + Social + Footer |
| `/admin/envios` | `app/admin/(panel)/envios/page.tsx` | Zonas envío |

`app/admin/(panel)/layout.tsx` hace `await auth()` (redirect si no sesión) y monta `<AdminShell>` (sidebar + topbar). Login está FUERA del grupo `(panel)` para no heredar sidebar.

### API routes — `app/api/`
| Endpoint | Fichero | Función |
|----------|---------|---------|
| `/api/auth/*` | `app/api/auth/[...nextauth]/route.ts` | Re-exporta `handlers` de `lib/auth.ts` |
| `/api/shipping/quote` | `app/api/shipping/quote/route.ts` | Cliente del checkout pide coste por país+subtotal |
| `/api/checkout/create-payment-intent` | `app/api/checkout/create-payment-intent/route.ts` | Crea pedido PENDIENTE + PI Stripe |
| `/api/stripe/webhook` | `app/api/stripe/webhook/route.ts` | Procesa `payment_intent.succeeded`, `payment_failed`, `charge.refunded` |
| `/api/upload` | `app/api/upload/route.ts` | POST: recibe imagen, convierte a WebP con sharp, guarda en disco local |
| `/api/uploads/*` | `app/api/uploads/[...path]/route.ts` | GET: sirve imágenes subidas con cache immutable |

### Otros archivos en raíz
- `proxy.ts` — Next 16 reemplaza `middleware.ts`. Protege `/admin/*` con `auth()`.
- `next.config.ts` — `output: "standalone"`, `images.remotePatterns: [https/**]`.
- `Dockerfile` — multi-stage node:22-slim, copia `.next/standalone` + Prisma engines.
- `prisma/schema.prisma` — todos los modelos (ver §4).
- `prisma/seed.ts` — orquesta seeds desde `prisma/seeds/*.ts`.

---

## 3. Dónde vive cada lógica

### 🛒 Compra (carrito → checkout → pago → pedido)

| Flujo | Fichero | Detalle |
|-------|---------|---------|
| Carrito (Zustand persist) | `lib/store/cart.ts` | items, qty, subtotal, persist `maraya-cart` en localStorage |
| Botón "Añadir al carrito" | `components/store/AddToCartButton.tsx` | usa `useCart` |
| Icono carrito header (counter live) | `components/store/CartIconButton.tsx` | client, lee `useCart` |
| Vacía carrito tras éxito | `components/store/ClearCartOnMount.tsx` | usado en `/pedido-confirmado` |
| Validación checkout (DNI/NIE, email…) | `lib/checkout.ts` | zod schema `checkoutSchema` + util `validSpanishId` + lista `CHECKOUT_COUNTRIES` |
| Form checkout (Stripe Elements) | `components/store/CheckoutForm.tsx` | client, `Elements` con deferred intent |
| Resumen lateral checkout | `components/store/CheckoutSummary.tsx` | shipping recalculado vía API |
| Cálculo coste envío | `lib/shipping.ts` | `getShippingQuote(country, subtotal)` cachea con `react.cache` |
| Mapping país → zona | `lib/shipping.ts` (`COUNTRY_TO_ZONE`) | ES, ES-IB, ES-GC, EUROPE, USA, OTHER |
| API recálculo en cliente | `app/api/shipping/quote/route.ts` | GET `?country=&subtotal=` |
| Crear PaymentIntent + Order PENDIENTE | `app/api/checkout/create-payment-intent/route.ts` | recalcula totales server-side |
| Helper crear/marcar pedido | `lib/order.ts` | `createPendingOrder`, `markOrderAsPaid`, `generateOrderNumber()` (`MAR-YYYY-NNNN`) |
| Webhook Stripe | `app/api/stripe/webhook/route.ts` | verifica firma, llama `markOrderAsPaid` y `sendOrderConfirmationEmails` |
| Cliente Stripe server | `lib/stripe.ts` | lazy singleton + `isStripeConfigured()` + `StripeNotConfiguredError` |
| Página confirmación | `app/(store)/pedido-confirmado/[orderNumber]/page.tsx` | |
| Página seguimiento (público) | `app/(store)/seguimiento/[orderNumber]/page.tsx` | progreso 5 pasos |

### 📬 Contacto

| Pieza | Fichero | Detalle |
|-------|---------|---------|
| Página contacto (info + form) | `app/(store)/contacto/page.tsx` | lee Settings para info, form con honeypot |
| Form contacto (client) | `components/store/ContactForm.tsx` | `useActionState`, anti-spam honeypot |
| Server action envío | `lib/contact.ts` | valida con zod, envía email vía Resend a adminEmail |

### 📖 Sobre Nosotros

| Pieza | Fichero | Detalle |
|-------|---------|---------|
| Página sobre nosotros | `app/(store)/sobre-nosotros/page.tsx` | 3 bloques (historia/valores/proceso) desde Settings |

### 📦 Productos (catálogo público + admin CRUD)

| Pieza | Fichero |
|-------|---------|
| Queries cacheadas catálogo | `lib/store/products.ts` (`getCatalog`, `getProductBySlug`, `getRelatedProducts`, `isNew`) |
| Card producto | `components/store/ProductCard.tsx` |
| Filtros catálogo (móvil colapsable) | `components/store/CatalogFilters.tsx` |
| Galería ficha | `components/store/ProductGallery.tsx` |
| Share buttons (WhatsApp/FB/X/IG) | `components/store/ShareButtons.tsx` |
| Iconos sociales SVG inline | `components/store/SocialIcons.tsx` |
| Server actions admin | `lib/admin/products.ts` (`createProductAction`, `updateProductAction`, `deleteProductAction`) |
| Validación zod productos | `lib/admin/products.ts` (`productCreateSchema`, `productUpdateSchema`) |
| Tabla productos admin | `components/admin/products/ProductsTable.tsx` |
| Form producto (crear/editar) | `components/admin/products/ProductForm.tsx` |
| Subida imágenes (drop + URL paste + alt SEO) | `components/admin/products/ProductImagesField.tsx` |
| Botón eliminar con confirm | `components/admin/products/DeleteProductButton.tsx` |
| Lista categorías editables | `components/admin/categories/CategoriesEditor.tsx` (desplegable en /admin/productos) |
| Categoría row | `components/admin/categories/CategoryRow.tsx` |
| Server actions categorías | `lib/admin/product-categories.ts` |

### 🎨 Contenido / CMS / Secciones del home

| Sección visual | Componente público | Settings/modelo BD | Dónde se edita |
|----------------|--------------------|--------------------|------------------|
| Top bar promo | `components/store/TopBar.tsx` | Settings.topBarText/Active | `SectionTopBar` en /admin/contenido |
| Header | `components/store/Header.tsx` | (NAV viene de `MenuItem` en BD) | Editor `MenuItemsEditor` en /contenido |
| Hero | `components/store/HeroBanner.tsx` | Settings.hero* | `SectionHero` en /contenido |
| Trust badges | `components/store/TrustBadges.tsx` | `TrustBadge` model | `TrustBadgesEditor` en /contenido |
| Colecciones del home | `components/store/CollectionsGrid.tsx` | `HomeCollection` model | `CollectionsEditor` + `CollectionDestinationField` en /contenido |
| Brand banner ("Brilla. Destaca.") | `components/store/BrandBanner.tsx` | Settings.brandBanner* | `SectionBrandBanner` en /contenido |
| Footer | `components/store/Footer.tsx` | Settings.newsletterIntro / clubIntro / social URLs | `SectionFooter` + `SectionSocial` en /admin/configuracion |
| Logo | `public/maraya-logo.png` | (no editable desde admin, cambiar archivo) | swap directo |
| Marco categorías | `public/marco.png` | (no editable, cambiar archivo) | swap directo |
| Leopardo decorativo | `public/leopardo.png` | (no editable, cambiar archivo) | swap directo |

#### Settings — single-row model (`Settings { id: "singleton" }`)

Lectura: `lib/store/content.ts` → `getSettings()` (cacheado por request).
Escritura: `lib/admin/settings.ts` → `saveSettingsAction` (admite **updates parciales**: solo persiste campos enviados).

Forms que la editan (parten el schema en dos vistas):
- `components/admin/settings/SettingsForm.tsx` — usa `SectionStore`, `SectionSocial`, `SectionStripe`, `SectionFooter` → /admin/configuracion
- `components/admin/settings/ContentSettingsForm.tsx` — usa `SectionTopBar`, `SectionHero`, `SectionBrandBanner`, `SectionAbout`, `SectionContact` → /admin/contenido
- `components/admin/settings/SettingsStickyBar.tsx` — UI compartida (botón Guardar + flash)
- `components/admin/settings/SectionCard.tsx` — wrapper cosmético compartido

**⚠️ Toggles emiten `__has_<name>`**: el `Toggle` de `components/admin/forms/Field.tsx` añade un hidden input `__has_X` para que `saveSettingsAction` distinga "off explícito" de "no incluido en este form". Importante para updates parciales.

### 🍔 Menú principal

- Modelo: `MenuItem` (ver §4).
- Lectura header: `lib/store/content.ts` → `getActiveMenuItems()`.
- Render header: `components/store/Header.tsx` (mapea menuItems).
- CRUD admin: `components/admin/content/MenuItemsEditor.tsx` + `MenuItemRow.tsx`.
- Server actions: `lib/admin/menu-items.ts` (`saveMenuItem`, `createMenuItem`, `deleteMenuItem`).

### 🎀 Decoraciones / patrones / iconos

| Pieza | Fichero |
|-------|---------|
| Iconos sociales SVG (no en lucide v1) | `components/store/SocialIcons.tsx` |
| Hojas tropicales decorativas | `components/store/decorations/TropicalLeaf.tsx` |
| Sparkles | `components/store/decorations/Sparkle.tsx` (`Sparkle`, `SparkleField`) |
| Esquinas barrocas doradas | `components/store/decorations/GoldCornerOrnament.tsx` (`GoldCornerOrnament`, `GoldCorners`) |
| Ilustración bolso fallback hero | `components/store/BagIllustration.tsx` |
| Patrones CSS leopardo / zebra / sparkles | `app/globals.css` (`.bg-leopard`, `.bg-leopard-teal`, `.bg-zebra`, `.bg-zebra-soft`, `.bg-sparkles`) |
| Tokens color/font | `app/globals.css` `@theme {}` |
| Mapeo nombre→componente lucide para TrustBadge.icon | `lib/store/icons.ts` (`STORE_ICON_MAP`, `getStoreIcon`, `STORE_ICON_OPTIONS`) |

### 🔐 Auth admin

- Config NextAuth v5: `lib/auth.ts` (credentials provider + bcrypt + JWT 8h).
- Re-export handlers: `app/api/auth/[...nextauth]/route.ts`.
- Tipos extendidos: `types/next-auth.d.ts` (añade `id`, `email`, `name` a Session.user).
- Form login: `components/admin/LoginForm.tsx` + página `app/admin/login/page.tsx`.
- Protección rutas: `proxy.ts` (matcher `/admin/:path*`, redirect a `/admin/login` si no auth).
- Defense-in-depth en pages admin: `await auth()` en `app/admin/(panel)/layout.tsx`.

### 🧰 Admin shell

- Layout panel: `app/admin/(panel)/layout.tsx`.
- Wrapper cliente con context drawer: `components/admin/AdminShell.tsx` (`useAdminSidebar`).
- Sidebar items list: `lib/admin/nav.ts` (`ADMIN_NAV`, `isNavActive`).
- Sidebar render: `components/admin/Sidebar.tsx` (client, `usePathname`).
- Topbar: `components/admin/AdminTopBar.tsx` (server, server action signOut).
- Botón hamburguesa móvil: `components/admin/MobileMenuButton.tsx` (client, lee context).
- Placeholder páginas no implementadas: `components/admin/PlaceholderPage.tsx`.

### 📊 Dashboard admin

- Queries (KPIs): `lib/admin/dashboard.ts` → `getDashboardStats()`.
- Card KPI: `components/admin/StatsCard.tsx`.
- Tabla pedidos recientes: `components/admin/RecentOrdersTable.tsx`.
- Badge estado pedido (compartido): `components/admin/OrderStatusBadge.tsx`.

### 📨 Pedidos admin

- Lista: `app/admin/(panel)/pedidos/page.tsx` (filtros estado + search).
- Detalle: `app/admin/(panel)/pedidos/[id]/page.tsx`.
- Tabla: `components/admin/orders/OrdersTable.tsx`.
- Cambio estado (form): `components/admin/orders/OrderStatusForm.tsx`.
- Tabla items: `components/admin/orders/OrderItemsTable.tsx`.
- Timeline historial: `components/admin/orders/OrderHistoryTimeline.tsx`.
- Server action cambio estado: `lib/admin/orders.ts` → `updateOrderStatus` (dispara email auto en estados notificables).

### 📧 Emails

- Wrapper sender (Resend o console): `lib/email/sender.ts` (`sendEmail`).
- Templates HTML inline-styles: `lib/email/templates.ts` (`customerOrderConfirmation`, `adminNewOrderAlert`, `customerStatusUpdate`).
- Notifications (lee BD + envía): `lib/email/notifications.ts` (`sendOrderConfirmationEmails`, `sendStatusUpdateEmail`).
- Sin `RESEND_API_KEY` → log en consola, no falla.

### 🚚 Envíos

- Lectura zonas: `lib/shipping.ts` (`getShippingQuote`, `zoneCodeFor`, `NoShippingAvailableError`).
- Editor admin: `components/admin/shipping/ShippingZonesEditor.tsx` + `ShippingZoneRow.tsx`.
- Server actions: `lib/admin/shipping-zones.ts` (`saveShippingZone`, `createShippingZone`, `deleteShippingZone`).
- Página: `app/admin/(panel)/envios/page.tsx`.

### 📸 Subida de imágenes (almacenamiento local)

- API upload: `app/api/upload/route.ts` — POST recibe archivo, convierte a WebP con sharp, guarda en `UPLOAD_DIR` (default `./uploads`).
- API serve: `app/api/uploads/[...path]/route.ts` — GET sirve archivos con `Cache-Control: immutable`.
- Componente cliente uploader: `components/admin/products/ProductImagesField.tsx` — POST a `/api/upload`, sin S3.
- Docker: volumen persistente `maraya_uploads` montado en `/app/uploads` (sobrevive a redeploys).
- Las URLs de imágenes en BD son paths relativos tipo `/api/uploads/1234-abc.webp`.
- Legacy S3: `lib/s3.ts` y `lib/admin/uploads.ts` siguen existiendo como fallback pero no se usan.

### 🛠️ Utils generales

- `lib/cn.ts` — concat classnames con falsy filter
- `lib/slug.ts` — `slugify(text)` (NFD + dash)
- `lib/prisma.ts` — singleton Prisma client (no recrear en hot reload)

---

## 4. Modelos Prisma (`prisma/schema.prisma`)

| Modelo | Función | Único | Notas |
|--------|---------|-------|-------|
| `Product` | Catálogo bolsos | `sku`, `slug` | `images: String[]`, `imagesAlt: String[]` (paralelo, alt SEO por imagen), `tags: String[]`, soft delete vía `isActive` cuando hay pedidos |
| `Order` | Pedido cliente | `orderNumber` (`MAR-YYYY-NNNN`), `trackingToken` (UUID) | `status: OrderStatus`, items en relación, `trackingToken` securiza URLs de seguimiento, transacción de descuento stock en `markOrderAsPaid` |
| `OrderItem` | Línea pedido | — | `productName` y `price` snapshot al momento de pedir |
| `OrderStatusHistory` | Timeline | — | Append-only, lo escriben las server actions de orders |
| `ShippingZone` | Tarifas | `code` | `code: SPAIN/BALEARES/CANARIAS/EUROPE/USA/OTHER/<custom>`, `freeFrom: Float?` |
| `Settings` | Singleton CMS | `id="singleton"` | TODOS los textos del home + datos tienda + Stripe |
| `HomeCollection` | Cards del grid de colecciones | `slug` | `gradient: String` (Tailwind classes), `imageUrl?`, `imageAlt?` (alt SEO de la imagen) |
| `TrustBadge` | Cápsulas con icono | — | `icon: String` matchea `STORE_ICON_MAP` en `lib/store/icons.ts` |
| `MenuItem` | Items del header | — | `sortOrder`, `isActive`, `hasDropdown` |
| `ProductCategory` | Categorías catálogo | `slug` | Borrado lógico (desactiva) si está en uso por algún Product |
| `Admin` | Cuentas admin | `email` | `password: bcrypt hash` |
| enum `OrderStatus` | — | — | PENDIENTE / PAGADO / EN_PREPARACION / ENVIADO / ENTREGADO / CANCELADO / REEMBOLSADO |

**Migraciones aplicadas (`prisma/migrations/`):**
1. `20260427234506_init` — schema inicial.
2. `20260428072321_cms_content_models` — añadió `HomeCollection`, `TrustBadge`, campos de Settings.
3. `20260501204738_menu_and_categories` — `MenuItem`, `ProductCategory`.
4. `20260505132156_about_and_contact_pages` — campos `about*` y `contact*` en Settings.
5. `20260505_image_alt_fields` — `HomeCollection.imageAlt`, `Product.imagesAlt`.
6. `20260505191740_images_alt` — auto-generada por Prisma (drift fix de la anterior).
7. `20260512_tracking_token` — `trackingToken` UUID en `Order` + backfill + unique index.

**Seeds (`prisma/seeds/*.ts`):**
- `shipping-zones.ts` — 6 zonas (upsert por `code`).
- `home-collections.ts` — 4 colecciones iniciales.
- `trust-badges.ts` — 4 badges (solo si tabla vacía).
- `menu-items.ts` — 7 items menú (solo si tabla vacía).
- `product-categories.ts` — 6 categorías (upsert por `slug`).

`prisma/seed.ts` orquesta todo + crea Admin inicial con `ADMIN_INITIAL_PASSWORD` o random base64.

---

## 5. Variables de entorno (`.env`)

| Var | Para qué |
|-----|----------|
| `DATABASE_URL` | Postgres (local: con túnel SSH `127.0.0.1:55432`; server: directo) |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | NextAuth firma JWT |
| `AUTH_URL` / `NEXTAUTH_URL` / `NEXT_PUBLIC_URL` | URL pública (en server: `https://maraya.91.107.235.70.nip.io`) |
| `AUTH_TRUST_HOST` | `true` cuando hay reverse proxy delante |
| `STRIPE_PUBLIC_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe (TEST mientras no en prod) |
| `RESEND_API_KEY` / `FROM_EMAIL` / `ADMIN_EMAIL` | Emails |
| `S3_ENDPOINT` / `S3_REGION` / `S3_BUCKET` / `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` / `S3_PUBLIC_URL` | Hetzner Object Storage |

Producción: `/root/maraya/.env` en el server. Compose lo lee al recrear container.

## 6. Flujos clave (qué tocar para cada cambio)

| Cambio que pide el usuario | Ficheros a tocar |
|----------------------------|---------------------|
| **Nuevo campo en Producto** | `prisma/schema.prisma` (modelo) → migrate → `lib/admin/products.ts` (zod + action) → `components/admin/products/ProductForm.tsx` (input) → `components/store/ProductCard.tsx` y/o ficha (mostrar) |
| **Nueva sección en home** | Crear `components/store/MiSeccion.tsx` (server async, lee de `lib/store/content.ts`) → render en `app/(store)/page.tsx` → si es editable, añadir campos a `Settings` y `Section*` admin (en `components/admin/settings/`) |
| **Nuevo campo en Settings** | `prisma/schema.prisma` Settings → migrate → `lib/admin/settings.ts` zod (`.optional()`) → `components/admin/settings/Section<X>.tsx` (input) → `lib/store/content.ts` (no hay que tocar, devuelve todo) → componente público que lo lee |
| **Nuevo modelo CMS (tipo HomeCollection)** | `prisma/schema.prisma` → migrate → `lib/store/content.ts` (`getActiveX = cache(...)`) → `lib/admin/<x>.ts` server actions zod → `components/admin/content/<X>Row.tsx` + `<X>Editor.tsx` → render en `app/admin/(panel)/contenido/page.tsx` → componente público en `components/store/` |
| **Nueva ruta admin** | `app/admin/(panel)/<x>/page.tsx` → añadir item a `lib/admin/nav.ts` (auto sale en sidebar) |
| **Nueva ruta pública** | `app/(store)/<x>/page.tsx` → si necesita header/footer ya los hereda del layout |
| **Nuevo estado de pedido / lógica al cambiar estado** | `prisma/schema.prisma` enum `OrderStatus` → migrate → `lib/admin/orders.ts` (añadir lógica + email si aplica) → `lib/email/templates.ts` (nuevo template) → `components/admin/OrderStatusBadge.tsx` (estilo del badge) → `app/(store)/seguimiento/[orderNumber]/page.tsx` (icono + label en `STATUS_META`) |
| **Nuevo método de pago** | `lib/stripe.ts` (configuración) + checkout API (PI options) — Stripe automatic_payment_methods ya cubre la mayoría |
| **Nuevo país de envío** | `lib/shipping.ts` `COUNTRY_TO_ZONE` (mapping) + `lib/checkout.ts` `CHECKOUT_COUNTRIES` (label en select) + `prisma.shippingZone.create` desde admin si zona nueva |
| **Cambio de logo** | Reemplazar `public/maraya-logo.png` |
| **Cambio paleta** | `app/globals.css` `@theme {}` (variables `--color-*`) |
| **Cambio tipografía** | `app/layout.tsx` (cargar fuente `next/font/google`) + `app/globals.css` (token `--font-*`) |

## 7. Convenciones del proyecto

- **No ficheros monolíticos.** Si un fichero pasa de ~200 líneas, partir. Pages = orquestación, lógica en `lib/`, presentación en `components/`. Ver memory `feedback_modular_files_and_tests.md`.
- **Server vs Client Components.** Por defecto server. Cliente solo cuando hace falta (`useState`, `useEffect`, hooks de Stripe, eventos). Las async server components leen de `lib/*` que devuelve Promise; cachean por request con `react.cache`.
- **Server actions** viven en `lib/admin/<dominio>.ts` con `"use server"` al top. SIEMPRE empiezan llamando a `auth()` (helper `requireSession`).
- **Validación zod en cada action.** Errores van a `Record<string, string>` para que el form los muestre por campo.
- **Updates parciales en Settings:** todos los campos `.optional()`, action filtra `undefined`. Toggles dependen del hidden `__has_<name>`.
- **Nuevo admin editor de lista (CRUD inline)** sigue el patrón `<X>Row.tsx` (single form per row con `useActionState`) + `<X>Editor.tsx` (lista + form de creación en `<details>`).
- **Tests pendientes** (Vitest + Playwright) — al final del proyecto, no antes. Memory: `feedback_modular_files_and_tests.md`.
- **Confirmar antes de borrar en server.** Memory `feedback_no_destructive_actions.md`. Otros proyectos del usuario coexisten en el server.

## 8. Comandos útiles

```bash
# Local
npm run dev                # Next dev server
npm run db:tunnel          # Túnel SSH a Postgres Hetzner (local 55432 → remoto 5432)
npm run db:migrate         # Prisma migrate dev (necesita túnel)
npm run db:studio          # Prisma Studio (necesita túnel)
npm run db:seed            # Ejecutar seeds
npm run db:reset           # Reset BD + migrate + seed (CUIDADO)

# Server (vía SSH alias `maraya`)
ssh maraya                                              # entrar
ssh maraya "cd /root/maraya && docker compose logs -f app"   # logs en vivo
ssh maraya /root/maraya/deploy.sh                       # deploy manual
tail -f /var/log/maraya-deploy.log                      # log de deploys
```

## 9. Cosas que rompen / gotchas

- **lucide-react v1 NO trae brand icons** (Instagram, Facebook, …). Usa `components/store/SocialIcons.tsx`. Memory: `reference_lucide_v1_no_brands.md`.
- **Prisma 7 rompe `url = env(...)` en schema.** No subir a v7 sin avisar al usuario. Memory: `project_prisma_v6_pinned.md`.
- **Next.js 16 deprecó `middleware.ts`** → archivo se llama `proxy.ts` ahora. Memory: `reference_next16_proxy_and_authv5.md`.
- **`output: standalone` y Prisma:** el Dockerfile copia explícitamente `node_modules/.prisma`, `node_modules/@prisma/client`, `node_modules/prisma` y `prisma/` al runner para que el Prisma engine esté disponible.
- **`force-dynamic` en `(store)/layout.tsx`** — sin esto el build falla porque Next intenta SSG la home y no hay `DATABASE_URL` en build time.
- **Toggles del Field component** emiten un hidden `__has_X`. Si copias un Toggle sin esa lógica, los updates parciales fallarán al detectar "off".
- **bcrypt + bash escape:** los hashes contienen `$` que bash interpreta. Para reset de admin password, usar `psql -v hash="$HASH"` con archivo intermedio (ver `reference_production_deploy.md`).
- **fail2ban en server:** intentos SSH fallidos te banean. Si pruebas auth a ciegas, puedes quedarte fuera. Memory: `reference_hetzner_access.md`.

## 10. Memorias (`~/.claude/projects/C--proyectos-maraya/memory/`)

Si necesitas más contexto sobre una decisión, consulta:

| Archivo | Contenido |
|---------|-----------|
| `MEMORY.md` | Índice de todas las memorias |
| `project_maraya_overview.md` | Qué es Maraya y stack |
| `project_hetzner_multitenant.md` | El server tiene OTROS proyectos del usuario (fundacion, ambulancia, bolsa-analasis) — NO tocar |
| `project_architecture_choice.md` | Por qué BD en Hetzner + Next en mismo server (option A) |
| `project_prisma_v6_pinned.md` | Prisma fijado a v6 |
| `feedback_no_destructive_actions.md` | Confirmar antes de borrar nada en server |
| `feedback_modular_files_and_tests.md` | Ficheros pequeños + tests pendientes |
| `feedback_final_content_review.md` | Antes del deploy hacer revisión de copy con el usuario |
| `reference_hetzner_access.md` | SSH alias, túnel, paths, fail2ban |
| `reference_production_deploy.md` | URL pública, GitHub, redeploy, reset password |
| `reference_next16_proxy_and_authv5.md` | proxy.ts y NextAuth v5 (Auth.js) |
| `reference_lucide_v1_no_brands.md` | Iconos sociales SVG inline |

---

## 11. Cómo mantener este documento

Cada vez que añadas algo digno de mención (nuevo modelo, ruta, componente reutilizable, dependencia, gotcha…) actualiza la sección correspondiente:

- ¿Nuevo modelo Prisma? → §4
- ¿Nueva URL? → §2
- ¿Nuevo flujo de admin? → §3
- ¿Nueva env var? → §5
- ¿Nuevo gotcha? → §9
- ¿Nuevo workflow recurrente? → §6

Si dudas, regla: **prefiere documentar de más a documentar de menos**. Cada línea aquí ahorra ficheros leídos en sesiones futuras.
