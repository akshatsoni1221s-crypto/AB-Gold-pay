import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'SALES', 'ACCOUNTANT', 'STAFF']).default('STAFF'),
});

export const productSchema = z.object({
  barcode: z.string().min(1, 'Barcode is required'),
  sku: z.string().min(1, 'SKU is required'),
  productCode: z.string().min(1, 'Product code is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.enum(['RINGS', 'EARRINGS', 'CHAINS', 'BRACELETS', 'BANGLES', 'NECKLACES', 'PENDANTS', 'MANGALSUTRA', 'PAYAL', 'TOE_RINGS', 'NOSE_PINS', 'KADA', 'COINS', 'BISCUITS', 'OTHER']),
  metalType: z.enum(['GOLD', 'SILVER', 'DIAMOND', 'PLATINUM', 'OTHER']),
  goldPurity: z.enum(['KT24', 'KT22', 'KT18', 'KT14']).optional().nullable(),
  silverPurity: z.enum(['FINE_999', 'STERLING_925', 'BRITANNIA_958', 'OTHER']).optional().nullable(),
  grossWeight: z.number().positive('Gross weight must be positive'),
  netWeight: z.number().positive('Net weight must be positive'),
  stoneWeight: z.number().min(0).default(0),
  makingCharges: z.number().min(0).default(0),
  wastagePercent: z.number().min(0).max(100).default(0),
  hallmark: z.string().optional(),
  designNumber: z.string().optional(),
  purchasePrice: z.number().positive('Purchase price must be positive'),
  sellingPrice: z.number().positive('Selling price must be positive'),
  mrp: z.number().positive().optional().nullable(),
  stockQuantity: z.number().int().min(0).default(0),
  minStockLevel: z.number().int().min(0).default(5),
  branch: z.string().optional(),
  location: z.string().optional(),
  hsnCode: z.string().optional(),
  taxRate: z.number().min(0).max(100).default(3),
  supplierId: z.string().optional().nullable(),
});

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  gstNumber: z.string().optional(),
  creditLimit: z.number().min(0).default(0),
});

export const invoiceSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerAddress: z.string().optional(),
  customerGst: z.string().optional(),
  invoiceType: z.enum(['GST', 'NORMAL', 'QUOTATION', 'ESTIMATE', 'PURCHASE', 'RETURN', 'CREDIT_NOTE', 'DEBIT_NOTE']).default('GST'),
  subtotal: z.number().positive(),
  discountPercent: z.number().min(0).max(100).default(0),
  taxAmount: z.number().min(0).default(0),
  grandTotal: z.number().positive(),
  paidAmount: z.number().min(0).default(0),
  paymentMethod: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CARD', 'CHEQUE', 'PARTIAL', 'ADVANCE', 'CREDIT', 'MIXED']).optional(),
  notes: z.string().optional(),
  dueDate: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().optional(),
    itemName: z.string().min(1),
    hsnCode: z.string().optional(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    grossWeight: z.number().optional(),
    netWeight: z.number().optional(),
    purity: z.string().optional(),
    makingCharge: z.number().optional(),
    wastage: z.number().optional(),
    discount: z.number().min(0).default(0),
    taxRate: z.number().min(0).default(0),
    total: z.number().positive(),
  })).min(1, 'At least one item required'),
});

export const expenseSchema = z.object({
  category: z.enum(['RENT', 'SALARY', 'ELECTRICITY', 'MAINTENANCE', 'OTHER']),
  amount: z.number().positive(),
  description: z.string().min(1, 'Description required'),
  date: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CARD', 'CHEQUE']).optional(),
});

export const paymentSchema = z.object({
  invoiceId: z.string(),
  amount: z.number().positive('Payment amount must be positive'),
  method: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CARD', 'CHEQUE']),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

export const settingsSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  type: z.enum(['string', 'number', 'boolean', 'json']).default('string'),
});
