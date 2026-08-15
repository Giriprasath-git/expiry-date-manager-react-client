import React, { useState } from 'react';
import { X, Calendar, Package, Tag, Hash, FileText, AlertCircle, Loader2 } from 'lucide-react';

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

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState('');
  const [barcode, setBarcode] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
      await onAddProduct({
        name: name.trim(),
        category,
        quantity: parseInt(quantity, 10) || 1,
        expiryDate: new Date(expiryDate).toISOString(),
        barcode: barcode.trim(),
        notes: notes.trim()
      });
      // Reset form
      setName('');
      setCategory('Dairy');
      setQuantity(1);
      setExpiryDate('');
      setBarcode('');
      setNotes('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0984e3] text-white flex items-center justify-center shadow-md shadow-[#0984e3]/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
              <p className="text-xs text-gray-500 font-medium">Track expiration and prevent food wastage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Package className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Organic Fresh Milk 1L"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all"
                required
              />
            </div>
          </div>

          {/* Category & Quantity Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all appearance-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Quantity
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all"
                required
              />
            </div>
          </div>

          {/* Barcode / UPC (Optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Barcode / UPC <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. 012345678905"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all"
              />
            </div>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Notes <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <textarea
                rows="2"
                placeholder="e.g. Keep in bottom shelf of fridge"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0984e3]/30 focus:border-[#0984e3] transition-all resize-none"
              ></textarea>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-100 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#0984e3] hover:bg-[#0077d4] text-white font-bold text-sm shadow-lg shadow-[#0984e3]/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <span>Save Product</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
