# GoldPay ERP - Project Folder Structure

```
goldpay-erp/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed data
│   └── migrations/            # Auto-generated migrations
│
├── src/
│   ├── app/
│   │   ├── (auth)/            # Auth pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   │
│   │   ├── (dashboard)/       # Dashboard pages (protected)
│   │   │   ├── dashboard/
│   │   │   ├── inventory/
│   │   │   ├── billing/
│   │   │   ├── customers/
│   │   │   ├── suppliers/
│   │   │   ├── accounting/
│   │   │   ├── reports/
│   │   │   ├── employees/
│   │   │   └── settings/
│   │   │
│   │   ├── api/               # API Route Handlers
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── inventory/
│   │   │   ├── billing/
│   │   │   ├── customers/
│   │   │   ├── suppliers/
│   │   │   ├── accounting/
│   │   │   ├── reports/
│   │   │   ├── employees/
│   │   │   ├── notifications/
│   │   │   └── backups/
│   │   │
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   └── page.tsx           # Root page (redirects)
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/            # Layout components
│   │   │   ├── sidebar.tsx
│   │   │   ├── navbar.tsx
│   │   │   ├── dashboard-layout.tsx
│   │   │   └── theme-provider.tsx
│   │   │
│   │   ├── forms/             # Form components
│   │   │   ├── product-form.tsx
│   │   │   ├── customer-form.tsx
│   │   │   ├── invoice-form.tsx
│   │   │   └── ...
│   │   │
│   │   ├── charts/            # Chart components
│   │   │   ├── sales-chart.tsx
│   │   │   ├── profit-chart.tsx
│   │   │   └── ...
│   │   │
│   │   ├── inventory/         # Inventory components
│   │   │   ├── product-list.tsx
│   │   │   ├── product-card.tsx
│   │   │   ├── stock-alerts.tsx
│   │   │   └── barcode-scanner.tsx
│   │   │
│   │   └── billing/           # Billing components
│   │       ├── invoice-list.tsx
│   │       ├── invoice-pdf.tsx
│   │       └── ...
│   │
│   ├── lib/
│   │   ├── utils/
│   │   │   ├── cn.ts          # className utility
│   │   │   ├── barcode.ts     # Barcode generation
│   │   │   ├── pdf.ts         # PDF generation
│   │   │   ├── excel.ts       # Excel export
│   │   │   ├── format.ts      # Number/date formatting
│   │   │   └── validators.ts  # Validation schemas
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   └── ...
│   │   │
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── redis.ts           # Redis client
│   │   └── auth.ts            # Auth utilities
│   │
│   ├── services/
│   │   ├── api/               # API client functions
│   │   │   ├── auth.ts
│   │   │   ├── inventory.ts
│   │   │   ├── billing.ts
│   │   │   └── ...
│   │   │
│   │   └── db/                # Database service layer
│   │       ├── product.service.ts
│   │       ├── invoice.service.ts
│   │       ├── customer.service.ts
│   │       └── ...
│   │
│   └── types/
│       ├── models/            # TypeScript types for models
│       │   ├── product.ts
│       │   ├── invoice.ts
│       │   └── ...
│       │
│       └── api/               # API response types
│           ├── responses.ts
│           └── requests.ts
│
├── public/
│   ├── logo.png
│   └── favicon.ico
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── scripts/
│   ├── backup.ts
│   └── restore.ts
│
├── docs/
│   ├── SRS.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── FOLDER_STRUCTURE.md
│   ├── DEPLOYMENT.md
│   ├── USER_MANUAL.md
│   └── ADMIN_MANUAL.md
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── postcss.config.js
```
