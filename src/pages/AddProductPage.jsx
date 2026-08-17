import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import BarcodeScannerModal from '../components/BarcodeScannerModal';
import { apiRequest } from '../utils/api';
import {
  ArrowLeft,
  Camera,
  Package,
  Calendar,
  Tag,
  Hash,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search,
  Sparkles,
  Plus,
  Minus
} from 'lucide-react';

const CATEGORIES = [
  'Dairy',
  'Produce',
  'Pantry',
  'Meat & Seafood',
  'Beverage',
  'Bakery',
  'Snacks',
  'Frozen',
  'Other'
];

const UNITS = ['pcs', 'kg', 'g', 'liters', 'ml', 'boxes', 'bottles', 'packs'];

const AddProductPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
        <div className="text-center p-8 bg-white rounded-3xl border border-gray-100 shadow-xl max-w-md w-full">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0984e3] flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 text-sm mb-6">You must be logged in to add products to your inventory.</p>
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

  const handleBarcodeScanned = (scannedCode) => {
    setBarcode(scannedCode);
    setSuccessMessage(`Barcode scanned: ${scannedCode}`);
    setTimeout(() => setSuccessMessage(''), 4000);
    // Automatically attempt lookup
    handleLookupUPC(scannedCode);
  };

  const handleLookupUPC = async (codeToLookup) => {
    const targetCode = codeToLookup || barcode;
    if (!targetCode.trim()) return;

    setLookupLoading(true);
    try {
      const data = await apiRequest(`/products/upc/${encodeURIComponent(targetCode.trim())}`);
      if (data && data.found && data.product) {
        if (data.product.title || data.product.name) {
          setName(data.product.name || data.product.title);
        }
        if (data.product.category) {
          setCategory(data.product.category);
        }
        setSuccessMessage(`Product details found for UPC ${targetCode}!`);
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      // Non-blocking lookup fail
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a product name.');
      return;
    }

    if (!expiryDate) {
      setError('Please select an expiry date.');
      return;
    }

    setLoading(true);
    try {
      await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          title: name.trim(),
          barcode: barcode.trim(),
          upcCode: barcode.trim(),
          category,
          quantity: Number(quantity) || 1,
          unit,
          expiryDate: new Date(expiryDate).toISOString(),
          notes: notes.trim()
        })
      });

      setSuccessMessage('Product added successfully! Redirecting to Dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1200);

    } catch (err) {
      setError(err.message || 'Failed to add product');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#0984e3] bg-gray-100 hover:bg-blue-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl overflow-hidden">
          {/* Card Header Banner */}
          <div className="bg-gradient-to-r from-[#0984e3] via-[#0077d4] to-[#00b894] p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Inventory Entry
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Add New Product
              </h1>
              <p className="mt-1 text-blue-100 text-sm">
                Scan barcode using your device camera or enter item details manually.
              </p>
            </div>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* BARCODE SECTION: Camera Scanner & Manual Input */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  UPC Barcode <span className="text-gray-400 font-normal">(Scan or Manual)</span>
                </label>

                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0984e3] hover:bg-[#0077d4] text-white text-xs font-bold rounded-xl shadow-md shadow-[#0984e3]/20 transition-all hover:scale-105"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan with Camera</span>
                </button>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter or scan UPC barcode e.g. 012345678905"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all"
                  />
                </div>

                {barcode && (
                  <button
                    type="button"
                    onClick={() => handleLookupUPC(barcode)}
                    disabled={lookupLoading}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    title="Lookup product details by UPC code"
                  >
                    {lookupLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#0984e3]" />
                    ) : (
                      <>
                        <Search className="w-4 h-4 text-gray-500" />
                        <span className="hidden sm:inline">Lookup</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Package className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Fresh Organic Milk 1L"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all"
                  required
                />
              </div>
            </div>

            {/* Category & Expiry Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all appearance-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Quantity & Unit Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, parseInt(prev, 10) - 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="flex-1 text-center py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => (parseInt(prev, 10) || 0) + 1)}
                    className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Measurement Unit
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Notes <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <textarea
                  rows="3"
                  placeholder="e.g. Keep in bottom shelf of fridge, open bottle expires in 7 days"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all resize-none"
                ></textarea>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-100 text-sm transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-[#0984e3] hover:bg-[#0077d4] text-white font-bold text-sm shadow-xl shadow-[#0984e3]/25 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Product...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Save Product to Inventory</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Barcode Camera Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleBarcodeScanned}
      />
    </div>
  );
};

export default AddProductPage;
