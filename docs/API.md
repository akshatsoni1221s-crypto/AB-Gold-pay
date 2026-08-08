# GoldPay ERP - API Documentation

## Authentication

### POST /api/auth/login
Login with email/phone and password.
```json
{ "email": "admin@goldpay.com", "password": "securepass" }
```
Response: `{ "token": "jwt...", "user": {...} }`

### POST /api/auth/register
Register new user (Admin only).
```json
{ "email": "...", "phone": "...", "password": "...", "name": "...", "role": "STAFF" }
```

### GET /api/auth/me
Get current user profile. Requires Bearer token.

### POST /api/auth/logout
Invalidate current session.

---

## Dashboard

### GET /api/dashboard/summary
Get dashboard analytics. Returns:
- todaySales, todayProfit, monthlyIncome, monthlyProfit
- totalStockValue, goldStock, silverStock
- pendingCustomerPayments, pendingSupplierPayments
- cashInHand, topSellingProducts, topCustomers
- lowStockAlerts, recentActivities

### GET /api/dashboard/charts?period=daily|weekly|monthly|yearly
Get chart data for sales and profit.

---

## Inventory

### GET /api/inventory
List products with pagination, search, filters.
Query: `?page=1&limit=20&search=&category=&metalType=&goldPurity=&isActive=true`

### GET /api/inventory/:id
Get single product details.

### POST /api/inventory
Create product.
```json
{
  "barcode": "GP-001", "sku": "GP-SKU-001",
  "name": "Gold Ring", "category": "RINGS",
  "metalType": "GOLD", "goldPurity": "KT22",
  "grossWeight": 5.0, "netWeight": 4.5,
  "purchasePrice": 25000, "sellingPrice": 28000,
  "stockQuantity": 10
}
```

### PUT /api/inventory/:id
Update product.

### DELETE /api/inventory/:id
Soft-delete product (sets isActive=false).

### GET /api/inventory/barcode/:barcode
Lookup product by barcode (for scanning).

---

## Billing

### GET /api/billing/invoices
List invoices. Query: `?page=1&limit=20&type=&status=&customerId=&from=&to=`

### POST /api/billing/invoices
Create invoice.
```json
{
  "customerId": "uuid",
  "items": [{
    "productId": "uuid", "quantity": 1,
    "unitPrice": 28000, "total": 28000
  }],
  "paymentMethod": "CASH",
  "paidAmount": 28000
}
```

### GET /api/billing/invoices/:id
Get invoice with items.

### GET /api/billing/invoices/:id/pdf
Download PDF.

### POST /api/billing/invoices/:id/payment
Record payment.

### POST /api/billing/invoices/:id/return
Create return invoice.

---

## Customers

### GET /api/customers
List customers. Query: `?page=1&limit=20&search=`

### POST /api/customers
Create customer.
```json
{ "name": "Rajesh", "phone": "9876543210", "gstNumber": "..." }
```

### GET /api/customers/:id
Get customer with ledger.

### PUT /api/customers/:id
Update customer.

### GET /api/customers/:id/ledger
Get customer ledger entries.

---

## Suppliers

### GET /api/suppliers
List suppliers.

### POST /api/suppliers
Create supplier.

### GET /api/suppliers/:id
Get supplier with ledger.

---

## Accounting

### GET /api/accounting/cashbook?date=2024-01-01
Get daily cash book.

### POST /api/accounting/expenses
Record expense.
```json
{ "category": "RENT", "amount": 15000, "description": "Shop rent" }
```

### GET /api/accounting/profit-loss?from=&to=
Get profit & loss statement.

---

## Reports

### GET /api/reports/sales?from=&to=&format=json|csv|pdf
Sales report.

### GET /api/reports/gst?from=&to=
GST report.

### GET /api/reports/inventory/valuation
Stock valuation report.

---

## Notifications

### GET /api/notifications
Get user notifications.

### PUT /api/notifications/:id/read
Mark notification as read.

### PUT /api/notifications/read-all
Mark all as read.

---

## Backup

### POST /api/backups
Create manual backup.

### GET /api/backups
List backups.

### POST /api/backups/:id/restore
Restore from backup.

---

## Settings

### GET /api/settings
Get all settings.

### PUT /api/settings
Update settings.
```json
{ "key": "company_name", "value": "AB GoldPay" }
```

---

## Employees

### GET /api/employees
List employees.

### POST /api/employees
Create employee.

### PUT /api/employees/:id
Update employee.

### GET /api/employees/:id/activity
Get employee activity log.
