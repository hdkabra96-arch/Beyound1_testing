import React, { useState, useEffect } from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import { useAffiliate } from '../../../services/affiliate-context';
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
  Gift,
  Tag,
  Percent,
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
  const {
    activeAttributedCode,
    validateReferralCode,
    recordReferralSaleOnPayment,
    setManualReferralCode,
  } = useAffiliate();

  const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId || currentStudent?.packageId || 'pkg_pro');
  const [selectedClassId, setSelectedClassId] = useState(currentStudent?.classId || 'class_5');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('student@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnDetails, setTxnDetails] = useState<{ transactionId: string; invoiceNumber: string } | null>(null);

  // Referral code state
  const [referralCodeInput, setReferralCodeInput] = useState(activeAttributedCode || '');
  const [appliedReferralCode, setAppliedReferralCode] = useState<string | null>(activeAttributedCode || null);
  const [referralError, setReferralError] = useState<string | null>(null);
  const [referralSuccessMsg, setReferralSuccessMsg] = useState<string | null>(null);

  const selectedPkg = packages.find((p) => p.id === selectedPackageId) || packages[1];
  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[1];

  // Dynamic calculation
  const referralValidation = appliedReferralCode
    ? validateReferralCode(appliedReferralCode, selectedPkg.priceINR, selectedPkg.id, currentStudent?.email)
    : null;

  const finalPayable = referralValidation && referralValidation.valid
    ? referralValidation.finalAmount
    : selectedPkg.priceINR;

  const discountAmount = referralValidation && referralValidation.valid
    ? referralValidation.discountAmount
    : 0;

  const handleApplyReferral = () => {
    setReferralError(null);
    setReferralSuccessMsg(null);

    if (!referralCodeInput.trim()) {
      setAppliedReferralCode(null);
      return;
    }

    const res = validateReferralCode(
      referralCodeInput.trim(),
      selectedPkg.priceINR,
      selectedPkg.id,
      currentStudent?.email
    );

    if (res.valid) {
      setAppliedReferralCode(res.code);
      setManualReferralCode(res.code);
      setReferralSuccessMsg(`✓ Code "${res.code}" applied! You get ${res.discountPercentage}% off (₹${res.discountAmount.toFixed(2)} discount).`);
    } else {
      setAppliedReferralCode(null);
      setReferralError(res.message);
    }
  };

  const handleRemoveReferral = () => {
    setAppliedReferralCode(null);
    setReferralCodeInput('');
    setReferralError(null);
    setReferralSuccessMsg(null);
  };

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
        finalPayable
      );

      // Record referral sale idempotently for affiliate
      if (appliedReferralCode && currentStudent) {
        recordReferralSaleOnPayment({
          studentId: currentStudent.id,
          studentName: currentStudent.name,
          studentEmail: currentStudent.email,
          packageId: selectedPkg.id,
          packageName: selectedPkg.name,
          classId: selectedClass.id,
          className: selectedClass.name,
          originalPrice: selectedPkg.priceINR,
          paidAmount: finalPayable,
          purchaseId: result.transactionId,
          referralCode: appliedReferralCode,
        });
      }

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

            {/* Referral Code Application */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Have a Partner / Referral Code?</span>
                </span>
                {appliedReferralCode && (
                  <span className="text-[10px] text-emerald-400 font-bold">✓ CODE APPLIED</span>
                )}
              </label>

              {!appliedReferralCode ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter referral code (e.g. BC-HARDIK10)"
                    value={referralCodeInput}
                    onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white uppercase placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyReferral}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black transition-all cursor-pointer shadow-sm"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/30 border border-emerald-800/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-mono font-black text-xs text-white">{appliedReferralCode}</span>
                      <span className="text-[10px] text-emerald-300 block font-semibold">
                        {referralValidation?.discountPercentage}% Discount Applied
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveReferral}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-bold px-2 py-1 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {referralError && (
                <p className="text-[11px] text-rose-400 font-medium">{referralError}</p>
              )}
              {referralSuccessMsg && (
                <p className="text-[11px] text-emerald-400 font-medium">{referralSuccessMsg}</p>
              )}
            </div>

            {/* Price Breakdown Banner */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Original Package Price:</span>
                <span className="font-bold text-slate-300">₹{selectedPkg.priceINR.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <span>Referral Partner Discount:</span>
                  <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-indigo-800/40 pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Final Amount Payable</span>
                  <span className="text-[11px] text-indigo-300">Includes 365 Days Academic Pass + GST</span>
                </div>
                <span className="text-xl font-black text-amber-400">₹{finalPayable.toLocaleString()}</span>
              </div>
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
                  <span>Authorize & Activate ₹{finalPayable.toLocaleString()}</span>
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
