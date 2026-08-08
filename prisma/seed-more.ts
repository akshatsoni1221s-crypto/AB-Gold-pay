import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const org = await prisma.organization.findFirst({ where: { slug: 'goldpay-demo' } });
  if (!org) { console.log('Organization not found. Run seed.ts first.'); process.exit(1); }

  const admin = await prisma.user.findFirst({ where: { email: 'admin@goldpay.com' } });
  if (!admin) { console.log('Admin not found'); process.exit(1); }

  const supplier1 = await prisma.supplier.findFirst({ where: { phone: '9988776655' } });
  const supplier2 = await prisma.supplier.findFirst({ where: { phone: '9988776654' } });
  const supplier3 = await prisma.supplier.findFirst({ where: { phone: '9988776653' } });
  const supplier5 = await prisma.supplier.findFirst({ where: { phone: '9988776651' } });

  const products = [
    // === GOLD RINGS (more variety) ===
    { name: '22KT Gold Solitaire Ring', barcode: 'GP101', sku: 'RNG-GD-00002', category: 'RINGS', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 4.2, netWeight: 3.8, purchasePrice: 4800, sellingPrice: 6200, stockQuantity: 12, supplierId: supplier1?.id, description: 'Solitaire-style gold ring with polished finish' },
    { name: '24KT Gold Band Ring', barcode: 'GP102', sku: 'RNG-GD-00003', category: 'RINGS', metalType: 'GOLD', goldPurity: 'KT24', grossWeight: 6.0, netWeight: 5.5, purchasePrice: 7200, sellingPrice: 9200, stockQuantity: 8, supplierId: supplier1?.id, description: 'Plain gold band ring, matte finish, unisex' },
    { name: '18KT Gold Cocktail Ring', barcode: 'GP103', sku: 'RNG-GD-00004', category: 'RINGS', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 7.5, netWeight: 6.8, purchasePrice: 8200, sellingPrice: 10500, stockQuantity: 5, supplierId: supplier1?.id, description: 'Statement cocktail ring with floral motif' },
    { name: '22KT Gold Stacking Ring Set', barcode: 'GP104', sku: 'RNG-GD-00005', category: 'RINGS', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 3.5, netWeight: 3.0, purchasePrice: 3800, sellingPrice: 5000, stockQuantity: 15, supplierId: supplier1?.id, description: 'Set of 3 thin stacking rings with textured finish' },
    { name: 'Diamond Engagement Ring 0.5ct', barcode: 'GP105', sku: 'RNG-DM-00001', category: 'RINGS', metalType: 'DIAMOND', grossWeight: 3.8, netWeight: 3.2, purchasePrice: 12000, sellingPrice: 16000, stockQuantity: 4, supplierId: supplier2?.id, description: '0.5 carat diamond engagement ring in 18KT white gold setting, H-color VS1 clarity' },
    { name: 'Diamond Eternity Ring', barcode: 'GP106', sku: 'RNG-DM-00002', category: 'RINGS', metalType: 'DIAMOND', grossWeight: 4.5, netWeight: 3.9, purchasePrice: 18000, sellingPrice: 24000, stockQuantity: 3, supplierId: supplier2?.id, description: 'Full diamond eternity ring, 1.2 carat total weight, round brilliant cut' },
    { name: 'Diamond Three-Stone Ring', barcode: 'GP107', sku: 'RNG-DM-00003', category: 'RINGS', metalType: 'DIAMOND', grossWeight: 5.0, netWeight: 4.3, purchasePrice: 22000, sellingPrice: 29000, stockQuantity: 2, supplierId: supplier2?.id, description: 'Three-stone diamond ring with baguette side stones' },
    { name: 'Silver Statement Ring', barcode: 'GP108', sku: 'RNG-SL-00001', category: 'RINGS', metalType: 'SILVER', grossWeight: 8.0, netWeight: 7.2, purchasePrice: 120, sellingPrice: 180, stockQuantity: 25, supplierId: supplier3?.id, description: 'Bold silver ring with oxidised finish and tribal design' },
    { name: 'Silver Adjustable Ring', barcode: 'GP109', sku: 'RNG-SL-00002', category: 'RINGS', metalType: 'SILVER', grossWeight: 3.0, netWeight: 2.5, purchasePrice: 45, sellingPrice: 75, stockQuantity: 40, supplierId: supplier3?.id, description: 'Adjustable silver ring with minimal design, everyday wear' },

    // === NECKLACES (more variety) ===
    { name: '22KT Gold Rani Haar Necklace', barcode: 'GP110', sku: 'NCK-GD-00002', category: 'NECKLACES', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 45.0, netWeight: 40.0, purchasePrice: 58000, sellingPrice: 75000, stockQuantity: 1, supplierId: supplier1?.id, description: 'Traditional Rani Haar layered necklace with Kundan work - heirloom piece' },
    { name: '24KT Gold Chain Necklace 50cm', barcode: 'GP111', sku: 'NCK-GD-00003', category: 'NECKLACES', metalType: 'GOLD', goldPurity: 'KT24', grossWeight: 18.0, netWeight: 16.5, purchasePrice: 21000, sellingPrice: 27000, stockQuantity: 4, supplierId: supplier1?.id, description: 'Solid gold rope chain necklace, 50cm length, 4mm wide' },
    { name: '18KT Gold Pendant Necklace Set', barcode: 'GP112', sku: 'NCK-GD-00004', category: 'NECKLACES', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 10.0, netWeight: 8.8, purchasePrice: 11000, sellingPrice: 14500, stockQuantity: 6, supplierId: supplier1?.id, description: 'Gold chain with matching pendant, Ganesh motif' },
    { name: 'Diamond Pendant Necklace', barcode: 'GP113', sku: 'NCK-DM-00001', category: 'NECKLACES', metalType: 'DIAMOND', grossWeight: 6.5, netWeight: 5.5, purchasePrice: 25000, sellingPrice: 33000, stockQuantity: 2, supplierId: supplier2?.id, description: 'Diamond drop pendant on 18KT white gold chain, 0.75ct total' },
    { name: 'Diamond Choker Necklace', barcode: 'GP114', sku: 'NCK-DM-00002', category: 'NECKLACES', metalType: 'DIAMOND', grossWeight: 15.0, netWeight: 13.0, purchasePrice: 45000, sellingPrice: 58000, stockQuantity: 1, supplierId: supplier2?.id, description: 'Diamond choker with intricate lattice design, 2.5ct total weight' },
    { name: 'Silver Filigree Necklace', barcode: 'GP115', sku: 'NCK-SL-00001', category: 'NECKLACES', metalType: 'SILVER', grossWeight: 25.0, netWeight: 22.0, purchasePrice: 550, sellingPrice: 800, stockQuantity: 7, supplierId: supplier3?.id, description: 'Handcrafted silver filigree necklace with traditional Odisha craft' },
    { name: 'Silver Tribal Necklace', barcode: 'GP116', sku: 'NCK-SL-00002', category: 'NECKLACES', metalType: 'SILVER', grossWeight: 35.0, netWeight: 30.0, purchasePrice: 300, sellingPrice: 480, stockQuantity: 10, supplierId: supplier5?.id, description: 'Tribal silver necklace with coin pendants and bead accents' },

    // === MANGALSUTRA (more variety) ===
    { name: '22KT Gold Traditional Mangalsutra', barcode: 'GP117', sku: 'MNG-GD-00002', category: 'MANGALSUTRA', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 10.0, netWeight: 8.8, purchasePrice: 10500, sellingPrice: 13500, stockQuantity: 5, supplierId: supplier1?.id, description: 'Traditional two-strand mangalsutra with gold pendant and black beads' },
    { name: '18KT Gold Diamond Mangalsutra', barcode: 'GP118', sku: 'MNG-GD-00003', category: 'MANGALSUTRA', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 6.5, netWeight: 5.8, purchasePrice: 14000, sellingPrice: 18000, stockQuantity: 3, supplierId: supplier1?.id, description: 'Mangalsutra with diamond-studded pendant on gold chain' },
    { name: '22KT Gold Short Mangalsutra', barcode: 'GP119', sku: 'MNG-GD-00004', category: 'MANGALSUTRA', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 5.0, netWeight: 4.2, purchasePrice: 5200, sellingPrice: 6800, stockQuantity: 10, supplierId: supplier1?.id, description: 'Modern short-length mangalsutra with minimalist gold pendant' },
    { name: 'Gold-Plated Mangalsutra Set', barcode: 'GP120', sku: 'MNG-GP-00001', category: 'MANGALSUTRA', metalType: 'GOLD', grossWeight: 4.0, netWeight: 3.2, purchasePrice: 600, sellingPrice: 950, stockQuantity: 20, supplierId: supplier3?.id, description: 'Affordable gold-plated mangalsutra with artificial beads' },

    // === EARRINGS (more gold/diamond/silver) ===
    { name: '22KT Gold Chandbali Earrings', barcode: 'GP121', sku: 'EAR-GD-00002', category: 'EARRINGS', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 6.0, netWeight: 5.2, purchasePrice: 6500, sellingPrice: 8500, stockQuantity: 7, supplierId: supplier1?.id, description: 'Traditional Chandbali earrings with pearl drops and enamel work' },
    { name: '24KT Gold Stud Earrings', barcode: 'GP122', sku: 'EAR-GD-00003', category: 'EARRINGS', metalType: 'GOLD', goldPurity: 'KT24', grossWeight: 2.5, netWeight: 2.2, purchasePrice: 2800, sellingPrice: 3800, stockQuantity: 18, supplierId: supplier1?.id, description: 'Simple gold stud earrings, everyday wear' },
    { name: 'Diamond Stud Earrings 0.25ct', barcode: 'GP123', sku: 'EAR-DM-00001', category: 'EARRINGS', metalType: 'DIAMOND', grossWeight: 1.5, netWeight: 1.2, purchasePrice: 8000, sellingPrice: 11000, stockQuantity: 6, supplierId: supplier2?.id, description: 'Diamond stud earrings in 18KT gold, 0.25 carat each' },
    { name: 'Diamond Drop Earrings', barcode: 'GP124', sku: 'EAR-DM-00002', category: 'EARRINGS', metalType: 'DIAMOND', grossWeight: 3.0, netWeight: 2.5, purchasePrice: 15000, sellingPrice: 20000, stockQuantity: 3, supplierId: supplier2?.id, description: 'Diamond drop earrings with pearl accent, 0.5ct total' },
    { name: 'Silver Jhumka Earrings', barcode: 'GP125', sku: 'EAR-SL-00001', category: 'EARRINGS', metalType: 'SILVER', grossWeight: 12.0, netWeight: 10.5, purchasePrice: 180, sellingPrice: 280, stockQuantity: 22, supplierId: supplier3?.id, description: 'Traditional silver jhumka earrings with bell detail' },

    // === BANGLES & BRACELETS ===
    { name: '22KT Gold Kada Bangle', barcode: 'GP126', sku: 'BNG-GD-00001', category: 'BANGLES', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 15.0, netWeight: 13.5, purchasePrice: 16500, sellingPrice: 21000, stockQuantity: 4, supplierId: supplier1?.id, description: 'Gold kada bangle with matte finish and goldsmith engraving' },
    { name: '24KT Gold Bangle Set (2)', barcode: 'GP127', sku: 'BNG-GD-00002', category: 'BANGLES', metalType: 'GOLD', goldPurity: 'KT24', grossWeight: 20.0, netWeight: 18.0, purchasePrice: 24000, sellingPrice: 31000, stockQuantity: 3, supplierId: supplier1?.id, description: 'Pair of 24KT gold bangles with floral engraving' },
    { name: 'Diamond Bangle', barcode: 'GP128', sku: 'BNG-DM-00001', category: 'BANGLES', metalType: 'DIAMOND', grossWeight: 8.0, netWeight: 7.0, purchasePrice: 28000, sellingPrice: 36000, stockQuantity: 2, supplierId: supplier2?.id, description: 'Diamond-studded bangle in 18KT gold, 1.5ct total' },
    { name: 'Silver Churidaar Bangle Set', barcode: 'GP129', sku: 'BNG-SL-00002', category: 'BANGLES', metalType: 'SILVER', grossWeight: 40.0, netWeight: 36.0, purchasePrice: 600, sellingPrice: 900, stockQuantity: 8, supplierId: supplier5?.id, description: 'Set of 10 silver churidaar bangles with plain and twisted mix' },
    { name: 'Gold Flexi Bracelet', barcode: 'GP130', sku: 'BRL-GD-00003', category: 'BRACELETS', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 5.0, netWeight: 4.5, purchasePrice: 5500, sellingPrice: 7200, stockQuantity: 9, supplierId: supplier1?.id, description: 'Flexi gold bracelet with heart-shaped lock' },
    { name: 'Silver Chain Bracelet', barcode: 'GP131', sku: 'BRL-SL-00001', category: 'BRACELETS', metalType: 'SILVER', grossWeight: 8.0, netWeight: 7.0, purchasePrice: 120, sellingPrice: 190, stockQuantity: 30, supplierId: supplier3?.id, description: 'Silver cable chain bracelet with lobster clasp' },

    // === NOSEPIN ===
    { name: '22KT Gold Nose Pin Floral', barcode: 'GP132', sku: 'NOS-GD-00002', category: 'NOSEPIN', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 0.8, netWeight: 0.6, purchasePrice: 650, sellingPrice: 950, stockQuantity: 28, supplierId: supplier1?.id, description: 'Gold nose pin with floral design and screw fitting' },
    { name: 'Diamond Nose Stud', barcode: 'GP133', sku: 'NOS-DM-00002', category: 'NOSEPIN', metalType: 'DIAMOND', grossWeight: 0.3, netWeight: 0.2, purchasePrice: 3500, sellingPrice: 5000, stockQuantity: 10, supplierId: supplier2?.id, description: 'Single diamond nose stud in 18KT gold with push-back fitting' },

    // === PENDANTS ===
    { name: '22KT Gold Lakshmi Pendant', barcode: 'GP134', sku: 'PND-GD-00001', category: 'PENDANTS', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 4.5, netWeight: 4.0, purchasePrice: 5000, sellingPrice: 6500, stockQuantity: 8, supplierId: supplier1?.id, description: 'Goddess Lakshmi pendant with intricate detailing' },
    { name: 'Diamond Om Pendant', barcode: 'GP135', sku: 'PND-DM-00002', category: 'PENDANTS', metalType: 'DIAMOND', grossWeight: 2.0, netWeight: 1.6, purchasePrice: 9000, sellingPrice: 12000, stockQuantity: 5, supplierId: supplier2?.id, description: 'Om symbol pendant with diamond pavé in 18KT gold' },
    { name: 'Silver Ganesh Pendant', barcode: 'GP136', sku: 'PND-SL-00001', category: 'PENDANTS', metalType: 'SILVER', grossWeight: 5.0, netWeight: 4.0, purchasePrice: 80, sellingPrice: 130, stockQuantity: 35, supplierId: supplier3?.id, description: 'Lord Ganesh silver pendant on adjustable cord' },

    // === ANKLETS ===
    { name: 'Silver Payal Anklet', barcode: 'GP137', sku: 'ANK-SL-00002', category: 'ANKLETS', metalType: 'SILVER', grossWeight: 30.0, netWeight: 27.0, purchasePrice: 350, sellingPrice: 520, stockQuantity: 12, supplierId: supplier5?.id, description: 'Traditional silver payal with bell charms' },
    { name: 'Gold Anklet Chain', barcode: 'GP138', sku: 'ANK-GD-00001', category: 'ANKLETS', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 4.0, netWeight: 3.5, purchasePrice: 4400, sellingPrice: 5800, stockQuantity: 6, supplierId: supplier1?.id, description: 'Delicate gold anklet chain with adjustable clasp' },
  ];

  let created = 0;
  for (const p of products) {
    const exists = await prisma.product.findUnique({ where: { barcode: p.barcode } });
    if (exists) {
      console.log(`  Update: ${p.name}`);
      await prisma.product.update({
        where: { barcode: p.barcode },
        data: { stockQuantity: p.stockQuantity, sellingPrice: p.sellingPrice, description: p.description },
      });
    } else {
      console.log(`  Create: ${p.name}`);
      await prisma.product.create({
        data: {
          organizationId: org.id,
          ...p,
          productCode: p.barcode,
          makingCharges: Math.round(Number(p.sellingPrice) * 0.08),
          wastagePercent: 2.5,
          minStockLevel: 5,
          hsnCode: '7113',
          taxRate: 3.0,
          images: '[]',
        } as any,
      });
      created++;
    }
  }
  console.log(`Products: ${created} new, ${products.length - created} already existed`);

  // ============ MORE CUSTOMERS ============
  const newCustomers = [
    { name: 'Lakshmi Narayan', phone: '9876543235', email: 'lakshmi.n@example.com', city: 'Chennai', state: 'Tamil Nadu', totalPurchases: 2800000 },
    { name: 'Sanjay Doshi', phone: '9876543236', email: 'sanjay.doshi@example.com', city: 'Surat', state: 'Gujarat', totalPurchases: 1950000 },
    { name: 'Anita Shetty', phone: '9876543237', email: 'anita.shetty@example.com', city: 'Mangalore', state: 'Karnataka', totalPurchases: 1120000 },
    { name: 'Raj Khanna', phone: '9876543238', email: 'raj.khanna@example.com', city: 'Delhi', state: 'Delhi', totalPurchases: 3450000 },
    { name: 'Pallavi Desai', phone: '9876543239', email: 'pallavi.desai@example.com', city: 'Vadodara', state: 'Gujarat', totalPurchases: 890000 },
    { name: 'Suresh Shetty', phone: '9876543240', email: 'suresh.shetty@example.com', city: 'Mumbai', state: 'Maharashtra', totalPurchases: 4100000 },
    { name: 'Divya Agarwal', phone: '9876543241', email: 'divya.agarwal@example.com', city: 'Lucknow', state: 'Uttar Pradesh', totalPurchases: 670000 },
    { name: 'Mohan Das', phone: '9876543242', email: 'mohan.das@example.com', city: 'Kolkata', state: 'West Bengal', totalPurchases: 1530000 },
    { name: 'Radhika Menon', phone: '9876543243', email: 'radhika.m@example.com', city: 'Kochi', state: 'Kerala', totalPurchases: 2250000 },
    { name: 'Vijay Patil', phone: '9876543244', email: 'vijay.patil@example.com', city: 'Pune', state: 'Maharashtra', totalPurchases: 980000 },
    { name: 'Shreya Singh', phone: '9876543245', email: 'shreya.singh@example.com', city: 'Jaipur', state: 'Rajasthan', totalPurchases: 3200000 },
    { name: 'Prakash Rao', phone: '9876543246', email: 'prakash.rao@example.com', city: 'Hyderabad', state: 'Telangana', totalPurchases: 1750000 },
    { name: 'Nandini Kulkarni', phone: '9876543247', email: 'nandini.k@example.com', city: 'Belgaum', state: 'Karnataka', totalPurchases: 540000 },
    { name: 'Akshay Jain', phone: '9876543248', email: 'akshay.jain@example.com', city: 'Ahmedabad', state: 'Gujarat', totalPurchases: 2850000 },
    { name: 'Tara Kapoor', phone: '9876543249', email: 'tara.kapoor@example.com', city: 'Chandigarh', state: 'Punjab', totalPurchases: 810000 },
    { name: 'Ranveer Singh Rathore', phone: '9876543250', email: 'ranveer.r@example.com', city: 'Jodhpur', state: 'Rajasthan', totalPurchases: 5600000 },
    { name: 'Komal Shah', phone: '9876543251', email: 'komal.shah@example.com', city: 'Mumbai', state: 'Maharashtra', totalPurchases: 1350000 },
    { name: 'Dinesh Yadav', phone: '9876543252', email: 'dinesh.yadav@example.com', city: 'Patna', state: 'Bihar', totalPurchases: 720000 },
    { name: 'Malaika Fernandes', phone: '9876543253', email: 'malaika.f@example.com', city: 'Goa', state: 'Goa', totalPurchases: 460000 },
    { name: 'Hitesh Aggarwal', phone: '9876543254', email: 'hitesh.a@example.com', city: 'Delhi', state: 'Delhi', totalPurchases: 2100000 },
    { name: 'Bhavana Reddy', phone: '9876543255', email: 'bhavana.r@example.com', city: 'Bangalore', state: 'Karnataka', totalPurchases: 1850000 },
    { name: 'Sachin Tendulkar (Fan)', phone: '9876543256', email: 'sachin.fan@example.com', city: 'Mumbai', state: 'Maharashtra', totalPurchases: 1200000 },
    { name: 'Rekha Sharma', phone: '9876543257', email: 'rekha.sharma@example.com', city: 'Kanpur', state: 'Uttar Pradesh', totalPurchases: 380000 },
    { name: 'Imran Khan', phone: '9876543258', email: 'imran.khan@example.com', city: 'Bhopal', state: 'Madhya Pradesh', totalPurchases: 920000 },
    { name: 'Sonia Pillai', phone: '9876543259', email: 'sonia.pillai@example.com', city: 'Thiruvananthapuram', state: 'Kerala', totalPurchases: 1600000 },
    { name: 'Ajay Devgn FAN', phone: '9876543260', email: 'ajay.devgn@example.com', city: 'Pune', state: 'Maharashtra', totalPurchases: 2050000 },
    { name: 'Kajol Mukherjee', phone: '9876543261', email: 'kajol.m@example.com', city: 'Kolkata', state: 'West Bengal', totalPurchases: 750000 },
    { name: 'Yashwant Mahajan', phone: '9876543262', email: 'yashwant.m@example.com', city: 'Nashik', state: 'Maharashtra', totalPurchases: 4300000 },
    { name: 'Jhanvi Patil', phone: '9876543263', email: 'jhanvi.patil@example.com', city: 'Kolhapur', state: 'Maharashtra', totalPurchases: 310000 },
    { name: 'Farhan Akhtar', phone: '9876543264', email: 'farhan.akhtar@example.com', city: 'Mumbai', state: 'Maharashtra', totalPurchases: 1500000 },
  ];

  let custCreated = 0;
  for (const c of newCustomers) {
    const exists = await prisma.customer.findUnique({ where: { phone: c.phone } });
    if (!exists) {
      await prisma.customer.create({
        data: {
          organizationId: org.id,
          name: c.name,
          phone: c.phone,
          email: c.email,
          city: c.city,
          state: c.state,
          totalPurchases: c.totalPurchases,
          creditLimit: Math.round(Number(c.totalPurchases) * 0.3),
        },
      });
      custCreated++;
    }
  }
  console.log(`Customers: ${custCreated} new`);

  // ============ MORE INVOICES ============
  const allCustomers = await prisma.customer.findMany({ where: { organizationId: org.id } });
  const now = new Date();
  const newInvoices = [
    { customerIdx: 25, amount: 6200, status: 'PAID', daysAgo: 0 },
    { customerIdx: 27, amount: 9200, status: 'PAID', daysAgo: 1 },
    { customerIdx: 30, amount: 14500, status: 'UNPAID', daysAgo: 2 },
    { customerIdx: 33, amount: 16000, status: 'PAID', daysAgo: 2 },
    { customerIdx: 35, amount: 58000, status: 'PARTIAL', daysAgo: 3 },
    { customerIdx: 38, amount: 75000, status: 'UNPAID', daysAgo: 4 },
    { customerIdx: 40, amount: 21000, status: 'PAID', daysAgo: 5 },
    { customerIdx: 42, amount: 280, status: 'PAID', daysAgo: 5 },
    { customerIdx: 45, amount: 13500, status: 'PAID', daysAgo: 6 },
    { customerIdx: 48, amount: 33000, status: 'OVERDUE', daysAgo: 12 },
    { customerIdx: 50, amount: 36000, status: 'PAID', daysAgo: 7 },
    { customerIdx: 52, amount: 950, status: 'UNPAID', daysAgo: 1 },
    { customerIdx: 30, amount: 5000, status: 'PAID', daysAgo: 0 },
    { customerIdx: 28, amount: 11000, status: 'PAID', daysAgo: 3 },
    { customerIdx: 41, amount: 18000, status: 'PARTIAL', daysAgo: 4 },
  ];

  const existingCount = await prisma.invoice.count();
  let invCreated = 0;
  for (let i = 0; i < newInvoices.length; i++) {
    const inv = newInvoices[i];
    const c = allCustomers[inv.customerIdx % allCustomers.length];
    if (!c) continue;
    const invDate = new Date(now.getTime() - inv.daysAgo * 86400000);
    const invoiceNo = `INV-${String(2024001 + existingCount + i).padStart(6, '0')}`;
    const paidAmount = inv.status === 'PAID' ? inv.amount : inv.status === 'PARTIAL' ? Math.round(inv.amount * 0.4) : 0;
    try {
      await prisma.invoice.create({
        data: {
          organizationId: org.id,
          invoiceNo,
          invoiceType: 'GST',
          customerId: c.id,
          customerName: c.name,
          customerPhone: c.phone,
          subtotal: inv.amount,
          grandTotal: inv.amount,
          paidAmount,
          balanceAmount: inv.amount - paidAmount,
          paymentStatus: inv.status,
          invoiceDate: invDate,
          userId: admin.id,
        },
      });
      invCreated++;
    } catch (e: any) {
      if (!e.message?.includes('Unique')) console.log(`  Skip invoice ${invoiceNo}: ${e.message}`);
    }
  }
  console.log(`Invoices: ${invCreated} new`);

  console.log('Done! Additional data seeded successfully.');
  console.log(`Total customers: ${allCustomers.length}`);
  console.log(`Total products: ${await prisma.product.count()}`);
  console.log(`Total invoices: ${await prisma.invoice.count()}`);
}

main()
  .catch((e) => { console.error('Failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
