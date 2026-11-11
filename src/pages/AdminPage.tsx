import React, { useState, useEffect } from 'react';
import { Product, Category, Banner, Order, StoreSettings } from '../types/store';
import { useSettings } from '../context/SettingsContext';
import { calculateDiscount, createWhatsAppUrl } from '../utils/orderUtils';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image,
  ShoppingBag,
  Settings,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  AlertTriangle,
  MessageCircle,
  ExternalLink,
  Upload,
  Lock,
  LogOut,
  RefreshCw,
  Search,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { settings, reloadSettings, updateSettingsState } = useSettings();

  // Admin Auth State
  const [token, setToken] = useState<string>(() => localStorage.getItem('sm_admin_token') || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'banners' | 'orders' | 'settings'>('overview');

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Modals state
  const [productModal, setProductModal] = useState<{ open: boolean; product: Partial<Product> | null }>({ open: false, product: null });
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; category: Partial<Category> | null }>({ open: false, category: null });
  const [bannerModal, setBannerModal] = useState<{ open: boolean; banner: Partial<Banner> | null }>({ open: false, banner: null });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState('');

  // Search & filter in product table
  const [adminSearch, setAdminSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Load all admin data when authenticated
  const loadAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [pRes, cRes, bRes, oRes] = await Promise.all([
        fetch('/api/products?includeInactive=true'),
        fetch('/api/categories'),
        fetch('/api/banners'),
        fetch('/api/orders', { headers }),
      ]);

      if (pRes.ok) setProducts(await pRes.json());
      if (cRes.ok) setCategories(await cRes.json());
      if (bRes.ok) setBanners(await bRes.json());
      if (oRes.ok) setOrders(await oRes.json());
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token]);

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  // Auth Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('sm_admin_token', data.token);
        setToken(data.token);
      } else {
        setAuthError(data.error || 'Incorrect admin password (default: admin123)');
      }
    } catch (err: any) {
      setAuthError('Server communication error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sm_admin_token');
    setToken('');
  };

  // -------------------------------------------------------------------------
  // Product CRUD Handlers
  // -------------------------------------------------------------------------
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productModal.product) return;

    const p = productModal.product;
    const isEdit = Boolean(p.id);
    const url = isEdit ? `/api/products/${p.id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(p),
      });

      if (res.ok) {
        setProductModal({ open: false, product: null });
        loadAdminData();
        showNotification(isEdit ? 'Product updated successfully' : 'Product added successfully');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save product');
      }
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        loadAdminData();
        showNotification('Product deleted');
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  // -------------------------------------------------------------------------
  // Category CRUD Handlers
  // -------------------------------------------------------------------------
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryModal.category) return;

    const c = categoryModal.category;
    const isEdit = Boolean(c.id);
    const url = isEdit ? `/api/categories/${c.id}` : '/api/categories';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(c),
      });

      if (res.ok) {
        setCategoryModal({ open: false, category: null });
        loadAdminData();
        showNotification(isEdit ? 'Category updated' : 'Category created');
      }
    } catch (e) {
      alert('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        loadAdminData();
        showNotification('Category removed');
      }
    } catch (e) {
      alert('Failed to delete category');
    }
  };

  // -------------------------------------------------------------------------
  // Banner CRUD Handlers
  // -------------------------------------------------------------------------
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerModal.banner) return;
    const b = bannerModal.banner;
    const isEdit = Boolean(b.id);
    const url = isEdit ? `/api/banners/${b.id}` : '/api/banners';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(b),
      });

      if (res.ok) {
        setBannerModal({ open: false, banner: null });
        loadAdminData();
        showNotification('Banner updated');
      }
    } catch (e) {
      alert('Failed to save banner');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm('Delete promotional banner?')) return;
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        loadAdminData();
        showNotification('Banner deleted');
      }
    } catch (e) {
      alert('Failed to delete banner');
    }
  };

  // -------------------------------------------------------------------------
  // Order Status Handler
  // -------------------------------------------------------------------------
  const handleUpdateOrderStatus = async (orderId: string, status: Order['order_status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId ? { ...o, order_status: status } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => (prev ? { ...prev, order_status: status } : null));
        }
        showNotification(`Order status changed to "${status}"`);
      }
    } catch (e) {
      alert('Failed to update status');
    }
  };

  // -------------------------------------------------------------------------
  // Store Settings Save Handler
  // -------------------------------------------------------------------------
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsForm),
      });

      if (res.ok) {
        const saved = await res.json();
        updateSettingsState(saved);
        showNotification('Store settings and WhatsApp configuration updated');
      }
    } catch (e) {
      alert('Failed to update store settings');
    }
  };

  // -------------------------------------------------------------------------
  // Bulk CSV Import Handler
  // -------------------------------------------------------------------------
  const handleBulkImport = async () => {
    if (!bulkCsvText.trim()) return;
    try {
      const lines = bulkCsvText.trim().split('\n');
      const parsedProds = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('Name,') || line.startsWith('name,')) continue;
        const parts = line.split(',').map(s => s.trim());
        if (parts.length >= 4) {
          const [name, sku, sellingPrice, mrp, categoryId, stock] = parts;
          parsedProds.push({
            name,
            sku,
            selling_price: Number(sellingPrice) || 100,
            mrp: Number(mrp) || Number(sellingPrice) || 120,
            category_id: categoryId || 'cat-notebooks',
            stock_quantity: Number(stock) || 50,
            description: `Quality ${name} for school and study`,
            images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
            is_new: true,
            is_featured: false,
            is_best_seller: false,
            is_active: true,
          });
        }
      }

      if (parsedProds.length === 0) {
        alert('Could not parse any valid products from CSV');
        return;
      }

      const res = await fetch('/api/admin/bulk-import-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ products: parsedProds }),
      });

      if (res.ok) {
        const data = await res.json();
        setBulkImportOpen(false);
        setBulkCsvText('');
        loadAdminData();
        showNotification(`Imported ${data.count} products successfully!`);
      }
    } catch (err) {
      alert('Bulk import failed. Please verify CSV formatting.');
    }
  };

  // If NOT authenticated, render Login Screen
  if (!token) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <img
              src="/assets/aistudio/Shri_Mahavir_Stationery_Gift_Logo_f6dc5ae7.png"
              alt="Shri Mahavir"
              className="h-16 w-auto mx-auto object-contain mb-2"
            />
            <h1 className="font-serif font-bold text-2xl text-stone-900">
              Admin Dashboard Login
            </h1>
            <p className="text-xs text-stone-500">
              Shri Mahavir Stationery & Toys Store Control Center
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter admin password (default: admin123)"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Tip: Initial default password is <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">admin123</code> (can be changed in settings).
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0F172A] hover:bg-[#1E293B] text-white border border-[#C5A059]/30 rounded-xl font-bold text-xs shadow-xs transition-colors tracking-wide"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculated overview stats
  const totalProductsCount = products.length;
  const activeProductsCount = products.filter(p => p.is_active).length;
  const outOfStockCount = products.filter(p => p.stock_quantity <= 0).length;
  const lowStockCount = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length;
  const pendingOrdersCount = orders.filter(o => o.order_status === 'Pending Request').length;
  const confirmedOrdersCount = orders.filter(o => o.order_status === 'WhatsApp Confirmed').length;
  const completedOrdersCount = orders.filter(o => o.order_status === 'Completed').length;
  const totalRevenue = orders
    .filter(o => o.order_status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const filteredProducts = products.filter(p => {
    if (!adminSearch.trim()) return true;
    const s = adminSearch.toLowerCase();
    return p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s);
  });

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.order_status === orderFilter;
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#781D2E]">Store Administration</span>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-stone-900 tracking-tight">
            Control Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {actionSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> {actionSuccess}
            </span>
          )}

          <button
            onClick={loadAdminData}
            title="Refresh Store Data"
            className="p-2.5 bg-white border border-stone-200 text-stone-700 hover:text-stone-900 rounded-xl hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-2">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
          { id: 'products', label: `Products (${totalProductsCount})`, icon: Package },
          { id: 'orders', label: `WhatsApp Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'categories', label: `Categories (${categories.length})`, icon: FolderTree },
          { id: 'banners', label: `Banners (${banners.length})`, icon: Image },
          { id: 'settings', label: 'Store & WhatsApp Settings', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#0F172A] text-white shadow-xs border border-[#C5A059]/30'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200/80'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. OVERVIEW TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Products</span>
              <p className="font-display font-black text-2xl text-stone-900">{totalProductsCount}</p>
              <p className="text-[11px] text-emerald-600 font-medium">{activeProductsCount} active on storefront</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Inventory Status</span>
              <p className="font-display font-black text-2xl text-stone-900">
                {outOfStockCount > 0 ? (
                  <span className="text-rose-600">{outOfStockCount} Out</span>
                ) : (
                  <span className="text-emerald-600">All In Stock</span>
                )}
              </p>
              <p className="text-[11px] text-amber-600 font-medium">{lowStockCount} items low stock (&lt;=5)</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">New WhatsApp Requests</span>
              <p className="font-serif font-bold text-2xl text-[#781D2E]">{pendingOrdersCount}</p>
              <p className="text-[11px] text-stone-500 font-medium">{confirmedOrdersCount} confirmed / {completedOrdersCount} done</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Processed Value</span>
              <p className="font-serif font-bold text-2xl text-[#0F172A] tabular-nums">₹{totalRevenue}</p>
              <p className="text-[11px] text-stone-500 font-medium">{orders.length} total customer orders</p>
            </div>
          </div>

          {/* Recent Orders List in Overview */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Recent WhatsApp Order Requests
                </h3>
                <p className="text-xs text-stone-500">Incoming requests from online customers</p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-[#781D2E] hover:text-[#0F172A] hover:underline"
              >
                View All Orders →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-semibold uppercase text-[10px] tracking-wider border-b border-stone-100">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.slice(0, 5).map(o => (
                    <tr key={o.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">{o.order_number}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-stone-900">{o.customer_name}</p>
                        <p className="text-stone-400 text-[11px]">{o.customer_phone}</p>
                      </td>
                      <td className="py-3 px-4">{o.order_type}</td>
                      <td className="py-3 px-4">{o.items.length} items</td>
                      <td className="py-3 px-4 font-bold tabular-nums">₹{o.total_amount}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          o.order_status === 'Pending Request'
                            ? 'bg-amber-100 text-amber-800'
                            : o.order_status === 'WhatsApp Confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : o.order_status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {o.order_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg text-xs"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. PRODUCTS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Search products by title or SKU..."
                value={adminSearch}
                onChange={e => setAdminSearch(e.target.value)}
                className="w-full text-xs bg-white border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 focus:outline-hidden focus:border-[#C5A059]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBulkImportOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
              >
                <Upload className="w-3.5 h-3.5" /> Bulk CSV Import
              </button>

              <button
                onClick={() =>
                  setProductModal({
                    open: true,
                    product: {
                      name: '',
                      sku: `SM-${Date.now().toString().slice(-4)}`,
                      selling_price: 150,
                      mrp: 180,
                      stock_quantity: 25,
                      category_id: categories[0]?.id || '',
                      description: '',
                      images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
                      is_new: true,
                      is_featured: false,
                      is_best_seller: false,
                      is_active: true,
                    },
                  })
                }
                className="flex items-center gap-1.5 px-4 py-2 bg-[#781D2E] hover:bg-[#621624] text-white rounded-xl text-xs font-bold shadow-xs tracking-wide"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-semibold uppercase text-[10px] tracking-wider border-b border-stone-100">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price / MRP</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Tags</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map(p => {
                    const discount = calculateDiscount(p.mrp, p.selling_price);
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg bg-stone-100 shrink-0"
                            />
                            <div className="max-w-xs">
                              <p className="font-semibold text-stone-900 truncate">{p.name}</p>
                              <p className="text-[11px] text-stone-400 line-clamp-1">{p.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-stone-600">{p.sku}</td>
                        <td className="py-3 px-4 text-stone-600">{p.category_name}</td>
                        <td className="py-3 px-4">
                          <span className="font-bold tabular-nums">₹{p.selling_price}</span>
                          {p.mrp > p.selling_price && (
                            <span className="block text-[10px] text-stone-400 line-through">
                              ₹{p.mrp} ({discount}% off)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold tabular-nums ${p.stock_quantity <= 0 ? 'text-rose-600' : p.stock_quantity <= 5 ? 'text-amber-600' : 'text-emerald-700'}`}>
                            {p.stock_quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {p.is_best_seller && <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded font-bold">Best</span>}
                            {p.is_new && <span className="bg-blue-100 text-blue-800 text-[9px] px-1.5 py-0.5 rounded font-bold">New</span>}
                            {p.is_featured && <span className="bg-purple-100 text-purple-800 text-[9px] px-1.5 py-0.5 rounded font-bold">Featured</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                            {p.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setProductModal({ open: true, product: { ...p } })}
                              className="p-1.5 text-stone-600 hover:text-[#0F172A] hover:bg-stone-100 rounded-lg transition-colors"
                              title="Edit product"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. ORDERS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Order status filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-xl">
            {['all', 'Pending Request', 'WhatsApp Confirmed', 'Processing', 'Ready for Pickup', 'Completed', 'Cancelled'].map(st => (
              <button
                key={st}
                onClick={() => setOrderFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  orderFilter === st ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {st === 'all' ? 'All Orders' : st}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-semibold uppercase text-[10px] tracking-wider border-b border-stone-100">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Fulfillment</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">WhatsApp Direct</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="font-mono font-bold text-[#0F172A] hover:text-[#781D2E] hover:underline"
                        >
                          {o.order_number}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-stone-500 text-[11px]">
                        {new Date(o.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{o.customer_name}</td>
                      <td className="py-3 px-4 font-mono">{o.customer_phone}</td>
                      <td className="py-3 px-4">
                        <span className="text-stone-700 font-medium">{o.order_type}</span>
                        {o.delivery_address && (
                          <span className="block text-[10px] text-stone-400 truncate max-w-xs">
                            {o.delivery_address}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">{o.items.length} items</td>
                      <td className="py-3 px-4 font-bold tabular-nums">₹{o.total_amount}</td>
                      <td className="py-3 px-4">
                        <select
                          value={o.order_status}
                          onChange={e => handleUpdateOrderStatus(o.id, e.target.value as any)}
                          className="bg-stone-100 border border-stone-200 text-stone-800 text-[11px] font-semibold rounded-lg p-1"
                        >
                          <option value="Pending Request">Pending Request</option>
                          <option value="WhatsApp Confirmed">WhatsApp Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={createWhatsAppUrl(
                            o.customer_phone,
                            `Hello ${o.customer_name}! Regarding your order ${o.order_number} at Shri Mahavir Stationery & Toys:`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-[11px] font-bold shadow-2xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white" /> Chat
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. CATEGORIES TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Manage Product Categories
            </h3>
            <button
              onClick={() =>
                setCategoryModal({
                  open: true,
                  category: {
                    name: '',
                    slug: '',
                    description: '',
                    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
                    display_order: categories.length + 1,
                    is_active: true,
                  },
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold border border-[#C5A059]/30"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-stone-200 p-4 flex gap-4 items-center">
                <img
                  src={c.image_url}
                  alt={c.name}
                  className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-stone-900 truncate">{c.name}</h4>
                    <span className="text-[10px] text-stone-400 font-mono">#{c.display_order}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1">{c.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setCategoryModal({ open: true, category: { ...c } })}
                      className="text-xs font-semibold text-[#0F172A] hover:underline"
                    >
                      Edit
                    </button>
                    <span className="text-stone-300">•</span>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. BANNERS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'banners' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-base text-stone-900">
              Manage Hero Carousel Banners
            </h3>
            <button
              onClick={() =>
                setBannerModal({
                  open: true,
                  banner: {
                    title: 'New Promotional Campaign',
                    subtitle: 'Great discounts on student supplies',
                    image_url: '/images/hero_stationery_school_1794382961056.jpg',
                    button_text: 'Shop Now',
                    button_link: '/shop',
                    display_order: banners.length + 1,
                    is_active: true,
                  },
                })
              }
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold border border-[#C5A059]/30"
            >
              <Plus className="w-4 h-4" /> Add Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map(b => (
              <div key={b.id} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="h-44 relative bg-stone-900">
                  <img src={b.image_url} alt="" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end text-white">
                    <span className="text-[10px] font-bold text-[#C5A059]">Display Order #{b.display_order}</span>
                    <h4 className="font-serif font-bold text-base text-white">{b.title}</h4>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-stone-600">{b.subtitle}</p>
                  <p className="text-[11px] text-stone-400 font-mono">Link: {b.button_link}</p>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => setBannerModal({ open: true, banner: { ...b } })}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. SETTINGS TAB */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-150 max-w-3xl">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 md:p-8 space-y-5">
            <h3 className="font-display font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
              Store Identity & WhatsApp Numbers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Store Name</label>
                <input
                  type="text"
                  value={settingsForm.store_name}
                  onChange={e => setSettingsForm({ ...settingsForm, store_name: e.target.value })}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={e => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1">Store Logo Image URL</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={settingsForm.logo_url || ''}
                    placeholder="/assets/aistudio/Shri_Mahavir_Stationery_Gift_Logo_f6dc5ae7.png"
                    onChange={e => setSettingsForm({ ...settingsForm, logo_url: e.target.value })}
                    className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono"
                  />
                  {settingsForm.logo_url && (
                    <div className="p-1 bg-white border border-stone-200 rounded-xl shrink-0">
                      <img src={settingsForm.logo_url} alt="Logo preview" className="h-9 w-auto object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Default WhatsApp Order Number (Numeric format)
                </label>
                <input
                  type="text"
                  placeholder="919555257650"
                  value={settingsForm.whatsapp_number}
                  onChange={e => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono"
                />
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Orders will be dispatched directly to this WhatsApp account.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={settingsForm.contact_number}
                  onChange={e => setSettingsForm({ ...settingsForm, contact_number: e.target.value })}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Floating WhatsApp Default Enquiry Message
              </label>
              <textarea
                rows={2}
                placeholder="Hello Shri Mahavir Stationery & Toys! I'm browsing your online store and have a question about your products."
                value={settingsForm.whatsapp_default_message || ''}
                onChange={e => setSettingsForm({ ...settingsForm, whatsapp_default_message: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
              />
              <p className="text-[10px] text-stone-400 mt-0.5">
                Custom greeting message opened when visitors click the floating WhatsApp button on any storefront page.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Top Announcement Bar Text</label>
              <input
                type="text"
                value={settingsForm.announcement_text}
                onChange={e => setSettingsForm({ ...settingsForm, announcement_text: e.target.value })}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Store Address</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Opening Hours</label>
                <input
                  type="text"
                  value={settingsForm.opening_hours}
                  onChange={e => setSettingsForm({ ...settingsForm, opening_hours: e.target.value })}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>
            </div>

            {/* Policies */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Store Policies</h4>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Privacy Policy</label>
                <textarea
                  rows={3}
                  value={settingsForm.policies.privacy_policy}
                  onChange={e =>
                    setSettingsForm({
                      ...settingsForm,
                      policies: { ...settingsForm.policies, privacy_policy: e.target.value },
                    })
                  }
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={settingsForm.policies.terms_and_conditions}
                  onChange={e =>
                    setSettingsForm({
                      ...settingsForm,
                      policies: { ...settingsForm.policies, terms_and_conditions: e.target.value },
                    })
                  }
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-bold text-xs shadow-xs border border-[#C5A059]/30 tracking-wide"
            >
              Save Store Settings
            </button>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ------------------------------------------------------------- */}
      {productModal.open && productModal.product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleSaveProduct}
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-base text-stone-900">
                {productModal.product.id ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                type="button"
                onClick={() => setProductModal({ open: false, product: null })}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Product Name</label>
              <input
                type="text"
                required
                value={productModal.product.name || ''}
                onChange={e =>
                  setProductModal({
                    ...productModal,
                    product: { ...productModal.product, name: e.target.value },
                  })
                }
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">SKU / Code</label>
                <input
                  type="text"
                  required
                  value={productModal.product.sku || ''}
                  onChange={e =>
                    setProductModal({
                      ...productModal,
                      product: { ...productModal.product, sku: e.target.value },
                    })
                  }
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                <select
                  value={productModal.product.category_id || ''}
                  onChange={e =>
                    setProductModal({
                      ...productModal,
                      product: { ...productModal.product, category_id: e.target.value },
                    })
                  }
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  value={productModal.product.selling_price || 0}
                  onChange={e =>
                    setProductModal({
                      ...productModal,
                      product: { ...productModal.product, selling_price: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Original MRP (₹)</label>
                <input
                  type="number"
                  value={productModal.product.mrp || 0}
                  onChange={e =>
                    setProductModal({
                      ...productModal,
                      product: { ...productModal.product, mrp: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={productModal.product.stock_quantity || 0}
                  onChange={e =>
                    setProductModal({
                      ...productModal,
                      product: { ...productModal.product, stock_quantity: Number(e.target.value) },
                    })
                  }
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={productModal.product.images?.[0] || ''}
                onChange={e =>
                  setProductModal({
                    ...productModal,
                    product: { ...productModal.product, images: [e.target.value] },
                  })
                }
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={productModal.product.description || ''}
                onChange={e =>
                  setProductModal({
                    ...productModal,
                    product: { ...productModal.product, description: e.target.value },
                  })
                }
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={productModal.product.is_active ?? true}
                  onChange={e =>
                    setProductModal({
                      ...productModal,
                      product: { ...productModal.product, is_active: e.target.checked },
                    })
                  }
                />
                <span>Active on Store</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={productModal.product.is_best_seller ?? false}
                  onChange={e =>
                    setProductModal({
                      ...productModal,
                      product: { ...productModal.product, is_best_seller: e.target.checked },
                    })
                  }
                />
                <span>Best Seller</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={productModal.product.is_new ?? false}
                  onChange={e =>
                    setProductModal({
                      ...productModal,
                      product: { ...productModal.product, is_new: e.target.checked },
                    })
                  }
                />
                <span>New Arrival</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setProductModal({ open: false, product: null })}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold border border-[#C5A059]/30"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* BULK CSV IMPORT MODAL */}
      {/* ------------------------------------------------------------- */}
      {bulkImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Bulk CSV Product Import
              </h3>
              <button
                onClick={() => setBulkImportOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-500">
              Paste product rows in CSV format (one per line):
              <br />
              <code className="text-[10px] font-mono bg-stone-100 p-1 rounded block mt-1">
                Name, SKU, SellingPrice, MRP, CategoryID, Stock
              </code>
            </p>

            <textarea
              rows={8}
              placeholder={`Apsara Platinum Extra Dark Pencils, SM-APS-01, 70, 80, cat-pens, 50\nDoms 24 Water Color Tubes, SM-DOM-01, 199, 240, cat-art, 30`}
              value={bulkCsvText}
              onChange={e => setBulkCsvText(e.target.value)}
              className="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl p-3"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setBulkImportOpen(false)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-xs font-bold border border-[#C5A059]/30"
              >
                Import Rows
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ORDER DETAILS MODAL */}
      {/* ------------------------------------------------------------- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="font-mono font-bold text-[#0F172A]">{selectedOrder.order_number}</span>
                <h3 className="font-serif font-bold text-base text-stone-900 mt-0.5">
                  Order Request Breakdown
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Information */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Customer:</span>
                <span className="font-bold text-stone-900">{selectedOrder.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Phone:</span>
                <span className="font-mono text-stone-900">{selectedOrder.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Type:</span>
                <span className="font-semibold text-stone-900">{selectedOrder.order_type}</span>
              </div>
              {selectedOrder.delivery_address && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Address:</span>
                  <span className="text-stone-800 text-right max-w-xs">{selectedOrder.delivery_address}</span>
                </div>
              )}
            </div>

            {/* Items list */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                Order Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-stone-100 border border-stone-100 rounded-xl overflow-hidden">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                    <div>
                      <p className="font-semibold text-stone-900">{it.product_name}</p>
                      <p className="text-[10px] text-stone-400 font-mono">
                        Code: {it.product_sku} • Qty: {it.quantity} × ₹{it.unit_price}
                      </p>
                    </div>
                    <span className="font-bold tabular-nums">₹{it.line_total}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between font-bold text-sm pt-2">
              <span>Total Estimated Amount:</span>
              <span className="font-serif font-bold text-lg text-[#0F172A] tabular-nums">
                ₹{selectedOrder.total_amount}
              </span>
            </div>

            {/* WhatsApp direct chat button for Admin */}
            <div className="pt-2">
              <a
                href={createWhatsAppUrl(
                  selectedOrder.customer_phone,
                  `Hello ${selectedOrder.customer_name}! We are preparing your order ${selectedOrder.order_number} at Shri Mahavir Stationery & Toys. Please confirm if you would like counter pickup or delivery!`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" /> Contact Customer on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
