import React, { useState } from 'react';
import { Calendar, Trash2, Edit3, Tag, AlertTriangle, CheckCircle2, Clock, Loader2, Barcode, Info, X } from 'lucide-react';

const ProductCard = ({ product, onDelete, onEdit }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Compute status & remaining days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expDate = new Date(product.expiryDate);
  expDate.setHours(0, 0, 0, 0);

  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const productName = product.name || product.title || 'Untitled Product';
  const productBarcode = product.barcode || product.upcCode || null;

  let statusBadge = {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    label: `Fresh (${diffDays} days left)`,
    color: 'emerald'
  };

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    statusBadge = {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
      label: `Expired (${daysAgo} day${daysAgo > 1 ? 's' : ''} ago)`,
      color: 'rose'
    };
  } else if (diffDays <= 7) {
    statusBadge = {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
      label: diffDays === 0 ? 'Expires Today!' : `Expiring Soon (${diffDays} day${diffDays > 1 ? 's' : ''})`,
      color: 'amber'
    };
  }

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await onDelete(product._id);
    } catch (err) {
      setDeleteError(err.message || 'Failed to remove product');
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between relative group overflow-hidden">
      {/* INLINE DELETE CONFIRMATION DIALOG OVERLAY */}
      {showConfirmDelete ? (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 p-5 flex flex-col justify-between animate-fade-in border-2 border-rose-200 rounded-2xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Confirm Deletion</span>
              </div>
              <button
                onClick={() => setShowConfirmDelete(false)}
                disabled={deleting}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600 font-medium mb-2">
              Are you sure you want to delete <span className="font-bold text-gray-900">"{productName}"</span> from inventory?
            </p>

            {deleteError && (
              <p className="text-[11px] font-semibold text-rose-600 bg-rose-50 p-2 rounded-lg mb-2">
                {deleteError}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setShowConfirmDelete(false)}
              disabled={deleting}
              className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : null}

      <div>
        {/* Header Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 font-semibold text-xs rounded-full">
            <Tag className="w-3 h-3 text-[#0984e3]" />
            <span>{product.category || 'Other'}</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 font-semibold text-xs rounded-full border ${statusBadge.bg}`}
          >
            {statusBadge.icon}
            <span>{statusBadge.label}</span>
          </span>
        </div>

        {/* Product Title */}
        <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#0984e3] transition-colors line-clamp-1 mb-1">
          {productName}
        </h4>

        {/* Details Grid */}
        <div className="space-y-2 my-3 text-xs text-gray-600 font-medium">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Quantity:</span>
            <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md">
              x{product.quantity || 1}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Expiry Date:
            </span>
            <span className="font-semibold text-gray-900">
              {new Date(product.expiryDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          {productBarcode && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center gap-1">
                <Barcode className="w-3.5 h-3.5" /> Barcode:
              </span>
              <span className="font-mono text-gray-700">{productBarcode}</span>
            </div>
          )}

          {product.notes && (
            <div className="pt-2 border-t border-gray-100 text-gray-500 italic flex items-start gap-1">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{product.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[11px] text-gray-400 font-medium">
          Added {new Date(product.createdAt).toLocaleDateString()}
        </span>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#0984e3] bg-gray-100 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Product"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}

          <button
            onClick={() => setShowConfirmDelete(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
            title="Remove Product"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
