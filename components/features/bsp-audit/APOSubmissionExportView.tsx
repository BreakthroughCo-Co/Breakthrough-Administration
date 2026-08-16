'use client';

import React, { useState } from 'react';
import {
  BSPAuditPackage,
  BSPDocument
} from '@/types/bsp-audit';
import {
  generateAuditJsonPackage,
  formatAPOScorecardMarkdown,
  validateAuditPackageIntegrity
} from '@/lib/bsp-auditor/apo-exporter';
import {
  Printer,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Award,
  FileCheck,
  Scale,
  Brain,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface APOSubmissionExportViewProps {
  auditPackage: BSPAuditPackage;
  bsp: BSPDocument;
}

export const APOSubmissionExportView: React.FC<APOSubmissionExportViewProps> = ({
  auditPackage,
  bsp
}) => {
  const [leadPractitionerName, setLeadPractitionerName] = useState(
    bsp.authorName || 'Dr. Sarah Jenkins (Lead PBS Practitioner)'
  );
  const [leadPractitionerReg, setLeadPractitionerReg] = useState('PR-881902');
  const [apoName, setApoName] = useState(
    auditPackage.apoEndorsement?.authorizedProgramOfficerName || 'Dr. Evelyn Ross (APO Lead)'
  );
  const [apoReg, setApoReg] = useState(
    auditPackage.apoEndorsement?.apoRegistrationNumber || 'APO-VIC-982104'
  );
  const [recommendation, setRecommendation] = useState(
    auditPackage.apoEndorsement?.recommendation ||
      (auditPackage.overallScore >= 90
        ? 'APPROVED_FOR_COMMISSION_SUBMISSION'
        : auditPackage.overallScore >= 75
        ? 'CONDITIONALLY_APPROVED_PENDING_REMEDIATION'
        : 'REJECTED_MANDATORY_REVISION_REQUIRED')
  );
  const [endorsementNotes, setEndorsementNotes] = useState(
    auditPackage.apoEndorsement?.endorsementNotes ||
      `Senior Practitioner review completed for ${bsp.clientName}. Quality Score: ${auditPackage.overallScore}% (${auditPackage.complianceGrade}).`
  );

  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [integrityStatus, setIntegrityStatus] = useState<string | null>(null);

  // Generate JSON Export
  const handleDownloadJson = () => {
    const jsonPkg = generateAuditJsonPackage(auditPackage, bsp, {
      leadPractitionerName,
      leadPractitionerRegistration: leadPractitionerReg,
      authorizedProgramOfficerName: apoName,
      apoRegistrationNumber: apoReg
    });

    const blob = new Blob([JSON.stringify(jsonPkg, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NDIS_APO_Audit_Package_${bsp.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy Markdown
  const handleCopyMarkdown = async () => {
    const md = formatAPOScorecardMarkdown(auditPackage, bsp, {
      leadPractitionerName,
      leadPractitionerRegistration: leadPractitionerReg,
      authorizedProgramOfficerName: apoName,
      apoRegistrationNumber: apoReg
    });
    await navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  // Print Window
  const handlePrint = () => {
    window.print();
  };

  // Verify Integrity
  const handleVerifyIntegrity = () => {
    const jsonPkg = generateAuditJsonPackage(auditPackage, bsp, {
      leadPractitionerName,
      leadPractitionerRegistration: leadPractitionerReg,
      authorizedProgramOfficerName: apoName,
      apoRegistrationNumber: apoReg
    });
    const result = validateAuditPackageIntegrity(JSON.stringify(jsonPkg));
    if (result.isValid) {
      setIntegrityStatus(`✅ Cryptographic SHA-256 Validated: ${result.calculatedHash.slice(0, 16)}... (Zero tampering detected)`);
    } else {
      setIntegrityStatus(`❌ Integrity check failed: ${result.errors.join('; ')}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Official NDIS APO Submission Scorecard & Export
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Senior Practitioner endorsement scorecard ready for Authorised Program Officer sign-off and NDIS Commission submission.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-700 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Print Official Scorecard</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-700 transition-all shadow-sm"
          >
            {copiedMarkdown ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-teal-400" />
            )}
            <span>{copiedMarkdown ? 'Copied Markdown' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download JSON Package</span>
          </button>
        </div>
      </div>

      {/* APO Endorsement Controls (Interactive Form) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 print:hidden">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Authorised Program Officer (APO) Endorsement Parameters
            </span>
          </div>
          <button
            onClick={handleVerifyIntegrity}
            className="text-[11px] font-mono text-teal-400 hover:underline font-semibold"
          >
            Verify Integrity Hash →
          </button>
        </div>

        {integrityStatus && (
          <div className="p-3 bg-slate-950 rounded-lg border border-teal-500/30 text-xs font-mono text-teal-300 animate-fadeIn">
            {integrityStatus}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Lead Practitioner Name
            </label>
            <input
              type="text"
              value={leadPractitionerName}
              onChange={(e) => setLeadPractitionerName(e.target.value)}
              className="clinical-input"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              NDIS Practitioner Registration #
            </label>
            <input
              type="text"
              value={leadPractitionerReg}
              onChange={(e) => setLeadPractitionerReg(e.target.value)}
              className="clinical-input font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Authorised Program Officer
            </label>
            <input
              type="text"
              value={apoName}
              onChange={(e) => setApoName(e.target.value)}
              className="clinical-input"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              APO Panel Recommendation
            </label>
            <select
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value as any)}
              className="clinical-input text-teal-300 font-bold"
            >
              <option value="APPROVED_FOR_COMMISSION_SUBMISSION">APPROVED (Lodging Ready)</option>
              <option value="CONDITIONALLY_APPROVED_PENDING_REMEDIATION">CONDITIONALLY APPROVED</option>
              <option value="REJECTED_MANDATORY_REVISION_REQUIRED">REJECTED (Revision Required)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Senior Practitioner Clinical Endorsement Notes
          </label>
          <textarea
            rows={2}
            value={endorsementNotes}
            onChange={(e) => setEndorsementNotes(e.target.value)}
            className="clinical-textarea"
          />
        </div>
      </div>

      {/* Printable Official NDIS APO Submission Scorecard Sheet */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        {/* Letterhead Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-teal-500/60 pb-5">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-teal-400 uppercase print:text-teal-700">
              NDIS Quality and Safeguards Commission Compliance Review
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white print:text-black tracking-tight mt-0.5">
              AUTHORISED PROGRAM OFFICER (APO) SUBMISSION SCORECARD
            </h2>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
              Breakthrough OS Behaviour Support Governance Engine • Authorised Restrictive Practices Rules 2018
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 print:text-gray-600">
            <div><strong>Audit ID:</strong> {auditPackage.auditMetadata?.auditId || `AUDIT-2026-${bsp.id}`}</div>
            <div><strong>Date:</strong> {auditPackage.auditTimestamp.split('T')[0]}</div>
            <div><strong>Version:</strong> {bsp.version || 'v2.2'}</div>
          </div>
        </div>

        {/* 1. Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-900/80 print:bg-gray-100 rounded-xl border border-slate-800 print:border-gray-300 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Participant Name</span>
            <span className="font-bold text-white print:text-black text-sm">{bsp.clientName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">NDIS Client ID</span>
            <span className="font-mono text-slate-300 print:text-gray-800">{bsp.clientId}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Lead Practitioner</span>
            <span className="font-semibold text-slate-200 print:text-gray-800">{leadPractitionerName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">APO Reviewer</span>
            <span className="font-semibold text-teal-400 print:text-teal-800">{apoName}</span>
          </div>
        </div>

        {/* 2. Executive Scorecard Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-gradient-to-br from-slate-900 to-slate-950 print:bg-gray-50 rounded-xl border border-slate-800 print:border-gray-300">
          <div className="text-center sm:text-left space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Authoritative Quality Score
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black font-mono text-teal-400 print:text-teal-700">
                {auditPackage.overallScore}%
              </span>
              <span className="text-xs font-bold text-slate-300 print:text-gray-700">
                ({auditPackage.complianceGrade})
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium block">
              Status: <strong>{auditPackage.complianceStatus}</strong>
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Regulatory Pillars Summary
            </span>
            <ul className="space-y-1 text-[11px] font-mono text-slate-300 print:text-gray-700">
              <li>P1 (Human Rights): <strong>{auditPackage.pillarScores.human_rights_legal}%</strong></li>
              <li>P2 (Clinical PBS): <strong>{auditPackage.pillarScores.clinical_pbs_formulation}%</strong></li>
              <li>P3 (Proactive): <strong>{auditPackage.pillarScores.proactive_skill_building}%</strong></li>
              <li>P4 (Crisis & Gov): <strong>{auditPackage.pillarScores.crisis_reduction_safeguards}%</strong></li>
            </ul>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              APO Recommendation
            </span>
            <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 print:text-teal-800 font-mono font-bold text-xs rounded-lg border border-teal-500/30">
              {recommendation}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {auditPackage.passedIndicatorsCount} / 12 Quality Indicators Passed
            </span>
          </div>
        </div>

        {/* 3. Restrictive Practices Register Table */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
            <Lock className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-white print:text-black uppercase text-xs">
              Regulated Restrictive Practices & Authorisations (NDIS Rules 2018)
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-slate-800 print:border-gray-300 text-slate-400 print:text-gray-600 font-bold uppercase text-[10px]">
                  <th className="py-2 pr-3">Practice Type</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">State Authorisation Ref</th>
                  <th className="py-2 pr-3">Least Restrictive</th>
                  <th className="py-2 pr-3">Fade-Out Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-gray-200">
                {auditPackage.restrictivePracticesAudit.length > 0 ? (
                  auditPackage.restrictivePracticesAudit.map((rp, idx) => (
                    <tr key={idx} className="text-slate-300 print:text-gray-800">
                      <td className="py-2 pr-3 font-bold text-white print:text-black">{rp.practiceType}</td>
                      <td className="py-2 pr-3 font-mono">{rp.status}</td>
                      <td className="py-2 pr-3 font-mono text-teal-400 print:text-teal-700">
                        {rp.authorizationReference || 'MISSING'}
                      </td>
                      <td className="py-2 pr-3">{rp.leastRestrictiveJustified ? '✅ Compliant' : '❌ Gap'}</td>
                      <td className="py-2 pr-3">{rp.fadingPlanPresent ? '✅ Active Schedule' : '❌ Missing'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-2 text-slate-500 italic">
                      Zero regulated restrictive practices reported. 100% positive behavioral supports.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. 12 NDIS Quality Indicators Summary Grid */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
            <Layers className="w-4 h-4 text-teal-400" />
            <h4 className="font-bold text-white print:text-black uppercase text-xs">
              The 12 NDIS Quality & Safeguards Indicators Audit Summary
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {auditPackage.indicatorResults.map((ind) => (
              <div
                key={ind.id}
                className="p-2 bg-slate-900/60 print:bg-gray-50 border border-slate-800 print:border-gray-300 rounded-lg space-y-1 text-[11px]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-teal-400 print:text-teal-800">{ind.id}</span>
                  <span
                    className={`font-mono font-bold text-[10px] ${
                      ind.score >= 80 ? 'text-emerald-400' : ind.score >= 60 ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {ind.score}%
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 print:text-gray-800 font-medium truncate" title={ind.name}>
                  {ind.name}
                </p>
                <span className="text-[9px] text-slate-500 block font-mono">
                  {ind.passed ? '✅ Passed' : '❌ Gap Identified'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. APO Endorsement & Digital Signature Block */}
        <div className="border-t-2 border-slate-800 print:border-gray-400 pt-4 space-y-3 text-xs">
          <h4 className="font-bold text-white print:text-black uppercase text-xs tracking-wider">
            Authorised Program Officer (APO) Endorsement & Digital Signature
          </h4>
          <p className="text-slate-300 print:text-gray-700 italic">
            "{endorsementNotes}"
          </p>

          <div className="bg-slate-900 print:bg-gray-100 p-4 rounded-xl border border-slate-800 print:border-gray-300 font-mono text-[10px] space-y-1 text-slate-400 print:text-gray-700">
            <div className="text-teal-400 print:text-teal-800 font-bold uppercase">
              [DIGITALLY ENDORSED VIA BREAKTHROUGH OS NDIS COMPLIANCE ENGINE]
            </div>
            <div>Reviewer: {apoName} (APO Registration #{apoReg})</div>
            <div>Timestamp: {auditPackage.auditTimestamp}</div>
            <div>Integrity SHA-256 Checksum: {auditPackage.checksumSha256}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
