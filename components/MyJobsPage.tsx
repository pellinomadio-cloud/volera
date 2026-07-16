import React, { useState, useEffect } from 'react';
import { ArrowLeft, Cpu, ShieldCheck, CheckCircle2, XCircle, Terminal, RefreshCw, AlertTriangle, Play, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface MyJobsPageProps {
  onBack: () => void;
  user: UserProfile;
  onGoToJobs: () => void;
  onGoToUpgrade: () => void;
}

interface AppliedJobRecord {
  id: string;
  title: string;
  company: string;
  category: string;
  basePay: number;
  timestamp: number;
  status: 'running' | 'completed';
}

interface RejectedJobRecord {
  id: string;
  title: string;
  company: string;
  category: string;
  basePay: number;
  reason: string;
  timestamp: number;
}

// Simulated log sequences to make the agent operation look incredibly real
const AGENT_LOGS = [
  "Initializing Volera Cryptographic Agent...",
  "Acquiring handshakes with Lagos-Abuja primary gateway fibers...",
  "Validating host operator age constraints: Clearance APPROVED.",
  "Injecting high-speed tunneling protocols (BPC consensus v4.2)...",
  "Synchronizing master ledger databases: 48,190 block signatures parsed.",
  "Verifying node consensus on Lagos hub: Hash mismatch corrected successfully.",
  "Running cryptographic integrity sweep on quantum block layers...",
  "Resolving CBN state files via secondary high-speed channels...",
  "Applying digital transaction signature (RSA-4096 / SHA-256)...",
  "Pushing signed payload directly to Volera Ledger Hub...",
  "Transaction finality achieved. Wallet balance successfully updated."
];

// Sub-component to handle real-time simulation for a single active agent
const AgentWorkerCard: React.FC<{ job: AppliedJobRecord; onComplete: (jobId: string) => void }> = ({ job, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Calculate elapsed time to set initial progress realistically if refreshed
  useEffect(() => {
    const duration = 25000; // 25 seconds for full execution simulation
    const elapsed = Date.now() - job.timestamp;
    
    if (elapsed >= duration) {
      setProgress(100);
      setLogs(AGENT_LOGS);
    } else {
      const initialProgress = Math.floor((elapsed / duration) * 100);
      setProgress(initialProgress);
      
      const logsCount = Math.min(
        AGENT_LOGS.length,
        Math.floor((initialProgress / 100) * AGENT_LOGS.length) + 1
      );
      setLogs(AGENT_LOGS.slice(0, logsCount));
      setCurrentLogIndex(logsCount - 1);
    }
  }, [job.timestamp]);

  // Handle active progress ticking and logging
  useEffect(() => {
    if (progress >= 100) return;

    const intervalTime = 1000 + Math.random() * 1500; // random intervals
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 5;
        if (next >= 100) {
          clearInterval(timer);
          onComplete(job.id);
          setLogs(prevLogs => [...prevLogs, AGENT_LOGS[AGENT_LOGS.length - 1]]);
          return 100;
        }

        // Add logs progressively as progress increases
        const expectedLogIdx = Math.min(
          AGENT_LOGS.length - 2,
          Math.floor((next / 100) * (AGENT_LOGS.length - 1))
        );
        
        setLogs((prevLogs) => {
          if (expectedLogIdx > currentLogIndex && expectedLogIdx < AGENT_LOGS.length) {
            setCurrentLogIndex(expectedLogIdx);
            return [...prevLogs, AGENT_LOGS[expectedLogIdx]];
          }
          return prevLogs;
        });

        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [progress, currentLogIndex, job.id, onComplete]);

  const formattedTime = new Date(job.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`glass-card rounded-3xl p-5 border relative overflow-hidden transition-all ${
        progress >= 100 
          ? 'border-emerald-500/20 bg-gradient-to-br from-[#02130c] to-[#040814]' 
          : 'border-blue-500/20 bg-gradient-to-br from-[#020b18] to-black'
      }`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-[8px] font-black font-mono text-gray-500 uppercase tracking-widest">{job.id}</span>
          <h4 className="text-xs font-black text-white uppercase tracking-wide leading-tight mt-0.5">{job.title}</h4>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{job.company}</p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-mono font-black text-amber-400 block">₦{job.basePay.toLocaleString()}</span>
          <span className="text-[8px] text-gray-500 font-bold">{formattedTime}</span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-2 mb-4 mt-4">
        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
          <span className="flex items-center gap-1.5 text-blue-400">
            {progress < 100 ? (
              <>
                <RefreshCw size={10} className="animate-spin text-blue-400" />
                Agent Syncing Nodes
              </>
            ) : (
              <>
                <CheckCircle2 size={11} className="text-emerald-400" />
                <span className="text-emerald-400">Gateway Synchronized</span>
              </>
            )}
          </span>
          <span className={progress < 100 ? 'text-blue-400' : 'text-emerald-400'}>{progress}%</span>
        </div>
        
        <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/5 p-0.5">
          <motion.div 
            className={`h-full rounded-full ${progress < 100 ? 'bg-gradient-to-r from-blue-500 to-amber-400' : 'bg-emerald-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Embedded Terminal Logs console */}
      <div className="bg-black/80 border border-white/5 rounded-2xl p-3.5 font-mono text-[8.5px] leading-relaxed text-gray-400 space-y-1.5 h-32 overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5 mb-1.5 text-gray-500 font-black">
          <Terminal size={10} className="text-blue-400 animate-pulse" />
          <span>REAL-TIME AGENT DEPLOYMENT CONSOLE</span>
        </div>
        {logs.map((log, idx) => (
          <div key={idx} className="flex gap-2 animate-fadeIn">
            <span className="text-amber-500/70">[{new Date(job.timestamp + idx * 2200).toLocaleTimeString([], { second: '2-digit' })}s]</span>
            <span className={idx === logs.length - 1 && progress < 100 ? "text-blue-400 font-bold animate-pulse" : "text-gray-300"}>
              {log}
            </span>
          </div>
        ))}
        {progress < 100 && (
          <div className="flex items-center gap-1.5 text-blue-500/70 animate-pulse">
            <span>&gt;</span>
            <span className="w-1.5 h-3 bg-blue-400 rounded-sm"></span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MyJobsPage: React.FC<MyJobsPageProps> = ({ onBack, user, onGoToJobs, onGoToUpgrade }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'rejected'>('active');
  const [appliedJobs, setAppliedJobs] = useState<AppliedJobRecord[]>([]);
  const [rejectedJobs, setRejectedJobs] = useState<RejectedJobRecord[]>([]);

  // Load jobs records from LocalStorage
  useEffect(() => {
    try {
      const storedApplied = localStorage.getItem(`volerapay_applied_job_records_${user.email}`);
      if (storedApplied) {
        setAppliedJobs(JSON.parse(storedApplied));
      }

      const storedRejected = localStorage.getItem(`volerapay_rejected_jobs_${user.email}`);
      if (storedRejected) {
        setRejectedJobs(JSON.parse(storedRejected));
      }
    } catch (err) {
      console.error("Failed to fetch jobs from LocalStorage", err);
    }
  }, [user.email]);

  const handleAgentComplete = (jobId: string) => {
    setAppliedJobs((prevJobs) => {
      const updated = prevJobs.map((j) => {
        if (j.id === jobId && j.status === 'running') {
          return { ...j, status: 'completed' as const };
        }
        return j;
      });
      try {
        localStorage.setItem(`volerapay_applied_job_records_${user.email}`, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save completed status:", err);
      }
      return updated;
    });
  };

  const activeRunningCount = appliedJobs.filter(j => j.status === 'running').length;
  const activeCompletedCount = appliedJobs.filter(j => j.status === 'completed').length;

  return (
    <div className="py-2 text-white animate-fadeIn relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-1.5 hover:bg-white/5 rounded-xl transition-colors border border-white/5"
          >
            <ArrowLeft size={18} className="text-gray-400" />
          </button>
          <div>
            <h2 className="text-sm font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200 uppercase">VOLERA AGENT WORKSPACE</h2>
            <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Manage AI Concurrency & Nodes</p>
          </div>
        </div>

        <div className="text-right">
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-400 animate-pulse tracking-wide inline-block">
            {activeRunningCount} Agents Active
          </span>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card p-3 rounded-2xl border-white/5 text-center">
          <span className="text-[7.5px] text-gray-500 uppercase font-black tracking-wider block">Running</span>
          <span className="text-sm font-mono font-black text-blue-400">{activeRunningCount}</span>
        </div>
        <div className="glass-card p-3 rounded-2xl border-white/5 text-center">
          <span className="text-[7.5px] text-gray-500 uppercase font-black tracking-wider block">Completed</span>
          <span className="text-sm font-mono font-black text-emerald-400">{activeCompletedCount}</span>
        </div>
        <div className="glass-card p-3 rounded-2xl border-white/5 text-center">
          <span className="text-[7.5px] text-gray-500 uppercase font-black tracking-wider block">Rejected</span>
          <span className="text-sm font-mono font-black text-red-400">{rejectedJobs.length}</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-black/40 border border-white/5 p-1 rounded-2xl mb-6">
        <button 
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2.5 text-[9.5px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'active' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
              : 'text-gray-500 hover:text-white'
          }`}
        >
          <Cpu size={12} />
          Active Agents
        </button>
        <button 
          onClick={() => setActiveTab('rejected')}
          className={`flex-1 py-2.5 text-[9.5px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'rejected' 
              ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
              : 'text-gray-500 hover:text-white'
          }`}
        >
          <XCircle size={12} />
          Rejected History
        </button>
      </div>

      {/* Main Tab Renderings */}
      <AnimatePresence mode="wait">
        {activeTab === 'active' ? (
          <motion.div 
            key="active-tab"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-4 mb-24"
          >
            {appliedJobs.length > 0 ? (
              appliedJobs.map((job) => (
                <AgentWorkerCard 
                  key={job.id} 
                  job={job} 
                  onComplete={handleAgentComplete} 
                />
              ))
            ) : (
              <div className="text-center py-16 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                <Cpu size={32} className="mx-auto text-gray-600 mb-2 animate-pulse" />
                <p className="text-xs text-gray-500 font-black uppercase tracking-widest">No Active Concurrency Agents</p>
                <p className="text-[9px] text-gray-600 font-bold uppercase mt-1 leading-relaxed max-w-[240px] mx-auto mb-6">
                  You have not deployed any agents. Browse the Volera Job Market to execute a consensus contract.
                </p>
                <button 
                  onClick={onGoToJobs}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg"
                >
                  Go to Job Portal
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="rejected-tab"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4 mb-24"
          >
            {rejectedJobs.length > 0 ? (
              rejectedJobs.map((record) => {
                const isWalletLevelRejection = record.reason.includes("requires a Level") || record.reason.includes("exceeds Level");

                return (
                  <motion.div 
                    key={record.id + record.timestamp}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-3xl p-5 border border-red-500/10 bg-gradient-to-br from-[#120404] to-black"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[8px] font-black font-mono text-gray-500 uppercase tracking-widest">{record.id}</span>
                        <h4 className="text-xs font-black text-white uppercase tracking-wide leading-tight mt-0.5">{record.title}</h4>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{record.company}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-black text-red-400 block">₦{record.basePay.toLocaleString()}</span>
                        <span className="text-[8px] text-gray-500 font-bold">
                          {new Date(record.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Reason Panel */}
                    <div className="mt-3.5 p-3.5 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-3 text-left">
                      <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-[8px] text-red-400 font-black uppercase tracking-widest block">Consensus Gateway Protocol Error</span>
                        <p className="text-[9.5px] text-gray-400 leading-normal font-bold">
                          {record.reason}
                        </p>
                      </div>
                    </div>

                    {isWalletLevelRejection && (
                      <div className="mt-4 pt-1 flex justify-end gap-2.5">
                        <button 
                          onClick={onGoToUpgrade}
                          className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-black text-[8px] font-black uppercase tracking-widest rounded-xl shadow-md"
                        >
                          Upgrade Wallet Tier
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                <ShieldCheck size={32} className="mx-auto text-gray-600 mb-2" />
                <p className="text-xs text-gray-500 font-black uppercase tracking-widest">No Rejection Logged</p>
                <p className="text-[9px] text-gray-600 font-bold uppercase mt-1 leading-relaxed max-w-[240px] mx-auto">
                  Your cryptographic nodes and operator clearances have a flawless status consensus.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyJobsPage;
