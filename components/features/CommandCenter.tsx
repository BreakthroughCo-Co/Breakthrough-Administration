'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useManagementStore } from '@/stores/useManagementStore';
import { Client, RestrictivePractice, Incident, BillingClaim, AuditLog } from '@/types';
import {
  Users,
  ShieldAlert,
  Lock,
  DollarSign,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
  BarChart3,
  PieChart as PieIcon,
  CheckCircle2,
  FileText,
  Bell,
  Calendar,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  X
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

export const CommandCenter: React.FC = () => {
  const {
    clients,
    restrictivePractices,
    incidents,
    billingClaims,
    auditLogs,
    notifications,
    practitioners,
    setActiveTab,
    dismissNotification,
    markNotificationsRead,
    addAuditLog
  } = useManagementStore();

  const [alertFilter, setAlertFilter] = React.useState<'ALL' | 'CLINICAL' | 'HR' | 'HIGH'>('ALL');

  // Dynamic store-driven alert generator for Clinical Compliance and HR Milestones
  const compiledAlerts = React.useMemo(() => {
    const list: {
      id: string;
      title: string;
      category: 'Clinical Compliance' | 'HR Milestone';
      description: string;
      dueDate: string;
      severity: 'Critical' | 'High' | 'Medium';
      linkTab: any;
      source: string;
    }[] = [];

    // 1. App Notifications from Store
    notifications.forEach((n) => {
      list.push({
        id: n.id,
        title: n.title,
        category: n.type === 'hr' ? 'HR Milestone' : 'Clinical Compliance',
        description: n.message,
        dueDate: 'Upcoming Milestone',
        severity: n.severity === 'high' ? 'High' : 'Medium',
        linkTab: n.linkTab || 'command-center',
        source: 'System Store',
      });
    });

    // 2. HR Milestones: Worker Screening & Police Check Expiries
    practitioners.forEach((p) => {
      if (p.screeningStatus === 'Expiring Soon' || p.screeningStatus === 'Expired') {
        list.push({
          id: `hr-screen-${p.id}`,
          title: `Worker Screening Clearance (${p.screeningStatus})`,
          category: 'HR Milestone',
          description: `NDIS Worker Screening Clearance for ${p.name} (${p.position}) requires renewal. Expiry date: ${p.screeningExpiryDate}.`,
          dueDate: p.screeningExpiryDate,
          severity: p.screeningStatus === 'Expired' ? 'Critical' : 'High',
          linkTab: 'practitioners',
          source: 'HR Roster Store',
        });
      }
      if (p.policeCheckExpiryDate) {
        list.push({
          id: `hr-police-${p.id}`,
          title: `Police Check Renewal Due`,
          category: 'HR Milestone',
          description: `Annual National Police Clearance check due for ${p.name}. Due date: ${p.policeCheckExpiryDate}.`,
          dueDate: p.policeCheckExpiryDate,
          severity: 'Medium',
          linkTab: 'practitioners',
          source: 'HR Roster Store',
        });
      }
    });

    // 3. Clinical Compliance Tasks: NDIS Plan Reviews, Restrictive Practices, Incidents
    clients.forEach((c) => {
      if (c.planEndDate) {
        list.push({
          id: `plan-end-${c.id}`,
          title: `Participant Plan Review Due`,
          category: 'Clinical Compliance',
          description: `${c.name} (NDIS #${c.ndisNumber}) plan ends on ${c.planEndDate}. Annual clinical progress review required.`,
          dueDate: c.planEndDate,
          severity: 'High',
          linkTab: 'clients',
          source: 'Participant Store',
        });
      }
    });

    restrictivePractices.forEach((rp) => {
      if (rp.monthlyReportStatus === 'Due' || rp.monthlyReportStatus === 'Overdue') {
        list.push({
          id: `rp-due-${rp.id}`,
          title: `VIC Senior Practitioner Restrictive Practice Log`,
          category: 'Clinical Compliance',
          description: `Monthly reduction log for ${rp.clientName} (${rp.practiceType}) is ${rp.monthlyReportStatus}. Submission to NDIS Portal required.`,
          dueDate: rp.expiryDate || '2026-08-15',
          severity: 'Critical',
          linkTab: 'restrictive-practices',
          source: 'Clinical BSP Store',
        });
      }
    });

    incidents.forEach((inc) => {
      if (inc.isNdisReportable && !inc.ndis5daySubmitted) {
        list.push({
          id: `inc-5day-${inc.id}`,
          title: `NDIS Commission 5-Day Incident Investigation`,
          category: 'Clinical Compliance',
          description: `Critical incident for ${inc.clientName} logged on ${inc.incidentDate}. 5-Day Root Cause Analysis & Prevention Plan pending.`,
          dueDate: inc.incidentDate,
          severity: 'Critical',
          linkTab: 'incidents',
          source: 'Governance Store',
        });
      }
    });

    return list;
  }, [notifications, practitioners, clients, restrictivePractices, incidents]);

  const filteredAlerts = compiledAlerts.filter((item) => {
    if (alertFilter === 'CLINICAL') return item.category === 'Clinical Compliance';
    if (alertFilter === 'HR') return item.category === 'HR Milestone';
    if (alertFilter === 'HIGH') return item.severity === 'Critical' || item.severity === 'High';
    return true;
  });

  const totalBudget = clients.reduce((acc: number, c: Client) => acc + c.totalBudget, 0);
  const spentBudget = clients.reduce((acc: number, c: Client) => acc + c.spentBudget, 0);
  const activeRestrictive = restrictivePractices.filter(
    (r: RestrictivePractice) => r.status === 'Active' || r.status === 'Authorized'
  ).length;
  const criticalIncidents = incidents.filter(
    (i: Incident) => i.severity === 'Critical / Reportable' || i.severity === 'High'
  ).length;
  const pendingBilling = billingClaims
    .filter((b: BillingClaim) => b.status === 'Pending' || b.status === 'Approved')
    .reduce((acc: number, b: BillingClaim) => acc + b.totalAmount, 0);

  // Financial Summary Widget Data: Monthly Billable Hours vs Revenue
  const monthlyFinancialData = [
    { month: 'Mar', hours: 140, revenue: 30000 },
    { month: 'Apr', hours: 165, revenue: 35200 },
    { month: 'May', hours: 180, revenue: 38500 },
    { month: 'Jun', hours: 195, revenue: 41800 },
    { month: 'Jul', hours: 210, revenue: 45000 },
    { month: 'Aug', hours: 230, revenue: 49200 },
  ];

  // Incident Severity Breakdown for Recharts Pie
  const incidentSeverityData = [
    { name: 'Critical / Reportable', value: incidents.filter((i: Incident) => i.severity === 'Critical / Reportable').length || 1, color: '#f43f5e' },
    { name: 'High Severity', value: incidents.filter((i: Incident) => i.severity === 'High').length || 1, color: '#f59e0b' },
    { name: 'Medium / Low', value: incidents.filter((i: Incident) => i.severity === 'Medium' || i.severity === 'Low').length || 2, color: '#10b981' },
  ];

  // Compliance Snapshot Data for Recharts
  const complianceData = [
    { name: 'Under Investigation', count: incidents.filter((i: Incident) => i.status === 'Investigating').length || 2 },
    { name: 'Pending NDIS 5-Day', count: incidents.filter((i: Incident) => i.isNdisReportable && !i.ndis5daySubmitted).length || 1 },
    { name: 'Audit Events', count: auditLogs.length || 8 }
  ];

  // Simulated Financial Data
  const financialData = [
    { month: 'Jan', billableHours: 120, revenue: 23000 },
    { month: 'Feb', billableHours: 135, revenue: 26000 },
    { month: 'Mar', billableHours: 110, revenue: 21000 },
    { month: 'Apr', billableHours: 145, revenue: 27500 },
    { month: 'May', billableHours: 160, revenue: 31000 },
    { month: 'Jun', billableHours: 155, revenue: 29800 },
  ];


  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
            NDIS Practice Command Center
          </span>
          <h2 className="text-xl font-black text-white mt-2">
            Breakthrough Coaching & Governance OS
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time Allied Health Governance, Restrictive Practice Tracking, Recharts Analytics, and PACE Compliance Monitoring.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('bsp-plans')}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Activity className="w-4 h-4" />
          <span>New BSP Generator</span>
        </button>
      </div>

      {/* High-Level Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Active NDIS Participants</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{clients.length}</div>
          <p className="text-[11px] text-emerald-400 font-medium">100% Active Capacity Plans</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Restrictive Practices Active</span>
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{activeRestrictive}</div>
          <p className="text-[11px] text-slate-400 font-medium">VIC Senior Practitioner Logged</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Pending Reportable Incidents</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">{criticalIncidents}</div>
          <p className="text-[11px] text-rose-400 font-medium">24hr NDIS Commission Notified</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Revenue Claims</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            ${pendingBilling.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Ready for PACE / PRODA</p>
        </div>
      </div>

      {/* Clinical Compliance Tasks & HR Milestones Alert Notification System */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Clinical Compliance & HR Milestone Alerts
                </h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                  {filteredAlerts.length} Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live store notifications highlighting upcoming due dates for practitioner clearances, BSP logs, and NDIS plan reviews.
              </p>
            </div>
          </div>

          {/* Alert Filter Category Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setAlertFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                alertFilter === 'ALL'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              All Alerts ({compiledAlerts.length})
            </button>
            <button
              onClick={() => setAlertFilter('CLINICAL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                alertFilter === 'CLINICAL'
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Clinical Compliance
            </button>
            <button
              onClick={() => setAlertFilter('HR')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                alertFilter === 'HR'
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              HR Milestones
            </button>
            <button
              onClick={() => setAlertFilter('HIGH')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                alertFilter === 'HIGH'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Critical / High
            </button>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredAlerts.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <span>No active alerts matching the selected filter criteria. All compliance deadlines up to date.</span>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                  alert.severity === 'Critical'
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : alert.severity === 'High'
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                        alert.category === 'HR Milestone'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                      }`}
                    >
                      {alert.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        alert.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : alert.severity === 'High'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-white leading-tight">{alert.title}</h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{alert.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>Due: {alert.dueDate}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        dismissNotification(alert.id);
                        addAuditLog(
                          'DISMISS_ALERT',
                          'COMMAND_CENTER',
                          alert.id,
                          `Acknowledged alert: ${alert.title}`
                        );
                      }}
                      className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition-colors"
                      title="Dismiss Alert"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setActiveTab(alert.linkTab)}
                      className="text-[10px] font-bold text-teal-300 hover:text-white flex items-center gap-1 hover:underline"
                    >
                      <span>Action</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Financial Summary & Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Billable Hours vs Actual Revenue Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.005, boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.1)' }}
          className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Financial Summary: Monthly Billable Hours vs Actual Revenue
              </h3>
              <p className="text-xs text-slate-400">
                Track practitioner billable output against total claim dollar value.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('billing')}
              className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1"
            >
              Billing Ledger <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFinancialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Legend formatter={(val) => <span className="text-slate-300 text-xs font-semibold">{val}</span>} />
                <Bar yAxisId="left" dataKey="hours" fill="#0d9488" radius={[4, 4, 0, 0]} name="Billable Hours" />
                <Bar yAxisId="right" dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Actual Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Incident Severity Breakdown Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.005, boxShadow: '0 10px 25px -5px rgba(244, 63, 94, 0.1)' }}
          className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-rose-400" />
              Incident Severity Distribution
            </h3>
            <button
              onClick={() => setActiveTab('incidents')}
              className="text-xs text-rose-400 hover:underline font-semibold"
            >
              Incidents
            </button>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incidentSeverityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {incidentSeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Legend formatter={(val) => <span className="text-slate-300 text-[11px] font-semibold">{val}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Main Split: Participants Caseload & Compliance Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Participant Caseload Summary */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              Participant Caseload & Budget Utilization
            </h3>
            <button
              onClick={() => setActiveTab('clients')}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {clients.map((client: Client) => {
              const utilPercent = Math.round((client.spentBudget / client.totalBudget) * 100);
              return (
                <div
                  key={client.id}
                  className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{client.name}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.5 rounded">
                        NDIS #{client.ndisNumber}
                      </span>
                      {client.restrictivePracticesActive && (
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded font-bold border border-amber-500/20">
                          Restrictive Practice
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{client.primaryDisability}</p>
                  </div>

                  <div className="w-full sm:w-48 space-y-1 shrink-0">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Budget Spent</span>
                      <span className="text-white font-mono font-bold">${client.spentBudget.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          utilPercent > 80 ? 'bg-amber-500' : 'bg-teal-500'
                        }`}
                        style={{ width: `${Math.min(utilPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance Snapshot Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Compliance Snapshot
            </h3>
            <button
              onClick={() => setActiveTab('audit-logs')}
              className="text-xs text-teal-400 hover:underline font-semibold"
            >
              Audit Trail
            </button>
          </div>

          <div className="h-32 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} width={100} />
                <Tooltip
                  cursor={{ fill: '#1e293b' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 text-xs">
            {/* Alert 1 */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold block">BSP Monthly Restrictive Practice Log</span>
                <span className="text-[9px] bg-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold">5 Days Left</span>
              </div>
              <p className="text-[11px] text-amber-300/80">
                Monthly report for Jordan Miller due to NDIS Quality & Safeguards Commission.
              </p>
            </div>

            {/* Alert 2 */}
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold block">Pending 5-Day Commission Submission</span>
                <span className="text-[9px] bg-rose-500/20 px-1.5 py-0.5 rounded font-mono font-bold">Action Needed</span>
              </div>
              <p className="text-[11px] text-rose-300/80">
                24-hr notification submitted for critical incident. Complete root cause analysis before day 5.
              </p>
            </div>

            {/* Recent Audit Ledger Snapshot */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Recent Audit Trail Events
              </span>
              <div className="space-y-1">
                {auditLogs.slice(0, 3).map((log: AuditLog) => (
                  <div key={log.id} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                    <div className="flex justify-between font-bold text-white">
                      <span>{log.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{log.actorName}</span>
                    </div>
                    <p className="text-slate-400 truncate text-[10px]">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Financial Summary Widget */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Financial Summary: Billable Hours vs Revenue
          </h3>
          <button
            onClick={() => setActiveTab('billing')}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            View Billing Claims
          </button>
        </div>
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}h`} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip
                cursor={{ fill: '#1e293b' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar yAxisId="left" dataKey="billableHours" name="Billable Hours" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar yAxisId="right" dataKey="revenue" name="Actual Revenue ($)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

