import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (_request: NextRequest, { user }) => {
  const products = await prisma.product.findMany({
    where: { organizationId: user.organizationId, isActive: true },
    select: {
      id: true,
      name: true,
      category: true,
      metalType: true,
      goldPurity: true,
      grossWeight: true,
      netWeight: true,
      stockQuantity: true,
      purchasePrice: true,
      sellingPrice: true,
    },
  });

  const valuation = {
    totalCostValue: 0,
    totalSellingValue: 0,
    totalGrossWeight: 0,
    totalNetWeight: 0,
    byMetal: {} as Record<string, { cost: number; selling: number; weight: number; qty: number }>,
    byCategory: {} as Record<string, { cost: number; selling: number; qty: number }>,
    items: products.map((p) => {
      const costValue = Number(p.purchasePrice) * p.stockQuantity;
      const sellValue = Number(p.sellingPrice) * p.stockQuantity;
      return {
        name: p.name,
        category: p.category,
        metal: p.metalType,
        purity: p.goldPurity,
        stock: p.stockQuantity,
        costValue,
        sellValue,
        grossWeight: Number(p.grossWeight) * p.stockQuantity,
        netWeight: Number(p.netWeight) * p.stockQuantity,
      };
    }),
  };

  for (const p of products) {
    const costValue = Number(p.purchasePrice) * p.stockQuantity;
    const sellValue = Number(p.sellingPrice) * p.stockQuantity;
    const weight = Number(p.grossWeight) * p.stockQuantity;

    valuation.totalCostValue += costValue;
    valuation.totalSellingValue += sellValue;
    valuation.totalGrossWeight += weight;
    valuation.totalNetWeight += Number(p.netWeight) * p.stockQuantity;

    if (!valuation.byMetal[p.metalType]) {
      valuation.byMetal[p.metalType] = { cost: 0, selling: 0, weight: 0, qty: 0 };
    }
    valuation.byMetal[p.metalType].cost += costValue;
    valuation.byMetal[p.metalType].selling += sellValue;
    valuation.byMetal[p.metalType].weight += weight;
    valuation.byMetal[p.metalType].qty += p.stockQuantity;

    if (!valuation.byCategory[p.category]) {
      valuation.byCategory[p.category] = { cost: 0, selling: 0, qty: 0 };
    }
    valuation.byCategory[p.category].cost += costValue;
    valuation.byCategory[p.category].selling += sellValue;
    valuation.byCategory[p.category].qty += p.stockQuantity;
  }

  return successResponse(valuation);
});
