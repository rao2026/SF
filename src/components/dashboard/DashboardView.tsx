import { motion } from 'motion/react';
import { FileText, Calendar, Trash2, Eye, FolderOpen, Home, ChevronRight, Loader2, AlertTriangle, LayoutGrid, ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight as ArrowRight, SearchX, AlignLeft, Edit3, Pencil } from 'lucide-react';
import { Button } from '../ui/button';
import { Header } from '../Header';
import { ProcessingProtocolSet } from '../../types';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface DashboardViewProps {
  protocolSets: ProcessingProtocolSet[];
  onViewProfile: (setId: string) => void;
  onRemoveSet: (setId: string) => void;
  onDashboardClick?: () => void;
  onBackToLanding: () => void;
  onUpdateProtocolSet?: (setId: string, updates: Partial<ProcessingProtocolSet>) => void;
  showEmptyDashboard?: boolean; // POC: Flag to force empty dashboard display
}

export function DashboardView({ protocolSets, onViewProfile, onRemoveSet, onDashboardClick, onBackToLanding, onUpdateProtocolSet, showEmptyDashboard }: DashboardViewProps) {
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const completedSets = protocolSets.filter(set => set.isComplete);
  const processingSets = protocolSets.filter(set => !set.isComplete);
  
  // Sort completed sets based on sortOrder
  const sortedCompletedSets = [...completedSets].sort((a, b) => {
    if (sortOrder === 'newest') {
      return b.addedAt - a.addedAt; // Latest first
    } else {
      return a.addedAt - b.addedAt; // Oldest first
    }
  });

  console.log('Dashboard - Total Sets:', protocolSets.length);
  console.log('Dashboard - Completed:', completedSets.length);
  console.log('Dashboard - Processing:', processingSets.length);

  // State for tracking which protocol is being loaded - REMOVED, using LoadingModal instead
  // const [loadingProfileId, setLoadingProfileId] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to generate dummy protocol numbers
  const getProtocolNumber = (index: number) => {
    const protocols = [
      'D5989C00001',
      'mRNA-1273_1283-P401',
      'NB-CVOT3',
      'NCT05165485'
    ];
    return protocols[index % protocols.length];
  };

  // Helper function to generate study names
  const getStudyName = (set: ProcessingProtocolSet, index: number) => {
    if (set.studyName) return set.studyName;
    
    const studyNames = [
      'COPD cardiopulmonary trial',
      'Phase II Advanced Non-Small Cell Lung Cancer Trial',
      'Phase I Melanoma Immunotherapy Study',
      'Phase III Breast Cancer Combination Therapy Trial'
    ];
    return studyNames[index % studyNames.length];
  };

  // Helper function to generate sponsor names
  const getSponsorName = (index: number) => {
    const sponsors = [
      'AstraZeneca',
      'ModernaTX, Inc.',
      'Medpace',
      'Codagenix Inc.',
      'Pfizer Inc.',
      'Sanofi Pasteur Inc.',
      'Amgen Inc.'
    ];
    return sponsors[index % sponsors.length];
  };

  // Helper function to generate protocol document name based on protocol number (shortened for POC)
  const getProtocolDocName = (protocolNumber: string) => {
    return `${protocolNumber}_Protocol.pdf`;
  };

  // Helper function to generate feasibility document name based on protocol number (shortened for POC)
  const getFeasibilityDocName = (protocolNumber: string) => {
    return `${protocolNumber}_Feasibility.pdf`;
  };

  // Filter completed sets based on search term
  const filteredCompletedSets = sortedCompletedSets.filter(set => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const protocolIndex = protocolSets.findIndex(s => s.id === set.id);
    const protocolNumber = getProtocolNumber(protocolIndex);
    const studyName = getStudyName(set, protocolIndex);
    const sponsorName = getSponsorName(protocolIndex);
    
    return (
      protocolNumber.toLowerCase().includes(searchLower) ||
      studyName.toLowerCase().includes(searchLower) ||
      sponsorName.toLowerCase().includes(searchLower)
    );
  });

  // Handle view profile with loading state
  const handleViewProfile = (setId: string) => {
    // setLoadingProfileId(setId);
    // Add a small delay to show the loading state
    setTimeout(() => {
      onViewProfile(setId);
    }, 300);
  };

  // Continue processing incomplete sets when viewing dashboard
  useEffect(() => {
    if (!onUpdateProtocolSet) return;
    if (processingSets.length === 0) return;

    const intervals: number[] = [];

    processingSets.forEach(set => {
      // Determine which inputs exist
      const hasProtocolDoc = !!set.protocolDoc;
      const hasFeasibilityDoc = !!set.feasibilityDoc;
      const hasTextInput = !!set.textInput;

      console.log(`Processing set ${set.id}:`, {
        protocolProgress: set.protocolProgress,
        feasibilityProgress: set.feasibilityProgress,
        hasProtocolDoc,
        hasFeasibilityDoc,
        hasTextInput
      });

      // Process Protocol Document or Text Input (using protocolProgress)
      if (set.protocolProgress < 100 && (hasProtocolDoc || hasTextInput)) {
        const protocolInterval = window.setInterval(() => {
          const currentSet = processingSets.find(s => s.id === set.id);
          if (!currentSet) return;
          
          const newProgress = Math.min(currentSet.protocolProgress + Math.random() * 3 + 2, 100);
          const isComplete = newProgress >= 100;
          
          console.log(`Protocol/Text progress for ${set.id}: ${newProgress}%`);
          
          onUpdateProtocolSet(set.id, {
            protocolProgress: newProgress,
            protocolStatus: isComplete ? 'complete' : 'processing'
          });

          if (isComplete) {
            clearInterval(protocolInterval);
          }
        }, 300);
        intervals.push(protocolInterval);
      }

      // Process Feasibility Document only if it exists
      if (set.feasibilityProgress < 100 && hasFeasibilityDoc) {
        const feasibilityInterval = window.setInterval(() => {
          const currentSet = processingSets.find(s => s.id === set.id);
          if (!currentSet) return;
          
          const newProgress = Math.min(currentSet.feasibilityProgress + Math.random() * 3 + 2, 100);
          const isComplete = newProgress >= 100;
          
          console.log(`Feasibility progress for ${set.id}: ${newProgress}%`);
          
          onUpdateProtocolSet(set.id, {
            feasibilityProgress: newProgress,
            feasibilityStatus: isComplete ? 'complete' : 'processing'
          });

          if (isComplete) {
            clearInterval(feasibilityInterval);
          }
        }, 300);
        intervals.push(feasibilityInterval);
      }
    });

    // Check completion status every 500ms
    const checkCompleteInterval = window.setInterval(() => {
      processingSets.forEach(set => {
        const hasProtocolDoc = !!set.protocolDoc;
        const hasFeasibilityDoc = !!set.feasibilityDoc;
        const hasTextInput = !!set.textInput;
        
        const protocolComplete = (hasProtocolDoc || hasTextInput) ? set.protocolProgress >= 100 : true;
        const feasibilityComplete = hasFeasibilityDoc ? set.feasibilityProgress >= 100 : true;
        
        if (protocolComplete && feasibilityComplete && !set.isComplete) {
          console.log(`Marking set ${set.id} as complete`);
          onUpdateProtocolSet(set.id, { isComplete: true });
        }
      });
    }, 500);
    intervals.push(checkCompleteInterval);

    return () => {
      console.log('Cleaning up intervals');
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [processingSets, onUpdateProtocolSet]);

  const [open, setOpen] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState('');

  const handleRemoveSet = (setId: string) => {
    setSelectedSetId(setId);
    setOpen(true);
  };

  const confirmRemoveSet = () => {
    if (selectedSetId) {
      onRemoveSet(selectedSetId);
      setOpen(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Animated Background Elements - Very Subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(40, 68, 151, 0.05)' }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-[32rem] h-[32rem] rounded-full blur-3xl"
          style={{ background: 'rgba(53, 189, 212, 0.04)' }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.12, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col">
        <div className="w-[90%] mx-auto px-8 pt-8 pb-12">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#284497] transition-colors group"
            >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Home</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-[#284497] font-medium">Dashboard</span>
            </button>
          </motion.div>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex items-start justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl text-[#061e47] mb-2">Protocol Dashboard</h1>
              <p className="text-gray-600">
                Manage your protocol sets and view Study Ask, Golden Site Profile, and Site Scorecards.
              </p>
            </div>
            
            {/* Intuitive Search Bar */}
            {protocolSets.length > 0 && !showEmptyDashboard && (
              <div className="relative min-w-[400px]">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by protocol number or sponsor name.."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#284497]/20 focus:border-[#284497] transition-all text-sm bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md relative z-0"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-auto"
                  >
                    <SearchX className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
            )}
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {protocolSets.length === 0 || showEmptyDashboard ? (
              /* Empty State */
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8">
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 mb-6">
                    <FolderOpen className="h-10 w-10 text-[#284497]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#061e47] mb-2">
                    No Previously Uploaded Documents
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    You haven't uploaded any protocol documents yet. Start by uploading a Protocol Document and Feasibility Questionnaire from the home page.
                  </p>
                  <Button
                    onClick={onBackToLanding}
                    className="bg-gradient-to-r from-[#284497] to-[#35bdd4] hover:from-[#1e3a5f] hover:to-[#2c8fa3] text-white"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go to Home & Upload Documents
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Processing Sets Section */}
                {processingSets.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 text-[#35bdd4] animate-spin" />
                          <h2 className="text-xl font-semibold text-[#061e47]">
                            Processing
                          </h2>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {processingSets.length} protocol set{processingSets.length !== 1 ? 's' : ''} currently processing
                        </p>
                      </div>

                      {/* List */}
                      <div className="space-y-3">
                        {processingSets.map((set, index) => (
                          <motion.div
                            key={set.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-xl p-5 border border-blue-200/70 transition-all duration-300"
                          >
                            <div className="flex items-start gap-4">
                              {/* Icon */}
                              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-[#284497]/10 to-[#35bdd4]/10 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 text-[#35bdd4] animate-spin" />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0 space-y-3">
                                <div>
                                  <h3 className="font-semibold text-[#061e47] mb-1">
                                    Processing Analysis...
                                  </h3>
                                  <div className="flex items-center gap-4 text-xs text-gray-600">
                                    {set.protocolDoc && (
                                      <div className="flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5" />
                                        <span className="truncate max-w-[200px]">{set.protocolDoc.name}</span>
                                      </div>
                                    )}
                                    {set.textInput && (
                                      <div className="flex items-center gap-1.5">
                                        <AlignLeft className="h-3.5 w-3.5" />
                                        <span>Text Input</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                      <Calendar className="h-3.5 w-3.5" />
                                      <span>{formatDate(set.addedAt)}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Combined Progress Bar */}
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className={`font-medium ${
                                      set.isComplete ? 'text-[#40b54d]' : 
                                      (set.protocolStatus === 'processing' || set.feasibilityStatus === 'processing') ? 'text-[#35bdd4]' : 
                                      'text-gray-500'
                                    }`}>
                                      {set.isComplete ? 'Complete' : 
                                       (set.protocolStatus === 'processing' || set.feasibilityStatus === 'processing') ? 'Processing...' : 
                                       'Waiting'}
                                    </span>
                                    <span className="font-bold text-[#284497]">
                                      {Math.round((set.protocolProgress + set.feasibilityProgress) / 2)}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-300 ease-out rounded-full ${
                                        set.isComplete
                                          ? 'bg-[#40b54d]' 
                                          : 'bg-gradient-to-r from-[#284497] to-[#35bdd4]'
                                      }`}
                                      style={{ width: `${(set.protocolProgress + set.feasibilityProgress) / 2}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => handleRemoveSet(set.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Completed Sets Section */}
                {sortedCompletedSets.length > 0 && (
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="border-b border-gray-200 pb-3">
                        <div className="flex items-center justify-between">
                          <h2 className="font-semibold text-[#061e47]" style={{ fontSize: '1.25rem' }}>Completed Protocols</h2>
                          <p className="text-sm text-gray-600">
                            {searchTerm ? `Found ${filteredCompletedSets.length} of ${sortedCompletedSets.length} protocols processed` : `${filteredCompletedSets.length} of ${sortedCompletedSets.length} protocols processed`}
                          </p>
                        </div>
                      </div>

                      {/* Table */}
                      {filteredCompletedSets.length === 0 ? (
                        /* No Search Results State */
                        <div className="text-center py-16">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-500/10 to-gray-600/10 mb-6"
                          >
                            <SearchX className="h-10 w-10 text-gray-400" />
                          </motion.div>
                          <h3 className="text-xl font-semibold text-[#061e47] mb-2">
                            No Results Found
                          </h3>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            We couldn't find any protocols matching "<span className="font-semibold text-[#284497]">{searchTerm}</span>". Try adjusting your search terms or clear the search to see all protocols.
                          </p>
                          <Button
                            onClick={() => setSearchTerm('')}
                            variant="outline"
                            className="border-[#284497] text-[#284497] hover:bg-[#284497]/5"
                          >
                            <SearchX className="h-4 w-4 mr-2" />
                            Clear Search
                          </Button>
                        </div>
                      ) : (
                      <div>
                        <table className="w-full table-fixed">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-3 text-sm font-semibold text-[#061e47] w-[140px]">
                                Protocol Number
                              </th>
                              <th className="text-left py-3 px-3 text-sm font-semibold text-[#061e47] w-[14%]">
                                Sponsor Name
                              </th>
                              <th className="text-left py-3 px-3 text-sm font-semibold text-[#061e47] w-[16%]">
                                Protocol Doc
                              </th>
                              <th className="text-left py-3 px-3 text-sm font-semibold text-[#061e47] w-[16%]">
                                Feasibility Doc
                              </th>
                              <th 
                                className="text-left py-3 px-3 text-sm font-semibold text-[#061e47] cursor-pointer hover:text-[#284497] transition-colors select-none group w-[15%]"
                                onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span>Last Updated</span>
                                  {sortOrder === 'newest' ? (
                                    <ArrowDown className="h-4 w-4 text-[#284497] group-hover:scale-110 transition-transform" />
                                  ) : (
                                    <ArrowUp className="h-4 w-4 text-[#284497] group-hover:scale-110 transition-transform" />
                                  )}
                                </div>
                              </th>
                              <th className="text-right py-3 px-3 text-sm font-semibold text-[#061e47] w-[180px]">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCompletedSets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((set, index) => {
                              const protocolIndex = protocolSets.findIndex(s => s.id === set.id);
                              const protocolNumber = getProtocolNumber(protocolIndex);
                              const sponsorName = getSponsorName(protocolIndex);
                              const protocolDocName = getProtocolDocName(protocolNumber);
                              const feasibilityDocName = getFeasibilityDocName(protocolNumber);
                              
                              return (
                                <motion.tr
                                  key={set.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  className="border-b border-gray-100 last:border-b-0 hover:bg-blue-50/30 transition-colors group"
                                >
                                  <td className="py-4 px-3">
                                    <span className="font-semibold text-[rgb(54,65,83)] text-sm leading-tight block max-w-[130px]">
                                      {protocolIndex === 2 ? '-' : protocolNumber}
                                    </span>
                                  </td>
                                  <td className="py-4 px-3">
                                    <div className="text-sm text-gray-700 leading-tight">
                                      {sponsorName}
                                    </div>
                                  </td>
                                  <td className="py-4 px-3">
                                    {set.protocolDoc ? (
                                      <button 
                                        onClick={() => {
                                          // Create a mock download link
                                          const blob = new Blob(['Protocol Document Content'], { type: 'application/pdf' });
                                          const url = URL.createObjectURL(blob);
                                          const a = document.createElement('a');
                                          a.href = url;
                                          a.download = protocolDocName;
                                          a.click();
                                          URL.revokeObjectURL(url);
                                        }}
                                        className="flex items-start gap-1.5 text-left cursor-pointer group/doc w-full max-w-full"
                                      >
                                        <FileText className="h-4 w-4 text-[#284497] flex-shrink-0 mt-0.5" />
                                        <span className="text-xs text-[#284497] underline leading-[1.3] line-clamp-2 break-words hover:text-[#1e3a5f] transition-colors min-w-0">
                                          {protocolDocName}
                                        </span>
                                      </button>
                                    ) : (
                                      <span className="text-sm text-gray-400">-</span>
                                    )}
                                  </td>
                                  <td className="py-4 px-3">
                                    {set.feasibilityDoc ? (
                                      <button 
                                        onClick={() => {
                                          // Create a mock download link
                                          const blob = new Blob(['Feasibility Document Content'], { type: 'application/pdf' });
                                          const url = URL.createObjectURL(blob);
                                          const a = document.createElement('a');
                                          a.href = url;
                                          a.download = feasibilityDocName;
                                          a.click();
                                          URL.revokeObjectURL(url);
                                        }}
                                        className="flex items-start gap-1.5 text-left cursor-pointer group/doc w-full max-w-full"
                                      >
                                        <FileText className="h-4 w-4 text-[#284497] flex-shrink-0 mt-0.5" />
                                        <span className="text-xs text-[#284497] underline leading-[1.3] line-clamp-2 break-words hover:text-[#1e3a5f] transition-colors min-w-0">
                                          {feasibilityDocName}
                                        </span>
                                      </button>
                                    ) : (
                                      <span className="text-sm text-gray-400">-</span>
                                    )}
                                  </td>
                                  <td className="py-4 px-3">
                                    <div className="flex items-start gap-1.5 text-xs text-gray-600">
                                      <Calendar className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                                      <span className="leading-[1.3] break-words min-w-0">{formatDate(set.addedAt)}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-3">
                                    <div className="flex items-center justify-end gap-2">
                                      <Button
                                        onClick={() => handleViewProfile(set.id)}
                                        variant="default"
                                        size="sm"
                                        className="h-8 px-3 text-xs bg-gradient-to-r from-[#284497] to-[#35bdd4] hover:from-[#1e3a5f] hover:to-[#2c8fa3] text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                                      >
                                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                                        View Study Ask
                                      </Button>
                                      <Button
                                        onClick={() => handleRemoveSet(set.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </td>
                                </motion.tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      )}

                      {/* Pagination */}
                      {filteredCompletedSets.length > itemsPerPage && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCompletedSets.length)} of {filteredCompletedSets.length} results
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 text-xs disabled:opacity-50"
                            >
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Previous
                            </Button>
                            <span className="text-sm text-gray-600 px-2">
                              Page {currentPage} of {Math.ceil(filteredCompletedSets.length / itemsPerPage)}
                            </span>
                            <Button
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage * itemsPerPage >= filteredCompletedSets.length}
                              variant="outline"
                              size="sm"
                              className="h-8 px-3 text-xs disabled:opacity-50"
                            >
                              Next
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Remove Set Confirmation Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle>Remove Protocol Set</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to remove this protocol set? This action cannot be undone and all associated data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-l-md">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemoveSet}
              className="bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}