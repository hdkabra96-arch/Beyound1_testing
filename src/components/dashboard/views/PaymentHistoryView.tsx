import React, { useState } from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import { PaymentTransaction } from '../../../types/admin';
import { InvoiceReceiptModal } from '../components/InvoiceReceiptModal';
import {
  CreditCard,
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export const PaymentHistoryView: React.FC = () => {
  const { currentStudent } = useStudent();
  const { payments } = useAdminStore();
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);

  if (!currentStudent) return null;

  // Filter payments for current student
  const studentPayments = payments.filter((p) => p.studentId === currentStudent.id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Payment History & Tax Invoices</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access verified billing records, view payment transaction IDs, and print official Beyond Classroom tax invoices.
          </p>
        </div>
      </div>

      {/* Transactions Table / Cards */}
      {studentPayments.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <CreditCard className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-300">No payment records found</p>
          <p className="text-xs text-slate-500">Your billing transactions will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {studentPayments.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {p.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">Order: {p.orderId}</span>
                  <span className="text-xs text-slate-500">• {p.paymentDate}</span>
                </div>

                <div>
                  <h3 className="text-base font-black text-white">{p.packageName}</h3>
                  <p className="text-xs text-slate-400">
                    Class {p.classId.replace('class_', '')} • Method: <strong className="text-slate-300">{p.paymentMethod}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                  <span>Txn ID: <strong className="font-mono text-indigo-400 font-bold">{p.transactionId}</strong></span>
                  <span>•</span>
                  <span>Invoice: <strong className="font-mono text-slate-300">{p.invoiceNumber || 'INV-2026'}</strong></span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 shrink-0">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Amount</span>
                  <span className="text-xl font-black text-amber-400">₹{p.amount.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => setSelectedPayment(p)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Tax Invoice</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedPayment && (
        <InvoiceReceiptModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  );
};
