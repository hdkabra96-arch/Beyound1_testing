import React, { useState } from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  Sparkles,
  ArrowRight,
  X,
  Building2,
  Smartphone,
  Check,
} from 'lucide-react';

interface RenewalCheckoutModalProps {
  initialPackageId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RenewalCheckoutModal: React.FC<RenewalCheckoutModalProps> = ({
  initialPackageId,
  onClose,
  onSuccess,
}) => {
  const { currentStudent, checkoutAndActivatePackage } = useStudent();
  const { packages, classes } = useAdminStore();

  const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId || currentStudent?.packageId || 'pkg_pro');
  const [selectedClassId, setSelectedClassId] = useState(currentStudent?.classId || 'class_5');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('student@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnDetails, setTxnDetails] = useState<{ transactionId: string; invoiceNumber: string } | null>(null);

  const selectedPkg = packages.find((p) => p.id === selectedPackageId) || packages[1];
  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[1];

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate network gateway processing (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const methodName =
        paymentMethod === 'upi'
          ? `UPI (${upiId})`
          : paymentMethod === 'card'
          ? 'Credit/Debit Card (Razorpay Gateway)'
          : 'NetBanking (HDFC Bank)';

      const result = await checkoutAndActivatePackage(
        selectedPackageId,
        selectedClassId,
        methodName,
        selectedPkg.priceINR
      );

      setTxnDetails(result);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      alert(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-indigo-950 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Renew / Upgrade Student Package</h3>
              <p className="text-[11px] text-slate-400">Official Gateway • Instant Entitlement Activation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handlePayNow} className="p-6 space-y-5">
            {/* Package Selection Cards */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                1. Select Package Plan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {packages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{pkg.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                      </div>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-lg font-black text-amber-400">₹{pkg.priceINR.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400">/ 365 days</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{pkg.tagline}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Class Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                2. Enrolled Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.board})
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                3. Choose Verified Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span>Cards</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>NetBanking</span>
                </button>
              </div>

              {/* UPI input fields */}
              {paymentMethod === 'upi' && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Enter UPI Virtual ID (Google Pay, PhonePe, Paytm)</span>
                    <span className="text-emerald-400 font-semibold">Zero Surcharge</span>
                  </div>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 block">Card Number (PCI-DSS 256-bit Encrypted)</span>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              )}
            </div>

            {/* Price Breakdown Banner */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount Payable</span>
                <span className="text-xs text-indigo-300 font-medium">Includes 365 Days Academic Pass + GST</span>
              </div>
              <span className="text-xl font-black text-amber-400">₹{selectedPkg.priceINR.toLocaleString()}</span>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-black text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Verifying Secure Payment...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Activate ₹{selectedPkg.priceINR.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Payment Success Confirmation */
          <div className="p-8 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Payment Verified & Activated!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Your package <strong>{selectedPkg.name}</strong> is now active for <strong>{selectedClass.name}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono text-emerald-400 font-bold">{txnDetails?.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Number:</span>
                <span className="font-mono text-indigo-400 font-bold">{txnDetails?.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Validity:</span>
                <span className="text-white font-bold">365 Days Access</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer"
            >
              Go to My Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
