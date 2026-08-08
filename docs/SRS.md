# GoldPay ERP - Software Requirement Specification

## 1. Introduction
GoldPay ERP is a comprehensive Jewellery ERP & Inventory Management System designed for jewellery businesses. It provides end-to-end management of inventory, billing, customers, suppliers, accounting, and reporting.

## 2. System Features

### 2.1 Authentication & Authorization
- Secure login with email/phone + password
- JWT-based authentication
- Role-based access control (Super Admin, Admin, Manager, Sales, Accountant, Staff)
- Session management
- Password encryption with bcryptjs

### 2.2 Dashboard Analytics
- Today's sales summary
- Daily profit calculation
- Monthly income & profit
- Total stock value (gold, silver, diamond)
- Pending payments (customer & supplier)
- Cash in hand
- Top-selling products
- Top customers
- Low-stock alerts
- Recent activities
- Charts: daily/weekly/monthly/yearly sales & profit

### 2.3 Inventory Management
- Multi-metal support: Gold, Silver, Diamond, Platinum
- Gold purity: 24KT, 22KT, 18KT, 14KT
- Silver purity: Fine 999, Sterling 925, Britannia 958
- Categories: Rings, Earrings, Chains, Bracelets, Bangles, Necklaces, Pendants, Mangalsutra, Payal, Toe Rings, Nose Pins, Kada, Coins, Biscuits
- Unique barcode/SKU per item
- Product code, category, metal type, purity
- Gross weight, net weight, stone weight
- Making charges, wastage percentage
- Hallmark details, design number
- Purchase price, selling price, MRP
- Stock quantity with minimum stock alerts
- Product images & videos
- Stock movement history

### 2.4 Barcode System
- Automatic barcode generation
- Barcode printing (thermal & A4)
- Mobile camera barcode scanning
- Instant product search via barcode
- QR code support
- Label printing

### 2.5 Billing Module
- GST invoices with CGST/SGST/IGST
- Normal invoices
- Quotations & estimates
- Purchase invoices
- Return invoices, credit notes, debit notes
- Thermal & A4 printing
- PDF invoice download
- Direct print
- HSN codes & tax summaries
- Company logo customization
- WhatsApp & email sharing
- Payment tracking (partial, advance, credit)

### 2.6 Customer Management
- Profile with photo
- Phone, address, GST number
- Purchase history & payment history
- Customer ledger with balance
- Credit limits
- Outstanding balance tracking
- Reminders & notifications

### 2.7 Supplier Management
- Complete supplier profiles
- GST information
- Purchase history
- Pending payments
- Supplier ledger

### 2.8 Accounting
- Daily cash book
- Expenses tracking (rent, salary, electricity, etc.)
- Income tracking
- Profit & loss statements
- General ledger
- Balance sheet readiness
- Opening/closing balance
- Cash flow management
- Multiple payment methods

### 2.9 Reports
- Daily/weekly/monthly/yearly sales
- Purchase reports
- Inventory reports
- Profit reports
- GST reports
- Tax reports
- Customer reports
- Supplier reports
- Stock valuation
- Employee performance
- Excel/CSV/PDF export

### 2.10 Notifications
- Low stock alerts
- Pending customer payments
- Supplier dues
- Backup reminders
- System alerts

### 2.11 Backup & Security
- Automatic daily database backups
- Manual backup/restore
- Audit logs
- Activity history
- System logs
- Encrypted passwords
- JWT authentication
- Role-based permissions
- SQL injection protection
- XSS protection
- Rate limiting
- Input validation

## 3. Technical Requirements
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS with shadcn/ui
- Prisma ORM with PostgreSQL
- Redis caching
- Docker containerization
- JWT authentication
- Cloudinary/AWS S3 for media
- Responsive design (mobile-first)
- Dark/Light mode
- SEO-friendly
- PWA-ready
