import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { PaymentTransaction, PaymentStatus } from '../../../types/admin';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  Download,
  Filter,
  Eye,
  Plus,
  Shield,
  FileText,
  Mail,
  Zap,
} from 'lucide-react';

interface PaymentManagementViewProps {
  initialStatusFilter?: 'all' | 'successful' | 'pending' | 'failed' | 'refunded';
}

export const PaymentManagementView: React.FC<PaymentManagementViewProps> = ({
  initialStatusFilter = 'all',
}) => {
  const { payments, students, packages, updatePaymentStatus, verifyAndActivatePayment, addPayment } = useAdminStore();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>(initialStatusFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [invoiceModalPayment, setInvoiceModalPayment] = useState<PaymentTransaction | null>(null);
  const [manualModalOpen, setManualModalOpen] = useState(false);

  // Manual payment state
  const [manualStudentId, setManualStudentId] = useState(students[0]?.id || '');
  const [manualPackageId, setManualPackageId] = useState('pkg_pro');
  const [manualAmount, setManualAmount] = useState(1499);
  const [manualGateway, setManualGateway] = useState<'Razorpay' | 'Stripe' | 'UPI' | 'Manual Offline'>('Manual Offline');

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = selectedStatusFilter === 'all' || p.status === selectedStatusFilter;
    const matchesSearch =
      p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === manualStudentId);
    const pkg = packages.find((p) => p.id === manualPackageId);
    if (!st || !pkg) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + pkg.validityDays);

    addPayment({
      studentId: st.id,
      studentName: st.name,
      studentEmail: st.email,
      studentMobile: st.mobile,
      packageId: pkg.id,
      packageName: pkg.name,
      classId: st.classId,
      amount: Number(manualAmount),
      currency: 'INR',
      paymentGateway: manualGateway,
      paymentMethod: manualGateway === 'UPI' ? 'UPI QR' : 'Admin Manual Entry',
      transactionId: `TXN_MAN_${Date.now()}`,
      orderId: `ORD_MAN_${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'successful',
      paymentDate: now,
      packageActivationDate: now.split(' ')[0],
      packageExpiryDate: expDate.toISOString().split('T')[0],
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    verifyAndActivatePayment(`txn_${Date.now()}`);
    setManualModalOpen(false);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'successful':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" /> Paid & Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold animate-pulse">
            <Clock className="w-3 h-3" /> Pending Verification
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold">
            <XCircle className="w-3 h-3" /> Failed
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-500/20 text-slate-400 text-[10px] font-bold">
            <RotateCcw className="w-3 h-3" /> Refunded
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Payment & Transaction Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Requirement 13
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit log of Razorpay, Stripe, and UPI gateway transactions with 1-click package entitlement auto-activation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setManualModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Manual Payment</span>
          </button>
        </div>
      </div>

      {/* Filter Cluster */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, student email, transaction ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Payment Statuses</option>
          <option value="successful">Successful (Paid)</option>
          <option value="pending">Pending Verification</option>
          <option value="failed">Failed / Aborted</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Transactions Table (Requirement 13) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Order & Transaction</th>
                <th className="p-4">Student Name & Contact</th>
                <th className="p-4">Package Plan</th>
                <th className="p-4">Amount & Gateway</th>
                <th className="p-4">Payment Timestamp</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No transactions found for filter selection.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const isPending = payment.status === 'pending';

                  return (
                    <tr key={payment.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Order & Txn */}
                      <td className="p-4 pl-6">
                        <span className="font-extrabold text-white font-mono text-xs">{payment.orderId}</span>
                        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{payment.transactionId}</span>
                      </td>

                      {/* Student */}
                      <td className="p-4">
                        <span className="font-bold text-white">{payment.studentName}</span>
                        <span className="block text-[10px] text-slate-400">{payment.studentEmail}</span>
                      </td>

                      {/* Package */}
                      <td className="p-4">
                        <span className="font-bold text-indigo-300">{payment.packageName}</span>
                        <span className="block text-[10px] text-slate-500">Class: {payment.classId.replace('_', ' ').toUpperCase()}</span>
                      </td>

                      {/* Amount & Gateway */}
                      <td className="p-4">
                        <span className="text-sm font-black text-emerald-400">₹{payment.amount}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          <span>{payment.paymentGateway}</span>
                          <span>•</span>
                          <span>{payment.paymentMethod}</span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="p-4">
                        <span className="text-slate-200 text-[11px] font-medium">{payment.paymentDate}</span>
                        <span className="block text-[10px] text-slate-500">Exp: {payment.packageExpiryDate}</span>
                      </td>

                      {/* Status */}
                      <td className="p-4">{getStatusBadge(payment.status)}</td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click Verification & Auto-Activation */}
                          {isPending && (
                            <button
                              onClick={() => verifyAndActivatePayment(payment.id)}
                              className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-md shadow-emerald-600/30 cursor-pointer"
                              title="Verify Payment and Automatically Unlock Package Access for Student"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Verify & Activate</span>
                            </button>
                          )}

                          {/* View Invoice Modal */}
                          <button
                            onClick={() => setInvoiceModalPayment(payment)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                            title="View Invoice & Details"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Mark Refunded */}
                          {payment.status === 'successful' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Initiate refund for order ${payment.orderId}?`)) {
                                  updatePaymentStatus(payment.id, 'refunded');
                                }
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                              title="Mark as Refunded"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {invoiceModalPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">{invoiceModalPayment.invoiceNumber}</span>
                <h3 className="text-base font-extrabold text-white">Payment Receipt & Tax Invoice</h3>
              </div>
              <button onClick={() => setInvoiceModalPayment(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Billed Student:</span>
                <span className="font-bold text-white">{invoiceModalPayment.studentName} ({invoiceModalPayment.studentEmail})</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Package Subscribed:</span>
                <span className="font-bold text-indigo-400">{invoiceModalPayment.packageName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono text-slate-300">{invoiceModalPayment.orderId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="font-mono text-slate-300">{invoiceModalPayment.transactionId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Gateway / Method:</span>
                <span className="text-slate-300">{invoiceModalPayment.paymentGateway} ({invoiceModalPayment.paymentMethod})</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-sm font-extrabold text-white">Total Amount Paid:</span>
                <span className="text-base font-black text-emerald-400">₹{invoiceModalPayment.amount} {invoiceModalPayment.currency}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  alert(`Invoice PDF simulated download for ${invoiceModalPayment.invoiceNumber}`);
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download PDF Invoice
              </button>
              <button
                onClick={() => setInvoiceModalPayment(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Payment Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Record Manual Offline Payment</h3>
            <p className="text-slate-400">
              Directly credit a student and activate subscription package privileges.
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Target Student</label>
                <select
                  value={manualStudentId}
                  onChange={(e) => setManualStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Select Package</label>
                <select
                  value={manualPackageId}
                  onChange={(e) => {
                    setManualPackageId(e.target.value);
                    const p = packages.find((pkg) => pkg.id === e.target.value);
                    if (p) setManualAmount(p.priceINR);
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} (₹{pkg.priceINR})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Method / Source</label>
                  <select
                    value={manualGateway}
                    onChange={(e: any) => setManualGateway(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Manual Offline">Manual / Cash</option>
                    <option value="UPI">Direct UPI</option>
                    <option value="Razorpay">Razorpay POS</option>
                    <option value="Stripe">Stripe Terminal</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Record & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
