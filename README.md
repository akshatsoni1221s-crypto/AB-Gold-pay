# AB GoldPay — Luxury Jewellery ERP & POS

> Enterprise-grade **Jewellery ERP, Inventory & Point-of-Sale** system built for the modern jewellery business. Manage inventory, billing, customers, suppliers, accounting and printing — all in one elegant, mobile-first platform.

![Stack](https://img.shields.io/badge/Next.js%2014-App%20Router-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-Proprietary-FF6B00)

---

## ✨ Features

### 💰 Billing & POS (Point of Sale)
- **Create & Print invoices directly** — saves the bill and opens an 80mm thermal-receipt style printout
- **With Tax / Without Tax** toggle — GST invoices with 3% tax, or simple sale invoices
- **Mobile barcode scanning** — point your phone camera at any barcode to add the product to the bill instantly
- Manual barcode entry with instant lookup (`barcode + Enter`)
- Walk-in or registered customers, payment methods (Cash / UPI / Card / Cheque), partial & full payments
- Payment tracking: PAID / PARTIAL / UNPAID / OVERDUE

### 💍 Inventory
- Multi-metal catalogue: **Gold (24K / 22K / 18K)**, **Silver (999 / 925)**, **Diamond**, **Platinum**
- Jewellery categories: Rings, Necklaces, Mangalsutra, Earrings, Bangles, Bracelets, Chains, Pendants, Nose Pins, Toe Rings, Anklets, Cufflinks, Coins & more
- Product photographs, gross/net weight, purity, making charges, wastage %
- Barcode / SKU generation per item
- Low-stock alerts and stock valuation

### 👤 Customers & Suppliers
- Customer profiles with purchase history, credit limits & outstanding balances
- Supplier ledger with pending payments
- Auto-updated ledgers on every invoice

### 📊 Dashboard
- Today's sales, monthly income & profit
- Total stock value (gold / silver / diamond)
- Top customers & best-selling products
- Low-stock alerts & recent invoices
- Animated luxury metrics with gold accents

### 🧾 Accounting & Reports
- Expense tracking, payment records, daily cash
- GST reports, sales / purchase / inventory reporting
- Backup & restore, audit logs, activity history

### 🎨 Luxury Aurelian UI
- Signature **gold-on-ivory** design language with dark mode
- Glass panels, gold-gradient buttons, shimmer & 3D tilt effects
- Fully responsive — mobile-first POS experience
- WebGL animated login background

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- npm or yarn

### 1. Clone & install

```bash
git clone https://github.com/akshatsoni1221s-crypto/AB-Gold-pay.git
cd AB-Gold-pay

npm install
```

### 2. Configure environment

Copy the example environment file and adjust values:

```bash
cp .env.example .env
```

Then set a `DATABASE_URL` (SQLite works out of the box) and your `JWT_SECRET`:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-at-least-32-chars"
```

### 3. Set up the database

```bash
npx prisma db push      # create schema
npm run db:seed         # seed demo data (admin, 47 products, 32 customers)
```

### 4. Run

```bash
npm run dev
```

Open **http://localhost:3000** and sign in with the demo credentials:

| Role  | Email               | Password   |
| ----- | ------------------- | ---------- |
| Admin | `admin@goldpay.com` | `Admin@123` |
| Staff | `staff@goldpay.com` | `Staff@123` |

---

## 🏷️ Barcode Scanning (Mobile)

1. Open the **Billing & POS** tab
2. Tap **Scan** → camera opens on the rear lens
3. Point it at any product barcode (EAN-13, EAN-8, UPC, Code-128, Code-39, QR)
4. The product is added to the cart automatically → **Create & Print Invoice**

> Works on Android Chrome + iOS Safari (BarcodeDetector API). On desktop, type the barcode and press **Enter**.

---

## 🎉 Print a bill

After creating an invoice, tap **Print** — a thermal-receipt-style printout opens with:

- Brand header (Aurelian / AB GoldPay)
- Invoice no, date & customer
- Itemised table (item, qty, rate, amount)
- Subtotal, GST (if enabled), **Grand Total**
- Paid / balance due, payment status
- Hallmark & thank-you footer

---

## 🧰 Tech Stack

| Layer        | Technology                                     |
| ------------ | ---------------------------------------------- |
| Framework    | Next.js 14 (App Router)                        |
| Language     | TypeScript                                     |
| Styling      | Tailwind CSS + custom design system (dark mode) |
| Database      | Prisma ORM (SQLite / PostgreSQL ready)          |
| Auth        | JWT (jose) + bcryptjs, role-based access        |
| Barcode      | BarcodeDetector API (camera) + manual entry     |
| Charts       | Recharts                                        |
| PDF          | PdfKit / PdfMake, HTML2PDF for exports          |
| Misc         | React Query, Radix UI, Framer Motion, Zustand    |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/login      # Luxury login (WebGL background)
│   ├── (dashboard)/      # POS, Inventory, Dashboard, Customers…
│   └── api/              # REST endpoints (billing, inventory, auth…)
├── components/
│   ├── layout/           # Wrappers
│   └── stitch/           # Aurelian design system (topbar, nav, shader…)
├── lib/                  # prisma, auth, middleware, formatters
prisma/
├── schema.prisma         # Models: User, Product, Invoice, Customer…
└── seed.ts               # Demo seed (47 products, 32 customers, 20 invoices)
docs/                     # SRS, API, manual, architecture docs
```

---

## 📚 Documentation

- [Software Requirements (SRS)](docs/SRS.md)
- [API Reference](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Admin Manual](docs/ADMIN_MANUAL.md)
- [User Manual](docs/USER_MANUAL.md)

---

## 🗂️ License

Private — © 2026 AB GoldPay. All rights reserved.