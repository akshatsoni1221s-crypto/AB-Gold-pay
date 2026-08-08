import { prisma } from '@/lib/prisma';
import { withAuth, successResponse } from '@/lib/api-middleware';
import { cacheGet, cacheSet } from '@/lib/redis';

export const GET = withAuth(async (_request, { user }) => {
  const cacheKey = `dashboard:summary:${user.id}`;
  const cached = await cacheGet<ReturnType<typeof generateSummary>>(cacheKey);
  if (cached) return successResponse(cached);

  const data = await generateSummary(user.organizationId);
  await cacheSet(cacheKey, data, 60);
  return successResponse(data);
});

async function generateSummary(organizationId: string) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [
    todayInvoices,
    monthlyInvoices,
    products,
    customerPayments,
    supplierPayments,
    expenses,
    topSelling,
    topCustomers,
    lowStock,
    recentActivities,
  ] = await Promise.all([
    prisma.invoice.aggregate({
      where: { invoiceDate: { gte: todayStart, lte: todayEnd }, paymentStatus: { not: 'CANCELLED' }, organizationId },
      _sum: { grandTotal: true, paidAmount: true },
      _count: true,
    }),
    prisma.invoice.aggregate({
      where: { invoiceDate: { gte: monthStart, lte: monthEnd }, paymentStatus: { not: 'CANCELLED' }, organizationId },
      _sum: { grandTotal: true, paidAmount: true },
    }),
    prisma.product.findMany({ where: { isActive: true, organizationId }, select: { id: true, purchasePrice: true, sellingPrice: true, stockQuantity: true, metalType: true, name: true, minStockLevel: true }, orderBy: { createdAt: 'desc' } }),
    prisma.invoice.aggregate({
      where: { paymentStatus: { in: ['UNPAID', 'PARTIAL', 'OVERDUE'] }, customerId: { not: null }, organizationId },
      _sum: { balanceAmount: true },
    }),
    prisma.invoice.aggregate({
      where: { paymentStatus: { in: ['UNPAID', 'PARTIAL', 'OVERDUE'] }, supplierId: { not: null }, organizationId },
      _sum: { balanceAmount: true },
    }),
    prisma.expense.aggregate({
      where: { date: { gte: monthStart, lte: monthEnd }, organizationId },
      _sum: { amount: true },
    }),
    prisma.invoiceItem.groupBy({
      by: ['productId'],
      where: { organizationId },
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
    prisma.customer.findMany({
      where: { organizationId },
      orderBy: { totalPurchases: 'desc' },
      take: 5,
      select: { id: true, name: true, totalPurchases: true },
    }),
    prisma.product.findMany({
      where: { stockQuantity: { lte: prisma.product.fields.minStockLevel }, isActive: true, organizationId },
      select: { id: true, name: true, stockQuantity: true, minStockLevel: true },
      take: 10,
    }),
    prisma.auditLog.findMany({
      where: { organizationId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    }),
  ]);

  const totalStockValue = products.reduce((sum, p) => sum + Number(p.purchasePrice) * p.stockQuantity, 0);
  const goldStock = products.filter((p) => p.metalType === 'GOLD');
  const silverStock = products.filter((p) => p.metalType === 'SILVER');
  const diamondStock = products.filter((p) => p.metalType === 'DIAMOND');

  const monthlyIncome = Number(monthlyInvoices._sum.grandTotal || 0);
  const monthlyExpenses = Number(expenses._sum.amount || 0);
  const monthlyProfit = monthlyIncome - monthlyExpenses;

  const todaySales = Number(todayInvoices._sum.grandTotal || 0);
  const todayCost = await calculateTodayCost(todayStart, todayEnd, organizationId);
  const todayProfit = todaySales - todayCost;

  const resolvedTopProducts = await Promise.all(
    topSelling.map(async (item) => {
      if (!item.productId) return { id: '', name: 'Unknown', totalSold: 0, revenue: 0 };
      const product = await prisma.product.findFirst({ where: { id: item.productId, organizationId }, select: { id: true, name: true } });
      return {
        id: item.productId,
        name: product?.name || 'Deleted',
        totalSold: item._sum.quantity || 0,
        revenue: Number(item._sum.total || 0),
      };
    })
  );

  const totalProducts = products.length;
  const totalCustomers = await prisma.customer.count({ where: { isActive: true, organizationId } });
  const totalInvoices = await prisma.invoice.count({ where: { organizationId, paymentStatus: { not: 'CANCELLED' } } });
  const totalRevenue = Number(monthlyInvoices._sum.grandTotal || 0);

  const recentInvoices = await prisma.invoice.findMany({
    where: { organizationId, paymentStatus: { not: 'CANCELLED' } },
    orderBy: { invoiceDate: 'desc' },
    take: 5,
    select: { id: true, invoiceNo: true, grandTotal: true, paymentStatus: true, createdAt: true },
  });

  return {
    totalProducts,
    totalCustomers,
    totalInvoices,
    totalRevenue,
    todayRevenue: todaySales,
    todaySales,
    todayProfit,
    monthlyIncome,
    monthlyProfit,
    totalStockValue,
    goldStock: { quantity: goldStock.length, value: goldStock.reduce((s, p) => s + Number(p.sellingPrice) * p.stockQuantity, 0) },
    silverStock: { quantity: silverStock.length, value: silverStock.reduce((s, p) => s + Number(p.sellingPrice) * p.stockQuantity, 0) },
    diamondStock: { quantity: diamondStock.length, value: diamondStock.reduce((s, p) => s + Number(p.sellingPrice) * p.stockQuantity, 0) },
    pendingCustomerPayments: Number(customerPayments._sum.balanceAmount || 0),
    pendingSupplierPayments: Number(supplierPayments._sum.balanceAmount || 0),
    cashInHand: Number(todayInvoices._sum.paidAmount || 0),
    topSellingProducts: resolvedTopProducts,
    topCustomers: topCustomers.map((c) => ({ id: c.id, name: c.name, totalPurchases: Number(c.totalPurchases) })),
    lowStockProducts: lowStock.map((p) => ({ id: p.id, name: p.name, stockQuantity: p.stockQuantity, minStockLevel: p.minStockLevel })),
    lowStockAlerts: lowStock.map((p) => ({ id: p.id, name: p.name, stockQuantity: p.stockQuantity, minStockLevel: p.minStockLevel })),
    recentInvoices: recentInvoices.map((inv) => ({
      id: inv.id,
      invoiceNo: inv.invoiceNo,
      grandTotal: Number(inv.grandTotal),
      paymentStatus: inv.paymentStatus,
      createdAt: inv.createdAt.toISOString(),
    })),
    recentActivities: recentActivities.map((a) => ({
      id: a.id,
      action: a.action,
      entity: a.entity,
      createdAt: a.createdAt,
      user: { name: a.user?.name || 'System' },
    })),
  };
}

async function calculateTodayCost(todayStart: Date, todayEnd: Date, organizationId: string): Promise<number> {
  const items = await prisma.invoiceItem.findMany({
    where: {
      organizationId,
      invoice: { invoiceDate: { gte: todayStart, lte: todayEnd }, paymentStatus: { not: 'CANCELLED' } },
      productId: { not: null },
    },
    include: { product: { select: { purchasePrice: true } } },
  });

  return items.reduce((sum, item) => {
    const cost = item.product ? Number(item.product.purchasePrice) * item.quantity : 0;
    return sum + cost;
  }, 0);
}
