import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter, ShieldCheck, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Briefcase, UserCheck, AlertTriangle, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Transaction } from '../types';

interface JobsPageProps {
  onBack: () => void;
  user: UserProfile;
  onJobSuccess: (earnings: number, title: string) => void;
  onGoToUpgrade: () => void;
}

interface Job {
  id: string;
  title: string;
  company: string;
  category: string;
  basePay: number;
  levelRequired: number;
  description: string;
}

// Dynamic pseudo-random job generator to simulate 3000+ available jobs!
const JOB_CATEGORIES = [
  'Node Syncing', 
  'Database Auditing', 
  'Verification Gateway', 
  'Ledger Audit', 
  'CBN Cryptographic Sync', 
  'Quantum Porting'
];

const COMPANIES = [
  'CBN Gateway Corp',
  'Volera Labs Inc',
  'Nova Node Services',
  'Genesis Block Ltd',
  'Standard Trust Ledger',
  'Core Sync Africa',
  'Quantum Nexus'
];

const JOB_TITLES = [
  'Cryptographic Node Auditor',
  'High-Speed Tunnel Sync Operator',
  'Database Ledger Reconciler',
  'CBN Verification Gateway Integrator',
  'Primary Wallet Node Validator',
  'Secure Tunnel Gateway Handler',
  'Quantum Ledger Protocol Sweeper',
  'CBN Certified Verification Agent'
];

const JOB_DESCRIPTIONS = [
  'Validate incoming transaction signatures across CBN-certified cryptographic channels to confirm consensus.',
  'Analyze state mismatches in high-speed data vaults and deploy secure sync bridges.',
  'Reconcile transaction ledgers with primary CBN state files using automated hash validators.',
  'Audit and shield local tunnel gateways against transaction rate mismatching.',
  'Optimize local peer-to-peer node pathways for rapid payment execution.',
  'Perform quantum integrity sweeps on distributed ledger channels.'
];

// Generates 10 jobs for a specific page with consistent attributes using deterministic math, excluding applied jobs
const generateJobsForPage = (page: number, search: string, categoryFilter: string, appliedJobIds: string[]): { jobs: Job[], totalCount: number } => {
  // We simulate 3412 total jobs
  const totalSimulated = 3412;
  const jobsPerPage = 10;
  
  const jobs: Job[] = [];
  
  // Dynamic offset generator to skip applied jobs
  let currentJobIndex = 0;
  let matchesCount = 0;
  
  // Determine starting point based on matching items
  while (jobs.length < jobsPerPage && currentJobIndex < totalSimulated) {
    // Deterministic indexes
    const titleIdx = (currentJobIndex * 3) % JOB_TITLES.length;
    const companyIdx = (currentJobIndex * 7) % COMPANIES.length;
    const categoryIdx = (currentJobIndex * 2) % JOB_CATEGORIES.length;
    const descIdx = (currentJobIndex * 5) % JOB_DESCRIPTIONS.length;
    
    // Payments are NOT less than 14,900 Naira
    const basePay = 14900 + ((currentJobIndex * 150) % 25000); 
    
    // All jobs require Level 2 to apply
    const levelRequired = 2;
    
    const id = `VP-JOB-${currentJobIndex + 1000}`;
    
    // Skip if already applied
    if (!appliedJobIds.includes(id)) {
      const job: Job = {
        id,
        title: JOB_TITLES[titleIdx],
        company: COMPANIES[companyIdx],
        category: JOB_CATEGORIES[categoryIdx],
        basePay,
        levelRequired,
        description: JOB_DESCRIPTIONS[descIdx]
      };

      // Filter matching
      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                            job.company.toLowerCase().includes(search.toLowerCase()) ||
                            job.id.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === '' || job.category === categoryFilter;

      if (matchesSearch && matchesCategory) {
        matchesCount++;
        // Check if we are on the requested page range
        const startRange = (page - 1) * jobsPerPage;
        const endRange = page * jobsPerPage;
        
        if (matchesCount > startRange && matchesCount <= endRange) {
          jobs.push(job);
        }
      }
    }
    
    currentJobIndex++;
  }

  const adjustedTotal = Math.max(0, totalSimulated - appliedJobIds.length);

  return {
    jobs,
    totalCount: adjustedTotal
  };
};

const JobsPage: React.FC<JobsPageProps> = ({ onBack, user, onJobSuccess, onGoToUpgrade }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Track applied jobs to prevent applying twice
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`volerapay_applied_jobs_${user.email}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Application Form States
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicantAge, setApplicantAge] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [customAction, setCustomAction] = useState('Node Deployment');
  
  // Flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationResult, setApplicationResult] = useState<{
    status: 'approved' | 'rejected';
    message: string;
    earnings?: number;
    upgradeSuggested?: boolean;
  } | null>(null);

  // Retrieve current jobs
  const { jobs, totalCount } = useMemo(() => {
    return generateJobsForPage(currentPage, search, categoryFilter, appliedJobIds);
  }, [currentPage, search, categoryFilter, appliedJobIds]);

  const maxPages = Math.ceil(totalCount / 10);

  const handleOpenApply = (job: Job) => {
    if (appliedJobIds.includes(job.id)) {
      alert("You have already completed this job!");
      return;
    }

    const userLevel = user.level || 1;
    const joinedCount = appliedJobIds.length;

    if (userLevel === 2 && joinedCount >= 2) {
      alert("SECURITY BLOCK: Level 2 validator nodes can only join a maximum of 2 jobs. Please upgrade your level to unlock unlimited jobs!");
      return;
    }
    if (userLevel === 3 && joinedCount >= 3) {
      alert("SECURITY BLOCK: Level 3 master-nodes can only join a maximum of 3 jobs. Please upgrade your level to unlock unlimited jobs!");
      return;
    }

    setSelectedJob(job);
    setApplicantAge('');
    setCustomAmount(job.basePay.toString());
    setApplicationResult(null);
  };

  const saveRejected = (job: Job, reason: string) => {
    try {
      const stored = localStorage.getItem(`volerapay_rejected_jobs_${user.email}`);
      const list = stored ? JSON.parse(stored) : [];
      const record = {
        id: job.id,
        title: job.title,
        company: job.company,
        category: job.category,
        basePay: job.basePay,
        reason,
        timestamp: Date.now()
      };
      localStorage.setItem(`volerapay_rejected_jobs_${user.email}`, JSON.stringify([record, ...list]));
    } catch (err) {
      console.error("Failed to save rejected job record", err);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    const ageNum = parseInt(applicantAge, 10);
    const amountNum = parseFloat(customAmount);

    if (isNaN(ageNum) || ageNum <= 0) {
      alert("Please input a valid age.");
      return;
    }

    if (isNaN(amountNum) || amountNum < 14900) {
      alert("Application amount cannot be less than ₦14,900.");
      return;
    }

    setIsSubmitting(true);

    // Simulate cryptographic sync processing latency
    setTimeout(() => {
      setIsSubmitting(false);

      const userLevel = user.level || 1;

      // 1. Age restriction validation
      if (ageNum < 18) {
        const msg = `REJECTED: Minimum cryptographic sync operator age requirement is 18+. Standard CBN safety laws deny clearance to age ${ageNum}.`;
        setApplicationResult({
          status: 'rejected',
          message: msg
        });
        saveRejected(selectedJob, msg);
        return;
      }

      // 2. Wallet Level restriction validation
      if (selectedJob.levelRequired > userLevel) {
        const msg = `REJECTED: Unresolved Volera Security Clearance. This high-paying CBN gateway node requires a Level ${selectedJob.levelRequired} wallet. Your current wallet is Level ${userLevel}.`;
        setApplicationResult({
          status: 'rejected',
          message: msg,
          upgradeSuggested: true
        });
        saveRejected(selectedJob, msg);
        return;
      }

      // 3. Dynamic payout validation based on level limits
      const maxMultiplier = userLevel * 200000; // Level 1 can propose up to 200k, Level 2 up to 400k, etc.
      if (amountNum > maxMultiplier) {
        const msg = `REJECTED: Propose payout of ₦${amountNum.toLocaleString()} exceeds Level ${userLevel} cryptographic vault margins (max: ₦${maxMultiplier.toLocaleString()}). Please upgrade your Volera Wallet tier.`;
        setApplicationResult({
          status: 'rejected',
          message: msg,
          upgradeSuggested: true
        });
        saveRejected(selectedJob, msg);
        return;
      }

      // 4. Random minor failure rate for extra realism (e.g., 8%)
      if (Math.random() < 0.08) {
        const msg = 'REJECTED: Gateway Timeout. Dynamic route congestion detected on secondary Lagos-Abuja fiber-optic network. Please re-submit proposal.';
        setApplicationResult({
          status: 'rejected',
          message: msg
        });
        saveRejected(selectedJob, msg);
        return;
      }

      // 5. Success! Credit earnings
      setApplicationResult({
        status: 'approved',
        message: `SUCCESS! CBN certified tunnel consensus reached. The sum of ₦${amountNum.toLocaleString()} has been securely signed and deposited directly to your Volera Node Balance.`,
        earnings: amountNum
      });
    }, 2200);
  };

  const handleClaimSuccess = () => {
    if (applicationResult?.status === 'approved' && applicationResult.earnings && selectedJob) {
      const updatedAppliedIds = [...appliedJobIds, selectedJob.id];
      setAppliedJobIds(updatedAppliedIds);
      try {
        localStorage.setItem(`volerapay_applied_jobs_${user.email}`, JSON.stringify(updatedAppliedIds));

        // Save detailed record for active agent workspace
        const storedRecords = localStorage.getItem(`volerapay_applied_job_records_${user.email}`);
        const recordsList = storedRecords ? JSON.parse(storedRecords) : [];
        const newRecord = {
          id: selectedJob.id,
          title: selectedJob.title,
          company: selectedJob.company,
          category: selectedJob.category,
          basePay: applicationResult.earnings,
          timestamp: Date.now(),
          status: 'running'
        };
        localStorage.setItem(`volerapay_applied_job_records_${user.email}`, JSON.stringify([newRecord, ...recordsList]));
      } catch (err) {
        console.error("Failed to save applied jobs:", err);
      }
      onJobSuccess(applicationResult.earnings, selectedJob.title);
      setSelectedJob(null);
      setApplicationResult(null);
    }
  };

  return (
    <div className="py-2 text-white animate-fadeIn relative">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-1.5 hover:bg-white/5 rounded-xl transition-colors border border-white/5"
          >
            <ArrowLeft size={18} className="text-gray-400" />
          </button>
          <div>
            <h2 className="text-sm font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200 uppercase">VOLERAPAY SECURE JOBS</h2>
            <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Page {currentPage} of {maxPages}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="px-3 py-1 bg-amber-400/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-400 animate-pulse tracking-wide inline-block">
            {totalCount.toLocaleString()}+ Jobs Live
          </span>
        </div>
      </div>

      {/* Main interactive section */}
      {!selectedJob ? (
        <>
          {/* Filter and Search Panel */}
          <div className="glass-card rounded-3xl p-4 mb-6 border border-white/5 space-y-3.5">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-3 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search CBN nodes, jobs or companies..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="w-full bg-black/50 border border-white/5 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500/40 transition-all text-white placeholder:text-gray-600"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
              <button 
                onClick={() => { setCategoryFilter(''); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider shrink-0 transition-all ${
                  categoryFilter === '' 
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/10' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-400'
                }`}
              >
                All categories
              </button>
              {JOB_CATEGORIES.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider shrink-0 transition-all ${
                    categoryFilter === cat 
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/10' 
                      : 'bg-white/5 hover:bg-white/10 text-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Job listings */}
          <div className="space-y-4 mb-8">
            {jobs.length > 0 ? (
              jobs.map((job, idx) => {
                const userLevel = user.level || 1;
                const isLocked = job.levelRequired > userLevel;
                const isAlreadyApplied = appliedJobIds.includes(job.id);

                return (
                  <motion.div 
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className={`glass-card rounded-3xl p-5 border relative overflow-hidden transition-all hover:border-amber-500/20 ${
                      isAlreadyApplied 
                        ? 'border-emerald-500/20 bg-emerald-950/5' 
                        : isLocked 
                          ? 'border-red-500/10 opacity-75' 
                          : 'border-white/5'
                    }`}
                  >
                    {/* Golden subtle shine glow */}
                    <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-amber-500/5 blur-xl pointer-events-none"></div>

                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[8px] font-black font-mono text-gray-500 uppercase tracking-widest">{job.id}</span>
                      {isAlreadyApplied ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                          Secured & Verified
                        </span>
                      ) : (
                        <span className="text-[10px] font-black font-mono text-amber-400">
                          Min. ₦{job.basePay.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs font-black text-white uppercase tracking-wide mb-1 leading-tight">{job.title}</h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-2">{job.company} • {job.category}</p>
                    
                    <p className="text-[10px] text-gray-500 leading-relaxed mb-4">{job.description}</p>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={12} className={isAlreadyApplied ? "text-emerald-400" : isLocked ? "text-red-400" : "text-amber-400"} />
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isAlreadyApplied ? 'text-emerald-400' : isLocked ? 'text-red-400' : 'text-amber-400'}`}>
                          {isAlreadyApplied ? 'Task Sync Active' : isLocked ? `Requires Lvl ${job.levelRequired} Wallet` : 'Approved for level'}
                        </span>
                      </div>

                      <button 
                        disabled={isAlreadyApplied}
                        onClick={() => handleOpenApply(job)}
                        className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                          isAlreadyApplied
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-not-allowed'
                            : isLocked 
                              ? 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20' 
                              : 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black hover:brightness-110 shadow-md shadow-amber-400/5'
                        }`}
                      >
                        {isAlreadyApplied ? 'Completed' : isLocked ? 'Locked (Apply)' : 'Apply Now'}
                      </button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-white/[0.01] rounded-3xl border border-dashed border-white/5">
                <Briefcase size={28} className="mx-auto text-gray-600 mb-2" />
                <p className="text-xs text-gray-500 font-black uppercase tracking-widest">No matching jobs found</p>
                <p className="text-[9px] text-gray-600 font-bold uppercase mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {maxPages > 1 && (
            <div className="flex justify-between items-center py-4 px-2 bg-white/[0.01] border border-white/5 rounded-2xl mb-24">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-xl border border-white/5 text-gray-400 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                Page {currentPage} of {maxPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(maxPages, prev + 1))}
                disabled={currentPage === maxPages}
                className="p-1.5 rounded-xl border border-white/5 text-gray-400 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Application flow overlay */
        <div className="glass-card rounded-3xl p-6 border border-amber-500/15 relative overflow-hidden mb-24">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="px-2 py-0.5 bg-amber-400/10 border border-amber-500/20 rounded-full text-[8px] font-black text-amber-400 tracking-wider mb-2 inline-block">
                Konsensus Node Sync Application
              </span>
              <h3 className="text-sm font-black text-white uppercase tracking-wide">{selectedJob.title}</h3>
              <p className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider">{selectedJob.company}</p>
            </div>
            <button 
              onClick={() => { setSelectedJob(null); setApplicationResult(null); }}
              className="p-1 hover:bg-white/5 rounded-lg border border-white/5 text-gray-500 hover:text-white"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {!applicationResult ? (
            <form onSubmit={handleApplySubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest block">Select Operations Area</label>
                <select 
                  value={customAction}
                  onChange={(e) => setCustomAction(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-amber-500/30 text-white"
                >
                  <option value="Node Deployment">Node Deployment & Routing</option>
                  <option value="Database Sync">Real-Time Database Syncing</option>
                  <option value="CBN Verification">CBN Security Verification</option>
                  <option value="Cryptographic Tunnel">Cryptographic Tunneling Shield</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest block">Input Operator Age</label>
                <input 
                  type="number" 
                  required
                  placeholder="Enter your age (18+ required)"
                  value={applicantAge}
                  onChange={(e) => setApplicantAge(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-amber-500/30 text-white placeholder:text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] text-gray-400 font-black uppercase tracking-widest block">Proposed Payout Amount (₦)</label>
                  <span className="text-[8px] text-amber-400 font-black">Min: ₦14,900</span>
                </div>
                <input 
                  type="number" 
                  required
                  placeholder="Enter proposal amount (any amount you want)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-2xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-amber-500/30 text-white placeholder:text-gray-700 font-mono font-bold"
                />
              </div>

              {parseInt(applicantAge) < 18 && applicantAge !== '' && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[9.5px] font-bold flex gap-2">
                  <AlertTriangle size={13} className="shrink-0" />
                  <span>Warning: CBN certified cryptographic nodes require operators to be at least 18 years of age. Submitting may trigger rejection.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-300 text-black py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-xl border border-amber-300/20 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ESTABLISHING GATEWAY CONSENSUS...
                  </>
                ) : (
                  <>
                    SUBMIT CONCURRENCY PROPOSAL
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center py-4 animate-fadeIn">
              {applicationResult.status === 'approved' ? (
                <>
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest">Consensus Approved</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed max-w-[280px] mx-auto mt-2">
                      {applicationResult.message}
                    </p>
                  </div>
                  
                  <div className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center">
                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-wider block">CONCURRENCY PAYOUT CREDITED</span>
                    <span className="text-xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                      +₦{applicationResult.earnings?.toLocaleString()}
                    </span>
                  </div>

                  <button 
                    onClick={handleClaimSuccess}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-lg transition-all"
                  >
                    SYNC WALLET BALANCE & RE-ENTRY
                  </button>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto">
                    <XCircle size={32} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-red-400 uppercase tracking-widest">Application Rejected</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed max-w-[280px] mx-auto mt-2">
                      {applicationResult.message}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {applicationResult.upgradeSuggested && (
                      <button 
                        onClick={() => {
                          setSelectedJob(null);
                          setApplicationResult(null);
                          onGoToUpgrade();
                        }}
                        className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-black py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-lg"
                      >
                        UPGRADE VOLERA WALLET NOW
                      </button>
                    )}

                    <button 
                      onClick={() => { setApplicationResult(null); }}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider"
                    >
                      TRY DIFFERENT PARAMETERS
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobsPage;
