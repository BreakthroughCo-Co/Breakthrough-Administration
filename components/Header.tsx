'use client';

import React, { useState } from 'react';
import { useManagementStore, TabType } from '@/stores/useManagementStore';
import { UserRole, UserProfile, AppNotification } from '@/types';
import {
  ShieldCheck,
  UserCheck,
  Activity,
  Search,
  Bell,
  Sun,
  Moon,
  Check,
  X,
  AlertTriangle,
  FileCheck,
  Clock,
  Sparkles,
  Wifi,
  WifiOff,
  Database,
  Globe,
  LogIn,
  Building2,
  RefreshCw,
  Rocket
} from 'lucide-react';
import { signInWithGoogle, getCachedAccessToken, auth } from '@/lib/firebase';
import { PhasedRolloutModal } from '@/components/PhasedRolloutModal';
import { BranchManagementModal } from '@/components/BranchManagementModal';
import { OfflineSyncModal } from '@/components/OfflineSyncModal';
import { GuidedTourModal } from '@/components/GuidedTourModal';

export const Header: React.FC = () => {
  const {
    users,
    currentUser,
    switchUser,
    setUserRole,
    setCommandPaletteOpen,
    notifications,
    markNotificationsRead,
    dismissNotification,
    setActiveTab,
    theme,
    toggleTheme,
    clinics,
    currentClinicId,
    setClinic,
    isOffline,
    setIsOffline,
    offlineQueue,
    syncOfflineQueue,
    openTour
  } = useManagementStore();

  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [isRolloutModalOpen, setIsRolloutModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);

  const unreadCount = notifications.filter((n: AppNotification) => !n.read).length;

  const handleNotificationClick = (linkTab?: string) => {
    if (linkTab) {
      setActiveTab(linkTab as TabType);
    }
    setShowNotifPopover(false);
  };

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-md">
        {/* Brand & Organization */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl shadow-md text-white font-black flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-white">
                Breakthrough OS
              </h1>
              <button
                onClick={() => setIsRolloutModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-teal-500/20 to-emerald-500/20 hover:from-teal-500/30 hover:to-emerald-500/30 text-teal-300 border border-teal-500/40 transition-all cursor-pointer shadow-sm group"
                title="View Breakthrough OS Multi-Phase Product Rollout Schedule (All Phases 1-6 100% Deployed)"
              >
                <Rocket className="w-3 h-3 text-teal-400 group-hover:scale-110 transition-transform" />
                <span className="font-mono font-bold">Phases 1–6 Live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {/* Interactive Guided Clinical Tour Button */}
              <button
                onClick={openTour}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-300 border border-indigo-500/40 transition-all cursor-pointer shadow-sm group"
                title="Start 3-Minute Interactive Clinical Guided Tour"
              >
                <Sparkles className="w-3 h-3 text-amber-300 group-hover:scale-110 transition-transform" />
                <span className="font-mono font-bold">Quick Tour</span>
              </button>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Live bidirectional sync active with Firebase Firestore database">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Firestore Synced</span>
              </div>

            {/* Offline Status & Sync Trigger Modal Launcher */}
            {isOffline ? (
              <button
                onClick={() => setIsOfflineModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse cursor-pointer hover:bg-amber-500/25 transition-all"
                title="App is running in offline mode. Click to open Sync & Storage Manager."
              >
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>Offline ({offlineQueue.filter((q) => q.status === 'PENDING').length} queued)</span>
              </button>
            ) : offlineQueue.some((q) => q.status === 'PENDING') ? (
              <button
                onClick={() => setIsOfflineModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 hover:bg-teal-500/25 transition-colors cursor-pointer"
                title="Pending records in offline queue. Click to open Sync Manager."
              >
                <RefreshCw className="w-3 h-3 text-teal-400 animate-spin" />
                <span>Sync ({offlineQueue.filter((q) => q.status === 'PENDING').length})</span>
              </button>
            ) : (
              <button
                onClick={() => setIsOfflineModalOpen(true)}
                className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                title="Click to open Offline PWA & Storage Engine"
              >
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>Online (PWA)</span>
              </button>
            )}

            {/* Multi-Clinic Branch Switcher & Management Launcher */}
            <div className="hidden 2xl:flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-[10px]">
              <Building2 className="w-3 h-3 text-teal-400 shrink-0" />
              <select
                value={currentClinicId}
                onChange={(e) => setClinic(e.target.value)}
                className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer"
              >
                {clinics.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.code} • {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsBranchModalOpen(true)}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold hover:text-white transition-colors cursor-pointer"
                title="Manage practice branches and regional hubs"
              >
                Manage
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 hidden lg:block">
            Behaviour Support • Restrictive Practice Governance • PACE Compliant
          </p>
        </div>
      </div>

      {/* Center Search Trigger */}
      <div className="hidden sm:flex items-center flex-1 max-w-sm mx-4">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl px-3 py-1.5 text-xs transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 transition-transform" />
            <span>Search participants, claims, notes...</span>
          </div>
          <kbd className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* User & Controls */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="sm:hidden p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 hover:text-white"
          title="Search"
        >
          <Search className="w-4 h-4 text-teal-400" />
        </button>

        {/* AI Copilot Omni-Drawer Launcher */}
        <button
          onClick={useManagementStore.getState().toggleAICopilot}
          className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-teal-500/15 via-indigo-500/15 to-teal-500/15 hover:from-teal-500/25 hover:to-indigo-500/25 border border-teal-500/30 hover:border-teal-400/50 rounded-xl text-teal-300 hover:text-white transition-all shadow-sm group"
          title="Open AI Clinical & Operations Copilot (Ctrl+J)"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold hidden sm:inline">AI Copilot</span>
          <kbd className="hidden md:inline-block text-[9px] font-mono bg-teal-950 text-teal-300 px-1.5 py-0.2 rounded border border-teal-500/30">
            Ctrl+J
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
        </button>

        {/* Real-time Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifPopover(!showNotifPopover)}
            className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 hover:text-white transition-all relative"
            title="Real-time Compliance & Incident Notifications"
          >
            <Bell className="w-4 h-4 text-teal-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {showNotifPopover && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 z-50 text-xs space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-teal-400" />
                  <span className="font-bold text-white text-sm">Real-Time Alerts</span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markNotificationsRead}
                    className="text-[10px] text-teal-400 hover:underline font-bold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center text-slate-500 py-4">No notifications.</p>
                ) : (
                  notifications.map((n: AppNotification) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n.linkTab)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                        n.read ? 'bg-slate-950/60 border-slate-800/80 text-slate-400' : 'bg-slate-800/90 border-teal-500/40 text-slate-200'
                      }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(n.id);
                        }}
                        className="absolute top-2 right-2 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${n.severity === 'high' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                        <span className="font-bold text-white text-xs">{n.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{n.message}</p>
                      <span className="text-[9px] text-slate-500 font-mono mt-1 block">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Role Quick Toggle */}
        <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 px-2 text-[10px] uppercase font-bold tracking-wider">
            Role:
          </span>
          {(['ADMIN', 'PRACTITIONER', 'VIEWER'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setUserRole(r)}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                currentUser.role === r
                  ? r === 'ADMIN'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : r === 'PRACTITIONER'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-700 text-slate-200'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Google Workspace & Maps Quick Launcher */}
        <button
          onClick={() => setActiveTab('google-workspace')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all"
          title="Open Google Workspace Enterprise Hub (Drive, Sheets, Docs, Slides, Calendar, Gmail, Meet, Tasks, Maps)"
        >
          <Globe className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline">Google Hub</span>
        </button>

        {/* User Account Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <UserCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <select
            value={currentUser.id}
            onChange={(e) => switchUser(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
          >
            {users.map((u: UserProfile) => (
              <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
    <PhasedRolloutModal isOpen={isRolloutModalOpen} onClose={() => setIsRolloutModalOpen(false)} />
    <BranchManagementModal isOpen={isBranchModalOpen} onClose={() => setIsBranchModalOpen(false)} />
    <OfflineSyncModal isOpen={isOfflineModalOpen} onClose={() => setIsOfflineModalOpen(false)} />
    <GuidedTourModal />
  </>
  );
};
