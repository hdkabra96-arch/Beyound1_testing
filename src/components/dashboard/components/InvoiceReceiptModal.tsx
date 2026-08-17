import React from 'react';
import { PaymentTransaction } from '../../../types/admin';
import { useStudent } from '../../../services/student-context';
import {
  FileText,
  Printer,
  Download,
  X,
  CheckCircle2,
  Building,
  ShieldCheck,
} from 'lucide-react';

interface InvoiceReceiptModalProps {
  payment: PaymentTransaction;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({ payment, onClose }) => {
  const { currentStudent } = useStudent();

  const handlePrint = () => {
    window.print();
  };

  const gstAmount = Math.round(payment.amount * (18 / 118));
  const baseAmount = payment.amount - gstAmount;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Top Bar */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-black text-white">Official Tax Invoice / Fee Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-950 text-slate-200 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xs">
                  BC
                </div>
                <span className="text-base font-black text-white tracking-tight">Beyond Classroom</span>
              </div>
              <p className="text-xs text-slate-400">Beyond Classroom Education LLP • GSTIN: 07AABCB1234F1Z8</p>
              <p className="text-[11px] text-slate-500">108 Knowledge Park, Indiranagar, Bengaluru, Karnataka 560038</p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Tax Paid Receipt
              </span>
              <p className="text-xs font-mono font-bold text-white mt-1">Invoice: {payment.invoiceNumber || 'INV-2026-0881'}</p>
              <p className="text-[11px] text-slate-400">Date: {payment.paymentDate}</p>
            </div>
          </div>

          {/* Billed To / Student Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-500">Billed To (Student):</span>
              <p className="font-bold text-white text-sm">{payment.studentName}</p>
              <p className="text-slate-400">Email: {payment.studentEmail}</p>
              <p className="text-slate-400">Phone: {payment.studentMobile || '+91 98000 00000'}</p>
              <p className="text-slate-400">Board: {currentStudent?.board || 'CBSE'}</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-black uppercase text-slate-500">Transaction Info:</span>
              <p className="text-slate-300">Transaction ID: <span className="font-mono text-indigo-400 font-bold">{payment.transactionId}</span></p>
              <p className="text-slate-300">Order ID: <span className="font-mono">{payment.orderId}</span></p>
              <p className="text-slate-300">Payment Mode: <span className="font-medium text-emerald-400">{payment.paymentMethod}</span></p>
              <p className="text-slate-300">Status: <span className="text-emerald-400 font-bold uppercase">{payment.status}</span></p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Item Description</th>
                  <th className="p-3.5 text-center">Class / Grade</th>
                  <th className="p-3.5 text-center">Validity</th>
                  <th className="p-3.5 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="p-3.5">
                    <p className="font-bold text-white">{payment.packageName}</p>
                    <p className="text-[11px] text-slate-400">
                      Full curriculum access, chapter notes, question banks, MCQs, and custom worksheets
                    </p>
                  </td>
                  <td className="p-3.5 text-center font-semibold text-slate-300">
                    Class {payment.classId.replace('class_', '')}
                  </td>
                  <td className="p-3.5 text-center font-semibold text-slate-300">
                    1 Year (365 Days)
                  </td>
                  <td className="p-3.5 text-right font-bold text-white">
                    ₹{baseAmount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Calculation Breakdown */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Base Subtotal:</span>
                <span className="text-slate-200">₹{baseAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Integrated GST (18%):</span>
                <span className="text-slate-200">₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-black text-sm text-white">
                <span>Total Amount Paid:</span>
                <span className="text-amber-400">₹{payment.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Authorized Signature & Notes */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Computer Generated Digitally Signed Tax Invoice</span>
              </div>
              <p>This document serves as proof of payment and course enrollment for academic sessions.</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-bold text-slate-300">Beyond Classroom Accounts Dept.</p>
              <p className="text-[10px] text-slate-500">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
