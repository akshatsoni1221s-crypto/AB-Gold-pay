import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, errorResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (_request, { params, user }) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id: params.id, organizationId: user.organizationId },
    include: {
      products: { where: { isActive: true } },
      purchaseInvoices: { orderBy: { invoiceDate: 'desc' }, take: 20 },
      supplierLedger: { orderBy: { createdAt: 'desc' }, take: 50 },
    },
  });

  if (!supplier) return errorResponse('Supplier not found', 404);
  return successResponse(supplier);
});
