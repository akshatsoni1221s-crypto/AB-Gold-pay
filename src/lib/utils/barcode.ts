export function generateBarcodeSvg(code: string): string {
  const width = code.length * 20 + 40;
  const height = 100;
  let bars = '';
  let isBar = true;
  for (const char of code) {
    const codePoint = char.charCodeAt(0);
    const barWidth = (codePoint % 4) + 1;
    if (isBar) {
      bars += `<rect x="${bars.length}" y="0" width="${barWidth}" height="${height - 30}" fill="black"/>`;
    }
    isBar = !isBar;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${bars}
    <text x="${width / 2}" y="${height - 5}" text-anchor="middle" font-family="monospace" font-size="12">${code}</text>
  </svg>`;
}

export function generateQRCodeData(productId: string, barcode: string): string {
  return JSON.stringify({
    type: 'PRODUCT',
    id: productId,
    barcode,
    timestamp: Date.now(),
  });
}

export function parseBarcodeQuery(query: string): { type: 'barcode' | 'sku' | 'productCode' | 'text'; value: string } {
  const upper = query.toUpperCase();
  if (/^GP[A-Z0-9]{8,}$/.test(upper)) return { type: 'barcode', value: upper };
  if (/^[A-Z]{2,4}-\d{4,5}$/.test(upper)) return { type: 'sku', value: upper };
  if (/^\d+$/.test(query)) return { type: 'productCode', value: query };
  return { type: 'text', value: query };
}
