import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, errorResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (_request, { params, user }) => {
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { barcode: params.barcode },
        { sku: params.barcode },
        { productCode: params.barcode },
      ],
      isActive: true,
      organizationId: user.organizationId,
    },
    include: { supplier: { select: { id: true, name: true } } },
  });

  if (!product) return errorResponse('Product not found', 404);
  return successResponse(product);
});
