import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ProductCard from '../components/ProductCard';
import AddProductModal from '../components/AddProductModal';
import EditProductModal from '../components/EditProductModal';
import { apiRequest } from '../utils/api';
import {
  LogOut,
  Plus,
  Search,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Pagination State (Use-Case 1: Capped at 20 items per page)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Search & Filter Controls (Use-Case 4)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpiryWindow, setSelectedExpiryWindow] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchProducts = async (currentPage = page) => {
    setLoading(true);
    setError('');
    try {
      let query = `?page=${currentPage}&limit=20`;
      if (searchQuery.trim()) {
        query += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      if (selectedExpiryWindow !== 'ALL') {
        query += `&expiryWindow=${selectedExpiryWindow}`;
      }

      const data = await apiRequest(`/products${query}`);
      setProducts(data.products || []);
      if (data.pagination) {
        setTotalPages(data.pagination.totalPages || 1);
        setTotalCount(data.pagination.totalCount || 0);
        setPage(data.pagination.page || 1);
      }
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts(1);
    }
  }, [user, searchQuery, selectedExpiryWindow]);

  const handleAddProduct = async (productData) => {
    await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
    // Refresh product list
    fetchProducts(1);
  };

  const handleUpdateProduct = async (productId, updatedData) => {
    const data = await apiRequest(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData)
    });
    // Update local state
    setProducts((prev) =>
      prev.map((p) => (p._id === productId ? (data.product || { ...p, ...updatedData }) : p))
    );
  };

  const handleDeleteProduct = async (productId) => {
    await apiRequest(`/products/${productId}`, {
      method: 'DELETE'
    });
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    setTotalCount((prev) => Math.max(0, prev - 1));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-xl max-w-md w-full">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0984e3] flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 text-sm mb-6">You must be logged in to access the Expiry Date Manager dashboard.</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full py-3 bg-[#0984e3] text-white font-bold rounded-xl shadow-lg shadow-[#0984e3]/25 hover:bg-[#0077d4] transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let expiredCount = 0;
  let expiringSoonCount = 0;
  let freshCount = 0;

  products.forEach((p) => {
    const exp = new Date(p.expiryDate);
    exp.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      expiredCount++;
    } else if (diffDays <= 7) {
      expiringSoonCount++;
    } else {
      freshCount++;
    }
  });

  // Client-side category filtering
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    return p.category === selectedCategory;
  });

  const categoriesList = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/80 text-gray-700 text-sm font-semibold border border-gray-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-gray-700 hover:text-rose-600 bg-gray-100 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner & Primary Action */}
        <div className="bg-gradient-to-br from-[#0984e3] via-[#0077d4] to-[#00b894] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-[#0984e3]/15 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              Dashboard Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manage Your Products & Expiry Dates
            </h1>
            <p className="mt-2 text-blue-100 text-sm sm:text-base">
              Keep track of items in your pantry, fridge, and inventory. Prevent food waste effortlessly.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to="/add-product"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#0984e3] hover:bg-blue-50 font-bold rounded-2xl shadow-lg shadow-black/10 transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0984e3] flex items-center justify-center shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Total Items</span>
              <span className="text-2xl font-black text-gray-900">{totalCount || products.length}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Expiring Soon</span>
              <span className="text-2xl font-black text-amber-600">{expiringSoonCount}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Expired</span>
              <span className="text-2xl font-black text-rose-600">{expiredCount}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Fresh Items</span>
              <span className="text-2xl font-black text-emerald-600">{freshCount}</span>
            </div>
          </div>
        </div>

        {/* Filters & Search Controls (Use-Case 4) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or UPC code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all"
            />
          </div>

          {/* Filter Dropdowns & Refresh */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Expiry Window Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400 hidden sm:inline-block" />
              <select
                value={selectedExpiryWindow}
                onChange={(e) => {
                  setSelectedExpiryWindow(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3]"
              >
                <option value="ALL">All Expiry Dates</option>
                <option value="1m">Expiring within 1 Month</option>
                <option value="3m">Expiring within 3 Months</option>
                <option value="6m">Expiring within 6 Months</option>
              </select>
            </div>

            {/* Category Filter */}
            {categoriesList.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3]"
              >
                <option value="ALL">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => fetchProducts(page)}
              className="p-2 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              title="Refresh Products"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Grid / Loading / Empty state */}
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-[#0984e3] animate-spin mx-auto mb-3" />
            <p className="text-gray-500 font-medium text-sm">Loading your product inventory...</p>
          </div>
        ) : error ? (
          <div className="py-12 px-6 bg-red-50 border border-red-200 rounded-2xl text-center max-w-lg mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-red-800 mb-1">Error Loading Products</h3>
            <p className="text-xs text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchProducts(page)}
              className="px-4 py-2 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-16 h-16 bg-blue-50 text-[#0984e3] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {products.length === 0
                ? "You haven't added any products yet. Click below to start managing your expiry dates!"
                : "No products match your current search and filter criteria."}
            </p>
            {products.length === 0 ? (
              <Link
                to="/add-product"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0984e3] hover:bg-[#0077d4] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#0984e3]/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Product</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedExpiryWindow('ALL');
                  setSelectedCategory('ALL');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  onDelete={handleDeleteProduct}
                  onEdit={(p) => setEditingProduct(p)}
                />
              ))}
            </div>

            {/* Pagination Controls (Use-Case 1) */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-200/80 pt-6">
                <p className="text-xs text-gray-500 font-medium">
                  Showing page <span className="font-bold text-gray-900">{page}</span> of{' '}
                  <span className="font-bold text-gray-900">{totalPages}</span> ({totalCount} total products)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => {
                      const newPage = page - 1;
                      setPage(newPage);
                      fetchProducts(newPage);
                    }}
                    className="p-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-gray-700 px-3 py-1 bg-gray-100 rounded-lg">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => {
                      const newPage = page + 1;
                      setPage(newPage);
                      fetchProducts(newPage);
                    }}
                    className="p-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Edit Product Modal (Use-Case 3) */}
      <EditProductModal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        onUpdateProduct={handleUpdateProduct}
      />
    </div>
  );
};

export default DashboardPage;
