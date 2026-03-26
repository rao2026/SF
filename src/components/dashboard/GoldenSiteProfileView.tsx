import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Home,
  FileText,
  Award,
  Users,
  Activity,
  Building2,
  ShieldCheck,
  Zap,
  BarChart3,
  Download,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Eye,
  CheckCircle2,
  Edit2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Filter,
  TrendingUp,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { BulletedEditList } from "../BulletedEditList";
import { ProtocolInput } from "../../types";
import { Header } from "../Header";
import { ConfirmationDialog } from "../ConfirmationDialog";
import { Badge } from "../ui/badge";
import { generateSiteFeasibilityPDF } from "../../utils/generatePDF";
import { generateGoldenSiteProfilePDF } from "../../utils/generateGoldenSiteProfilePDF";
import { generateStudyAskPDF } from "../../utils/generateStudyAskPDF";
import { Progress } from "../ui/progress";
import { SiteSelectionScorecard } from "./SiteSelectionScorecard";
import { LoadingModal } from "../LoadingModal";
import { toast } from "sonner@2.0.3";

interface GoldenSiteProfileViewProps {
  protocol: ProtocolInput;
  onBack: () => void;
  onDashboardClick?: () => void;
  initialView?: 'studyAsk' | 'goldenSite' | 'scorecard'; // Control which section to show initially
}

// Full-screen Golden Site Profile Component
function GoldenSiteProfileFullScreen({
  protocol,
  onClose,
  onBack,
  onDashboardClick,
  showScorecard,
  setShowScorecard,
  handleViewScorecards,
  showNavigationDialog,
  setShowNavigationDialog,
  pendingNavigation,
  setPendingNavigation,
  confirmNavigation,
  loadingScorecards,
  setLoadingScorecards,
}: {
  protocol: ProtocolInput;
  onClose: () => void;
  onBack: () => void;
  onDashboardClick?: () => void;
  showScorecard: boolean;
  setShowScorecard: (show: boolean) => void;
  handleViewScorecards: () => void;
  showNavigationDialog: boolean;
  setShowNavigationDialog: (show: boolean) => void;
  pendingNavigation: 'back' | 'scorecards' | 'goldenSite' | 'studyAsk' | 'viewGSP' | null;
  setPendingNavigation: (nav: 'back' | 'scorecards' | 'goldenSite' | 'studyAsk' | 'viewGSP' | null) => void;
  confirmNavigation: () => void;
  loadingScorecards: boolean;
  setLoadingScorecards: (loading: boolean) => void;
}) {
  const [selectedFilters, setSelectedFilters] = useState<
    string[]
  >(["All"]);
  const [siteExperienceFilter, setSiteExperienceFilter] = useState<
    "Experienced Site & PI" | "Limited Site Experience" | "Limited PI Experience"
  >("Experienced Site & PI");

  const toggleFilter = (filter: string) => {
    if (filter === "All") {
      setSelectedFilters(["All"]);
    } else {
      const newFilters = selectedFilters.includes(filter)
        ? selectedFilters.filter((f) => f !== filter)
        : [
            ...selectedFilters.filter((f) => f !== "All"),
            filter,
          ];

      setSelectedFilters(
        newFilters.length === 0 ? ["All"] : newFilters,
      );
    }
  };

  const shouldShowPriority = (priority: string) => {
    if (selectedFilters.includes("All")) return true;
    return selectedFilters.includes(priority);
  };

  // Calculate the number of active priorities (excluding 'All')
  const activePriorities = selectedFilters.includes("All")
    ? 3
    : selectedFilters.length;

  // Determine grid class based on active priorities
  const getGridClass = () => {
    if (activePriorities === 1) return "grid-cols-1";
    if (activePriorities === 2) return "grid-cols-2";
    return "grid-cols-3";
  };

  // Helper function to reset all full-screen edit states (no edit functionality in Golden Site Profile)
  const resetAllFsEditStates = () => {
    // No edit states to reset
  };

  // Default content arrays
  const defaultGspSiteCriticalItems = [
    "PI/sub-I with prior COPD trial oversight experience",
    "PI comfortable managing CV events & respiratory exacerbations"
  ];
  const defaultGspSiteStrongItems = [
    "Prior event-driven outcomes trial PI/Sub-I experience",
    "Documented spirometry oversight experience (≥5 respiratory trials)",
    "Established referral relationships with cardiology and pulmonology clinics"
  ];
  const defaultGspSiteNiceItems = [
    "Prior strong sponsor relationship with quality metrics above network median",
    "PI publications in COPD or cardiopulmonary outcomes"
  ];

  const defaultGspStaffingCriticalItems = [
    "Dedicated coordinator capacity mapped to a 30-month enrollment window",
    "Staff trained on ATS/ERS spirometry with source-level handling",
    "24/7 SAE intake pathway for hospitalizations and acute care",
    "Long-term retention plan supporting up to 3-year follow-up"
  ];
  const defaultGspStaffingStrongItems = [
    "Recruitment lead with COPD database–driven pre-screen workflow",
    "Weekly early-screen QC for spirometry and eligibility",
    "Data entry ≥90% within 5 days; query turnaround <7 days"
  ];
  const defaultGspStaffingNiceItems = [
    "Dedicated retention specialist for decentralized or hybrid follow-up",
    "Bilingual staff supporting older COPD populations",
    "Cross-trained cardiac event documentation staff for MI, heart failure, and cardiopulmonary death adjudication"
  ];

  const defaultGspPopulationCriticalItems = [
    "Access to ≥300 COPD patients with recent PFTs showing airflow limitation",
    "History of screening/enrollment success in Phase 3 COPD trials"
  ];
  const defaultGspPopulationStrongItems = [
    "Catchment area with underserved/diverse patient populations",
    "Enrollment performance above 75th percentile in recent respiratory trials"
  ];
  const defaultGspPopulationNiceItems = [
    "Active patient registry or database with opt-in for research outreach",
    "COPD-specific support programs or clinics with repeat visit patterns"
  ];

  const defaultGspFacilitiesCriticalItems = [
    "Calibrated spirometry equipment and PIFR instrumentation",
    "On-site or proximate emergency response capability (AED, crash cart, O₂ on demand)"
  ];
  const defaultGspFacilitiesStrongItems = [
    "On-site PFT lab or access to lung function lab <10 min away",
    "24-hour emergency contact capability for CV or respiratory AEs"
  ];
  const defaultGspFacilitiesNiceItems = [
    "Dedicated exam rooms for research with source document space",
    "Secure storage for confidential materials and investigational product"
  ];

  const defaultGspOrgExpectationsItems = [
    "Startup cycle time ≤3 months achievable",
    "Contract/budget execution supports 4-year study duration",
    "Escalation governance for enrollment shortfalls within 30 days",
    "CEC package prep with <30-day submission and <20% query rate",
    "Proven performance in decentralized/hybrid respiratory trials",
    "Centralized advertising activation within 2 weeks of greenlight"
  ];

  // Content state arrays for editable sections - Site & Investigator Profile
  const [gspSiteCriticalItems, setGspSiteCriticalItems] = useState(defaultGspSiteCriticalItems);
  const [gspSiteStrongItems, setGspSiteStrongItems] = useState(defaultGspSiteStrongItems);
  const [gspSiteNiceItems, setGspSiteNiceItems] = useState(defaultGspSiteNiceItems);

  // Staffing & Operational Capacity
  const [gspStaffingCriticalItems, setGspStaffingCriticalItems] = useState(defaultGspStaffingCriticalItems);
  const [gspStaffingStrongItems, setGspStaffingStrongItems] = useState(defaultGspStaffingStrongItems);
  const [gspStaffingNiceItems, setGspStaffingNiceItems] = useState(defaultGspStaffingNiceItems);

  // Patient Population & Enrollment Performance
  const [gspPopulationCriticalItems, setGspPopulationCriticalItems] = useState(defaultGspPopulationCriticalItems);
  const [gspPopulationStrongItems, setGspPopulationStrongItems] = useState(defaultGspPopulationStrongItems);
  const [gspPopulationNiceItems, setGspPopulationNiceItems] = useState(defaultGspPopulationNiceItems);

  // Clinical Facilities & Capabilities
  const [gspFacilitiesCriticalItems, setGspFacilitiesCriticalItems] = useState(defaultGspFacilitiesCriticalItems);
  const [gspFacilitiesStrongItems, setGspFacilitiesStrongItems] = useState(defaultGspFacilitiesStrongItems);
  const [gspFacilitiesNiceItems, setGspFacilitiesNiceItems] = useState(defaultGspFacilitiesNiceItems);

  // Other Organisation Level Expectations
  const [gspOrgExpectationsItems, setGspOrgExpectationsItems] = useState(defaultGspOrgExpectationsItems);

  // Load persisted data from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('goldenSiteProfileData');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Site & Investigator Profile
        if (parsed.gspSiteCriticalItems) setGspSiteCriticalItems(parsed.gspSiteCriticalItems);
        if (parsed.gspSiteStrongItems) setGspSiteStrongItems(parsed.gspSiteStrongItems);
        if (parsed.gspSiteNiceItems) setGspSiteNiceItems(parsed.gspSiteNiceItems);
        
        // Staffing & Operational Capacity
        if (parsed.gspStaffingCriticalItems) setGspStaffingCriticalItems(parsed.gspStaffingCriticalItems);
        if (parsed.gspStaffingStrongItems) setGspStaffingStrongItems(parsed.gspStaffingStrongItems);
        if (parsed.gspStaffingNiceItems) setGspStaffingNiceItems(parsed.gspStaffingNiceItems);
        
        // Patient Population & Enrollment Performance
        if (parsed.gspPopulationCriticalItems) setGspPopulationCriticalItems(parsed.gspPopulationCriticalItems);
        if (parsed.gspPopulationStrongItems) setGspPopulationStrongItems(parsed.gspPopulationStrongItems);
        if (parsed.gspPopulationNiceItems) setGspPopulationNiceItems(parsed.gspPopulationNiceItems);
        
        // Clinical Facilities & Capabilities
        if (parsed.gspFacilitiesCriticalItems) setGspFacilitiesCriticalItems(parsed.gspFacilitiesCriticalItems);
        if (parsed.gspFacilitiesStrongItems) setGspFacilitiesStrongItems(parsed.gspFacilitiesStrongItems);
        if (parsed.gspFacilitiesNiceItems) setGspFacilitiesNiceItems(parsed.gspFacilitiesNiceItems);
        
        // Other Organisation Level Expectations
        if (parsed.gspOrgExpectationsItems) setGspOrgExpectationsItems(parsed.gspOrgExpectationsItems);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  }, []);

  // Backup original data for cancel functionality
  const [originalGspSiteCriticalItems, setOriginalGspSiteCriticalItems] = useState<string[]>([]);
  const [originalGspSiteStrongItems, setOriginalGspSiteStrongItems] = useState<string[]>([]);
  const [originalGspSiteNiceItems, setOriginalGspSiteNiceItems] = useState<string[]>([]);
  
  const [originalGspStaffingCriticalItems, setOriginalGspStaffingCriticalItems] = useState<string[]>([]);
  const [originalGspStaffingStrongItems, setOriginalGspStaffingStrongItems] = useState<string[]>([]);
  const [originalGspStaffingNiceItems, setOriginalGspStaffingNiceItems] = useState<string[]>([]);
  
  const [originalGspPopulationCriticalItems, setOriginalGspPopulationCriticalItems] = useState<string[]>([]);
  const [originalGspPopulationStrongItems, setOriginalGspPopulationStrongItems] = useState<string[]>([]);
  const [originalGspPopulationNiceItems, setOriginalGspPopulationNiceItems] = useState<string[]>([]);
  
  const [originalGspFacilitiesCriticalItems, setOriginalGspFacilitiesCriticalItems] = useState<string[]>([]);
  const [originalGspFacilitiesStrongItems, setOriginalGspFacilitiesStrongItems] = useState<string[]>([]);
  const [originalGspFacilitiesNiceItems, setOriginalGspFacilitiesNiceItems] = useState<string[]>([]);
  
  const [originalGspOrgExpectationsItems, setOriginalGspOrgExpectationsItems] = useState<string[]>([]);

  // Edit handlers - directly enter edit mode without confirmation
  const handleEditClick = (
    section: 'gspFsSite' | 'gspFsStaffing' | 'gspFsPopulation' | 'gspFsFacilities' | 'gspFsOrgExpectations',
    sectionName: string
  ) => {
    // Backup original data
    switch (section) {
      case "gspFsSite":
        setOriginalGspSiteCriticalItems([...gspSiteCriticalItems]);
        setOriginalGspSiteStrongItems([...gspSiteStrongItems]);
        setOriginalGspSiteNiceItems([...gspSiteNiceItems]);
        setEditingGspFsSite(true);
        break;
      case "gspFsStaffing":
        setOriginalGspStaffingCriticalItems([...gspStaffingCriticalItems]);
        setOriginalGspStaffingStrongItems([...gspStaffingStrongItems]);
        setOriginalGspStaffingNiceItems([...gspStaffingNiceItems]);
        setEditingGspFsStaffing(true);
        break;
      case "gspFsPopulation":
        setOriginalGspPopulationCriticalItems([...gspPopulationCriticalItems]);
        setOriginalGspPopulationStrongItems([...gspPopulationStrongItems]);
        setOriginalGspPopulationNiceItems([...gspPopulationNiceItems]);
        setEditingGspFsPopulation(true);
        break;
      case "gspFsFacilities":
        setOriginalGspFacilitiesCriticalItems([...gspFacilitiesCriticalItems]);
        setOriginalGspFacilitiesStrongItems([...gspFacilitiesStrongItems]);
        setOriginalGspFacilitiesNiceItems([...gspFacilitiesNiceItems]);
        setEditingGspFsFacilities(true);
        break;
      case "gspFsOrgExpectations":
        setOriginalGspOrgExpectationsItems([...gspOrgExpectationsItems]);
        setEditingGspFsOrgExpectations(true);
        break;
    }
  };

  // Save changes directly without confirmation
  const handleSaveClick = (
    section: 'gspFsSite' | 'gspFsStaffing' | 'gspFsPopulation' | 'gspFsFacilities' | 'gspFsOrgExpectations',
    sectionName: string
  ) => {
    // Exit edit mode
    switch (section) {
      case "gspFsSite":
        setEditingGspFsSite(false);
        break;
      case "gspFsStaffing":
        setEditingGspFsStaffing(false);
        break;
      case "gspFsPopulation":
        setEditingGspFsPopulation(false);
        break;
      case "gspFsFacilities":
        setEditingGspFsFacilities(false);
        break;
      case "gspFsOrgExpectations":
        setEditingGspFsOrgExpectations(false);
        break;
    }

    // Save all data to localStorage
    try {
      const dataToSave = {
        gspSiteCriticalItems: gspSiteCriticalItems.filter(item => item.trim()),
        gspSiteStrongItems: gspSiteStrongItems.filter(item => item.trim()),
        gspSiteNiceItems: gspSiteNiceItems.filter(item => item.trim()),
        gspStaffingCriticalItems: gspStaffingCriticalItems.filter(item => item.trim()),
        gspStaffingStrongItems: gspStaffingStrongItems.filter(item => item.trim()),
        gspStaffingNiceItems: gspStaffingNiceItems.filter(item => item.trim()),
        gspPopulationCriticalItems: gspPopulationCriticalItems.filter(item => item.trim()),
        gspPopulationStrongItems: gspPopulationStrongItems.filter(item => item.trim()),
        gspPopulationNiceItems: gspPopulationNiceItems.filter(item => item.trim()),
        gspFacilitiesCriticalItems: gspFacilitiesCriticalItems.filter(item => item.trim()),
        gspFacilitiesStrongItems: gspFacilitiesStrongItems.filter(item => item.trim()),
        gspFacilitiesNiceItems: gspFacilitiesNiceItems.filter(item => item.trim()),
        gspOrgExpectationsItems,
      };
      // Update state with filtered items
      setGspSiteCriticalItems(dataToSave.gspSiteCriticalItems);
      setGspSiteStrongItems(dataToSave.gspSiteStrongItems);
      setGspSiteNiceItems(dataToSave.gspSiteNiceItems);
      setGspStaffingCriticalItems(dataToSave.gspStaffingCriticalItems);
      setGspStaffingStrongItems(dataToSave.gspStaffingStrongItems);
      setGspStaffingNiceItems(dataToSave.gspStaffingNiceItems);
      setGspPopulationCriticalItems(dataToSave.gspPopulationCriticalItems);
      setGspPopulationStrongItems(dataToSave.gspPopulationStrongItems);
      setGspPopulationNiceItems(dataToSave.gspPopulationNiceItems);
      setGspFacilitiesCriticalItems(dataToSave.gspFacilitiesCriticalItems);
      setGspFacilitiesStrongItems(dataToSave.gspFacilitiesStrongItems);
      setGspFacilitiesNiceItems(dataToSave.gspFacilitiesNiceItems);
      localStorage.setItem('goldenSiteProfileData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Cancel edit directly without confirmation
  const handleCancelEdit = (section: 'gspFsSite' | 'gspFsStaffing' | 'gspFsPopulation' | 'gspFsFacilities' | 'gspFsOrgExpectations') => {
    // Restore original data and exit edit mode
    switch (section) {
      case "gspFsSite":
        setGspSiteCriticalItems([...originalGspSiteCriticalItems]);
        setGspSiteStrongItems([...originalGspSiteStrongItems]);
        setGspSiteNiceItems([...originalGspSiteNiceItems]);
        setEditingGspFsSite(false);
        break;
      case "gspFsStaffing":
        setGspStaffingCriticalItems([...originalGspStaffingCriticalItems]);
        setGspStaffingStrongItems([...originalGspStaffingStrongItems]);
        setGspStaffingNiceItems([...originalGspStaffingNiceItems]);
        setEditingGspFsStaffing(false);
        break;
      case "gspFsPopulation":
        setGspPopulationCriticalItems([...originalGspPopulationCriticalItems]);
        setGspPopulationStrongItems([...originalGspPopulationStrongItems]);
        setGspPopulationNiceItems([...originalGspPopulationNiceItems]);
        setEditingGspFsPopulation(false);
        break;
      case "gspFsFacilities":
        setGspFacilitiesCriticalItems([...originalGspFacilitiesCriticalItems]);
        setGspFacilitiesStrongItems([...originalGspFacilitiesStrongItems]);
        setGspFacilitiesNiceItems([...originalGspFacilitiesNiceItems]);
        setEditingGspFsFacilities(false);
        break;
      case "gspFsOrgExpectations":
        setGspOrgExpectationsItems([...originalGspOrgExpectationsItems]);
        setEditingGspFsOrgExpectations(false);
        break;
    }
  };

  // Check if any section is currently being edited (no edit mode in Golden Site Profile)
  const isAnyEditMode = () => {
    return false;
  };

  // Handler for navigation with edit mode check
  const handleBackNavigation = () => {
    resetAllFsEditStates();
    onBack();
  };

  // Handler for breadcrumb navigation to Study Ask
  const handleStudyAskNavigation = () => {
    resetAllFsEditStates();
    onClose();
  };

  // Local wrapper for View Site Scorecards that checks full-screen edit states
  const handleLocalViewScorecards = async () => {
    resetAllFsEditStates();
    // If no edit mode in full-screen view, directly navigate to scorecards
    // Bypass parent's handler to avoid double-checking parent edit states
    setLoadingScorecards(true);
    await new Promise(resolve => setTimeout(resolve, 5000));
    setLoadingScorecards(false);
    setShowScorecard(true);
  };

  // Local confirm navigation wrapper to handle 'studyAsk' case and reset edit states
  const handleConfirmNavigation = async () => {
    // Reset all edit states before navigating
    resetAllFsEditStates();

    if (pendingNavigation === 'studyAsk') {
      setShowNavigationDialog(false);
      setPendingNavigation(null);
      onClose();
    } else if (pendingNavigation === 'scorecards') {
      // Navigate to scorecards directly from full-screen view
      setShowNavigationDialog(false);
      setPendingNavigation(null);
      setLoadingScorecards(true);
      await new Promise(resolve => setTimeout(resolve, 5000));
      setLoadingScorecards(false);
      setShowScorecard(true);
    } else {
      // For other cases, use the parent's confirmNavigation
      confirmNavigation();
    }
  };

  // Show scorecard view if requested
  if (showScorecard) {
    return (
      <SiteSelectionScorecard
        onBack={onBack}
        onDashboardClick={onDashboardClick}
        onClose={onClose}
        onGoldenSiteClick={() => setShowScorecard(false)}
        protocolNumber={protocol.protocolNumber}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <Header onDashboardClick={onDashboardClick} />

      {/* Body content wrapper with relative positioning for loading mask */}
      <div className="relative min-h-[calc(100vh-80px)]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "rgba(40, 68, 151, 0.05)" }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-[32rem] h-[32rem] rounded-full blur-3xl"
          style={{ background: "rgba(53, 189, 212, 0.04)" }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.12, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-[90%] mx-auto px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={handleBackNavigation}
                className="flex items-center gap-2 text-gray-600 hover:text-[#284497] transition-colors"
                title="Go to Homepage"
              >
                <Home className="h-4 w-4" />
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={onDashboardClick}
                className="text-gray-600 hover:text-[#284497] transition-colors font-medium"
              >
                Dashboard
              </button>
              <span className="text-gray-400">|</span>
              <span className="text-[#284497] font-semibold">{protocol.studyTitle}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => generateGoldenSiteProfilePDF(protocol.protocolNumber || 'NCT05165485')}
                size="sm"
                title="Export PDF"
                className="flex items-center gap-2 bg-white text-gray-600 hover:text-gray-800 border border-gray-200/60 hover:border-gray-300 hover:bg-gray-50/50 transition-all"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleBackNavigation}
                size="sm"
                title="Analyse New Protocol"
                className="flex items-center gap-2 bg-white text-gray-600 hover:text-gray-800 border border-gray-200/60 hover:border-gray-300 hover:bg-gray-50/50 transition-all"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleStudyAskNavigation}
                size="sm"
                className="flex items-center gap-2 bg-sky-100 text-sky-700 hover:bg-sky-200 hover:text-sky-800 transition-all"
              >
                <FileText className="h-4 w-4" />
                Study Ask Profile
              </Button>
              <Button
                onClick={handleLocalViewScorecards}
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
              >
                <TrendingUp className="h-4 w-4" />
                View Sites
              </Button>
            </div>
          </nav>

          {/* Golden Site Profile Full Screen */}
          <div className="col-span-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-5 space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#061e47]">
                      Golden Site Profile
                    </h2>
                    <p className="text-sm text-gray-600">
                      Ideal site characteristics and
                      requirements for this protocol
                    </p>
                  </div>
                </div>

                {/* Site Experience Filter Toggle with Priority Tabs Below */}
                <div className="flex flex-col gap-2">
                  {/* Hiding main Site Experience filter - keeping only priority tabs */}
                  {/* <div className="flex items-center gap-3">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-lg">
                      {["Experienced Site & PI", "Limited Site Experience", "Limited PI Experience"].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setSiteExperienceFilter(
                            filter as "Experienced Site & PI" | "Limited Site Experience" | "Limited PI Experience"
                          )}
                          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                            siteExperienceFilter === filter
                              ? "bg-[#284497] text-white shadow-sm"
                              : "bg-white/60 text-gray-600 hover:bg-white/90"
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  </div> */}

                  {/* Priority Filter - Card Based */}
                  <div className="flex items-stretch gap-2 mb-2">
                    {[
                      { name: "All", color: null, desc: "All Priorities" },
                      { name: "Critical", color: "green", desc: "Must Have" },
                      { name: "Strong Preference", color: "amber", desc: "Differentiator" },
                      { name: "Nice to Have", color: "blue", desc: "Delight" },
                    ].map((filter) => (
                      <button
                        key={filter.name}
                        onClick={() => toggleFilter(filter.name)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all flex-1 h-[52px] ${
                          selectedFilters.includes(filter.name)
                            ? filter.color === "green"
                              ? "bg-green-50/50 border-green-400 text-green-700 shadow-sm"
                              : filter.color === "amber"
                                ? "bg-amber-50/50 border-amber-400 text-amber-700 shadow-sm"
                                : filter.color === "blue"
                                  ? "bg-blue-50/50 border-blue-400 text-blue-700 shadow-sm"
                                  : "bg-[#284497]/5 border-[#284497] text-[#284497] shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        {filter.color && (
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            filter.color === "green"
                              ? "bg-green-500"
                              : filter.color === "amber"
                                ? "bg-amber-500"
                                : "bg-blue-500"
                          }`}></div>
                        )}
                        <div className="flex flex-col items-start justify-center leading-tight">
                          <span className="text-xs font-bold leading-tight whitespace-nowrap">
                            {filter.name}
                          </span>
                          <span className="text-[10px] opacity-75 font-normal leading-tight whitespace-nowrap">
                            {filter.desc}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Priority-First Horizontal Layout */}
              <div className="grid grid-cols-2 gap-4">
                {/* Site & Investigator Profile */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200/50 p-5 space-y-4 relative"
                  style={{ order: 2 }}
                >
                  {/* Header */}
                  <div className="mb-4 pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-[#061e47] text-[17px]">
                      Site & Investigator Profile
                    </h3>
                  </div>

                  {/* Content */}

                  <div
                    className={`grid ${getGridClass()} gap-4`}
                  >
                    {siteExperienceFilter === "Limited PI Experience" ? (
                      <>
                        {/* Limited PI Experience Content */}
                        {/* Critical Requirements */}
                        {shouldShowPriority("Critical") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#16a34a] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  PI: Board-certified physician with GCP training and active medical license
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}

                        {/* Strong Preference */}
                        {shouldShowPriority("Strong Preference") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#f59e0b] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  Dedicated mentor PI with respiratory trial experience
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}

                        {/* Nice to Have */}
                        {shouldShowPriority("Nice to Have") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#3b82f6] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  Interest in pulmonary/respiratory medicine
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </>
                    ) : siteExperienceFilter === "Limited Site Experience" ? (
                      <>
                        {/* Limited Site Experience Content */}
                        {/* Critical Requirements */}
                        {shouldShowPriority("Critical") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#16a34a] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  PI: Board-certified Pulmonologist or IM physician with COPD expertise
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}

                        {/* Strong Preference */}
                        {shouldShowPriority("Strong Preference") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#f59e0b] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  Willingness to complete 1-2 training protocols
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}

                        {/* Nice to Have */}
                        {shouldShowPriority("Nice to Have") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#3b82f6] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  Access to COPD patients with FEV1 {"<"}80% predicted
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Default: Experienced Site & PI Content */}
                        {/* Critical Requirements */}
                        {shouldShowPriority("Critical") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              {gspSiteCriticalItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-1.5">
                                  <span className="text-[#16a34a] flex-shrink-0 mt-0.5">
                                    ●
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                    {/* Strong Preference */}
                    {shouldShowPriority(
                      "Strong Preference"
                    ) && (
                      <div className="space-y-1.5">
                        <ul className="space-y-1.5 text-[14px] text-gray-700">
                          {gspSiteStrongItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-1.5">
                              <span className="text-[#f59e0b] flex-shrink-0 mt-0.5">
                                ●
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                        {/* Nice to Have */}
                        {shouldShowPriority("Nice to Have") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              {gspSiteNiceItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-1.5">
                                  <span className="text-[#3b82f6] flex-shrink-0 mt-0.5">
                                    ●
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>


                </motion.div>

                {/* Staffing & Operational Capacity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200/50 p-5 space-y-4 relative"
                  style={{ order: 4 }}
                >
                  {/* Header */}
                  <div className="mb-4 pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-[#061e47] text-[17px]">
                      Staffing & Operational Capacity
                    </h3>
                  </div>

                  {/* Content */}

                  <div
                    className={`grid ${getGridClass()} gap-4`}
                  >
                    {siteExperienceFilter === "Limited PI Experience" ? (
                      <>
                        {/* Limited PI Experience Content */}
                        {/* Critical Requirements */}
                        {shouldShowPriority("Critical") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#16a34a] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  ≥2 experienced research coordinators
                                </span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#16a34a] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  Dedicated clinical research manager or coordinator lead
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}

                        {/* Strong Preference */}
                        {shouldShowPriority("Strong Preference") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#f59e0b] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  Access to training for spirometry/PIFR
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}

                        {/* Nice to Have */}
                        {shouldShowPriority("Nice to Have") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#3b82f6] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  Backup coordinator coverage available
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </>
                    ) : siteExperienceFilter === "Limited Site Experience" ? (
                      <>
                        {/* Limited Site Experience Content */}
                        {/* Critical Requirements */}
                        {shouldShowPriority("Critical") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#16a34a] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  ≥3 dedicated research coordinators with CRA-level experience
                                </span>
                              </li>
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#16a34a] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  Staff trained in spirometry and PIFR measurements
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}

                        {/* Strong Preference */}
                        {shouldShowPriority("Strong Preference") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#f59e0b] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  On-site clinical research manager or senior coordinator
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}

                        {/* Nice to Have */}
                        {shouldShowPriority("Nice to Have") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              <li className="flex items-start gap-1.5">
                                <span className="text-[#3b82f6] flex-shrink-0 mt-0.5">
                                  ●
                                </span>
                                <span>
                                  Backup coordinator coverage and documented SOPs
                                </span>
                              </li>
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Default: Experienced Site & PI Content */}
                        {/* Critical Requirements */}
                        {shouldShowPriority("Critical") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              {gspStaffingCriticalItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-1.5">
                                  <span className="text-[#16a34a] flex-shrink-0 mt-0.5">
                                    ●
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Strong Preference */}
                        {shouldShowPriority(
                          "Strong Preference"
                        ) && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              {gspStaffingStrongItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-1.5">
                                  <span className="text-[#f59e0b] flex-shrink-0 mt-0.5">
                                    ●
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Nice to Have */}
                        {shouldShowPriority("Nice to Have") && (
                          <div className="space-y-1.5">
                            <ul className="space-y-1.5 text-[14px] text-gray-700">
                              {gspStaffingNiceItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-1.5">
                                  <span className="text-[#3b82f6] flex-shrink-0 mt-0.5">
                                    ●
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>


                </motion.div>

                {/* Patient Population & Enrollment Performance */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200/50 p-5 space-y-4 relative"
                  style={{ order: 1 }}
                >
                  {/* Header */}
                  <div className="mb-4 pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-[#061e47] text-[17px]">
                      Patient Population & Enrollment Performance
                    </h3>
                  </div>

                  <div
                    className={`grid ${getGridClass()} gap-4`}
                  >
                    {/* Critical Requirements */}
                    {shouldShowPriority("Critical") && (
                      <div className="space-y-1.5">
                        <ul className="space-y-1.5 text-[14px] text-gray-700">
                          {gspPopulationCriticalItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-1.5">
                              <span className="text-[#16a34a] flex-shrink-0 mt-0.5">
                                ●
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Strong Preference */}
                    {shouldShowPriority("Strong Preference") && (
                      <div className="space-y-1.5">
                        <ul className="space-y-1.5 text-[14px] text-gray-700">
                          {gspPopulationStrongItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-1.5">
                              <span className="text-[#f59e0b] flex-shrink-0 mt-0.5">
                                ●
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Nice to Have */}
                    {shouldShowPriority("Nice to Have") && (
                      <div className="space-y-1.5">
                        <ul className="space-y-1.5 text-[14px] text-gray-700">
                          {gspPopulationNiceItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-1.5">
                              <span className="text-[#3b82f6] flex-shrink-0 mt-0.5">
                                ●
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                </motion.div>

                {/* Clinical Facilities & Capabilities */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200/50 p-5 space-y-4 relative"
                  style={{ order: 3 }}
                >
                  {/* Header */}
                  <div className="mb-4 pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-[#061e47] text-[17px]">
                      Clinical Facilities & Capabilities
                    </h3>
                  </div>

                  {/* Content */}
                  <div
                    className={`grid ${getGridClass()} gap-4`}
                  >
                    {/* Critical Requirements */}
                    {shouldShowPriority("Critical") && (
                      <div className="space-y-1.5">
                        <ul className="space-y-1.5 text-[14px] text-gray-700">
                          {gspFacilitiesCriticalItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-1.5">
                              <span className="text-[#16a34a] flex-shrink-0 mt-0.5">
                                ●
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Strong Preference */}
                    {shouldShowPriority("Strong Preference") && (
                      <div className="space-y-1.5">
                        <ul className="space-y-1.5 text-[14px] text-gray-700">
                          {gspFacilitiesStrongItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-1.5">
                              <span className="text-[#f59e0b] flex-shrink-0 mt-0.5">
                                ●
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Nice to Have */}
                    {shouldShowPriority("Nice to Have") && (
                      <div className="space-y-1.5">
                        <ul className="space-y-1.5 text-[14px] text-gray-700">
                          {gspFacilitiesNiceItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-1.5">
                              <span className="text-[#3b82f6] flex-shrink-0 mt-0.5">
                                ●
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                </motion.div>

                {/* Organizational Expectations & Standards - This section was moved below */}
              </div>

              {/* Other Organisation Level Expectations Section */}
              <div className="mt-6">
                <div className="mb-4">
                  <h3 className="font-bold text-[#061e47] text-[17px]">
                    Other Organisation Level Expectations
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    All organizational requirements and recommendations
                  </p>
                </div>

                {/* Combined Card - Just Bullets */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-gray-50/50 backdrop-blur-xl rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-200/50 p-4 relative"
                >
                  <ul className="space-y-1.5 text-[13px] text-gray-600 columns-2 gap-6">
                    {gspOrgExpectationsItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-1.5">
                        <span className="text-gray-400 flex-shrink-0 mt-0.5 text-xs">
                          ○
                        </span>
                        <span>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-[90%] mx-auto px-8 py-6 border-t border-gray-200/50 mt-12">
        <div className="text-center text-sm text-gray-500">
          © 2025 Velocity Clinical Research, United States. All
          rights reserved.
        </div>
      </footer>

      </div>
    </div>
  );
}

export function GoldenSiteProfileView({
  protocol,
  onBack,
  onDashboardClick,
  initialView = 'studyAsk', // Default to Study Ask Profile
}: GoldenSiteProfileViewProps) {
  // Edit states for sections
  const [editingProtocolInfo, setEditingProtocolInfo] = useState(false); // Master edit state for ALL Protocol Information sections
  const [protocolInfoHasChanges, setProtocolInfoHasChanges] = useState(false); // Track if any changes have been made
  const [editingRecruitment, setEditingRecruitment] = useState(false);
  const [editingStaff, setEditingStaff] = useState(false);
  const [editingInfrastructure, setEditingInfrastructure] = useState(false);
  const [editingRegulatory, setEditingRegulatory] = useState(false);
  const [editingAdditional, setEditingAdditional] = useState(false);
  const [editingInclusion, setEditingInclusion] = useState(false);
  const [editingExclusion, setEditingExclusion] = useState(false);

  // Edit states for Golden Site Profile cards
  const [editingGspSite, setEditingGspSite] = useState(false);
  const [editingGspStaffing, setEditingGspStaffing] = useState(false);
  const [editingGspInfrastructure, setEditingGspInfrastructure] = useState(false);
  const [editingGspQuality, setEditingGspQuality] = useState(false);
  const [editingGspPatient, setEditingGspPatient] = useState(false);
  const [editingGspStrategic, setEditingGspStrategic] = useState(false);

  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingSection, setPendingSection] = useState<string | null>(null);

  const [editConfirmDialog, setEditConfirmDialog] = useState<{
    isOpen: boolean;
    section: string;
    sectionType: 'recruitment' | 'staff' | 'infrastructure' | 'regulatory' | 'additional' | 'inclusion' | 'exclusion' | 'gspSite' | 'gspStaffing' | 'gspInfrastructure' | 'gspQuality' | 'gspPatient' | 'gspStrategic' | null;
  }>({ isOpen: false, section: '', sectionType: null });

  const [saveConfirmDialog, setSaveConfirmDialog] = useState<{
    isOpen: boolean;
    section: string;
    sectionType: 'recruitment' | 'staff' | 'infrastructure' | 'regulatory' | 'additional' | 'inclusion' | 'exclusion' | 'gspSite' | 'gspStaffing' | 'gspInfrastructure' | 'gspQuality' | 'gspPatient' | 'gspStrategic' | null;
  }>({ isOpen: false, section: '', sectionType: null });

  const [showNavigationDialog, setShowNavigationDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<'back' | 'scorecards' | 'goldenSite' | 'studyAsk' | 'viewGSP' | null>(null);

  // Protocol Number state
  const [protocolNumber, setProtocolNumber] = useState(() => {
    const saved = localStorage.getItem('protocolNumber');
    return saved || 'D5989C00001';
  });
  const [savedProtocolNumber, setSavedProtocolNumber] = useState(() => {
    const saved = localStorage.getItem('protocolNumber');
    return saved || 'D5989C00001';
  });

  // Section title states (must be declared before validation useEffect)
  const [recruitmentTitle, setRecruitmentTitle] = useState(() => {
    const saved = localStorage.getItem('recruitmentTitle');
    return saved || 'Patient Population & Enrollment Constraints';
  });
  const [savedRecruitmentTitle, setSavedRecruitmentTitle] = useState(() => {
    const saved = localStorage.getItem('recruitmentTitle');
    return saved || 'Patient Population & Enrollment Constraints';
  });

  const [staffTitle, setStaffTitle] = useState(() => {
    const saved = localStorage.getItem('staffTitle');
    return saved || 'Study Design & Follow-Up';
  });
  const [savedStaffTitle, setSavedStaffTitle] = useState(() => {
    const saved = localStorage.getItem('staffTitle');
    return saved || 'Study Design & Follow-Up';
  });

  const [infrastructureTitle, setInfrastructureTitle] = useState(() => {
    const saved = localStorage.getItem('infrastructureTitle');
    return saved || 'Clinical Assessments';
  });
  const [savedInfrastructureTitle, setSavedInfrastructureTitle] = useState(() => {
    const saved = localStorage.getItem('infrastructureTitle');
    return saved || 'Clinical Assessments';
  });

  const [regulatoryTitle, setRegulatoryTitle] = useState(() => {
    const saved = localStorage.getItem('regulatoryTitle');
    return saved || 'Site & Operational Readiness';
  });
  const [savedRegulatoryTitle, setSavedRegulatoryTitle] = useState(() => {
    const saved = localStorage.getItem('regulatoryTitle');
    return saved || 'Site & Operational Readiness';
  });

  // Validation state for empty fields
  const [validationErrors, setValidationErrors] = useState<{
    protocolNumber: boolean;
    additionalDetailsSubItems: boolean; // Add validation for subsection titles
  }>({
    protocolNumber: false,
    additionalDetailsSubItems: false,
  });

  // Enrollment Window state
  const [enrollmentWindow, setEnrollmentWindow] = useState(() => {
    const saved = localStorage.getItem('enrollmentWindow');
    // Treat "0" as null/empty
    return (saved && saved !== '0') ? saved : '';
  });
  const [savedEnrollmentWindow, setSavedEnrollmentWindow] = useState(() => {
    const saved = localStorage.getItem('enrollmentWindow');
    // Treat "0" as null/empty
    return (saved && saved !== '0') ? saved : '';
  });

  const isAnyEditMode = () => {
    return editingProtocolInfo ||
           editingRecruitment || editingStaff || editingInfrastructure || 
           editingRegulatory || editingAdditional || editingInclusion || 
           editingExclusion || editingGspSite || editingGspStaffing || 
           editingGspInfrastructure || editingGspQuality || editingGspPatient || 
           editingGspStrategic;
  };

  const [originalRecruitmentItems, setOriginalRecruitmentItems] = useState<string[]>([]);
  const [originalStaffItems, setOriginalStaffItems] = useState<string[]>([]);
  const [originalInfrastructureItems, setOriginalInfrastructureItems] = useState<any[]>([]);
  const [originalRegulatoryItems, setOriginalRegulatoryItems] = useState<string[]>([]);
  const [originalAdditionalDetailsItems, setOriginalAdditionalDetailsItems] = useState<string[]>([]);
  const [originalInclusionItems, setOriginalInclusionItems] = useState<string[]>([]);
  const [originalExclusionItems, setOriginalExclusionItems] = useState<string[]>([]);
  const [originalCustomSections, setOriginalCustomSections] = useState<CustomSection[]>([]);

  const [originalGspSiteItems, setOriginalGspSiteItems] = useState<string[]>([]);
  const [originalGspStaffingItems, setOriginalGspStaffingItems] = useState<string[]>([]);
  const [originalGspInfrastructureItems, setOriginalGspInfrastructureItems] = useState<string[]>([]);
  const [originalGspQualityItems, setOriginalGspQualityItems] = useState<string[]>([]);
  const [originalGspPatientItems, setOriginalGspPatientItems] = useState<string[]>([]);
  const [originalGspStrategicItems, setOriginalGspStrategicItems] = useState<string[]>([]);

  // Default values
  const defaultRecruitmentItems = [
    "Recruit ICS-naive COPD participants with high cardiovascular (CV) risk.",
    "At least 50% of randomized participants must have established CV disease",
    "Approximately 8,334 participants will be screened to randomize ~5,000 participants.",
  ];

  // Content states for editable sections - load from localStorage
  const [recruitmentItems, setRecruitmentItems] = useState(() => {
    const saved = localStorage.getItem('recruitmentItems');
    return saved ? JSON.parse(saved) : defaultRecruitmentItems;
  });

  const defaultStaffItems = [
    "Event-driven outcomes study with follow-up of up to 3 years per participant",
    "Study closeout occurs once 632 primary cardiovascular events are reached",
    "All study-related screening and follow-up visits to take place at the site"
  ];

  const [staffItems, setStaffItems] = useState(() => {
    const saved = localStorage.getItem('staffItems');
    return saved ? JSON.parse(saved) : defaultStaffItems;
  });

  const defaultInfrastructureItems = [
    { text: "High-resolution CT scan capability (required within last 12 months)", subItems: [] },
    { text: "12-lead ECG and echocardiogram (routine)", subItems: [] },
    { text: "Spirometry (post-bronchodilator)", subItems: [] }
  ];

  const [infrastructureItems, setInfrastructureItems] = useState(() => {
    const saved = localStorage.getItem('infrastructureItems');
    return saved ? JSON.parse(saved) : defaultInfrastructureItems;
  });

  const defaultRegulatoryItems = [
    "This is a global, multicenter study requiring coordination with international regulatory bodies",
    "Sites must have prior experience with cardiovascular outcome trials",
    "All sites must meet sponsor's audit and data quality requirements"
  ];

  const [regulatoryItems, setRegulatoryItems] = useState(() => {
    const saved = localStorage.getItem('regulatoryItems');
    return saved ? JSON.parse(saved) : defaultRegulatoryItems;
  });

  const defaultAdditionalDetailsItems = [
    {
      text: "Study intervention overview",
      subItems: [
        "Run-in placebo MDI HFA QID for ~2 weeks then three 4-week periods of BDA MDI HFO, BDA MDI HFA, and placebo MDI HFA."
      ]
    },
    {
      text: "Participant logistics support",
      subItems: [
        "Offer optional overnight stays for Visits 2–5 at clinic or nearby facility with sponsor reimbursement per local regulations.",
        "Arrange reimbursed transportation services on visit days to reduce morning rescue SABA use risk."
      ]
    },
    {
      text: "Safety testing access",
      subItems: [
        "Use local laboratory at or near site for clinical chemistry, hematology, and pregnancy testing per Schedule of Activities."
      ]
    }
  ];

  const [additionalDetailsItems, setAdditionalDetailsItems] = useState(() => {
    const saved = localStorage.getItem('additionalDetailsItems');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if old format (array of strings) - migrate to new format
        if (parsed.length > 0 && typeof parsed[0] === 'string') {
          // Old format detected, use new default instead
          localStorage.setItem('additionalDetailsItems', JSON.stringify(defaultAdditionalDetailsItems));
          return defaultAdditionalDetailsItems;
        }
        return parsed;
      } catch (e) {
        return defaultAdditionalDetailsItems;
      }
    }
    return defaultAdditionalDetailsItems;
  });

  const defaultInclusionCriteria = [
    "Disease and lung function: Physician-diagnosed asthma per GINA for ≥12 months before Visit 1.",
    "Prior therapy: No daily inhaled maintenance therapy or low-dose ICS or low-dose ICS-LABA with stability ≥3 months (ICS) or ≥6 months (ICS-LABA).",
    "Technique and adherence: Acceptable spirometry performance meeting ATS/ERS 2019 acceptability and repeatability criteria.",
    "Demographics: Age ≥18 years at time of signing informed consent."
  ];

  const [inclusionItems, setInclusionItems] = useState(() => {
    // Version-based reset to force new content once
    const version = localStorage.getItem('criteriaVersion');
    if (version !== '2.0') {
      localStorage.removeItem('inclusionItems');
      localStorage.removeItem('exclusionItems');
      localStorage.setItem('criteriaVersion', '2.0');
    }
    const saved = localStorage.getItem('inclusionItems');
    return saved ? JSON.parse(saved) : defaultInclusionCriteria;
  });

  const defaultExclusionCriteria = [
    "Asthma severity and instability: Life-threatening asthma within 5 years (ICU admission, ventilation with hypercapnia, respiratory arrest, hypoxic seizures, syncope).",
    "Pulmonary comorbidity and smoking: COPD or clinically significant non-asthma airway/lung disease.",
    "Recent infections and steroids: Lower respiratory infection within 4 weeks before Visit 1.",
    "Medication and procedure constraints: Not likely to abstain from reliever use within 6 hours before lung function testing at each visit.",
    "Cardiac and hypersensitivity: QTcF >480 msec on ECG."
  ];

  const [exclusionItems, setExclusionItems] = useState(() => {
    const saved = localStorage.getItem('exclusionItems');
    return saved ? JSON.parse(saved) : defaultExclusionCriteria;
  });

  // Custom sections state
  interface CustomSection {
    id: string;
    title: string;
    items: string[];
  }

  const [customSections, setCustomSections] = useState<CustomSection[]>(() => {
    const saved = localStorage.getItem('customSections');
    return saved ? JSON.parse(saved) : [];
  });

  // Hidden sections state - track which default sections are hidden
  const [hiddenSections, setHiddenSections] = useState<string[]>(() => {
    const saved = localStorage.getItem('hiddenSections');
    return saved ? JSON.parse(saved) : [];
  });

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    sectionId: string | null;
    sectionTitle: string;
  }>({
    isOpen: false,
    sectionId: null,
    sectionTitle: '',
  });

  // Show validation errors for empty fields while editing
  useEffect(() => {
    if (editingProtocolInfo) {
      // Check if any main item title or subsection content is empty in additionalDetailsItems
      const hasEmptyItems = additionalDetailsItems.some(item => 
        !item.text.trim() || (item.subItems && item.subItems.some((subItem: string) => !subItem.trim()))
      );
      
      setValidationErrors({
        protocolNumber: !protocolNumber.trim(),
        additionalDetailsSubItems: hasEmptyItems,
      });
    }
  }, [editingProtocolInfo, protocolNumber, additionalDetailsItems]);

  // Golden Site Profile default data
  const defaultGspSiteItems = [
    "Proven COPD patient base with CV comorbidities",
    "Access to diverse patient demographics for CV risk stratification",
    "Recent enrollment success in respiratory or cardiovascular trials"
  ];

  const [gspSiteItems, setGspSiteItems] = useState(() => {
    const saved = localStorage.getItem('gspSiteItems');
    return saved ? JSON.parse(saved) : defaultGspSiteItems;
  });

  const defaultGspStaffingItems = [
    "Principal Investigator with dual pulmonary/cardiology expertise or partnership",
    "Dedicated study coordinator experienced in outcomes trials",
    "Clinical staff trained in ECG, spirometry, and CT interpretation"
  ];

  const [gspStaffingItems, setGspStaffingItems] = useState(() => {
    const saved = localStorage.getItem('gspStaffingItems');
    return saved ? JSON.parse(saved) : defaultGspStaffingItems;
  });

  const defaultGspInfrastructureItems = [
    "ATS/ERS-compliant spirometry equipment",
    "ECG equipment for cardiac monitoring",
    "Adequate storage for study medications and supplies",
    "Reliable internet for eCRF and virtual visit platform",
  ];

  const [gspInfrastructureItems, setGspInfrastructureItems] = useState(() => {
    const saved = localStorage.getItem('gspInfrastructureItems');
    return saved ? JSON.parse(saved) : defaultGspInfrastructureItems;
  });

  const defaultGspQualityItems = [
    "No major FDA/HRPP findings in past 2 years",
    "Query rate <15% on recent trials",
    "Source document verification (SDV) findings <5% on recent audits",
  ];

  const [gspQualityItems, setGspQualityItems] = useState(() => {
    const saved = localStorage.getItem('gspQualityItems');
    return saved ? JSON.parse(saved) : defaultGspQualityItems;
  });

  const defaultGspPatientItems = [
    "Access to 150+ COPD patients meeting FEV1 criteria",
    "50%+ patients with documented CV risk factors",
    "Ability to recruit ICS-naive population",
  ];

  const [gspPatientItems, setGspPatientItems] = useState(() => {
    const saved = localStorage.getItem('gspPatientItems');
    return saved ? JSON.parse(saved) : defaultGspPatientItems;
  });

  const defaultGspStrategicItems = [
    "Located in region with COPD prevalence >8%",
    "No competing respiratory trials during enrollment period",
    "Previous successful collaboration with sponsor",
  ];

  const [gspStrategicItems, setGspStrategicItems] = useState(() => {
    const saved = localStorage.getItem('gspStrategicItems');
    return saved ? JSON.parse(saved) : defaultGspStrategicItems;
  });

  const defaultGspFsFacilitiesItems = [
    "On-site spirometry testing capabilities",
    "ECG equipment and interpretation services",
    "CT imaging access within 30 miles",
    "Capacity to conduct at least 4-6 study visits weekly",
  ];

  const [gspFsFacilitiesItems, setGspFsFacilitiesItems] = useState(() => {
    const saved = localStorage.getItem('gspFsFacilitiesItems');
    return saved ? JSON.parse(saved) : defaultGspFsFacilitiesItems;
  });

  const defaultGspOrgExpectationsItems = [
    "Institutional commitment to respiratory research",
    "Adequate administrative support for study coordination",
    "Financial stability with net accounts receivable <120 days",
    "Willingness to adopt sponsor's eCRF and IWRS platforms",
  ];

  const [gspOrgExpectationsItems, setGspOrgExpectationsItems] = useState(() => {
    const saved = localStorage.getItem('gspOrgExpectationsItems');
    return saved ? JSON.parse(saved) : defaultGspOrgExpectationsItems;
  });

  const [gspGenerated, setGspGenerated] = useState(initialView === 'goldenSite'); // Generated if starting with Golden Site view
  const [showGSPFullScreen, setShowGSPFullScreen] =
    useState(initialView === 'goldenSite'); // Show Golden Site if initialView is 'goldenSite'
  const [isReviewed, setIsReviewed] = useState(false); // Default state is "Mark as Reviewed"
  const [isGeneratingGSP, setIsGeneratingGSP] = useState(false);
  const [gspProgress, setGspProgress] = useState(0);
  const [loadingScorecards, setLoadingScorecards] = useState(false);
  const [showScorecard, setShowScorecard] = useState(initialView === 'scorecard'); // Show Scorecard if initialView is 'scorecard'

  // Ref for focusing new Additional Details section titles
  const newSectionTitleRef = useRef<HTMLInputElement>(null);

  // Scroll to top when GSP full screen is shown/hidden
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [showGSPFullScreen]);

  // Edit states for sub-sections (Critical, Strong, Nice to Have)
  const [editingGspSiteCritical, setEditingGspSiteCritical] = useState(false);
  const [editingGspSiteStrong, setEditingGspSiteStrong] = useState(false);
  const [editingGspSiteNice, setEditingGspSiteNice] =
    useState(false);
  const [editingGspStaffingCritical, setEditingGspStaffingCritical] = useState(false);
  const [editingGspStaffingStrong, setEditingGspStaffingStrong] = useState(false);
  const [editingGspStaffingNice, setEditingGspStaffingNice] = useState(false);

  // Protocol Insights - Categorized Challenges
  const [missingInfoItems, setMissingInfoItems] = useState([
    {
      label: "Per-Site Enrollment Targets",
      description:
        "Exact per-site enrollment targets and minimum acceptable monthly accrual are not specified",
      editable: true,
      value: "",
      editing: false,
    },
    {
      label: "Lab Requirements",
      description:
        "No explicit requirements for central lab vs local lab for serostatus and immunogenicity are given",
      editable: true,
      value: "",
      editing: false,
    },
  ]);

  const [protocolInsights] = useState({
    highBarriers: [
      {
        title: "Pediatric high-risk cohorts",
        description:
          "Protocol 5.1 requires enrollment of pediatric high-risk populations with specific comorbidities",
        impact:
          "Sites need specialized pediatric recruitment infrastructure and access to at-risk populations",
      },
      {
        title: "RSV-seropositive toddlers",
        description:
          "Protocol 5.1 mandates screening for RSV-seropositive toddlers requiring specialized testing",
        impact:
          "Requires laboratory capacity for serological testing and pediatric phlebotomy expertise",
      },
      {
        title: "PBMC processing",
        description:
          "Protocol 8.2.2 requires peripheral blood mononuclear cell processing and storage",
        impact:
          "Sites must have cellular processing capabilities and cryopreservation infrastructure",
      },
      {
        title: "Lyophilized IMP handling",
        description:
          "Protocol 6.2 involves lyophilized investigational medicinal product requiring reconstitution",
        impact:
          "Pharmacy must have specialized training and equipment for lyophilized product handling",
      },
      {
        title: "Daily e-diary oversight",
        description:
          "Protocol 8.3.4 requires daily electronic diary completion with active site monitoring",
        impact:
          "Significant coordinator time for participant engagement and compliance monitoring",
      },
      {
        title: "Telehealth visits",
        description:
          "Protocol 8.1.1 includes telehealth visit requirements with technical specifications",
        impact:
          "Sites need telehealth infrastructure, HIPAA-compliant platforms, and staff training",
      },
      {
        title: "Stopping rule response",
        description:
          "Protocol 8.3.5 requires immediate response to safety stopping rules within defined timeframes",
        impact:
          "Sites must have 24/7 coverage and rapid escalation procedures for safety events",
      },
    ],
    moderateBarriers: [
      {
        title: "IRT randomization",
        description:
          "Protocol 6.3 uses interactive response technology for randomization and drug assignment",
        impact:
          "Staff training required on IRT system; backup procedures needed for technical failures",
      },
      {
        title: "6-month retention",
        description:
          "Protocol 4.1 requires 6-month follow-up period with multiple touchpoints",
        impact:
          "Retention strategies and participant engagement plans essential for study completion",
      },
      {
        title: "Unscheduled AE visits",
        description:
          "Protocol 8.11 allows for unscheduled adverse event visits requiring flexible scheduling",
        impact:
          "Sites need capacity to accommodate urgent visits and adequate coordinator availability",
      },
      {
        title: "Subspecialist access",
        description:
          "Protocol 5.1 may require consultation with pediatric subspecialists for high-risk cohorts",
        impact:
          "Sites should have established relationships with relevant subspecialty services",
      },
      {
        title: "Recruitment forecasting",
        description:
          "FQ Q4-5 indicates uncertainty in accurate enrollment forecasting capabilities",
        impact:
          "May require enhanced database screening and recruitment tracking systems",
      },
    ],
    fqFlaggedChallenges: [
      {
        title: "Eligibility/design concerns",
        description:
          "FQ Q2 flagged concerns about protocol eligibility criteria and study design complexity",
        source: "Feasibility Questionnaire Q2",
        severity: "high",
      },
      {
        title: "Multispecialty collaboration",
        description:
          "FQ Q3 identified challenges in coordinating multiple specialty departments",
        source: "Feasibility Questionnaire Q3",
        severity: "medium",
      },
      {
        title: "Peds accrual capacity",
        description:
          "FQ Q4-5 raised questions about pediatric patient accrual capacity and timelines",
        source: "Feasibility Questionnaire Q4-5",
        severity: "high",
      },
      {
        title: "Competing trials",
        description:
          "FQ Q7 noted potential competition from other active pediatric trials at the site",
        source: "Feasibility Questionnaire Q7",
        severity: "medium",
      },
    ],
  });

  // Helper function to reset all edit states
  const resetAllEditStates = () => {
    setEditingRecruitment(false);
    setEditingStaff(false);
    setEditingInfrastructure(false);
    setEditingRegulatory(false);
    setEditingAdditional(false);
    setEditingInclusion(false);
    setEditingExclusion(false);
    setEditingGspSite(false);
    setEditingGspStaffing(false);
    setEditingGspInfrastructure(false);
    setEditingGspQuality(false);
    setEditingGspPatient(false);
    setEditingGspStrategic(false);
  };

  // Handler to load Site Scorecards with delay
  const handleViewScorecards = async () => {
    resetAllEditStates();
    setLoadingScorecards(true);
    
    // Simulate loading time (4-6 seconds, random)
    const loadingTime = 4000 + Math.random() * 2000; // Random between 4000-6000ms
    await new Promise(resolve => setTimeout(resolve, loadingTime));
    
    setLoadingScorecards(false);
    setShowScorecard(true);
  };

  // Handler for navigation with edit mode check
  const handleBackNavigation = () => {
    resetAllEditStates();
    onBack();
  };

  // Confirm navigation despite unsaved changes
  const confirmNavigation = async () => {
    // Reset all edit states before navigating
    resetAllEditStates();

    setShowNavigationDialog(false);
    
    if (pendingNavigation === 'back') {
      onBack();
    } else if (pendingNavigation === 'scorecards') {
      setLoadingScorecards(true);
      // Simulate loading time (4-6 seconds, random)
      const loadingTime = 4000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, loadingTime));
      setLoadingScorecards(false);
      setShowScorecard(true);
    } else if (pendingNavigation === 'goldenSite') {
      // Proceed with GSP generation
      setIsGeneratingGSP(true);
      setGspProgress(0);

      const duration = 6000;
      const steps = 100;
      const intervalTime = duration / steps;

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 1;
        setGspProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(interval);
          setIsGeneratingGSP(false);
          setGspGenerated(true);
        }
      }, intervalTime);
    } else if (pendingNavigation === 'viewGSP') {
      // Navigate to already generated GSP full screen
      setShowGSPFullScreen(true);
    }
    
    setPendingNavigation(null);
  };



  // Handle Mark as Reviewed
  const handleMarkAsReviewed = () => {
    setIsReviewed(true);
  };

  // Handle edit button click - directly enter edit mode without confirmation
  const handleEditClick = (
    section: 'recruitment' | 'staff' | 'infrastructure' | 'regulatory' | 'additional' | 'inclusion' | 'exclusion' | 'gspSite' | 'gspStaffing' | 'gspInfrastructure' | 'gspQuality' | 'gspPatient' | 'gspStrategic',
    sectionName: string
  ) => {
    // Backup original data
    switch (section) {
      case "recruitment":
        setOriginalRecruitmentItems([...recruitmentItems]);
        setEditingRecruitment(true);
        break;
      case "staff":
        setOriginalStaffItems([...staffItems]);
        setEditingStaff(true);
        break;
      case "infrastructure":
        setOriginalInfrastructureItems([...infrastructureItems]);
        setEditingInfrastructure(true);
        break;
      case "regulatory":
        setOriginalRegulatoryItems([...regulatoryItems]);
        setEditingRegulatory(true);
        break;
      case "additional":
        setOriginalAdditionalDetailsItems([...additionalDetailsItems]);
        setEditingAdditional(true);
        break;
      case "inclusion":
        setOriginalInclusionItems([...inclusionItems]);
        setEditingInclusion(true);
        break;
      case "exclusion":
        setOriginalExclusionItems([...exclusionItems]);
        setEditingExclusion(true);
        break;
      case "gspSite":
        setOriginalGspSiteItems([...gspSiteItems]);
        setEditingGspSite(true);
        break;
      case "gspStaffing":
        setOriginalGspStaffingItems([...gspStaffingItems]);
        setEditingGspStaffing(true);
        break;
      case "gspInfrastructure":
        setOriginalGspInfrastructureItems([...gspInfrastructureItems]);
        setEditingGspInfrastructure(true);
        break;
      case "gspQuality":
        setOriginalGspQualityItems([...gspQualityItems]);
        setEditingGspQuality(true);
        break;
      case "gspPatient":
        setOriginalGspPatientItems([...gspPatientItems]);
        setEditingGspPatient(true);
        break;
      case "gspStrategic":
        setOriginalGspStrategicItems([...gspStrategicItems]);
        setEditingGspStrategic(true);
        break;
    }
  };

  // Confirm entering edit mode
  const confirmEdit = () => {
    const section = editConfirmDialog.sectionType;
    if (!section) return;

    // Backup original data
    switch (section) {
      case "recruitment":
        setOriginalRecruitmentItems([...recruitmentItems]);
        setEditingRecruitment(true);
        break;
      case "staff":
        setOriginalStaffItems([...staffItems]);
        setEditingStaff(true);
        break;
      case "infrastructure":
        setOriginalInfrastructureItems([...infrastructureItems]);
        setEditingInfrastructure(true);
        break;
      case "regulatory":
        setOriginalRegulatoryItems([...regulatoryItems]);
        setEditingRegulatory(true);
        break;
      case "additional":
        setOriginalAdditionalDetailsItems([...additionalDetailsItems]);
        setEditingAdditional(true);
        break;
      case "inclusion":
        setOriginalInclusionItems([...inclusionItems]);
        setEditingInclusion(true);
        break;
      case "exclusion":
        setOriginalExclusionItems([...exclusionItems]);
        setEditingExclusion(true);
        break;
      case "gspSite":
        setOriginalGspSiteItems([...gspSiteItems]);
        setEditingGspSite(true);
        break;
      case "gspStaffing":
        setOriginalGspStaffingItems([...gspStaffingItems]);
        setEditingGspStaffing(true);
        break;
      case "gspInfrastructure":
        setOriginalGspInfrastructureItems([...gspInfrastructureItems]);
        setEditingGspInfrastructure(true);
        break;
      case "gspQuality":
        setOriginalGspQualityItems([...gspQualityItems]);
        setEditingGspQuality(true);
        break;
      case "gspPatient":
        setOriginalGspPatientItems([...gspPatientItems]);
        setEditingGspPatient(true);
        break;
      case "gspStrategic":
        setOriginalGspStrategicItems([...gspStrategicItems]);
        setEditingGspStrategic(true);
        break;
    }
  };

  // Handle save button click - directly save without confirmation
  const handleSaveClick = (
    section: 'recruitment' | 'staff' | 'infrastructure' | 'regulatory' | 'additional' | 'inclusion' | 'exclusion' | 'gspSite' | 'gspStaffing' | 'gspInfrastructure' | 'gspQuality' | 'gspPatient' | 'gspStrategic',
    sectionName: string
  ) => {
    // Reset reviewed and GSP generated states
    setIsReviewed(false);
    setGspGenerated(false);

    // Save to localStorage and exit edit mode
    switch (section) {
      case "recruitment":
        setRecruitmentItems(recruitmentItems.filter(item => item.trim()));
        localStorage.setItem('recruitmentItems', JSON.stringify(recruitmentItems.filter(item => item.trim())));
        setEditingRecruitment(false);
        break;
      case "staff":
        setStaffItems(staffItems.filter(item => item.trim()));
        localStorage.setItem('staffItems', JSON.stringify(staffItems.filter(item => item.trim())));
        setEditingStaff(false);
        break;
      case "infrastructure":
        setInfrastructureItems(infrastructureItems.filter(item => item.text.trim()));
        localStorage.setItem('infrastructureItems', JSON.stringify(infrastructureItems.filter(item => item.text.trim())));
        setEditingInfrastructure(false);
        break;
      case "regulatory":
        setRegulatoryItems(regulatoryItems.filter(item => item.trim()));
        localStorage.setItem('regulatoryItems', JSON.stringify(regulatoryItems.filter(item => item.trim())));
        setEditingRegulatory(false);
        break;
      case "additional":
        setAdditionalDetailsItems(additionalDetailsItems);
        localStorage.setItem('additionalDetailsItems', JSON.stringify(additionalDetailsItems));
        setEditingAdditional(false);
        break;
      case "inclusion":
        setInclusionItems(inclusionItems.filter(item => item.trim()));
        localStorage.setItem('inclusionItems', JSON.stringify(inclusionItems.filter(item => item.trim())));
        setEditingInclusion(false);
        break;
      case "exclusion":
        setExclusionItems(exclusionItems.filter(item => item.trim()));
        localStorage.setItem('exclusionItems', JSON.stringify(exclusionItems.filter(item => item.trim())));
        setEditingExclusion(false);
        break;
      case "gspSite":
        setGspSiteItems(gspSiteItems.filter(item => item.trim()));
        localStorage.setItem('gspSiteItems', JSON.stringify(gspSiteItems.filter(item => item.trim())));
        setEditingGspSite(false);
        break;
      case "gspStaffing":
        setGspStaffingItems(gspStaffingItems.filter(item => item.trim()));
        localStorage.setItem('gspStaffingItems', JSON.stringify(gspStaffingItems.filter(item => item.trim())));
        setEditingGspStaffing(false);
        break;
      case "gspInfrastructure":
        setGspInfrastructureItems(gspInfrastructureItems.filter(item => item.trim()));
        localStorage.setItem('gspInfrastructureItems', JSON.stringify(gspInfrastructureItems.filter(item => item.trim())));
        setEditingGspInfrastructure(false);
        break;
      case "gspQuality":
        setGspQualityItems(gspQualityItems.filter(item => item.trim()));
        localStorage.setItem('gspQualityItems', JSON.stringify(gspQualityItems.filter(item => item.trim())));
        setEditingGspQuality(false);
        break;
      case "gspPatient":
        setGspPatientItems(gspPatientItems.filter(item => item.trim()));
        localStorage.setItem('gspPatientItems', JSON.stringify(gspPatientItems.filter(item => item.trim())));
        setEditingGspPatient(false);
        break;
      case "gspStrategic":
        setGspStrategicItems(gspStrategicItems.filter(item => item.trim()));
        localStorage.setItem('gspStrategicItems', JSON.stringify(gspStrategicItems.filter(item => item.trim())));
        setEditingGspStrategic(false);
        break;
    }
  };

  // Confirm saving changes
  const confirmSave = () => {
    const section = saveConfirmDialog.sectionType;
    if (!section) return;

    // Reset reviewed and GSP generated states
    setIsReviewed(false);
    setGspGenerated(false);

    // Save to localStorage and exit edit mode
    switch (section) {
      case "recruitment":
        setRecruitmentItems(recruitmentItems.filter(item => item.trim()));
        localStorage.setItem('recruitmentItems', JSON.stringify(recruitmentItems.filter(item => item.trim())));
        setEditingRecruitment(false);
        break;
      case "staff":
        setStaffItems(staffItems.filter(item => item.trim()));
        localStorage.setItem('staffItems', JSON.stringify(staffItems.filter(item => item.trim())));
        setEditingStaff(false);
        break;
      case "infrastructure":
        setInfrastructureItems(infrastructureItems.filter(item => item.text.trim()));
        localStorage.setItem('infrastructureItems', JSON.stringify(infrastructureItems.filter(item => item.text.trim())));
        setEditingInfrastructure(false);
        break;
      case "regulatory":
        setRegulatoryItems(regulatoryItems.filter(item => item.trim()));
        localStorage.setItem('regulatoryItems', JSON.stringify(regulatoryItems.filter(item => item.trim())));
        setEditingRegulatory(false);
        break;
      case "additional":
        setAdditionalDetailsItems(additionalDetailsItems);
        localStorage.setItem('additionalDetailsItems', JSON.stringify(additionalDetailsItems));
        setEditingAdditional(false);
        break;
      case "inclusion":
        setInclusionItems(inclusionItems.filter(item => item.trim()));
        localStorage.setItem('inclusionItems', JSON.stringify(inclusionItems.filter(item => item.trim())));
        setEditingInclusion(false);
        break;
      case "exclusion":
        setExclusionItems(exclusionItems.filter(item => item.trim()));
        localStorage.setItem('exclusionItems', JSON.stringify(exclusionItems.filter(item => item.trim())));
        setEditingExclusion(false);
        break;
      case "gspSite":
        setGspSiteItems(gspSiteItems.filter(item => item.trim()));
        localStorage.setItem('gspSiteItems', JSON.stringify(gspSiteItems.filter(item => item.trim())));
        setEditingGspSite(false);
        break;
      case "gspStaffing":
        setGspStaffingItems(gspStaffingItems.filter(item => item.trim()));
        localStorage.setItem('gspStaffingItems', JSON.stringify(gspStaffingItems.filter(item => item.trim())));
        setEditingGspStaffing(false);
        break;
      case "gspInfrastructure":
        setGspInfrastructureItems(gspInfrastructureItems.filter(item => item.trim()));
        localStorage.setItem('gspInfrastructureItems', JSON.stringify(gspInfrastructureItems.filter(item => item.trim())));
        setEditingGspInfrastructure(false);
        break;
      case "gspQuality":
        setGspQualityItems(gspQualityItems.filter(item => item.trim()));
        localStorage.setItem('gspQualityItems', JSON.stringify(gspQualityItems.filter(item => item.trim())));
        setEditingGspQuality(false);
        break;
      case "gspPatient":
        setGspPatientItems(gspPatientItems.filter(item => item.trim()));
        localStorage.setItem('gspPatientItems', JSON.stringify(gspPatientItems.filter(item => item.trim())));
        setEditingGspPatient(false);
        break;
      case "gspStrategic":
        setGspStrategicItems(gspStrategicItems.filter(item => item.trim()));
        localStorage.setItem('gspStrategicItems', JSON.stringify(gspStrategicItems.filter(item => item.trim())));
        setEditingGspStrategic(false);
        break;
    }
  };

  // Handle enrollment window save
  const handleSaveEnrollmentWindow = () => {
    if (enrollmentWindow.trim()) {
      localStorage.setItem('enrollmentWindow', enrollmentWindow);
      setSavedEnrollmentWindow(enrollmentWindow);
      toast.success('Saved', {
        duration: 2000,
      });
    }
  };

  // Handle Protocol Information edit
  const handleEditProtocolInfo = () => {
    // Backup original data for all sections
    setOriginalRecruitmentItems([...recruitmentItems]);
    setOriginalStaffItems([...staffItems]);
    setOriginalInfrastructureItems([...infrastructureItems]);
    setOriginalRegulatoryItems([...regulatoryItems]);
    setOriginalAdditionalDetailsItems([...additionalDetailsItems]);
    setOriginalInclusionItems([...inclusionItems]);
    setOriginalExclusionItems([...exclusionItems]);
    setOriginalCustomSections([...customSections]);
    
    // Ensure each additional details section has at least one empty subitem for editing
    const updatedAdditionalDetails = additionalDetailsItems.map(item => {
      const hasEmptyItem = item.subItems && item.subItems.some(subItem => !subItem.trim());
      if (!hasEmptyItem) {
        return { ...item, subItems: [...(item.subItems || []), ''] };
      }
      return item;
    });
    setAdditionalDetailsItems(updatedAdditionalDetails);
    
    setEditingProtocolInfo(true);
    setProtocolInfoHasChanges(false); // Reset changes tracker
  };

  // Handle Protocol Information save
  const handleSaveProtocolInfo = () => {
    // Check if any additional details WITH TITLES have empty subitems
    // Sections without titles will be automatically removed, so we only validate titled sections
    const hasEmptyItems = additionalDetailsItems.some(item => 
      item.text.trim() && (item.subItems && item.subItems.every((subItem: string) => !subItem.trim()))
    );
    
    // Check if any custom sections WITH TITLES have no valid items
    // Sections without titles will be automatically removed, so we only validate titled sections
    const hasInvalidCustomSections = customSections.some(section => 
      section.title.trim() && section.items.every((item: string) => !item.trim())
    );
    
    // Validate required fields
    const errors = {
      protocolNumber: !protocolNumber.trim(),
      additionalDetailsSubItems: hasEmptyItems,
      customSections: hasInvalidCustomSections,
    };
    
    setValidationErrors(errors);
    
    // If any validation errors, don't save
    if (Object.values(errors).some(error => error)) {
      if (hasInvalidCustomSections) {
        toast.error('Custom sections with titles must have at least one item', {
          duration: 3000,
        });
      } else if (hasEmptyItems) {
        toast.error('Additional details sections with titles must have at least one item', {
          duration: 3000,
        });
      } else {
        toast.error('Please fill in all required fields', {
          duration: 3000,
        });
      }
      return;
    }
    
    // Save all Protocol Information sections
    localStorage.setItem('protocolNumber', protocolNumber);
    setSavedProtocolNumber(protocolNumber);
    
    localStorage.setItem('enrollmentWindow', enrollmentWindow);
    setSavedEnrollmentWindow(enrollmentWindow);
    
    // Save section titles
    localStorage.setItem('recruitmentTitle', recruitmentTitle);
    setSavedRecruitmentTitle(recruitmentTitle);
    localStorage.setItem('staffTitle', staffTitle);
    setSavedStaffTitle(staffTitle);
    localStorage.setItem('infrastructureTitle', infrastructureTitle);
    setSavedInfrastructureTitle(infrastructureTitle);
    localStorage.setItem('regulatoryTitle', regulatoryTitle);
    setSavedRegulatoryTitle(regulatoryTitle);
    
    localStorage.setItem('recruitmentItems', JSON.stringify(recruitmentItems.filter((item: string) => item.trim())));
    localStorage.setItem('staffItems', JSON.stringify(staffItems.filter((item: string) => item.trim())));
    localStorage.setItem('infrastructureItems', JSON.stringify(infrastructureItems));
    localStorage.setItem('regulatoryItems', JSON.stringify(regulatoryItems.filter((item: string) => item.trim())));
    
    // Filter out additional details sections without titles (min requirement) and remove empty subitems
    const cleanedAdditionalDetails = additionalDetailsItems
      .filter(item => item.text.trim()) // Only keep sections with titles
      .map(item => ({
        ...item,
        subItems: item.subItems ? item.subItems.filter((subItem: string) => subItem.trim()) : []
      }));
    localStorage.setItem('additionalDetailsItems', JSON.stringify(cleanedAdditionalDetails));
    setAdditionalDetailsItems(cleanedAdditionalDetails);
    
    localStorage.setItem('inclusionItems', JSON.stringify(inclusionItems.filter((item: string) => item.trim())));
    localStorage.setItem('exclusionItems', JSON.stringify(exclusionItems.filter((item: string) => item.trim())));
    
    // Filter out custom sections without titles (min requirement) and remove empty items
    const cleanedCustomSections = customSections
      .filter(section => section.title.trim()) // Only keep sections with titles
      .map(section => ({
        ...section,
        items: section.items.filter((item: string) => item.trim())
      }));
    localStorage.setItem('customSections', JSON.stringify(cleanedCustomSections));
    
    // Update state with cleaned sections
    setCustomSections(cleanedCustomSections);
    
    setEditingProtocolInfo(false);
    setProtocolInfoHasChanges(false); // Reset changes tracker after save
    toast.success('Protocol Information saved', {
      duration: 2000,
    });
  };

  // Handle Protocol Information cancel
  const handleCancelProtocolInfo = () => {
    // Restore original data for all sections
    setProtocolNumber(savedProtocolNumber);
    setEnrollmentWindow(savedEnrollmentWindow);
    
    // Restore section titles
    setRecruitmentTitle(savedRecruitmentTitle);
    setStaffTitle(savedStaffTitle);
    setInfrastructureTitle(savedInfrastructureTitle);
    setRegulatoryTitle(savedRegulatoryTitle);
    
    setRecruitmentItems([...originalRecruitmentItems]);
    setStaffItems([...originalStaffItems]);
    setInfrastructureItems([...originalInfrastructureItems]);
    setRegulatoryItems([...originalRegulatoryItems]);
    setAdditionalDetailsItems([...originalAdditionalDetailsItems]);
    setInclusionItems([...originalInclusionItems]);
    setExclusionItems([...originalExclusionItems]);
    setCustomSections([...originalCustomSections]);
    setEditingProtocolInfo(false);
    setProtocolInfoHasChanges(false); // Reset changes tracker on cancel
  };

  // Handle cancel - directly discard changes without confirmation
  const handleCancelEdit = (
    section: 'recruitment' | 'staff' | 'infrastructure' | 'regulatory' | 'additional' | 'inclusion' | 'exclusion' | 'gspSite' | 'gspStaffing' | 'gspInfrastructure' | 'gspQuality' | 'gspPatient' | 'gspStrategic'
  ) => {
    // Restore original data for all sections
    switch (section) {
      case "recruitment":
        setRecruitmentItems([...originalRecruitmentItems]);
        setEditingRecruitment(false);
        break;
      case "staff":
        setStaffItems([...originalStaffItems]);
        setEditingStaff(false);
        break;
      case "infrastructure":
        setInfrastructureItems([...originalInfrastructureItems]);
        setEditingInfrastructure(false);
        break;
      case "regulatory":
        setRegulatoryItems([...originalRegulatoryItems]);
        setEditingRegulatory(false);
        break;
      case "additional":
        setAdditionalDetailsItems([...originalAdditionalDetailsItems]);
        setEditingAdditional(false);
        break;
      case "inclusion":
        setInclusionItems([...originalInclusionItems]);
        setEditingInclusion(false);
        break;
      case "exclusion":
        setExclusionItems([...originalExclusionItems]);
        setEditingExclusion(false);
        break;
      case "gspSite":
        setGspSiteItems([...originalGspSiteItems]);
        setEditingGspSite(false);
        break;
      case "gspStaffing":
        setGspStaffingItems([...originalGspStaffingItems]);
        setEditingGspStaffing(false);
        break;
      case "gspInfrastructure":
        setGspInfrastructureItems([...originalGspInfrastructureItems]);
        setEditingGspInfrastructure(false);
        break;
      case "gspQuality":
        setGspQualityItems([...originalGspQualityItems]);
        setEditingGspQuality(false);
        break;
      case "gspPatient":
        setGspPatientItems([...originalGspPatientItems]);
        setEditingGspPatient(false);
        break;
      case "gspStrategic":
        setGspStrategicItems([...originalGspStrategicItems]);
        setEditingGspStrategic(false);
        break;
    }
  };

  // Confirm discarding changes and restore original data
  const confirmCancelEdit = () => {
    if (!pendingSection) return;

    // Restore original data for all sections
    if (pendingSection === "recruitment") {
      setRecruitmentItems([...originalRecruitmentItems]);
      setEditingRecruitment(false);
    }
    if (pendingSection === "staff") {
      setStaffItems([...originalStaffItems]);
      setEditingStaff(false);
    }
    if (pendingSection === "infrastructure") {
      setInfrastructureItems([...originalInfrastructureItems]);
      setEditingInfrastructure(false);
    }
    if (pendingSection === "regulatory") {
      setRegulatoryItems([...originalRegulatoryItems]);
      setEditingRegulatory(false);
    }
    if (pendingSection === "additional") {
      setAdditionalDetailsItems([...originalAdditionalDetailsItems]);
      setEditingAdditional(false);
    }
    if (pendingSection === "inclusion") {
      setInclusionItems([...originalInclusionItems]);
      setEditingInclusion(false);
    }
    if (pendingSection === "exclusion") {
      setExclusionItems([...originalExclusionItems]);
      setEditingExclusion(false);
    }
    if (pendingSection === "gspSite") {
      setGspSiteItems([...originalGspSiteItems]);
      setEditingGspSite(false);
    }
    if (pendingSection === "gspStaffing") {
      setGspStaffingItems([...originalGspStaffingItems]);
      setEditingGspStaffing(false);
    }
    if (pendingSection === "gspInfrastructure") {
      setGspInfrastructureItems([...originalGspInfrastructureItems]);
      setEditingGspInfrastructure(false);
    }
    if (pendingSection === "gspQuality") {
      setGspQualityItems([...originalGspQualityItems]);
      setEditingGspQuality(false);
    }
    if (pendingSection === "gspPatient") {
      setGspPatientItems([...originalGspPatientItems]);
      setEditingGspPatient(false);
    }
    if (pendingSection === "gspStrategic") {
      setGspStrategicItems([...originalGspStrategicItems]);
      setEditingGspStrategic(false);
    }

    setShowDiscardDialog(false);
    setPendingSection(null);
  };

  // Handle section edit - reset reviewed state when saved (not when editing starts)
  const handleSectionEdit = (
    section:
      | "recruitment"
      | "staff"
      | "infrastructure"
      | "regulatory"
      | "additional"
      | "inclusion"
      | "exclusion",
    editing: boolean,
  ) => {
    // When saving (editing changes from true to false), reset reviewed state and GSP generated state
    if (!editing) {
      setIsReviewed(false); // Reset to "Mark as Reviewed" when saving changes
      setGspGenerated(false); // Reset to "Generate Golden Site Profile" when saving changes
    }

    switch (section) {
      case "recruitment":
        setEditingRecruitment(editing);
        break;
      case "staff":
        setEditingStaff(editing);
        break;
      case "infrastructure":
        setEditingInfrastructure(editing);
        break;
      case "regulatory":
        setEditingRegulatory(editing);
        break;
      case "additional":
        setEditingAdditional(editing);
        break;
      case "inclusion":
        setEditingInclusion(editing);
        break;
      case "exclusion":
        setEditingExclusion(editing);
        break;
    }
  };

  // Handle Golden Site Profile generation
  const handleGenerateGSP = async () => {
    resetAllEditStates();
    setIsGeneratingGSP(true);
    setGspProgress(0);

    // Simulate realistic processing with incremental progress
    const duration = 6000; // 6 seconds total
    const steps = 100;
    const intervalTime = duration / steps;

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 1;
      setGspProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsGeneratingGSP(false);
        setGspGenerated(true);
      }
    }, intervalTime);
  };

  // Handle missing info item editing
  const handleMissingInfoEdit = (
    index: number,
    newValue: string,
  ) => {
    const updatedItems = [...missingInfoItems];
    updatedItems[index].value = newValue;
    setMissingInfoItems(updatedItems);
  };

  const toggleMissingInfoEdit = (index: number) => {
    const updatedItems = [...missingInfoItems];
    updatedItems[index].editing = !updatedItems[index].editing;

    // If we're saving (editing becomes false), reset reviewed state
    if (!updatedItems[index].editing) {
      setIsReviewed(false);
      setGspGenerated(false);
    }

    setMissingInfoItems(updatedItems);
  };

  // Handle View Golden Site Profile
  const handleViewGSP = () => {
    resetAllEditStates();
    setShowGSPFullScreen(true);
  };

  // Handle Close GSP Full Screen
  const handleCloseGSP = () => {
    setShowGSPFullScreen(false);
  };

  // Handle delete section confirmation
  const handleDeleteSection = (sectionId: string, sectionTitle: string) => {
    setDeleteConfirmation({
      isOpen: true,
      sectionId,
      sectionTitle,
    });
  };

  // Confirm delete section
  const confirmDeleteSection = () => {
    if (deleteConfirmation.sectionId) {
      // Check if it's an additional details section (starts with 'additional-')
      if (deleteConfirmation.sectionId.startsWith('additional-')) {
        const index = parseInt(deleteConfirmation.sectionId.replace('additional-', ''));
        const newItems = additionalDetailsItems.filter((_, i) => i !== index);
        setAdditionalDetailsItems(newItems);
        localStorage.setItem('additionalDetailsItems', JSON.stringify(newItems));
      }
      // Check if it's a custom section (starts with 'custom-')
      else if (deleteConfirmation.sectionId.startsWith('custom-')) {
        const updatedSections = customSections.filter(
          section => section.id !== deleteConfirmation.sectionId
        );
        setCustomSections(updatedSections);
        localStorage.setItem('customSections', JSON.stringify(updatedSections));
      } else {
        // It's a default section, add to hidden list
        const updatedHidden = [...hiddenSections, deleteConfirmation.sectionId];
        setHiddenSections(updatedHidden);
        localStorage.setItem('hiddenSections', JSON.stringify(updatedHidden));
      }
      toast.success(`${deleteConfirmation.sectionTitle} deleted`, {
        duration: 2000,
      });
    }
    setDeleteConfirmation({ isOpen: false, sectionId: null, sectionTitle: '' });
  };

  // Cancel delete section
  const cancelDeleteSection = () => {
    setDeleteConfirmation({ isOpen: false, sectionId: null, sectionTitle: '' });
  };

  // Handle add new section
  const handleAddSection = () => {
    // Automatically enter edit mode if not already editing
    if (!editingProtocolInfo) {
      handleEditProtocolInfo();
    }
    
    const newSection: CustomSection = {
      id: `custom-${Date.now()}`,
      title: '',
      items: [''],
    };
    const updatedSections = [...customSections, newSection];
    setCustomSections(updatedSections);
    localStorage.setItem('customSections', JSON.stringify(updatedSections));
    toast.success('New section added', {
      duration: 2000,
    });
  };

  // If showing site scorecard, render the scorecard view
  if (showScorecard) {
    return (
      <>
        {/* Loading Modal - Positioned at root level */}
        <LoadingModal isOpen={loadingScorecards} message="Loading Sites" bodyOnly />
        <SiteSelectionScorecard
          onBack={onBack}
          onDashboardClick={onDashboardClick}
          onClose={() => {
            // Go back to Study Ask Profile (initial view)
            setShowScorecard(false);
            setShowGSPFullScreen(false);
          }}
          onGoldenSiteClick={() => {
            // Go to Golden Site Profile full screen
            setShowScorecard(false);
            setShowGSPFullScreen(true);
          }}
          protocolNumber={protocol.protocolNumber}
        />
      </>
    );
  }

  // If showing GSP full screen, render the full screen view
  if (showGSPFullScreen) {
    return (
      <>
        {/* Loading Modal - Positioned at root level */}
        <LoadingModal isOpen={loadingScorecards} message="Loading Sites" bodyOnly />
        <GoldenSiteProfileFullScreen
          protocol={protocol}
          onClose={handleCloseGSP}
          onBack={onBack}
          onDashboardClick={onDashboardClick}
          showScorecard={showScorecard}
          setShowScorecard={setShowScorecard}
          handleViewScorecards={handleViewScorecards}
          showNavigationDialog={showNavigationDialog}
          setShowNavigationDialog={setShowNavigationDialog}
          pendingNavigation={pendingNavigation}
          setPendingNavigation={setPendingNavigation}
          confirmNavigation={confirmNavigation}
          loadingScorecards={loadingScorecards}
          setLoadingScorecards={setLoadingScorecards}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <Header onDashboardClick={onDashboardClick} />

      {/* Body content wrapper with relative positioning for loading mask */}
      <div className="relative min-h-[calc(100vh-80px)]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "rgba(40, 68, 151, 0.05)" }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-[32rem] h-[32rem] rounded-full blur-3xl"
          style={{ background: "rgba(53, 189, 212, 0.04)" }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.12, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-[90%] mx-auto px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={handleBackNavigation}
                className="flex items-center gap-2 text-gray-600 hover:text-[#284497] transition-colors"
                title="Go to Homepage"
              >
                <Home className="h-4 w-4" />
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={onDashboardClick}
                className="text-gray-600 hover:text-[#284497] transition-colors font-medium"
              >
                Dashboard
              </button>
              <span className="text-gray-400">|</span>
              <span className="text-[#284497] font-semibold">{protocol.studyTitle}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => generateStudyAskPDF(protocol.protocolNumber || 'NCT05165485')}
                size="sm"
                title="Export PDF"
                className="flex items-center gap-2 bg-white text-gray-600 hover:text-gray-800 border border-gray-200/60 hover:border-gray-300 hover:bg-gray-50/50 transition-all"
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                onClick={handleBackNavigation}
                size="sm"
                title="Analyse New Protocol"
                className="flex items-center gap-2 bg-white text-gray-600 hover:text-gray-800 border border-gray-200/60 hover:border-gray-300 hover:bg-gray-50/50 transition-all"
              >
                <Plus className="h-4 w-4" />
              </Button>

              <Button
                onClick={handleViewGSP}
                size="sm"
                className="flex items-center gap-2 bg-sky-100 text-sky-700 hover:bg-sky-200 hover:text-sky-800 transition-all"
              >
                <Award className="h-4 w-4" />
                Golden Site Profile
              </Button>

              <Button
                onClick={handleViewScorecards}
                size="sm"
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
              >
                <TrendingUp className="h-4 w-4" />
               View Sites
              </Button>
            </div>
          </nav>

          {/* 6:6 Two Column Layout */}
          <div className="grid grid-cols-12 gap-4">
            {/* LEFT COLUMN - Protocol Information (EXPANDED TO FULL WIDTH) */}
            <div className="col-span-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-5 space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#284497] to-[#35bdd4] flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#061e47]">
                        Protocol Information
                      </h2>
                      <p className="text-sm text-gray-600">
                        AI-extracted protocol details and study
                        requirements
                      </p>
                    </div>
                  </div>
                  
                  {/* Edit/Save/Cancel buttons */}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-500 font-regular">
                      Make all edits together and save them in a single step.
                    </span>
                    {!editingProtocolInfo ? (
                      <button
                        onClick={handleEditProtocolInfo}
                        className="px-4 py-2 rounded-lg bg-white text-[#284497] hover:bg-blue-50 transition-all shadow-sm border border-gray-200 font-medium text-sm flex items-center gap-2"
                        title="Edit Protocol Information"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                    ) : (
                      <>
                        <div className="relative inline-flex group">
                          <button
                            onClick={handleSaveProtocolInfo}
                            disabled={
                              !protocolInfoHasChanges ||
                              !protocolNumber.trim() || 
                              additionalDetailsItems.some(item => !item.text.trim()) ||
                              additionalDetailsItems.some(item => item.text.trim() && (item.subItems && item.subItems.every((subItem: string) => !subItem.trim()))) ||
                              customSections.some(section => !section.title.trim()) ||
                              customSections.some(section => section.title.trim() && section.items.every((item: string) => !item.trim()))
                            }
                            className={`px-4 py-2 rounded-lg transition-all shadow-sm border font-medium text-sm flex items-center gap-2 ${
                              !protocolInfoHasChanges ||
                              !protocolNumber.trim() || 
                              additionalDetailsItems.some(item => !item.text.trim()) ||
                              additionalDetailsItems.some(item => item.text.trim() && (item.subItems && item.subItems.every((subItem: string) => !subItem.trim()))) ||
                              customSections.some(section => !section.title.trim()) ||
                              customSections.some(section => section.title.trim() && section.items.every((item: string) => !item.trim()))
                                ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                : 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200'
                            }`}
                          >
                            <Save className="h-4 w-4" />
                            Save
                          </button>
                          {(
                            !protocolInfoHasChanges ||
                            !protocolNumber.trim() || 
                            additionalDetailsItems.some(item => !item.text.trim() || (item.subItems && item.subItems.some((subItem: string) => !subItem.trim()))) ||
                            customSections.some(section => !section.title.trim()) ||
                            customSections.some(section => section.title.trim() && section.items.every((item: string) => !item.trim()))
                          ) && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                              {!protocolInfoHasChanges
                                ? 'No changes to save'
                                : customSections.some(section => !section.title.trim())
                                ? 'All section titles must be filled'
                                : customSections.some(section => section.title.trim() && section.items.every((item: string) => !item.trim())) 
                                ? 'Custom sections with titles must have items'
                                : additionalDetailsItems.some(item => item.text.trim() && (item.subItems && item.subItems.every((subItem: string) => !subItem.trim())))
                                ? 'Additional details with titles must have items'
                                : 'Fields shouldn\'t be empty'}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={handleCancelProtocolInfo}
                          className="px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm border border-gray-200 font-medium text-sm flex items-center gap-2"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Study & Classification */}
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-3 bg-blue-50/50 rounded-lg p-3 border border-blue-200">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-semibold text-gray-700 text-[14px]">
                        Protocol Number:
                      </p>
                      {editingProtocolInfo ? (
                        <input
                          type="text"
                          value={protocolNumber}
                          onChange={(e) => {
                            setProtocolNumber(e.target.value);
                            setProtocolInfoHasChanges(true);
                          }}
                          className={`px-2 py-1 text-sm font-normal text-[#061e47] bg-white border rounded focus:outline-none focus:ring-2 ${
                            validationErrors.protocolNumber
                              ? 'border-red-500 focus:ring-red-400'
                              : 'border-blue-300 focus:ring-blue-400 focus:border-transparent'
                          }`}
                          placeholder="Enter protocol number"
                        />
                      ) : (
                        <p className="text-sm font-normal text-[#061e47]">
                          {protocolNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-5 bg-blue-50/50 rounded-lg p-3 border border-blue-200">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-semibold text-gray-700 text-[14px]">
                        Classification Label:
                      </p>
                      <p className="text-sm font-normal text-[#061e47]">
                        ICS-naive COPD cardiopulmonary outcomes trial
                      </p>
                    </div>
                  </div>
                  <div className="col-span-4 bg-blue-50/50 rounded-lg p-3 border border-blue-200">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-semibold text-gray-700 text-[14px]">
                        Enter Enrollment Window (months):
                      </p>
                      <div className="flex items-center gap-2">
                        {!editingProtocolInfo ? (
                          <div className="relative inline-flex group">
                            <input
                              type="text"
                              value={enrollmentWindow}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow only numbers and limit to 3 characters
                                if (/^\d{0,3}$/.test(value)) {
                                  // Treat "0" as null/empty
                                  setEnrollmentWindow(value === '0' ? '' : value);
                                }
                              }}
                              maxLength={3}
                              className="w-20 px-2 py-1 text-sm font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded cursor-not-allowed text-center placeholder:text-gray-400"
                              placeholder="e.g. 12"
                              disabled={!editingProtocolInfo}
                            />
                            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                              Click Edit button to enter enrollment duration
                              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                            </div>
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={enrollmentWindow}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Allow only numbers and limit to 3 characters
                              if (/^\d{0,3}$/.test(value)) {
                                // Treat "0" as null/empty
                                setEnrollmentWindow(value === '0' ? '' : value);
                                setProtocolInfoHasChanges(true);
                              }
                            }}
                            maxLength={3}
                            className="w-20 px-2 py-1 text-sm font-semibold text-[#061e47] bg-white border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-center placeholder:text-gray-400"
                            placeholder="e.g. 12"
                          />
                        )}
                        <p className="text-[10px] text-gray-500 leading-tight">Expected study enrollment duration</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Study Ask Profile */}
                <div className="space-y-4">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-semibold text-[#061e47] text-[20px]">
                      Study Ask Profile
                    </h3>
                  </div>

                  {/* 2 Cards Per Row Grid - DESIGN OPTION 3 */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Recruitment Card */}
                    {!hiddenSections.includes('recruitment') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                    >
                      {/* Card Content */}
                      <div className="relative p-5">
                        {/* Header with Delete Button */}
                        <div className="mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                          <h4 className="font-bold text-[#061e47] text-[17px]">
                            {recruitmentTitle}
                          </h4>
                          {editingProtocolInfo && (
                            <button
                              onClick={() => handleDeleteSection('recruitment', recruitmentTitle)}
                              className="flex items-center gap-1 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md px-2 py-1 text-xs font-medium transition-all shadow-sm hover:shadow"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                              Delete Section
                            </button>
                          )}
                        </div>

                        {/* Content List */}
                        {!editingProtocolInfo ? (
                          <ul className="space-y-3 text-sm text-gray-700">
                            {recruitmentItems.map(
                              (item, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-3"
                                >
                                  <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                                  <span className="leading-relaxed">
                                    {item}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <BulletedEditList
                            items={recruitmentItems}
                            onChange={(items) => {
                              setRecruitmentItems(items);
                              setProtocolInfoHasChanges(true);
                            }}
                            placeholder="Enter item text..."
                          />
                        )}
                      </div>
                    </motion.div>
                    )}

                    {/* Staff & Procedures Card */}
                    {!hiddenSections.includes('staff') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                    >
                      {/* Card Content */}
                      <div className="relative p-5">
                        {/* Header with Delete Button */}
                        <div className="mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                          <h4 className="font-bold text-[#061e47] text-[17px]">
                            {staffTitle}
                          </h4>
                          {editingProtocolInfo && (
                            <button
                              onClick={() => handleDeleteSection('staff', staffTitle)}
                              className="flex items-center gap-1 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md px-2 py-1 text-xs font-medium transition-all shadow-sm hover:shadow"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                              Delete Section
                            </button>
                          )}
                        </div>

                        {/* Content List */}
                        {!editingProtocolInfo ? (
                          <ul className="space-y-3 text-sm text-gray-700">
                            {staffItems.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                                <span className="leading-relaxed">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <BulletedEditList
                            items={staffItems}
                            onChange={(items) => {
                              setStaffItems(items);
                              setProtocolInfoHasChanges(true);
                            }}
                            placeholder="Enter item text..."
                          />
                        )}
                      </div>
                    </motion.div>
                    )}

                    {/* Infrastructure & Facilities Card */}
                    {!hiddenSections.includes('infrastructure') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                    >
                      {/* Card Content */}
                      <div className="relative p-5">
                        {/* Header with Delete Button */}
                        <div className="mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                          <h4 className="font-bold text-[#061e47] text-[17px]">
                            {infrastructureTitle}
                          </h4>
                          {editingProtocolInfo && (
                            <button
                              onClick={() => handleDeleteSection('infrastructure', infrastructureTitle)}
                              className="flex items-center gap-1 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md px-2 py-1 text-xs font-medium transition-all shadow-sm hover:shadow"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                              Delete Section
                            </button>
                          )}
                        </div>

                        {/* Content List */}
                        {!editingProtocolInfo ? (
                          <ul className="space-y-3 text-sm text-gray-700">
                            {infrastructureItems.map(
                              (item, index) => (
                                <li
                                  key={index}
                                  className="space-y-2"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                                    <span className="leading-relaxed">
                                      {item.text}
                                    </span>
                                  </div>
                                  {item.subItems && item.subItems.length > 0 && (
                                    <ul className="ml-7 space-y-1.5">
                                      {item.subItems.map((subItem, subIndex) => (
                                        <li key={subIndex} className="flex items-start gap-2">
                                          <div className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0 mt-2"></div>
                                          <span className="leading-relaxed text-gray-600">
                                            {subItem}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <BulletedEditList
                            items={infrastructureItems.map(item => item.text)}
                            onChange={(newTexts) => {
                              setInfrastructureItems(newTexts.map(text => ({ text, subItems: [] })));
                              setProtocolInfoHasChanges(true);
                            }}
                            placeholder="Enter item text..."
                          />
                        )}
                      </div>
                    </motion.div>
                    )}

                    {/* Regulatory & Startup Card */}
                    {!hiddenSections.includes('regulatory') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                    >
                      {/* Card Content */}
                      <div className="relative p-5">
                        {/* Header with Delete Button */}
                        <div className="mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                          <h4 className="font-bold text-[#061e47] text-[17px]">
                            {regulatoryTitle}
                          </h4>
                          {editingProtocolInfo && (
                            <button
                              onClick={() => handleDeleteSection('regulatory', regulatoryTitle)}
                              className="flex items-center gap-1 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md px-2 py-1 text-xs font-medium transition-all shadow-sm hover:shadow"
                            >
                              <Trash2 className="h-2.5 w-2.5" />
                              Delete Section
                            </button>
                          )}
                        </div>

                        {/* Content List */}
                        {!editingProtocolInfo ? (
                          <ul className="space-y-3 text-sm text-gray-700">
                            {regulatoryItems.map(
                              (item, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-3"
                                >
                                  <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                                  <span className="leading-relaxed">
                                    {item}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        ) : (
                          <BulletedEditList
                            items={regulatoryItems}
                            onChange={(items) => {
                              setRegulatoryItems(items);
                              setProtocolInfoHasChanges(true);
                            }}
                            placeholder="Enter item text..."
                          />
                        )}
                      </div>
                    </motion.div>
                    )}

                    {/* Custom Sections - Fill available grid slots */}
                    {(() => {
                      // Calculate available slots in the 2x2 grid
                      const baseCardCount = ['recruitment', 'staff', 'infrastructure', 'regulatory']
                        .filter(section => !hiddenSections.includes(section)).length;
                      const availableSlots = 4 - baseCardCount;
                      const customInGrid = customSections.slice(0, availableSlots);
                      
                      return customInGrid.map((section, sectionIndex) => {
                        const hasValidationError = editingProtocolInfo && (!section.title.trim() || section.items.every((item: string) => !item.trim()));
                        return (
                        <motion.div
                          key={section.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 * (baseCardCount + sectionIndex) }}
                          className={`relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border ${hasValidationError ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-100'}`}
                        >
                          <div className="relative p-5">
                            {/* Header with Delete Button */}
                            <div className="mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                              {!editingProtocolInfo ? (
                                <h4 className="font-bold text-[#061e47] text-[17px]">
                                  {section.title}
                                </h4>
                              ) : (
                                <input
                                  type="text"
                                  value={section.title}
                                  onChange={(e) => {
                                    const updatedSections = [...customSections];
                                    updatedSections[sectionIndex].title = e.target.value;
                                    setCustomSections(updatedSections);
                                    setProtocolInfoHasChanges(true);
                                  }}
                                  className={`flex-1 font-bold text-[#061e47] text-[17px] bg-white border rounded px-2 py-1 focus:outline-none focus:ring-2 ${!section.title.trim() ? 'border-red-300 focus:ring-red-400 focus:border-red-400' : 'border-blue-300 focus:ring-blue-400 focus:border-transparent'}`}
                                  placeholder="Enter section title..."
                                />
                              )}
                              {editingProtocolInfo && (
                                <button
                                  onClick={() => handleDeleteSection(section.id, section.title)}
                                  className="ml-3 flex items-center gap-1 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md px-2 py-1 text-xs font-medium transition-all shadow-sm hover:shadow"
                                >
                                  <Trash2 className="h-2.5 w-2.5" />
                                  Delete Section
                                </button>
                              )}
                            </div>

                            {/* Content List */}
                            {!editingProtocolInfo ? (
                              <ul className="space-y-3 text-sm text-gray-700">
                                {section.items.map((item, index) => (
                                  <li key={index} className="flex items-start gap-3">
                                    <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                                    <span className="leading-relaxed">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <BulletedEditList
                                items={section.items}
                                onChange={(newItems) => {
                                  const updatedSections = [...customSections];
                                  updatedSections[sectionIndex].items = newItems;
                                  setCustomSections(updatedSections);
                                  setProtocolInfoHasChanges(true);
                                }}
                                placeholder="Enter item text..."
                              />
                            )}
                          </div>
                        </motion.div>
                        );
                      });
                    })()}
                  </div>

                  {/* Custom Sections - Overflow sections appear above Add Section button in 2x2 grid */}
                  {(() => {
                    const baseCardCount = ['recruitment', 'staff', 'infrastructure', 'regulatory']
                      .filter(section => !hiddenSections.includes(section)).length;
                    const availableSlots = 4 - baseCardCount;
                    const overflowSections = customSections.slice(availableSlots);
                    
                    if (overflowSections.length === 0) return null;
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {overflowSections.map((section, overflowIndex) => {
                          const actualIndex = availableSlots + overflowIndex; // Calculate actual index in customSections array
                          const hasValidationError = editingProtocolInfo && (!section.title.trim() || section.items.every((item: string) => !item.trim()));
                          
                          return (
                            <motion.div
                              key={section.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.1 * (overflowIndex + 1) }}
                              className={`relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border ${hasValidationError ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-100'}`}
                            >
                              <div className="relative p-5">
                                {/* Header with Delete Button */}
                                <div className="mb-4 pb-3 border-b border-gray-100 flex items-center justify-between">
                                  {!editingProtocolInfo ? (
                                    <h4 className="font-bold text-[#061e47] text-[17px]">
                                      {section.title}
                                    </h4>
                                  ) : (
                                    <input
                                      type="text"
                                      value={section.title}
                                      onChange={(e) => {
                                        const updatedSections = [...customSections];
                                        updatedSections[actualIndex].title = e.target.value;
                                        setCustomSections(updatedSections);
                                        setProtocolInfoHasChanges(true);
                                      }}
                                      className={`flex-1 font-semibold text-gray-700 leading-relaxed border-b border-transparent hover:border-gray-300 focus:border-[#284497] outline-none bg-transparent transition-colors placeholder:text-gray-400 placeholder:font-normal'}`}
                                      placeholder="Enter section title..."
                                    />
                                  )}
                                  {editingProtocolInfo && (
                                    <button
                                      onClick={() => handleDeleteSection(section.id, section.title)}
                                      className="ml-3 flex items-center gap-1 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md px-2 py-1 text-xs font-medium transition-all shadow-sm hover:shadow"
                                    >
                                      <Trash2 className="h-2.5 w-2.5" />
                                      Delete Section
                                    </button>
                                  )}
                                </div>

                                {/* Content List */}
                                {!editingProtocolInfo ? (
                                  <ul className="space-y-3 text-sm text-gray-700">
                                    {section.items.map((item, index) => (
                                      <li key={index} className="flex items-start gap-3">
                                        <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                                        <span className="leading-relaxed">{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <BulletedEditList
                                    items={section.items}
                                    onChange={(newItems) => {
                                      const updatedSections = [...customSections];
                                      updatedSections[actualIndex].items = newItems;
                                      setCustomSections(updatedSections);
                                      setProtocolInfoHasChanges(true);
                                    }}
                                    placeholder="Enter item text..."
                                  />
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    );
                  })()}

                  {/* Validation Warning for Custom Sections */}
                  {editingProtocolInfo && customSections.some(section => !section.title.trim() || section.items.every((item: string) => !item.trim())) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">Custom sections need attention</p>
                        <p className="text-xs text-red-600 mt-1">Please ensure all custom sections have a title and at least one item before saving.</p>
                      </div>
                    </div>
                  )}

                  {/* Add Section Button - Only visible in edit mode, cute and tiny */}
                  {editingProtocolInfo && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={handleAddSection}
                      className="mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border border-dashed border-blue-300 rounded-lg px-3 py-1.5 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-400 transition-all flex items-center justify-center gap-1.5 text-blue-600 font-medium text-xs shadow-sm hover:shadow"
                    >
                      <Plus className="h-3 w-3" />
                      Add Section
                    </motion.button>
                  )}

                  {/* Protocol Feasibility Insights - HIDDEN FOR NOW */}
                  {false && (
                  <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-xl border-2 border-amber-200/60 overflow-hidden">
                    {/* Collapsible Header */}
                    <button
                      onClick={() =>
                        setAttributesExpanded(
                          !attributesExpanded,
                        )
                      }
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-amber-100/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-[#061e47] text-[15px]">
                            Protocol Feasibility Insights
                          </h3>
                          <p className="text-xs text-gray-600">
                            {missingInfoItems.filter(
                              (item) =>
                                !item.value ||
                                item.value.trim() === "",
                            ).length > 0 ? (
                              <span className="text-amber-700 font-medium">
                                {
                                  missingInfoItems.filter(
                                    (item) =>
                                      !item.value ||
                                      item.value.trim() === "",
                                  ).length
                                }{" "}
                                missing item(s) ·{" "}
                                {
                                  protocolInsights.highBarriers
                                    .length
                                }{" "}
                                high barriers identified
                              </span>
                            ) : (
                              <span className="text-green-700 font-medium">
                                All information captured ·
                                Review barriers below
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!attributesExpanded &&
                          missingInfoItems.filter(
                            (item) =>
                              !item.value ||
                              item.value.trim() === "",
                          ).length > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 border border-red-300">
                              <AlertCircle className="h-3 w-3 text-red-700" />
                              <span className="text-[10px] font-bold text-red-700">
                                ACTION NEEDED
                              </span>
                            </div>
                          )}
                        {attributesExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                    </button>

                    {/* Expandable Content */}
                    {attributesExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-amber-200/60"
                      >
                        <div className="p-5 bg-white/40 space-y-5">
                          {/* Missing Information Section - Compact Table Style */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <h4 className="font-semibold text-[#061e47] text-[15px]">
                                Missing Information
                              </h4>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                Click pencil icon to add
                              </span>
                              <div className="flex-1 border-b border-gray-300"></div>
                            </div>

                            {/* Compact Table-Like Layout */}
                            <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
                              {missingInfoItems.map(
                                (item, index) => (
                                  <div
                                    key={index}
                                    className={`grid grid-cols-[200px_1fr_90px] gap-4 items-center p-3 hover:bg-red-50/30 transition-colors ${
                                      index !==
                                      missingInfoItems.length -
                                        1
                                        ? "border-b border-red-100"
                                        : ""
                                    }`}
                                  >
                                    {/* Field Label */}
                                    <div>
                                      <p className="text-sm font-bold text-gray-800">
                                        {item.label}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-0.5">
                                        {item.description}
                                      </p>
                                    </div>

                                    {/* Value or Input */}
                                    <div>
                                      {!item.editing ? (
                                        <p
                                          className={`text-sm ${item.value ? "text-[#061e47] font-medium" : "text-red-500 italic"}`}
                                        >
                                          {item.value ||
                                            "Not provided"}
                                        </p>
                                      ) : (
                                        <input
                                          type="text"
                                          value={item.value}
                                          onChange={(e) =>
                                            handleMissingInfoEdit(
                                              index,
                                              e.target.value,
                                            )
                                          }
                                          placeholder={`Enter ${item.label.toLowerCase()}...`}
                                          className="w-full px-2 py-1.5 text-sm border-2 border-[#284497] rounded-md focus:outline-none focus:ring-2 focus:ring-[#284497]/30"
                                          autoFocus
                                        />
                                      )}
                                    </div>

                                    {/* Edit/Save Button */}
                                    <div className="flex justify-end">
                                      {!item.editing ? (
                                        <button
                                          onClick={() =>
                                            toggleMissingInfoEdit(
                                              index,
                                            )
                                          }
                                          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-[#284497] hover:bg-blue-50 rounded transition-colors"
                                        >
                                          <Edit2 className="h-4 w-4" />
                                          <span>Edit</span>
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() =>
                                            toggleMissingInfoEdit(
                                              index,
                                            )
                                          }
                                          className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                                        >
                                          <Save className="h-4 w-4" />
                                          <span>Save</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Barriers Grid - Side by Side */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* High Barriers Section */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <h4 className="font-semibold text-[#061e47] text-[15px]">
                                  High Barriers
                                </h4>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">
                                Significant feasibility
                                challenges
                              </p>
                              <div className="space-y-2">
                                {protocolInsights.highBarriers.map(
                                  (barrier, index) => (
                                    <div
                                      key={index}
                                      className="bg-white border border-red-300 rounded-lg p-3 hover:shadow-md transition-shadow"
                                    >
                                      <h5 className="text-sm font-bold text-red-700 mb-1">
                                        {barrier.title}
                                      </h5>
                                      <p className="text-xs text-gray-700 mb-1.5 leading-relaxed">
                                        {barrier.description}
                                      </p>
                                      <div className="flex items-start gap-1.5 bg-red-50 rounded p-2">
                                        <Info className="h-3.5 w-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-700 leading-snug">
                                          <span className="font-semibold">
                                            Impact:
                                          </span>{" "}
                                          {barrier.impact}
                                        </p>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>

                            {/* Moderate Barriers Section */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <h4 className="font-semibold text-[#061e47] text-[15px]">
                                  Moderate Barriers
                                </h4>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">
                                Manageable challenges
                              </p>
                              <div className="space-y-2">
                                {protocolInsights.moderateBarriers.map(
                                  (barrier, index) => (
                                    <div
                                      key={index}
                                      className="bg-white border border-amber-300 rounded-lg p-3 hover:shadow-md transition-shadow"
                                    >
                                      <h5 className="text-sm font-bold text-amber-700 mb-1">
                                        {barrier.title}
                                      </h5>
                                      <p className="text-xs text-gray-700 mb-1.5 leading-relaxed">
                                        {barrier.description}
                                      </p>
                                      <div className="flex items-start gap-1.5 bg-amber-50 rounded p-2">
                                        <Info className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-700 leading-snug">
                                          <span className="font-semibold">
                                            Impact:
                                          </span>{" "}
                                          {barrier.impact}
                                        </p>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>

                          {/* FQ Flagged Challenges Section - Horizontal Cards */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-4 w-4 text-[#284497]" />
                              <h4 className="font-semibold text-[#061e47] text-[15px]">
                                FQ Flagged Challenges
                              </h4>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                From Feasibility Questionnaire
                              </span>
                              <div className="flex-1 border-b border-gray-300"></div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              {protocolInsights.fqFlaggedChallenges.map(
                                (challenge, index) => (
                                  <div
                                    key={index}
                                    className={`bg-white border rounded-lg p-3 hover:shadow-md transition-shadow ${
                                      challenge.severity ===
                                      "high"
                                        ? "border-blue-400"
                                        : "border-blue-300"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-1 mb-1.5">
                                      <h5 className="text-sm font-bold text-[#284497] leading-tight">
                                        {challenge.title}
                                      </h5>
                                      <div
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 ${
                                          challenge.severity ===
                                          "high"
                                            ? "bg-red-100 text-red-700 border border-red-300"
                                            : "bg-amber-100 text-amber-700 border border-amber-300"
                                        }`}
                                      >
                                        {challenge.severity.toUpperCase()}
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-700 mb-1.5 leading-relaxed">
                                      {challenge.description}
                                    </p>
                                    <p className="text-[10px] text-[#284497] italic">
                                      📋 {challenge.source}
                                    </p>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  )}

                  {/* Additional Cards */}
                  <div className="space-y-4 pt-2">
                    {/* Additional Details - Card */}
                    {!hiddenSections.includes('additionalDetails') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                      className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                    >
                      <div className="relative p-5">
                        <div className="mb-4 pb-3 border-b border-gray-100">
                          <h4 className="font-bold text-[#061e47] text-[17px]">
                            Additional Details
                          </h4>
                        </div>
                        
                        {!editingProtocolInfo ? (
                          <div className="grid grid-cols-2 gap-6">
                            {additionalDetailsItems.map((item, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-start gap-3">
                                 
                                  <span className="font-semibold text-sm text-gray-700 leading-relaxed">
                                    {item.text}
                                  </span>
                                </div>
                                {item.subItems && item.subItems.length > 0 && (
                                  <ul className=" space-y-1.5">
                                    {item.subItems.map((subItem, subIndex) => (
                                      <li key={subIndex} className="flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                                        <span className="leading-relaxed text-sm text-gray-600">
                                          {subItem}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-6">
                            {additionalDetailsItems.map((item, index) => (
                              <div key={index} className="border border-gray-300 rounded-lg p-4 focus-within:ring-2 focus-within:ring-[#284497] focus-within:border-transparent bg-white">
                                {/* Section Header - Editable Title with Delete Button */}
                                <div className="flex items-start justify-between mb-3 gap-2">
                                  <input
                                    type="text"
                                    ref={index === additionalDetailsItems.length - 1 ? newSectionTitleRef : null}
                                    value={item.text}
                                    onChange={(e) => {
                                      const newItems = [...additionalDetailsItems];
                                      newItems[index] = { ...newItems[index], text: e.target.value };
                                      setAdditionalDetailsItems(newItems);
                                      setProtocolInfoHasChanges(true);
                                    }}
                                    onFocus={(e) => {
                                      // Keep cursor at the beginning for empty fields
                                      if (item.text === '') {
                                        e.target.setSelectionRange(0, 0);
                                      }
                                    }}
                                    className="flex-1 font-semibold text-gray-700 leading-relaxed border-b border-transparent hover:border-gray-300 focus:border-[#284497] outline-none bg-transparent transition-colors placeholder:text-gray-400 placeholder:font-normal"
                                    style={{ fontSize: '17px' }}
                                    placeholder="Enter section title..."
                                  />
                                  <button
                                    onClick={() => {
                                      setDeleteConfirmation({
                                        isOpen: true,
                                        sectionId: `additional-${index}`,
                                        sectionTitle: item.text || 'this section',
                                      });
                                    }}
                                    className="flex items-center gap-1 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-md px-2 py-0.5 text-xs font-medium transition-all shadow-sm hover:shadow flex-shrink-0"
                                    title="Delete this section"
                                  >
                                    <Trash2 className="h-2.5 w-2.5" />
                                    Delete Section
                                  </button>
                                </div>

                                {/* Sub-items - Editable */}
                                <div className="space-y-2">
                                    {item.subItems && item.subItems.map((subItem, subIndex) => (
                                      <div key={subIndex} className="flex items-start gap-2">
                                        <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                                        <textarea
                                          value={subItem}
                                          onChange={(e) => {
                                            const newItems = [...additionalDetailsItems];
                                            const newSubItems = [...newItems[index].subItems];
                                            newSubItems[subIndex] = e.target.value;
                                            newItems[index] = { ...newItems[index], subItems: newSubItems };
                                            
                                            // If user is typing in the last item and it's not empty, add a new empty item
                                            if (subIndex === newSubItems.length - 1 && e.target.value.trim() !== '') {
                                              newSubItems.push('');
                                              newItems[index] = { ...newItems[index], subItems: newSubItems };
                                            }
                                            
                                            setAdditionalDetailsItems(newItems);
                                            setProtocolInfoHasChanges(true);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                          }}
                                          onKeyDown={(e) => {
                                            const textarea = e.currentTarget;
                                            const cursorPosition = textarea.selectionStart;
                                            const textLength = textarea.value.length;
                                            
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                              e.preventDefault();
                                              // Only create a new sub-item if the current sub-item has text
                                              if (subItem.trim() !== '') {
                                                const newItems = [...additionalDetailsItems];
                                                const newSubItems = [...newItems[index].subItems];
                                                newSubItems.splice(subIndex + 1, 0, '');
                                                newItems[index] = { ...newItems[index], subItems: newSubItems };
                                                setAdditionalDetailsItems(newItems);
                                                // Focus the newly created textarea
                                                const parentContainer = e.currentTarget.parentElement?.parentElement;
                                                setTimeout(() => {
                                                  if (parentContainer) {
                                                    const textareas = parentContainer.querySelectorAll('textarea');
                                                    if (textareas && textareas[subIndex + 1]) {
                                                      (textareas[subIndex + 1] as HTMLTextAreaElement).focus();
                                                    }
                                                  }
                                                }, 0);
                                              }
                                            } else if (e.key === 'Backspace' && subItem === '' && item.subItems.length > 1 && cursorPosition === 0) {
                                              // Only remove bullet when field is empty AND cursor is at the start
                                              e.preventDefault();
                                              const newItems = [...additionalDetailsItems];
                                              const newSubItems = newItems[index].subItems.filter((_, i) => i !== subIndex);
                                              newItems[index] = { ...newItems[index], subItems: newSubItems };
                                              setAdditionalDetailsItems(newItems);
                                              // Focus the previous textarea after deletion
                                              const parentContainer = e.currentTarget.parentElement?.parentElement;
                                              setTimeout(() => {
                                                if (parentContainer) {
                                                  const textareas = parentContainer.querySelectorAll('textarea');
                                                  if (textareas && textareas[Math.max(0, subIndex - 1)]) {
                                                    const prevTextarea = textareas[Math.max(0, subIndex - 1)] as HTMLTextAreaElement;
                                                    prevTextarea.focus();
                                                    // Place cursor at the end
                                                    prevTextarea.setSelectionRange(prevTextarea.value.length, prevTextarea.value.length);
                                                  }
                                                }
                                              }, 0);
                                            } else if (e.key === 'ArrowUp' && cursorPosition === 0 && subIndex > 0) {
                                              // Move to previous textarea when at the start and pressing up
                                              e.preventDefault();
                                              const parentContainer = e.currentTarget.parentElement?.parentElement;
                                              if (parentContainer) {
                                                const textareas = parentContainer.querySelectorAll('textarea');
                                                if (textareas && textareas[subIndex - 1]) {
                                                  const prevTextarea = textareas[subIndex - 1] as HTMLTextAreaElement;
                                                  prevTextarea.focus();
                                                  prevTextarea.setSelectionRange(0, 0);
                                                }
                                              }
                                            } else if (e.key === 'ArrowDown' && cursorPosition === textLength && subIndex < item.subItems.length - 1) {
                                              // Move to next textarea when at the end and pressing down
                                              e.preventDefault();
                                              const parentContainer = e.currentTarget.parentElement?.parentElement;
                                              if (parentContainer) {
                                                const textareas = parentContainer.querySelectorAll('textarea');
                                                if (textareas && textareas[subIndex + 1]) {
                                                  const nextTextarea = textareas[subIndex + 1] as HTMLTextAreaElement;
                                                  nextTextarea.focus();
                                                  nextTextarea.setSelectionRange(0, 0);
                                                }
                                              }
                                            } else if (e.key === 'ArrowLeft' && cursorPosition === 0 && subIndex > 0) {
                                              // Move to end of previous textarea when at the start and pressing left
                                              e.preventDefault();
                                              const parentContainer = e.currentTarget.parentElement?.parentElement;
                                              if (parentContainer) {
                                                const textareas = parentContainer.querySelectorAll('textarea');
                                                if (textareas && textareas[subIndex - 1]) {
                                                  const prevTextarea = textareas[subIndex - 1] as HTMLTextAreaElement;
                                                  prevTextarea.focus();
                                                  prevTextarea.setSelectionRange(prevTextarea.value.length, prevTextarea.value.length);
                                                }
                                              }
                                            } else if (e.key === 'ArrowRight' && cursorPosition === textLength && subIndex < item.subItems.length - 1) {
                                              // Move to start of next textarea when at the end and pressing right
                                              e.preventDefault();
                                              const parentContainer = e.currentTarget.parentElement?.parentElement;
                                              if (parentContainer) {
                                                const textareas = parentContainer.querySelectorAll('textarea');
                                                if (textareas && textareas[subIndex + 1]) {
                                                  const nextTextarea = textareas[subIndex + 1] as HTMLTextAreaElement;
                                                  nextTextarea.focus();
                                                  nextTextarea.setSelectionRange(0, 0);
                                                }
                                              }
                                            }
                                          }}
                                          className="flex-1 text-sm text-gray-600 border-none outline-none bg-transparent leading-relaxed resize-none min-h-[24px] overflow-y-auto"
                                          placeholder="Enter item text..."
                                          rows={1}
                                          style={{ height: 'auto' }}
                                          ref={(el) => {
                                            if (el) {
                                              el.style.height = 'auto';
                                              el.style.height = el.scrollHeight + 'px';
                                            }
                                          }}
                                        />
                                      </div>
                                    ))}
                                </div>
                              </div>
                            ))}
                            
                            {/* Add Section Button - Only visible in edit mode */}
                            {editingProtocolInfo && (
                              <div className="col-span-2 flex justify-center mt-3">
                                <motion.button
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3 }}
                                  onClick={() => {
                                    const newSection = {
                                      text: '',
                                      subItems: ['']
                                    };
                                    setAdditionalDetailsItems([...additionalDetailsItems, newSection]);
                                    // Focus the new input with cursor at beginning after state updates
                                    setTimeout(() => {
                                      if (newSectionTitleRef.current) {
                                        newSectionTitleRef.current.focus();
                                        newSectionTitleRef.current.setSelectionRange(0, 0);
                                      }
                                    }, 0);
                                  }}
                                  className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-dashed border-blue-300 rounded-lg px-3 py-1.5 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-400 transition-all flex items-center justify-center gap-1.5 text-blue-600 font-medium text-xs shadow-sm hover:shadow"
                                >
                                  <Plus className="h-3 w-3" />
                                  Add Section
                                </motion.button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                    )}

                    {/* Inclusion Criteria - Card */}
                    {!hiddenSections.includes('inclusionCriteria') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                    >
                      <div className="relative p-5">
                        <div className="mb-4 pb-3 border-b border-gray-100">
                          <h4 className="font-bold text-[#061e47] text-[17px]">
                            Inclusion Criteria
                          </h4>
                        </div>
                        {!editingProtocolInfo ? (
                          <ul className="space-y-3 text-sm text-gray-700">
                            {inclusionItems.map((item, index) => {
                              const parts = item.split(":");
                              const label = parts[0];
                              const description = parts.slice(1).join(":");
                              return (
                                <li key={index} className="flex items-start gap-3">
                                  <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                                  <span className="leading-relaxed">
                                    {description.trim()}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <BulletedEditList
                            items={inclusionItems}
                            onChange={setInclusionItems}
                            placeholder="Enter item text..."
                          />
                        )}
                      </div>
                    </motion.div>
                    )}

                    {/* Exclusion Criteria - Card */}
                    {!hiddenSections.includes('exclusionCriteria') && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                      className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                    >
                      <div className="relative p-5">
                        <div className="mb-4 pb-3 border-b border-gray-100">
                          <h4 className="font-bold text-[#061e47] text-[17px]">
                            Exclusion Criteria
                          </h4>
                        </div>
                        {!editingProtocolInfo ? (
                          <ul className="space-y-3 text-sm text-gray-700">
                            {exclusionItems.map((item, index) => {
                              const parts = item.split(":");
                              const label = parts[0];
                              const description = parts.slice(1).join(":");
                              return (
                                <li key={index} className="flex items-start gap-3">
                                  <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                                  <span className="leading-relaxed">
                                    {description.trim()}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <BulletedEditList
                            items={exclusionItems}
                            onChange={setExclusionItems}
                            placeholder="Enter item text..."
                          />
                        )}
                      </div>
                    </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN - Golden Site Profile */}
            {false && (
              <div className="col-span-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  {/* Header */}
                  <div className="bg-amber-50/80 backdrop-blur-xl rounded-2xl shadow-xl border border-amber-200/50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-[#061e47]">
                          Golden Site Profile
                        </h2>
                        <p className="text-sm text-gray-600">
                          Ideal site characteristics and
                          requirements for this protocol
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Grid of 6 Cards (2 columns x 3 rows) */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Site & Investigator Profile */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200/50 p-4 space-y-3 relative"
                      style={{ order: 2 }}
                    >
                      {/* Header */}
                      <div className="mb-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-bold text-[#061e47] text-[17px]">
                            Site & Investigator Profile
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      {!editingGspSite ? (
                        <ul className="space-y-3 text-sm text-gray-700">
                          {gspSiteItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                              <span className="leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <BulletedEditList
                          items={gspSiteItems}
                          onChange={setGspSiteItems}
                          placeholder="Enter item text..."
                        />
                      )}

                      {/* Action Icons - Top Right */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {!editingGspSite ? (
                          <>
                            <button
                              onClick={() => handleEditClick("gspSite", "Site & Investigator Profile")}
                              className="p-1.5 rounded-lg bg-white/80 text-gray-400 hover:text-[#284497] hover:bg-blue-50 transition-all shadow-sm border border-gray-200"
                              title="Edit section"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSaveClick("gspSite", "Site & Investigator Profile")}
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:text-green-700 hover:bg-green-100 transition-all shadow-sm border border-green-200"
                              title="Save changes"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancelEdit("gspSite")}
                              className="p-1.5 rounded-lg bg-white/80 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm border border-gray-200"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>

                    {/* Staffing & Operational Capacity */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200/50 p-5 space-y-4 relative"
                      style={{ order: 3 }}
                    >
                      {/* Header */}
                      <div className="mb-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#284497] to-indigo-600 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-bold text-[#061e47] text-[17px]">
                            Staffing & Operational Capacity
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      {!editingGspStaffing ? (
                        <ul className="space-y-3 text-sm text-gray-700">
                          {gspStaffingItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                              <span className="leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <BulletedEditList
                          items={gspStaffingItems}
                          onChange={setGspStaffingItems}
                          placeholder="Enter item text..."
                        />
                      )}

                      {/* Action Icons - Top Right */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {!editingGspStaffing ? (
                          <>
                            <button
                              onClick={() => handleEditClick("gspStaffing", "Staffing & Operational Capacity")}
                              className="p-1.5 rounded-lg bg-white/80 text-gray-400 hover:text-[#284497] hover:bg-blue-50 transition-all shadow-sm border border-gray-200"
                              title="Edit section"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSaveClick("gspStaffing", "Staffing & Operational Capacity")}
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:text-green-700 hover:bg-green-100 transition-all shadow-sm border border-green-200"
                              title="Save changes"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancelEdit("gspStaffing")}
                              className="p-1.5 rounded-lg bg-white/80 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm border border-gray-200"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>

                    {/* Patient Population & Enrollment Performance */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200/50 p-5 space-y-4 relative"
                      style={{ order: 1 }}
                    >
                      {/* Header */}
                      <div className="mb-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <BarChart3 className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-bold text-[#061e47] text-[17px]">
                            Patient Population & Enrollment
                            Performance
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      {!editingGspPatient ? (
                        <ul className="space-y-3 text-sm text-gray-700">
                          {gspPatientItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                              <span className="leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <BulletedEditList
                          items={gspPatientItems}
                          onChange={setGspPatientItems}
                          placeholder="Enter item text..."
                        />
                      )}

                      {/* Action Icons - Top Right */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {!editingGspPatient ? (
                          <>
                            <button
                              onClick={() => handleEditClick("gspPatient", "Patient Population & Enrollment Performance")}
                              className="p-1.5 rounded-lg bg-white/80 text-gray-400 hover:text-[#284497] hover:bg-blue-50 transition-all shadow-sm border border-gray-200"
                              title="Edit section"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSaveClick("gspPatient", "Patient Population & Enrollment Performance")}
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:text-green-700 hover:bg-green-100 transition-all shadow-sm border border-green-200"
                              title="Save changes"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancelEdit("gspPatient")}
                              className="p-1.5 rounded-lg bg-white/80 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm border border-gray-200"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>

                    {/* Clinical Facilities & Capabilities */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200/50 p-5 space-y-4 relative"
                      style={{ order: 4 }}
                    >
                      {/* Header */}
                      <div className="mb-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-bold text-[#061e47] text-[17px]">
                            Clinical Facilities & Capabilities
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      {!editingGspInfrastructure ? (
                        <ul className="space-y-3 text-sm text-gray-700">
                          {gspInfrastructureItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                              <span className="leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <BulletedEditList
                          items={gspInfrastructureItems}
                          onChange={setGspInfrastructureItems}
                          placeholder="Enter item text..."
                        />
                      )}

                      {/* Action Icons - Top Right */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {!editingGspInfrastructure ? (
                          <>
                            <button
                              onClick={() => handleEditClick("gspInfrastructure", "Clinical Facilities & Capabilities")}
                              className="p-1.5 rounded-lg bg-white/80 text-gray-400 hover:text-[#284497] hover:bg-blue-50 transition-all shadow-sm border border-gray-200"
                              title="Edit section"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSaveClick("gspInfrastructure", "Clinical Facilities & Capabilities")}
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:text-green-700 hover:bg-green-100 transition-all shadow-sm border border-green-200"
                              title="Save changes"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancelEdit("gspInfrastructure")}
                              className="p-1.5 rounded-lg bg-white/80 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm border border-gray-200"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>

                    {/* Regulatory & Start-Up Readiness */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200/50 p-5 space-y-4 relative"
                    >
                      {/* Header */}
                      <div className="mb-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                            <ShieldCheck className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-bold text-[#061e47] text-[17px]">
                            Regulatory & Start-Up Readiness
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      {!editingGspQuality ? (
                        <ul className="space-y-3 text-sm text-gray-700">
                          {gspQualityItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                              <span className="leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <BulletedEditList
                          items={gspQualityItems}
                          onChange={setGspQualityItems}
                          placeholder="Enter item text..."
                        />
                      )}

                      {/* Action Icons - Top Right */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {!editingGspQuality ? (
                          <>
                            <button
                              onClick={() => handleEditClick("gspQuality", "Regulatory & Start-Up Readiness")}
                              className="p-1.5 rounded-lg bg-white/80 text-gray-400 hover:text-[#284497] hover:bg-blue-50 transition-all shadow-sm border border-gray-200"
                              title="Edit section"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSaveClick("gspQuality", "Regulatory & Start-Up Readiness")}
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:text-green-700 hover:bg-green-100 transition-all shadow-sm border border-green-200"
                              title="Save changes"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancelEdit("gspQuality")}
                              className="p-1.5 rounded-lg bg-white/80 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm border border-gray-200"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>

                    {/* Data Systems & Monitoring Support */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200/50 p-5 space-y-4 relative"
                    >
                      {/* Header */}
                      <div className="mb-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
                            <Zap className="h-4 w-4 text-white" />
                          </div>
                          <h3 className="font-bold text-[#061e47] text-[17px]">
                            Data Systems & Monitoring Support
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      {!editingGspStrategic ? (
                        <ul className="space-y-3 text-sm text-gray-700">
                          {gspStrategicItems.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-1 h-1 rounded-full bg-[#284497] flex-shrink-0 mt-2"></div>
                              <span className="leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <BulletedEditList
                          items={gspStrategicItems}
                          onChange={setGspStrategicItems}
                          placeholder="Enter item text..."
                        />
                      )}

                      {/* Action Icons - Top Right */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        {!editingGspStrategic ? (
                          <>
                            <button
                              onClick={() => handleEditClick("gspStrategic", "Data Systems & Monitoring Support")}
                              className="p-1.5 rounded-lg bg-white/80 text-gray-400 hover:text-[#284497] hover:bg-blue-50 transition-all shadow-sm border border-gray-200"
                              title="Edit section"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSaveClick("gspStrategic", "Data Systems & Monitoring Support")}
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:text-green-700 hover:bg-green-100 transition-all shadow-sm border border-green-200"
                              title="Save changes"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancelEdit("gspStrategic")}
                              className="p-1.5 rounded-lg bg-white/80 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm border border-gray-200"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-[90%] mx-auto px-8 py-6 border-t border-gray-200/50 mt-12">
        <div className="text-center text-sm text-gray-500">
          © 2025 Velocity Clinical Research, United States. All
          rights reserved.
        </div>
      </footer>

      {/* Discard Changes Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDiscardDialog}
        onClose={() => setShowDiscardDialog(false)}
        onConfirm={confirmCancelEdit}
        title="Discard Changes?"
        message="Are you sure you want to discard your changes? This action cannot be undone."
      />

      {/* Edit Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={editConfirmDialog.isOpen}
        onClose={() => setEditConfirmDialog({ isOpen: false, section: '', sectionType: null })}
        onConfirm={confirmEdit}
        title="Enable Edit Mode?"
        message={`You are about to edit "${editConfirmDialog.section}". This will allow you to modify the content. Changes won't be saved until you click the Save button.`}
        confirmText="Start Editing"
        cancelText="Cancel"
        type="info"
      />

      {/* Save Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={saveConfirmDialog.isOpen}
        onClose={() => setSaveConfirmDialog({ isOpen: false, section: '', sectionType: null })}
        onConfirm={confirmSave}
        title="Save Changes?"
        message={`Are you sure you want to save your changes to "${saveConfirmDialog.section}"? This will update the protocol requirements and reset your review status.`}
        confirmText="Save Changes"
        cancelText="Continue Editing"
        type="warning"
      />

      {/* Loading Modal for Site Portfolio */}
      <LoadingModal isOpen={loadingScorecards} message="Loading Sites" bodyOnly />

      {/* Delete Section Confirmation Dialog */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" onClick={cancelDeleteSection}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Delete Section?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete <span className="font-semibold">{deleteConfirmation.sectionTitle}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelDeleteSection}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteSection}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}