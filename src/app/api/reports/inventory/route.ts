import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (request: NextRequest, { user }) => {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';

  const products = await prisma.product.findMany({
    where: { organizationId: user.organizationId, isActive: true },
    select: {
      id: true,
      name: true,
      barcode: true,
      sku: true,
      category: true,
      metalType: true,
      goldPurity: true,
      grossWeight: true,
      netWeight: true,
      stockQuantity: true,
      purchasePrice: true,
      sellingPrice: true,
      minStockLevel: true,
    },
    orderBy: { name: 'asc' },
  });

  const summary = {
    totalProducts: products.length,
    totalStockQuantity: products.reduce((s, p) => s + p.stockQuantity, 0),
    totalStockValue: products.reduce((s, p) => s + Number(p.purchasePrice) * p.stockQuantity, 0),
    totalSellingValue: products.reduce((s, p) => s + Number(p.sellingPrice) * p.stockQuantity, 0),
    lowStockItems: products.filter((p) => p.stockQuantity <= p.minStockLevel).length,
    byCategory: {} as Record<string, { count: number; value: number }>,
    byMetal: {} as Record<string, { count: number; value: number }>,
  };

  products.forEach((p) => {
    const cat = p.category;
    if (!summary.byCategory[cat]) summary.byCategory[cat] = { count: 0, value: 0 };
    summary.byCategory[cat].count += p.stockQuantity;
    summary.byCategory[cat].value += Number(p.sellingPrice) * p.stockQuantity;

    const metal = p.metalType;
    if (!summary.byMetal[metal]) summary.byMetal[metal] = { count: 0, value: 0 };
    summary.byMetal[metal].count += p.stockQuantity;
    summary.byMetal[metal].value += Number(p.sellingPrice) * p.stockQuantity;
  });

  if (format === 'csv') {
    const csv = [
      'Name,Barcode,SKU,Category,Metal,Purity,Stock,Cost Price,Selling Price',
      ...products.map((p) =>
        `"${p.name}","${p.barcode}","${p.sku}","${p.category}","${p.metalType}","${p.goldPurity || ''}",${p.stockQuantity},${p.purchasePrice},${p.sellingPrice}`
      ),
    ].join('\n');

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=inventory-report.csv`,
      },
    });
  }

  return successResponse({ products, summary });
});
