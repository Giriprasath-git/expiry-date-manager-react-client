import React from 'react';
import { Link } from 'react-router-dom';
import { Scan, BellRing, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-gray-50/50 py-16 sm:py-24 lg:py-28">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#0984e3]/15 to-[#e17055]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0984e3] text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-[#e17055]" />
            <span>Smart Product Expiry Tracking</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Never waste food or supplies again with{' '}
            <span className="bg-gradient-to-r from-[#0984e3] to-[#00b894] bg-clip-text text-transparent">
              ExpiryGuard
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
            Scan UPC barcodes using your camera, manage item expiry dates effortlessly, and receive timely alerts before products spoil.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-white bg-[#0984e3] hover:bg-[#0077d4] active:bg-[#0066b8] rounded-xl shadow-lg shadow-[#0984e3]/30 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-xs transition-all flex items-center justify-center"
            >
              Log In to Dashboard
            </Link>
          </div>

          {/* Highlight Cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0984e3] flex items-center justify-center mb-4">
                <Scan className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">UPC Barcode Scanning</h3>
              <p className="mt-2 text-sm text-gray-600">
                Scan product barcodes instantly using your device camera to fetch details and set expiry dates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#e17055] flex items-center justify-center mb-4">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Smart Expiry Alerts</h3>
              <p className="mt-2 text-sm text-gray-600">
                Get notified well in advance before your items reach their expiration date.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#00b894] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Inventory Insights</h3>
              <p className="mt-2 text-sm text-gray-600">
                Track fridge, pantry, and medicine cabinet items organized cleanly in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
