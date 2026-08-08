const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Change provider
schema = schema.replace(/provider = "postgresql"/g, 'provider = "sqlite"');

// Remove @db.Decimal annotations
schema = schema.replace(/ @db\.Decimal\(\d+, \d+\)/g, '');

// Remove enum blocks
schema = schema.replace(/enum \w+ \{[\s\S]*?^\}/gm, '');

// Replace enum type references with String
const enumRefs = [
  'UserRole', 'MetalType', 'GoldPurity', 'SilverPurity',
  'ProductCategory', 'InvoiceType', 'PaymentStatus',
  'PaymentMethod', 'TransactionType', 'NotificationType'
];
enumRefs.forEach(e => {
  const regex = new RegExp('\\b' + e + '\\b', 'g');
  schema = schema.replace(regex, 'String');
});

// Replace array defaults
schema = schema.replace(/String\[\] @default\(\[\]\)/g, 'String @default("")');

// Replace uuid() with cuid()
schema = schema.replace(/@default\(uuid\(\)\)/g, '@default(cuid())');

// Remove @@index lines with mode: insensitive
schema = schema.replace(/\s+@@index\(\[[^\]]+\], mode: 'insensitive'\)/g, '');

// Remove @unique constraints that may not work
schema = schema.replace(/(phone\s+String\s+)@unique/g, '$1');
schema = schema.replace(/(email\s+String\s+)@unique/g, '$1');

// Remove @@map lines
schema = schema.replace(/\s+@@map\("\w+"\)/g, '');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log('Schema converted to SQLite successfully');
