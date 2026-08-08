import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with luxury jewellery data...');

  const org = await prisma.organization.upsert({
    where: { slug: 'goldpay-demo' },
    update: {},
    create: {
      name: 'AB GoldPay Demo',
      slug: 'goldpay-demo',
      email: 'contact@goldpay.com',
      phone: '+91-9876543210',
      address: '123, Jewelry Market, Mumbai - 400001',
      gstin: 'GSTIN1234567890',
    },
  });
  console.log(`Organization: ${org.name}`);

  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@goldpay.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'admin@goldpay.com',
      phone: '9999999999',
      password: adminPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log('Admin: admin@goldpay.com / Admin@123');

  const staffPassword = await bcrypt.hash('Staff@123', 12);
  await prisma.user.upsert({
    where: { email: 'staff@goldpay.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'staff@goldpay.com',
      phone: '8888888888',
      password: staffPassword,
      name: 'Demo Staff',
      role: 'STAFF',
      isActive: true,
    },
  });

  // ============ CUSTOMERS (30 luxury buyers) ============
  const customers = [
    { name: 'Rajesh Patel', phone: '9876543210', email: 'rajesh.patel@example.com', city: 'Mumbai', state: 'Maharashtra', totalPurchases: 1250000 },
    { name: 'Priya Sharma', phone: '9876543211', email: 'priya.sharma@example.com', city: 'Delhi', state: 'Delhi', totalPurchases: 850000 },
    { name: 'Amit Kumar', phone: '9876543212', email: 'amit.kumar@example.com', city: 'Ahmedabad', state: 'Gujarat', totalPurchases: 2100000 },
    { name: 'Sneha Reddy', phone: '9876543213', email: 'sneha.reddy@example.com', city: 'Hyderabad', state: 'Telangana', totalPurchases: 675000 },
    { name: 'Vikram Singh', phone: '9876543214', email: 'vikram.singh@example.com', city: 'Jaipur', state: 'Rajasthan', totalPurchases: 3200000 },
    { name: 'Ananya Gupta', phone: '9876543215', email: 'ananya.gupta@example.com', city: 'Lucknow', state: 'Uttar Pradesh', totalPurchases: 950000 },
    { name: 'Rohit Mehta', phone: '9876543216', email: 'rohit.mehta@example.com', city: 'Pune', state: 'Maharashtra', totalPurchases: 1500000 },
    { name: 'Deepika Joshi', phone: '9876543217', email: 'deepika.joshi@example.com', city: 'Bangalore', state: 'Karnataka', totalPurchases: 420000 },
    { name: 'Arjun Nair', phone: '9876543218', email: 'arjun.nair@example.com', city: 'Kochi', state: 'Kerala', totalPurchases: 1800000 },
    { name: 'Kavita Deshmukh', phone: '9876543219', email: 'kavita.deshmukh@example.com', city: 'Nagpur', state: 'Maharashtra', totalPurchases: 560000 },
    { name: 'Manish Agarwal', phone: '9876543220', email: 'manish.agarwal@example.com', city: 'Kolkata', state: 'West Bengal', totalPurchases: 2750000 },
    { name: 'Neha Kapoor', phone: '9876543221', email: 'neha.kapoor@example.com', city: 'Chandigarh', state: 'Punjab', totalPurchases: 1100000 },
    { name: 'Siddharth Rao', phone: '9876543222', email: 'sid.rao@example.com', city: 'Chennai', state: 'Tamil Nadu', totalPurchases: 1950000 },
    { name: 'Pooja Malhotra', phone: '9876543223', email: 'pooja.m@example.com', city: 'Indore', state: 'Madhya Pradesh', totalPurchases: 780000 },
    { name: 'Ravi Shastri', phone: '9876543224', email: 'ravi.shastri@example.com', city: 'Surat', state: 'Gujarat', totalPurchases: 4300000 },
    { name: 'Isha Verma', phone: '9876543225', email: 'isha.verma@example.com', city: 'Bhopal', state: 'Madhya Pradesh', totalPurchases: 340000 },
    { name: 'Karan Thapar', phone: '9876543226', email: 'karan.t@example.com', city: 'Ludhiana', state: 'Punjab', totalPurchases: 890000 },
    { name: 'Ritu Jain', phone: '9876543227', email: 'ritu.jain@example.com', city: 'Agra', state: 'Uttar Pradesh', totalPurchases: 620000 },
    { name: 'Harsh Mehta', phone: '9876543228', email: 'harsh.mehta@example.com', city: 'Vadodara', state: 'Gujarat', totalPurchases: 1500000 },
    { name: 'Tanya Bajaj', phone: '9876543229', email: 'tanya.b@example.com', city: 'Nashik', state: 'Maharashtra', totalPurchases: 480000 },
    { name: 'Gaurav Saxena', phone: '9876543230', email: 'gaurav.s@example.com', city: 'Patna', state: 'Bihar', totalPurchases: 3200000 },
    { name: 'Meera Iyer', phone: '9876543231', email: 'meera.iyer@example.com', city: 'Coimbatore', state: 'Tamil Nadu', totalPurchases: 210000 },
    { name: 'Aditya Choudhury', phone: '9876543232', email: 'aditya.c@example.com', city: 'Guwahati', state: 'Assam', totalPurchases: 1650000 },
    { name: 'Simran Kaur', phone: '9876543233', email: 'simran.k@example.com', city: 'Amritsar', state: 'Punjab', totalPurchases: 740000 },
    { name: 'Vivek Pandey', phone: '9876543234', email: 'vivek.p@example.com', city: 'Ranchi', state: 'Jharkhand', totalPurchases: 910000 },
    { name: 'Nandini Desai', phone: '9876543235', email: 'nandini.d@example.com', city: 'Surat', state: 'Gujarat', totalPurchases: 2800000 },
    { name: 'Akash Thakur', phone: '9876543236', email: 'akash.t@example.com', city: 'Jodhpur', state: 'Rajasthan', totalPurchases: 1650000 },
    { name: 'Lavanya Krishnan', phone: '9876543237', email: 'lavanya.k@example.com', city: 'Madurai', state: 'Tamil Nadu', totalPurchases: 890000 },
    { name: 'Shivendra Rathore', phone: '9876543238', email: 'shivendra.r@example.com', city: 'Bikaner', state: 'Rajasthan', totalPurchases: 4100000 },
    { name: 'Sonia D\'Souza', phone: '9876543239', email: 'sonia.d@example.com', city: 'Panaji', state: 'Goa', totalPurchases: 520000 },
    { name: 'Rohan Bhatia', phone: '9876543240', email: 'rohan.b@example.com', city: 'Thane', state: 'Maharashtra', totalPurchases: 2100000 },
    { name: 'Tanvi Kulkarni', phone: '9876543241', email: 'tanvi.k@example.com', city: 'Kolhapur', state: 'Maharashtra', totalPurchases: 1350000 },
  ];
  for (const c of customers) {
    await prisma.customer.upsert({
      where: { phone: c.phone },
      update: { totalPurchases: c.totalPurchases },
      create: {
        organizationId: org.id,
        name: c.name,
        phone: c.phone,
        email: c.email,
        city: c.city,
        state: c.state,
        totalPurchases: c.totalPurchases,
        creditLimit: Math.round(c.totalPurchases * 0.3),
      },
    });
  }
  console.log(`Created ${customers.length} customers`);

  // ============ SUPPLIERS ============
  const suppliers = [
    { name: 'Mumbai Gold Traders', phone: '9988776655', city: 'Mumbai', state: 'Maharashtra', totalPurchases: 50000000 },
    { name: 'Delhi Diamond House', phone: '9988776654', city: 'Delhi', state: 'Delhi', totalPurchases: 35000000 },
    { name: 'Jaipur Gems & Co.', phone: '9988776653', city: 'Jaipur', state: 'Rajasthan', totalPurchases: 28000000 },
    { name: 'Surat Diamond Works', phone: '9988776652', city: 'Surat', state: 'Gujarat', totalPurchases: 42000000 },
    { name: 'Chennai Silver Palace', phone: '9988776651', city: 'Chennai', state: 'Tamil Nadu', totalPurchases: 15000000 },
    { name: 'Kolkata Ornament Mart', phone: '9988776650', city: 'Kolkata', state: 'West Bengal', totalPurchases: 22000000 },
    { name: 'Hyderabad Pearls & Gems', phone: '9988776649', city: 'Hyderabad', state: 'Telangana', totalPurchases: 18000000 },
  ];
  for (const s of suppliers) {
    await prisma.supplier.upsert({
      where: { phone: s.phone },
      update: { totalPurchases: s.totalPurchases },
      create: {
        organizationId: org.id,
        name: s.name,
        phone: s.phone,
        city: s.city,
        state: s.state,
        totalPurchases: s.totalPurchases,
      },
    });
  }
  console.log(`Created ${suppliers.length} suppliers`);

  const supplier1 = await prisma.supplier.findFirst({ where: { phone: '9988776655' } });
  const supplier2 = await prisma.supplier.findFirst({ where: { phone: '9988776654' } });
  const supplier3 = await prisma.supplier.findFirst({ where: { phone: '9988776653' } });
  const supplier4 = await prisma.supplier.findFirst({ where: { phone: '9988776652' } });
  const supplier5 = await prisma.supplier.findFirst({ where: { phone: '9988776651' } });
  const supplier6 = await prisma.supplier.findFirst({ where: { phone: '9988776650' } });
  const supplier7 = await prisma.supplier.findFirst({ where: { phone: '9988776649' } });

  // ============ PRODUCTS (40 luxury ornaments) ============
  const products = [
    // --- GOLD RINGS (6) ---
    { name: '22KT Gold Temple Ring', barcode: 'GP001', sku: 'RNG-GD-00001', category: 'RINGS', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 5.0, netWeight: 4.5, purchasePrice: 5500, sellingPrice: 6800, stockQuantity: 15, supplierId: supplier1?.id, description: 'Handcrafted temple design ring with intricate deity carvings, 22KT gold' },
    { name: '24KT Gold Solitaire Ring', barcode: 'GP019', sku: 'RNG-GD-00002', category: 'RINGS', metalType: 'GOLD', goldPurity: 'KT24', grossWeight: 6.5, netWeight: 5.8, purchasePrice: 18500, sellingPrice: 22500, stockQuantity: 5, supplierId: supplier1?.id, description: 'Classic 24KT gold solitaire ring with diamond centre stone, 0.5ct' },
    { name: '22KT Gold Kundan Ring', barcode: 'GP020', sku: 'RNG-GD-00003', category: 'RINGS', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 8.0, netWeight: 7.0, purchasePrice: 12000, sellingPrice: 15500, stockQuantity: 8, supplierId: supplier3?.id, description: 'Rajasthani kundan ring with polki diamonds and enamel work' },
    { name: '18KT Rose Gold Ring with Ruby', barcode: 'GP021', sku: 'RNG-RG-00001', category: 'RINGS', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 3.8, netWeight: 3.2, purchasePrice: 8500, sellingPrice: 11000, stockQuantity: 7, supplierId: supplier1?.id, description: 'Rose gold ring with natural ruby centre and diamond halo' },
    { name: '22KT Gold Nakshi Ring', barcode: 'GP022', sku: 'RNG-GD-00004', category: 'RINGS', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 7.2, netWeight: 6.4, purchasePrice: 16000, sellingPrice: 20500, stockQuantity: 4, supplierId: supplier3?.id, description: 'Bengali nakshi design ring with filigree work, lightweight' },
    { name: '24KT Gold Plain Ring', barcode: 'GP023', sku: 'RNG-GD-00005', category: 'RINGS', metalType: 'GOLD', goldPurity: 'KT24', grossWeight: 4.0, netWeight: 3.8, purchasePrice: 4500, sellingPrice: 5800, stockQuantity: 25, supplierId: supplier1?.id, description: 'Simple 24KT gold plain band ring, daily wear, polished finish' },
    { name: '950 Platinum Diamond Ring', barcode: 'GP006', sku: 'RNG-PT-00001', category: 'RINGS', metalType: 'PLATINUM', grossWeight: 6.0, netWeight: 5.2, purchasePrice: 10000, sellingPrice: 13500, stockQuantity: 3, supplierId: supplier2?.id, description: 'Platinum ring with 0.3 carat diamond accent, elegant' },

    // --- NECKLACES (6) ---
    { name: '22KT Gold Lakshmi Necklace', barcode: 'GP024', sku: 'NCK-GD-00002', category: 'NECKLACES', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 28.0, netWeight: 25.0, purchasePrice: 38000, sellingPrice: 49500, stockQuantity: 3, supplierId: supplier1?.id, description: 'Goddess Lakshmi pendant necklace with gold chain, festive special' },
    { name: 'Antique Gold Necklace Set', barcode: 'GP015', sku: 'NCK-GD-00001', category: 'NECKLACES', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 35.0, netWeight: 31.0, purchasePrice: 45000, sellingPrice: 58000, stockQuantity: 2, supplierId: supplier1?.id, description: 'Antique finish necklace set with matching earrings, heirloom quality' },
    { name: '22KT Gold Peacock Necklace', barcode: 'GP025', sku: 'NCK-GD-00003', category: 'NECKLACES', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 22.0, netWeight: 19.5, purchasePrice: 52000, sellingPrice: 67500, stockQuantity: 2, supplierId: supplier3?.id, description: 'Peacock design gold necklace with emerald and ruby accents' },
    { name: '18KT Gold Pearl Necklace', barcode: 'GP026', sku: 'NCK-GD-00004', category: 'NECKLACES', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 16.0, netWeight: 14.0, purchasePrice: 22000, sellingPrice: 28500, stockQuantity: 4, supplierId: supplier1?.id, description: 'Gold chain with cultured South Sea pearls, elegant design' },
    { name: 'Diamond Choker Necklace', barcode: 'GP027', sku: 'NCK-DM-00001', category: 'NECKLACES', metalType: 'DIAMOND', grossWeight: 12.0, netWeight: 10.5, purchasePrice: 65000, sellingPrice: 85000, stockQuantity: 1, supplierId: supplier2?.id, description: '1.5ct diamond choker in 18KT gold setting, bridal collection' },
    { name: 'Gold Nose Pin Set', barcode: 'GP009', sku: 'NOS-GD-00001', category: 'NOSEPIN', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 1.0, netWeight: 0.8, purchasePrice: 800, sellingPrice: 1200, stockQuantity: 30, supplierId: supplier1?.id, description: 'Set of 3 gold nose pins with pearl, emerald, and ruby tips' },

    // --- MANGALSUTRA (4) ---
    { name: '22KT Gold Traditional Mangalsutra', barcode: 'GP007', sku: 'MNG-GD-00001', category: 'MANGALSUTRA', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 8.0, netWeight: 7.2, purchasePrice: 8500, sellingPrice: 11000, stockQuantity: 7, supplierId: supplier1?.id, description: 'Traditional mangalsutra with black bead and gold pendant, 2-strand' },
    { name: '22KT Gold Diamond Mangalsutra', barcode: 'GP028', sku: 'MNG-GD-00002', category: 'MANGALSUTRA', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 10.5, netWeight: 9.2, purchasePrice: 16000, sellingPrice: 21000, stockQuantity: 4, supplierId: supplier2?.id, description: 'Mangalsutra with diamond-studded gold pendant, modern design' },
    { name: '18KT Gold Mangalsutra with Emerald', barcode: 'GP029', sku: 'MNG-GD-00003', category: 'MANGALSUTRA', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 7.0, netWeight: 6.0, purchasePrice: 11500, sellingPrice: 15000, stockQuantity: 6, supplierId: supplier1?.id, description: 'Gold mangalsutra with emerald stone pendant, lightweight daily wear' },
    { name: 'Platinum Diamond Mangalsutra', barcode: 'GP030', sku: 'MNG-PT-00001', category: 'MANGALSUTRA', metalType: 'PLATINUM', grossWeight: 6.0, netWeight: 5.2, purchasePrice: 35000, sellingPrice: 46000, stockQuantity: 2, supplierId: supplier2?.id, description: 'Platinum mangalsutra with diamonds, contemporary minimalist design' },

    // --- EARRINGS (5) ---
    { name: '18KT Gold Jhumka Earrings', barcode: 'GP005', sku: 'EAR-GD-00001', category: 'EARRINGS', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 4.0, netWeight: 3.5, purchasePrice: 4000, sellingPrice: 5200, stockQuantity: 20, supplierId: supplier1?.id, description: 'Classic jhumka earrings with pearl drops and filigree work' },
    { name: '22KT Gold Chandbali Earrings', barcode: 'GP031', sku: 'EAR-GD-00002', category: 'EARRINGS', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 6.0, netWeight: 5.2, purchasePrice: 9500, sellingPrice: 12500, stockQuantity: 6, supplierId: supplier1?.id, description: 'Crescent moon chandbali earrings with kundan work, bridal style' },
    { name: 'Rose Gold Diamond Earrings', barcode: 'GP013', sku: 'EAR-RG-00001', category: 'EARRINGS', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 3.5, netWeight: 3.0, purchasePrice: 5200, sellingPrice: 6800, stockQuantity: 6, supplierId: supplier2?.id, description: 'Rose gold earrings with rose-cut diamond studs' },
    { name: 'Gold Stud Earrings with Ruby', barcode: 'GP032', sku: 'EAR-GD-00003', category: 'EARRINGS', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 2.5, netWeight: 2.1, purchasePrice: 3500, sellingPrice: 4800, stockQuantity: 12, supplierId: supplier1?.id, description: 'Gold stud earrings set with natural ruby stones, elegant' },
    { name: 'Silver Jhumka Earrings', barcode: 'GP033', sku: 'EAR-SL-00001', category: 'EARRINGS', metalType: 'SILVER', grossWeight: 8.0, netWeight: 7.2, purchasePrice: 120, sellingPrice: 180, stockQuantity: 18, supplierId: supplier5?.id, description: 'Traditional silver jhumka earrings with oxidized finish' },

    // --- BANGLES & BRACELETS (6) ---
    { name: '22KT Gold Bangle Set', barcode: 'GP034', sku: 'BNG-GD-00001', category: 'BANGLES', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 18.0, netWeight: 16.0, purchasePrice: 22000, sellingPrice: 28500, stockQuantity: 4, supplierId: supplier1?.id, description: 'Set of 2 gold bangles with embossed floral design, traditional' },
    { name: '18KT Gold Tennis Bracelet', barcode: 'GP010', sku: 'BRL-GD-00001', category: 'BRACELETS', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 7.0, netWeight: 6.2, purchasePrice: 6000, sellingPrice: 7800, stockQuantity: 4, supplierId: supplier1?.id, description: 'Elegant tennis bracelet with diamond channel setting' },
    { name: 'Gold Baby Bracelet', barcode: 'GP014', sku: 'BRL-GD-00002', category: 'BRACELETS', metalType: 'GOLD', goldPurity: 'KT24', grossWeight: 3.0, netWeight: 2.6, purchasePrice: 3200, sellingPrice: 4200, stockQuantity: 22, supplierId: supplier1?.id, description: 'Delicate baby bracelet with adjustable chain and tiny bell charms' },
    { name: 'Silver Polki Bangles', barcode: 'GP004', sku: 'BNG-SL-00001', category: 'BANGLES', metalType: 'SILVER', grossWeight: 30.0, netWeight: 28.5, purchasePrice: 150, sellingPrice: 220, stockQuantity: 10, supplierId: supplier3?.id, description: 'Traditional silver bangles set of 6 with pola finish' },
    { name: 'Silver Oxidized Bracelet', barcode: 'GP035', sku: 'BRL-SL-00001', category: 'BRACELETS', metalType: 'SILVER', grossWeight: 15.0, netWeight: 13.5, purchasePrice: 250, sellingPrice: 380, stockQuantity: 14, supplierId: supplier5?.id, description: 'Oxidized silver bracelet with tribal motifs and adjustable chain' },
    { name: 'Platinum Diamond Bracelet', barcode: 'GP036', sku: 'BRL-PT-00001', category: 'BRACELETS', metalType: 'PLATINUM', grossWeight: 8.5, netWeight: 7.5, purchasePrice: 28000, sellingPrice: 36500, stockQuantity: 2, supplierId: supplier2?.id, description: 'Platinum bracelet with 0.8ct diamond accent, luxury gift' },

    // --- CHAINS (4) ---
    { name: '24KT Gold Cuban Chain', barcode: 'GP002', sku: 'CHN-GD-00001', category: 'CHAINS', metalType: 'GOLD', goldPurity: 'KT24', grossWeight: 12.0, netWeight: 11.2, purchasePrice: 14000, sellingPrice: 17500, stockQuantity: 8, supplierId: supplier1?.id, description: 'Premium 24KT gold Cuban link chain, 20-inch length' },
    { name: '22KT Gold Rope Chain', barcode: 'GP037', sku: 'CHN-GD-00002', category: 'CHAINS', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 8.0, netWeight: 7.3, purchasePrice: 9500, sellingPrice: 12500, stockQuantity: 6, supplierId: supplier1?.id, description: '22KT gold rope chain, 18-inch length, diamond-cut finish' },
    { name: '18KT Gold Figaro Chain', barcode: 'GP038', sku: 'CHN-GD-00003', category: 'CHAINS', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 6.5, netWeight: 5.8, purchasePrice: 7200, sellingPrice: 9500, stockQuantity: 10, supplierId: supplier1?.id, description: 'Figaro pattern gold chain, 22-inch, versatile layering chain' },
    { name: 'Silver Cable Chain', barcode: 'GP039', sku: 'CHN-SL-00001', category: 'CHAINS', metalType: 'SILVER', grossWeight: 10.0, netWeight: 9.2, purchasePrice: 180, sellingPrice: 280, stockQuantity: 20, supplierId: supplier5?.id, description: 'Pure silver cable chain, 20-inch, lobster clasp' },

    // --- PENDANTS (4) ---
    { name: 'Diamond Solitaire Pendant', barcode: 'GP003', sku: 'PND-DM-00001', category: 'PENDANTS', metalType: 'DIAMOND', grossWeight: 3.2, netWeight: 2.8, purchasePrice: 350, sellingPrice: 520, stockQuantity: 5, supplierId: supplier2?.id, description: '0.5 carat diamond solitaire in 18KT gold setting' },
    { name: '22KT Gold Om Pendant', barcode: 'GP040', sku: 'PND-GD-00001', category: 'PENDANTS', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 4.0, netWeight: 3.5, purchasePrice: 4800, sellingPrice: 6200, stockQuantity: 12, supplierId: supplier1?.id, description: 'Sacred Om symbol pendant in 22KT gold, religious wear' },
    { name: 'Gold Ganesh Pendant', barcode: 'GP041', sku: 'PND-GD-00002', category: 'PENDANTS', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 5.5, netWeight: 4.8, purchasePrice: 7500, sellingPrice: 9800, stockQuantity: 9, supplierId: supplier1?.id, description: 'Lord Ganesh pendant, finely carved in 22KT gold, auspicious' },
    { name: 'Pearl Drop Pendant', barcode: 'GP042', sku: 'PND-GD-00003', category: 'PENDANTS', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 2.0, netWeight: 1.6, purchasePrice: 2800, sellingPrice: 3800, stockQuantity: 15, supplierId: supplier1?.id, description: '18KT gold pendant with freshwater pearl drop, delicate design' },

    // --- OTHER ITEMS (5) ---
    { name: 'Silver Oxidized Anklet', barcode: 'GP043', sku: 'ANK-SL-00002', category: 'ANKLETS', metalType: 'SILVER', grossWeight: 18.0, netWeight: 16.5, purchasePrice: 280, sellingPrice: 420, stockQuantity: 11, supplierId: supplier5?.id, description: 'Oxidized silver anklet with traditional bell charms, adjustable length' },
    { name: '999 Silver Investment Coin 100g', barcode: 'GP008', sku: 'CN-SL-00001', category: 'COINS', metalType: 'SILVER', grossWeight: 100.0, netWeight: 100.0, purchasePrice: 650, sellingPrice: 780, stockQuantity: 25, supplierId: supplier5?.id, description: 'Pure 999 silver coin with Lakshmi embossing, 100g' },
    { name: 'Gold Plated Designer Watch', barcode: 'GP011', sku: 'WTC-GP-00001', category: 'WATCHES', metalType: 'GOLD', grossWeight: 25.0, netWeight: 20.0, purchasePrice: 2000, sellingPrice: 3500, stockQuantity: 12, supplierId: supplier1?.id, description: 'Swiss movement gold-plated watch with leather strap' },
    { name: 'Gold Cufflinks Set', barcode: 'GP018', sku: 'CFL-GD-00001', category: 'CUFFLINKS', metalType: 'GOLD', goldPurity: 'KT18', grossWeight: 5.0, netWeight: 4.2, purchasePrice: 4500, sellingPrice: 6000, stockQuantity: 9, supplierId: supplier1?.id, description: 'Luxury gold cufflinks with onyx inlay, gift box included' },
    { name: 'Diamond Nose Ring', barcode: 'GP016', sku: 'NOS-DM-00001', category: 'NOSEPIN', metalType: 'DIAMOND', grossWeight: 0.5, netWeight: 0.4, purchasePrice: 1500, sellingPrice: 2200, stockQuantity: 14, supplierId: supplier2?.id, description: 'Mini diamond nose ring in 18KT gold screw fitting' },
    { name: 'Silver Anklet with Bells', barcode: 'GP017', sku: 'ANK-SL-00001', category: 'ANKLETS', metalType: 'SILVER', grossWeight: 20.0, netWeight: 18.0, purchasePrice: 200, sellingPrice: 350, stockQuantity: 16, supplierId: supplier3?.id, description: 'Traditional silver anklet with tiny bell charms' },
    { name: '22KT Gold Toe Ring Set', barcode: 'GP012', sku: 'TOE-GD-00001', category: 'TOERINGS', metalType: 'GOLD', goldPurity: 'KT22', grossWeight: 2.0, netWeight: 1.6, purchasePrice: 1800, sellingPrice: 2500, stockQuantity: 18, supplierId: supplier3?.id, description: 'Traditional toe ring set with temple bells design' },

    // --- DIAMOND SPECIALS (4) ---
    { name: 'Diamond Halo Ring', barcode: 'GP044', sku: 'RNG-DM-00001', category: 'RINGS', metalType: 'DIAMOND', grossWeight: 4.0, netWeight: 3.4, purchasePrice: 22000, sellingPrice: 29000, stockQuantity: 3, supplierId: supplier2?.id, description: '0.75ct diamond halo ring in 18KT gold, brilliant cut' },
    { name: 'Diamond Drop Earrings', barcode: 'GP045', sku: 'EAR-DM-00001', category: 'EARRINGS', metalType: 'DIAMOND', grossWeight: 2.8, netWeight: 2.3, purchasePrice: 18000, sellingPrice: 24000, stockQuantity: 4, supplierId: supplier2?.id, description: 'Diamond drop earrings with 0.4ct each, elegant sparkle' },
    { name: 'Diamond Bangles Set', barcode: 'GP046', sku: 'BNG-DM-00001', category: 'BANGLES', metalType: 'DIAMOND', grossWeight: 14.0, netWeight: 12.0, purchasePrice: 42000, sellingPrice: 55000, stockQuantity: 2, supplierId: supplier2?.id, description: 'Set of 2 diamond-studded gold bangles, bridal collection' },
    { name: 'Diamond Pendant with Chain', barcode: 'GP047', sku: 'PND-DM-00002', category: 'PENDANTS', metalType: 'DIAMOND', grossWeight: 2.5, netWeight: 2.0, purchasePrice: 14000, sellingPrice: 18500, stockQuantity: 5, supplierId: supplier2?.id, description: 'Diamond pendant with matching chain, 0.3ct total weight' },
  ];
  const categoryImages: Record<string, string> = {
    RINGS: '/products/ring.jpg',
    NECKLACES: '/products/necklace.jpg',
    MANGALSUTRA: '/products/mangalsutra.jpg',
    EARRINGS: '/products/earrings.jpg',
    BANGLES: '/products/bangles.jpg',
    BRACELETS: '/products/bracelet.jpg',
    CHAINS: '/products/chain.jpg',
    PENDANTS: '/products/pendant.jpg',
    COINS: '/products/coin.jpg',
    NOSEPIN: '/products/nosepin.jpg',
    ANKLETS: '/products/anklet.jpg',
    TOERINGS: '/products/toering.jpg',
    WATCHES: '/products/watch.jpg',
    CUFFLINKS: '/products/cufflinks.jpg',
  };
  for (const p of products) {
    const isDiamondRing = p.category === 'RINGS' && (p.metalType === 'DIAMOND' || p.metalType === 'PLATINUM');
    const img = isDiamondRing ? '/products/ring-diamond.jpg' : (categoryImages[p.category] || '/products/ring.jpg');
    await prisma.product.upsert({
      where: { barcode: p.barcode },
      update: {
        stockQuantity: p.stockQuantity,
        sellingPrice: p.sellingPrice,
        description: p.description,
        images: JSON.stringify([img]),
      },
      create: {
        organizationId: org.id,
        ...p,
        productCode: p.barcode,
        makingCharges: Math.round(Number(p.sellingPrice) * 0.08),
        wastagePercent: 2.5,
        minStockLevel: 5,
        hsnCode: '7113',
        taxRate: 3.0,
        images: JSON.stringify([img]),
      } as any,
    });
  }
  console.log(`Created ${products.length} products`);

  // ============ INVOICES (20 recent transactions) ============
  const allCustomers = await prisma.customer.findMany({ where: { organizationId: org.id } });
  const now = new Date();
  const invoiceData = [
    { customerIdx: 0, amount: 6800, status: 'PAID', daysAgo: 0 },
    { customerIdx: 2, amount: 17500, status: 'PAID', daysAgo: 1 },
    { customerIdx: 4, amount: 11000, status: 'PAID', daysAgo: 1 },
    { customerIdx: 1, amount: 11000, status: 'UNPAID', daysAgo: 2 },
    { customerIdx: 3, amount: 58000, status: 'PARTIAL', daysAgo: 3 },
    { customerIdx: 6, amount: 7800, status: 'PAID', daysAgo: 3 },
    { customerIdx: 5, amount: 3500, status: 'PAID', daysAgo: 4 },
    { customerIdx: 8, amount: 22500, status: 'UNPAID', daysAgo: 5 },
    { customerIdx: 7, amount: 2500, status: 'PAID', daysAgo: 5 },
    { customerIdx: 10, amount: 15500, status: 'PAID', daysAgo: 6 },
    { customerIdx: 9, amount: 6800, status: 'OVERDUE', daysAgo: 10 },
    { customerIdx: 11, amount: 28500, status: 'PAID', daysAgo: 7 },
    { customerIdx: 12, amount: 4200, status: 'PAID', daysAgo: 7 },
    { customerIdx: 14, amount: 12500, status: 'UNPAID', daysAgo: 8 },
    { customerIdx: 13, amount: 380, status: 'PAID', daysAgo: 9 },
    { customerIdx: 15, amount: 46000, status: 'PARTIAL', daysAgo: 11 },
    { customerIdx: 18, amount: 9800, status: 'PAID', daysAgo: 12 },
    { customerIdx: 20, amount: 17500, status: 'PAID', daysAgo: 13 },
    { customerIdx: 22, amount: 520, status: 'OVERDUE', daysAgo: 15 },
    { customerIdx: 25, amount: 67500, status: 'PAID', daysAgo: 14 },
  ];
  for (let i = 0; i < invoiceData.length; i++) {
    const inv = invoiceData[i];
    const c = allCustomers[inv.customerIdx % allCustomers.length];
    if (!c) continue;
    const invDate = new Date(now.getTime() - inv.daysAgo * 86400000);
    const invoiceNo = `INV-${String(2024001 + i).padStart(6, '0')}`;
    const paidAmount = inv.status === 'PAID' ? inv.amount : inv.status === 'PARTIAL' ? Math.round(inv.amount * 0.4) : 0;
    await prisma.invoice.upsert({
      where: { invoiceNo },
      update: {},
      create: {
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
  }
  console.log(`Created ${invoiceData.length} invoices`);

  // ============ SETTINGS ============
  const settings = [
    { key: 'company_name', value: 'AB GoldPay' },
    { key: 'company_address', value: '123, Jewelry Market, Mumbai - 400001' },
    { key: 'company_gst', value: 'GSTIN1234567890' },
    { key: 'company_phone', value: '+91-9876543210' },
    { key: 'company_email', value: 'contact@goldpay.com' },
    { key: 'invoice_prefix', value: 'INV' },
    { key: 'default_tax_rate', value: '3' },
    { key: 'low_stock_alert', value: '5' },
    { key: 'auto_backup', value: 'true' },
    { key: 'backup_retention', value: '30' },
    { key: 'gold_rate_22kt', value: '7150' },
    { key: 'gold_rate_24kt', value: '7630' },
    { key: 'silver_rate', value: '82' },
    { key: 'store_timing', value: '10:00 AM - 8:00 PM' },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({
      where: { organizationId_key: { organizationId: org.id, key: s.key } },
      update: { value: s.value },
      create: { organizationId: org.id, key: s.key, value: s.value },
    });
  }

  console.log('GoldPay ERP seeded with 40 luxury products & 32 customers!');
  console.log('Login: admin@goldpay.com / Admin@123');
}

main()
  .catch((e) => { console.error('Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
