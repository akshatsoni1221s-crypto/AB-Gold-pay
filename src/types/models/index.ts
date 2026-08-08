export type {
  User, Session,
  Product, StockMovement,
  Customer, CustomerLedger,
  Supplier, SupplierLedger,
  Invoice, InvoiceItem, Payment,
  Account, AccountTransaction, Expense,
  Notification,
  ActivityLog, SystemLog,
  Backup, Setting,
} from '@prisma/client';

export type {
  UserRole, MetalType, GoldPurity, SilverPurity,
  ProductCategory, InvoiceType, PaymentStatus,
  PaymentMethod, TransactionType, NotificationType,
} from '@prisma/client';

export interface DashboardSummary {
  todaySales: number;
  todayProfit: number;
  todaySalesCount: number;
  monthlyIncome: number;
  monthlyProfit: number;
  totalStockValue: number;
  goldStock: { quantity: number; value: number };
  silverStock: { quantity: number; value: number };
  diamondStock: { quantity: number; value: number };
  pendingCustomerPayments: number;
  pendingSupplierPayments: number;
  cashInHand: number;
  topSellingProducts: Array<{ id: string; name: string; totalSold: number; revenue: number }>;
  topCustomers: Array<{ id: string; name: string; totalPurchases: number }>;
  lowStockAlerts: Array<{ id: string; name: string; stockQuantity: number; minStockLevel: number }>;
  recentActivities: Array<{ id: string; action: string; entity: string; createdAt: Date; user: { name: string } }>;
}

export interface ChartDataPoint {
  date: string;
  sales: number;
  profit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface InvoicePdfData {
  invoice: Invoice & { items: InvoiceItem[]; payments: Payment[] };
  company: {
    name: string;
    address: string;
    gst: string;
    phone: string;
    email: string;
    logo?: string;
  };
}
