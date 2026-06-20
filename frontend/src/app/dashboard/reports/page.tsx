'use client';

import { motion } from 'framer-motion';
import { FileText, Download, Calendar } from 'lucide-react';

const reports = [
  { id: '1', title: 'January 2024 Monthly Report', period: 'Jan 2024', emissions: 178, change: -12.5 },
  { id: '2', title: 'December 2023 Monthly Report', period: 'Dec 2023', emissions: 203, change: -5.2 },
  { id: '3', title: 'November 2023 Monthly Report', period: 'Nov 2023', emissions: 214, change: -8.1 },
  { id: '4', title: 'Q4 2023 Quarterly Report', period: 'Q4 2023', emissions: 631, change: -15.3 },
  { id: '5', title: '2023 Annual Report', period: '2023', emissions: 2580, change: -22.0 },
];

export default function ReportsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-emerald-500" aria-hidden="true" />
          Reports
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Download and share your sustainability reports</p>
      </div>

      <div className="space-y-3">
        {reports.map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 flex items-center justify-between hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{report.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" aria-hidden="true" /> {report.period}
                  </span>
                  <span className="text-xs font-medium">{report.emissions} kg CO₂</span>
                  <span className={`text-xs font-medium ${report.change < 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {report.change > 0 ? '+' : ''}{report.change}%
                  </span>
                </div>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
              <Download className="h-4 w-4" aria-hidden="true" /> PDF
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
