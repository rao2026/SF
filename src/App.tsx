import { useState, useCallback, useEffect } from 'react';
import { LandingView } from './components/dashboard/LandingView';
import { GoldenSiteProfileView } from './components/dashboard/GoldenSiteProfileView';
import { DashboardView } from './components/dashboard/DashboardView';
import { LoadingModal } from './components/LoadingModal';
import type { ProtocolInput, ProcessingProtocolSet } from './types/index';
import { Toaster } from './components/ui/sonner';

// Main Application Component - Site Feasibility Dashboard
type View = 'landing' | 'dashboard' | 'goldenProfile';

// Mock processed protocol sets for demonstration
const mockProtocolSets: ProcessingProtocolSet[] = [
  {
    id: 'mock-set-1',
    protocolDoc: { name: 'COPD_Phase4_Protocol_v2.3.pdf', file: new File([], 'COPD_Phase4_Protocol_v2.3.pdf') },
    feasibilityDoc: { name: 'Site_Feasibility_Form_COPD.pdf', file: new File([], 'Site_Feasibility_Form_COPD.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now(), // Today, current time
  },
  {
    id: 'mock-set-2',
    protocolDoc: { name: 'Oncology_Immunotherapy_Trial_Protocol.pdf', file: new File([], 'Oncology_Immunotherapy_Trial_Protocol.pdf') },
    feasibilityDoc: { name: 'Oncology_Site_Assessment.pdf', file: new File([], 'Oncology_Site_Assessment.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
  },
  {
    id: 'mock-set-3',
    protocolDoc: { name: 'Cardiovascular_Phase3_RCT.pdf', file: new File([], 'Cardiovascular_Phase3_RCT.pdf') },
    feasibilityDoc: { name: 'CV_Site_Feasibility_Assessment.pdf', file: new File([], 'CV_Site_Feasibility_Assessment.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
  },
  {
    id: 'mock-set-4',
    protocolDoc: { name: 'Diabetes_Type2_Prevention_Study.pdf', file: new File([], 'Diabetes_Type2_Prevention_Study.pdf') },
    feasibilityDoc: { name: 'Feasibility_Questionnaire_DM2.pdf', file: new File([], 'Feasibility_Questionnaire_DM2.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
  },
  {
    id: 'mock-set-5',
    protocolDoc: { name: 'Neurology_Alzheimers_Phase2.pdf', file: new File([], 'Neurology_Alzheimers_Phase2.pdf') },
    feasibilityDoc: { name: 'Neurology_Site_Capability.pdf', file: new File([], 'Neurology_Site_Capability.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 12 * 24 * 60 * 60 * 1000, // 12 days ago
  },
  {
    id: 'mock-set-6',
    protocolDoc: { name: 'Rheumatology_Arthritis_Study.pdf', file: new File([], 'Rheumatology_Arthritis_Study.pdf') },
    feasibilityDoc: { name: 'RA_Feasibility_Form.pdf', file: new File([], 'RA_Feasibility_Form.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
  },
  {
    id: 'mock-set-7',
    protocolDoc: { name: 'Dermatology_Psoriasis_Protocol.pdf', file: new File([], 'Dermatology_Psoriasis_Protocol.pdf') },
    feasibilityDoc: { name: 'Derma_Site_Assessment.pdf', file: new File([], 'Derma_Site_Assessment.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 18 * 24 * 60 * 60 * 1000, // 18 days ago
  },
  {
    id: 'mock-set-8',
    protocolDoc: { name: 'Infectious_Disease_Vaccine_Trial.pdf', file: new File([], 'Infectious_Disease_Vaccine_Trial.pdf') },
    feasibilityDoc: { name: 'Vaccine_Site_Feasibility.pdf', file: new File([], 'Vaccine_Site_Feasibility.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 21 * 24 * 60 * 60 * 1000, // 21 days ago
  },
  {
    id: 'mock-set-9',
    protocolDoc: { name: 'Gastroenterology_IBD_Study.pdf', file: new File([], 'Gastroenterology_IBD_Study.pdf') },
    feasibilityDoc: { name: 'GI_Site_Questionnaire.pdf', file: new File([], 'GI_Site_Questionnaire.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 24 * 24 * 60 * 60 * 1000, // 24 days ago
  },
  {
    id: 'mock-set-10',
    protocolDoc: { name: 'Endocrinology_Thyroid_Protocol.pdf', file: new File([], 'Endocrinology_Thyroid_Protocol.pdf') },
    feasibilityDoc: { name: 'Endo_Feasibility_Assessment.pdf', file: new File([], 'Endo_Feasibility_Assessment.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 27 * 24 * 60 * 60 * 1000, // 27 days ago
  },
  {
    id: 'mock-set-11',
    protocolDoc: { name: 'Hematology_Leukemia_Phase1.pdf', file: new File([], 'Hematology_Leukemia_Phase1.pdf') },
    feasibilityDoc: { name: 'Hematology_Site_Form.pdf', file: new File([], 'Hematology_Site_Form.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  },
  {
    id: 'mock-set-12',
    protocolDoc: { name: 'Nephrology_CKD_Trial.pdf', file: new File([], 'Nephrology_CKD_Trial.pdf') },
    feasibilityDoc: { name: 'Nephro_Site_Capability.pdf', file: new File([], 'Nephro_Site_Capability.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 33 * 24 * 60 * 60 * 1000, // 33 days ago
  },
  {
    id: 'mock-set-13',
    protocolDoc: { name: 'Ophthalmology_Glaucoma_Study.pdf', file: new File([], 'Ophthalmology_Glaucoma_Study.pdf') },
    feasibilityDoc: { name: 'Ophthal_Feasibility.pdf', file: new File([], 'Ophthal_Feasibility.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 36 * 24 * 60 * 60 * 1000, // 36 days ago
  },
  {
    id: 'mock-set-14',
    protocolDoc: { name: 'Pulmonology_Asthma_Protocol.pdf', file: new File([], 'Pulmonology_Asthma_Protocol.pdf') },
    feasibilityDoc: { name: 'Pulmo_Site_Assessment.pdf', file: new File([], 'Pulmo_Site_Assessment.pdf') },
    protocolProgress: 100,
    feasibilityProgress: 100,
    protocolStatus: 'complete',
    feasibilityStatus: 'complete',
    isComplete: true,
    addedAt: Date.now() - 40 * 24 * 60 * 60 * 1000, // 40 days ago
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [currentProtocol, setCurrentProtocol] = useState<ProtocolInput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing your request');
  const [protocolSets, setProtocolSets] = useState<ProcessingProtocolSet[]>(mockProtocolSets);
  const [showEmptyDashboard, setShowEmptyDashboard] = useState(false); // POC: Toggle for empty dashboard
  const [goldenProfileInitialView, setGoldenProfileInitialView] = useState<'studyAsk' | 'goldenSite' | 'scorecard'>('studyAsk'); // Track which section to show

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleProtocolSubmit = async (protocol: ProtocolInput, targetView: 'studyAsk' | 'goldenSite' | 'scorecard' = 'studyAsk') => {
    setIsProcessing(true);
    
    // Set loading message based on target view
    if (targetView === 'scorecard') {
      setLoadingMessage('Loading Sites...');
    } else {
      setLoadingMessage('Processing your request');
    }
    
    // Simulate processing time for POC (3-5 seconds for scorecard)
    const delay = targetView === 'scorecard' ? 3000 + Math.random() * 2000 : 2000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    setCurrentProtocol(protocol);
    setGoldenProfileInitialView(targetView);
    setCurrentView('goldenProfile');
    
    setIsProcessing(false);
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setCurrentProtocol(null);
  };

  const handleViewDashboard = () => {
    setShowEmptyDashboard(false); // Reset to show actual data
    setCurrentView('dashboard');
  };

  // POC: Handler for viewing empty dashboard
  const handleViewEmptyDashboard = () => {
    setShowEmptyDashboard(true); // Flag to show empty state
    setCurrentView('dashboard');
  };

  const handleViewProfile = (setId: string) => {
    // In real app, load the specific protocol set data
    // For now, use mock data
    handleProtocolSubmit({
      studyTitle: "COPD and Suboptimal Inspiratory Flow Rate (PIFR-2)",
      studyPhase: "Phase 4",
      therapeuticAreas: ["Respiratory", "COPD"],
      primaryIndication: "Chronic Obstructive Pulmonary Disease (COPD)",
      targetEnrollment: 450,
      enrollmentDuration: "18 months",
      targetStartDate: "Q2 2025",
      countries: ["United States", "United Kingdom", "Germany", "Poland"],
      structuredStudyAskProfile: "Archetype: Prophylactic-Vaccine-RCT | Phase: III | Design: Double-Blind-Placebo-Controlled | Population: Healthy-Adults | Setting: Multi-Center-International | Primary-Endpoint: Efficacy-Safety | Enrollment-Model: Parallel-Assignment | Intervention-Type: Biological-Preventive | Disease-Stage: Pre-Exposure-Prevention | Complexity: Standard-Protocol",
      humanComprehensibleLabel: "Phase 4 | COPD | Device Comparison | Gold 3/4 Population",
      statusFlags: {
        study_ask_generated: true,
        missing_information: false,
        requires_review: true
      },
      inclusionCriteria: [
        "Healthy adults 18-75 years",
        "No recent pathogen vaccination",
        "Compliant with study schedule"
      ],
      exclusionCriteria: [
        "Immunocompromised status",
        "Severe vaccine allergies",
        "Pregnant or breastfeeding"
      ]
    }, 'studyAsk'); // Navigate to Study Ask Profile
  };

  const handleRemoveSet = (setId: string) => {
    setProtocolSets(prev => prev.filter(set => set.id !== setId));
  };

  // Update a specific protocol set with partial updates
  const handleUpdateProtocolSet = useCallback((setId: string, updates: Partial<ProcessingProtocolSet>) => {
    setProtocolSets(prev => prev.map(set => 
      set.id === setId ? { ...set, ...updates } : set
    ));
  }, []);

  // Update protocol sets from LandingView - use useCallback to prevent infinite loop
  const handleProtocolSetsUpdate = useCallback((sets: ProcessingProtocolSet[]) => {
    setProtocolSets(prev => {
      // Keep mock sets and merge with new sets from LandingView
      const mockIds = new Set([
        'mock-set-1', 'mock-set-2', 'mock-set-3', 'mock-set-4', 'mock-set-5',
        'mock-set-6', 'mock-set-7', 'mock-set-8', 'mock-set-9', 'mock-set-10',
        'mock-set-11', 'mock-set-12', 'mock-set-13', 'mock-set-14'
      ]);
      const preservedMockSets = prev.filter(s => mockIds.has(s.id));
      
      // Filter out any duplicates from the new sets
      const newSetsMap = new Map(sets.map(s => [s.id, s]));
      const mergedSets = [...preservedMockSets];
      
      // Add or update sets from LandingView
      sets.forEach(set => {
        const existingIndex = mergedSets.findIndex(s => s.id === set.id);
        if (existingIndex >= 0) {
          mergedSets[existingIndex] = set;
        } else {
          mergedSets.push(set);
        }
      });
      
      return mergedSets;
    });
  }, []);

  // Show Golden Site Profile View
  if (currentView === 'goldenProfile' && currentProtocol) {
    return (
      <>
        <Toaster position="top-right" />
        <LoadingModal isOpen={isProcessing} message={loadingMessage} />
        <GoldenSiteProfileView
          protocol={currentProtocol}
          onBack={handleBackToLanding}
          onDashboardClick={handleViewDashboard}
          initialView={goldenProfileInitialView}
        />
      </>
    );
  }

  // Show Dashboard View
  if (currentView === 'dashboard') {
    return (
      <>
        <Toaster position="top-right" />
        <LoadingModal isOpen={isProcessing} message={loadingMessage} />
        <DashboardView
          protocolSets={protocolSets}
          onViewProfile={handleViewProfile}
          onRemoveSet={handleRemoveSet}
          onDashboardClick={handleViewDashboard}
          onBackToLanding={handleBackToLanding}
          onUpdateProtocolSet={handleUpdateProtocolSet}
          showEmptyDashboard={showEmptyDashboard} // POC: Pass the flag to DashboardView
        />
      </>
    );
  }

  // Show Landing View (Homepage)
  return (
    <>
      <Toaster position="top-right" />
      <LoadingModal isOpen={isProcessing} message={loadingMessage} />
      <LandingView 
        onSubmit={handleProtocolSubmit}
        onProtocolSetsUpdate={handleProtocolSetsUpdate}
        onDashboardClick={handleViewDashboard}
        existingProtocolSetsCount={protocolSets.length}
        onEmptyDashboardClick={handleViewEmptyDashboard}
      />
    </>
  );
}