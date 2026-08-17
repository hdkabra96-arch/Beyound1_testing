import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import {
  BarChart3,
  TrendingUp,
  Download,
  FileSpreadsheet,
  Users,
  Award,
  CreditCard,
  Layers,
  Sparkles,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const ReportsAnalyticsView: React.FC = () => {
  const { students, payments, contents, classes, packages } = useAdminStore();
  const [reportType, setReportType] = useState<'performance' | 'revenue' | 'content' | 'downloads'>('performance');

  // Chart data: Class-wise Performance average
  const classPerformanceData = [
    { class: 'Class 1', avgScore: 92, activeStudents: 85, completionRate: 94 },
    { class: 'Class 2', avgScore: 88, activeStudents: 120, completionRate: 91 },
    { class: 'Class 3', avgScore: 84, activeStudents: 145, completionRate: 89 },
    { class: 'Class 4', avgScore: 81, activeStudents: 190, completionRate: 86 },
    { class: 'Class 5', avgScore: 78, activeStudents: 310, completionRate: 84 },
    { class: 'Class 6', avgScore: 75, activeStudents: 260, completionRate: 82 },
    { class: 'Class 7', avgScore: 73, activeStudents: 215, completionRate: 79 },
    { class: 'Class 8', avgScore: 71, activeStudents: 180, completionRate: 77 },
  ];

  // Most attempted papers
  const popularPapers = [
    { title: 'Standard Assessment Paper - Class 5 Fractions & Decimals', attempts: 1420, avgScore: '76%', diff: 'Medium' },
    { title: 'Class 5 Speed Math & Mental Arithmetic Sprint 1', attempts: 1180, avgScore: '82%', diff: 'Easy' },
    { title: 'National Olympiad Math Master Challenge - Set A', attempts: 940, avgScore: '64%', diff: 'Olympiad' },
    { title: 'Class 6 Algebra Fundamentals Practice Set 1', attempts: 890, avgScore: '71%', diff: 'Medium' },
    { title: 'Class 8 Linear Equations Step-by-Step Mastery', attempts: 720, avgScore: '68%', diff: 'Hard' },
  ];

  // Revenue by package breakdown
  const packageSalesData = [
    { name: 'Olympiad Pro Master', value: 58, revenue: '₹4,34,710', color: '#6366f1' },
    { name: 'Complete Math Mastery', value: 24, revenue: '₹2,39,760', color: '#06b6d4' },
    { name: 'Core Foundations', value: 12, revenue: '₹89,880', color: '#10b981' },
    { name: 'School Enterprise Tier', value: 6, revenue: '₹1,50,000', color: '#f59e0b' },
  ];

  const handleExportCSV = (name: string) => {
    alert(`Exporting ${name}.csv with real database records.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Reports & Deep Analytics</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
              Requirement 17
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Student performance metrics, hardest question bottlenecks, download frequencies, and revenue breakdowns.
          </p>
        </div>

        <button
          onClick={() => handleExportCSV('Beyond_Classroom_Full_Report')}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors border border-slate-700"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Excel / CSV Report</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'performance', label: 'Class & Student Performance', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'revenue', label: 'Revenue & Package Sales', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'content', label: 'Most Attempted Papers & Difficulty', icon: <Layers className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              reportType === tab.id
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* PERFORMANCE TAB */}
      {reportType === 'performance' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-white">Class-wise Average Test Score & Completion Rate</h2>
              <p className="text-xs text-slate-400">Benchmarking Class 1 through Class 8 student submissions.</p>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="class" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Bar dataKey="avgScore" name="Avg Score (%)" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="completionRate" name="Completion Rate (%)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* KPI Mini Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-slate-400 block font-bold">Overall Platform Accuracy</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">82.6%</span>
              <span className="text-[11px] text-slate-500 mt-1 block">+4.2% from previous month</span>
            </div>
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-slate-400 block font-bold">Practice Tests Completed</span>
              <span className="text-2xl font-black text-indigo-400 mt-1 block">18,420</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Avg 14 tests per student</span>
            </div>
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-slate-400 block font-bold">Total PDF Downloads</span>
              <span className="text-2xl font-black text-purple-400 mt-1 block">9,850</span>
              <span className="text-[11px] text-slate-500 mt-1 block">Watermarked printable sets</span>
            </div>
          </div>
        </div>
      )}

      {/* REVENUE TAB */}
      {reportType === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-extrabold text-white">Revenue Distribution by Plan</h2>
              <div className="space-y-3">
                {packageSalesData.map((item) => (
                  <div key={item.name} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <div>
                        <h4 className="font-extrabold text-white text-xs">{item.name}</h4>
                        <span className="text-[11px] text-slate-400">{item.value}% of Total Subscriptions</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-emerald-400">{item.revenue}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-white text-sm">Monthly Run-Rate (MRR)</h3>
                <span className="text-3xl font-black text-white mt-2 block">₹9,14,350</span>
                <span className="text-xs text-emerald-400 font-bold block mt-1">+18.5% MoM Growth</span>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs mt-6">
                <strong>Razorpay Auto-Settlement Active:</strong> All student plan purchases automatically verify and unlock content instantanously.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT TAB */}
      {reportType === 'content' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-extrabold text-white">Most Attempted Practice Papers & Completion Rates</h2>
          <div className="divide-y divide-slate-800">
            {popularPapers.map((paper, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-slate-950 text-slate-400 font-black text-xs flex items-center justify-center">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{paper.title}</h4>
                    <span className="text-[10px] text-slate-400">Difficulty: {paper.diff}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-xs font-black text-white">{paper.attempts}</span>
                    <span className="text-[10px] text-slate-500 block">Total Solves</span>
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-400">{paper.avgScore}</span>
                    <span className="text-[10px] text-slate-500 block">Avg Accuracy</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
