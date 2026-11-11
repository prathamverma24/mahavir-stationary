import express, { Request, Response, NextFunction } from 'express';
import { db } from './db.ts';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// On Vercel the function may receive `/products` instead of `/api/products`.
// Locally every request shares this app, so leave non-API paths unchanged.
app.use((req, _res, next) => {
  if (!process.env.VERCEL) {
    next();
    return;
  }
  const raw = req.url || '/';
  const qIndex = raw.indexOf('?');
  const pathOnly = qIndex === -1 ? raw : raw.slice(0, qIndex);
  const query = qIndex === -1 ? '' : raw.slice(qIndex);
  if (!pathOnly.startsWith('/api')) {
    const suffix = pathOnly === '/' ? '' : pathOnly;
    req.url = `/api${suffix}${query}`;
  }
  next();
});

// Admin auth middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header required' });
  }
  const token = authHeader.replace(/^Bearer\s+/i, '');
  // Token format: "admin-token-SESSION" or raw verified password
  if (!token || (!token.startsWith('admin-token-') && !db.verifyAdmin(token))) {
    return res.status(403).json({ error: 'Invalid or expired admin credentials' });
  }
  next();
}

// ---------------------------------------------------------------------------
// REST API ENDPOINTS
// ---------------------------------------------------------------------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', store: 'Shri Mahavir Stationery & Toys', timestamp: new Date().toISOString() });
});

// Settings
app.get('/api/settings', (_req, res) => {
  const settings = db.getSettings();
  // Don't leak admin password hash
  const { admin_password_hash, ...publicSettings } = settings;
  res.json(publicSettings);
});

app.put('/api/settings', requireAdmin, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    const { admin_password_hash, ...publicSettings } = updated;
    res.json(publicSettings);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update settings' });
  }
});

// Admin Auth
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  if (db.verifyAdmin(password)) {
    const token = `admin-token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    return res.json({ success: true, token, message: 'Authentication successful' });
  }
  return res.status(401).json({ error: 'Incorrect admin password' });
});

app.get('/api/admin/verify', requireAdmin, (_req, res) => {
  res.json({ authenticated: true });
});

// Categories
app.get('/api/categories', (_req, res) => {
  const categories = db.getCategories();
  res.json(categories);
});

app.post('/api/categories', requireAdmin, (req, res) => {
  try {
    const { name, slug, description, image_url, display_order, is_active } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });
    const newCategory = db.createCategory({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || '',
      image_url: image_url || '',
      display_order: Number(display_order) || 0,
      is_active: is_active ?? true,
    });
    res.status(201).json(newCategory);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/categories/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', requireAdmin, (req, res) => {
  const deleted = db.deleteCategory(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Category not found' });
  res.json({ success: true, message: 'Category deleted' });
});

// Products
app.get('/api/products', (req, res) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    isNew,
    isFeatured,
    isBestSeller,
    inStockOnly,
    hasOffer,
    sortBy,
    includeInactive,
  } = req.query;

  const products = db.getProducts({
    category: category as string,
    search: search as string,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    isNew: isNew === 'true',
    isFeatured: isFeatured === 'true',
    isBestSeller: isBestSeller === 'true',
    inStockOnly: inStockOnly === 'true',
    hasOffer: hasOffer === 'true',
    sortBy: sortBy as any,
    includeInactive: includeInactive === 'true',
  });

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProduct(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', requireAdmin, (req, res) => {
  try {
    const {
      name,
      slug,
      sku,
      description,
      selling_price,
      mrp,
      stock_quantity,
      category_id,
      images,
      is_new,
      is_featured,
      is_best_seller,
      is_active,
    } = req.body;

    if (!name || !selling_price || !sku) {
      return res.status(400).json({ error: 'Name, SKU, and selling price are required' });
    }

    const newProd = db.createProduct({
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku,
      description: description || '',
      selling_price: Number(selling_price),
      mrp: Number(mrp) || Number(selling_price),
      stock_quantity: Number(stock_quantity) || 0,
      category_id: category_id || '',
      images: Array.isArray(images) && images.length ? images : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
      is_new: !!is_new,
      is_featured: !!is_featured,
      is_best_seller: !!is_best_seller,
      is_active: is_active ?? true,
      rating: 5.0,
      review_count: 1,
    });

    res.status(201).json(newProd);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const deleted = db.deleteProduct(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true, message: 'Product deleted' });
});

// Bulk Import
app.post('/api/admin/bulk-import-products', requireAdmin, (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Valid products array is required' });
    }
    const count = db.bulkImportProducts(products);
    res.json({ success: true, count, message: `Successfully imported ${count} products` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Banners
app.get('/api/banners', (_req, res) => {
  const banners = db.getBanners();
  res.json(banners);
});

app.post('/api/banners', requireAdmin, (req, res) => {
  try {
    const newBanner = db.createBanner(req.body);
    res.status(201).json(newBanner);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/banners/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateBanner(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Banner not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/banners/:id', requireAdmin, (req, res) => {
  const deleted = db.deleteBanner(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Banner not found' });
  res.json({ success: true, message: 'Banner deleted' });
});

// Orders
app.get('/api/orders', requireAdmin, (_req, res) => {
  const orders = db.getOrders();
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// Place new order (Server-side validation)
app.post('/api/orders', (req, res) => {
  try {
    const { customer_name, customer_phone, delivery_address, city, pincode, order_type, additional_notes, items } = req.body;

    if (!customer_name || !customer_phone) {
      return res.status(400).json({ error: 'Customer name and phone number are required' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required in the cart' });
    }

    if (order_type === 'Home Delivery' && (!delivery_address || !delivery_address.trim())) {
      return res.status(400).json({ error: 'Delivery address is required for Home Delivery orders' });
    }

    const order = db.createOrder({
      customer_name,
      customer_phone,
      delivery_address,
      city,
      pincode,
      order_type: order_type === 'Store Pickup' ? 'Store Pickup' : 'Home Delivery',
      additional_notes,
      items,
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to place order' });
  }
});

app.patch('/api/orders/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });
  const updated = db.updateOrderStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(updated);
});

export default app;
