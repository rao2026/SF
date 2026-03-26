import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Info,
  LayoutGrid,
  AlignLeft,
  Edit3,
  Check,
} from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Header } from "../Header";
import {
  ProtocolInput,
  ProcessingProtocolSet,
} from "../../types";
import { ProtocolInputAccordion } from "./ProtocolInputAccordion";

interface LandingViewProps {
  onSubmit: (
    protocol: ProtocolInput,
    targetView?: "studyAsk" | "goldenSite" | "scorecard",
  ) => void;
  onProtocolSetsUpdate?: (
    sets: ProcessingProtocolSet[],
  ) => void;
  onDashboardClick?: () => void;
  existingProtocolSetsCount?: number; // Total count of existing protocol sets in dashboard
  onEmptyDashboardClick?: () => void; // POC: Show empty dashboard state
}

// Mock extracted data (in real app, this would come from document parsing)
const mockExtractedData = {
  studyTitle:
    "COPD and Suboptimal Inspiratory Flow Rate (PIFR-2)",
  studyPhase: "Phase 4",
  therapeuticAreas: ["Respiratory", "COPD"],
  primaryIndication:
    "Chronic Obstructive Pulmonary Disease (COPD)",
  targetEnrollment: 450,
  enrollmentDuration: "18 months",
  targetStartDate: "Q2 2025",
  countries: [
    "United States",
    "United Kingdom",
    "Germany",
    "Poland",
  ],
  structuredStudyAskProfile:
    "Archetype: Prophylactic-Vaccine-RCT | Phase: III | Design: Double-Blind-Placebo-Controlled | Population: Healthy-Adults | Setting: Multi-Center-International | Primary-Endpoint: Efficacy-Safety | Enrollment-Model: Parallel-Assignment | Intervention-Type: Biological-Preventive | Disease-Stage: Pre-Exposure-Prevention | Complexity: Standard-Protocol",
  humanComprehensibleLabel:
    "Phase 4 | COPD | Device Comparison | Gold 3-4 Population",
  statusFlags: {
    study_ask_generated: true,
    missing_information: false,
    requires_review: true,
  },
  inclusionCriteria: [
    "Healthy adults 18-75 years",
    "No recent pathogen vaccination",
    "Compliant with study schedule",
  ],
  exclusionCriteria: [
    "Immunocompromised status",
    "Severe vaccine allergies",
    "Pregnant or breastfeeding",
  ],
};

// Component for animated processing dots
const ProcessingDots = () => {
  return (
    <span className="inline-flex gap-0.5">
      <motion.span
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0,
        }}
      >
        .
      </motion.span>
      <motion.span
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.2,
        }}
      >
        .
      </motion.span>
      <motion.span
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: 0.4,
        }}
      >
        .
      </motion.span>
    </span>
  );
};

export function LandingView({
  onSubmit,
  onProtocolSetsUpdate,
  onDashboardClick,
  existingProtocolSetsCount,
  onEmptyDashboardClick,
}: LandingViewProps) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Current upload form state
  const [feasibilityDoc, setFeasibilityDoc] =
    useState<File | null>(null);
  const [protocolDoc, setProtocolDoc] = useState<File | null>(
    null,
  );
  const [studySynopsis, setStudySynopsis] = useState("");

  // Accordion state - which input method is active
  const [activeInputMethod, setActiveInputMethod] = useState<
    "upload" | "form"
  >("upload");

  // Study scope - selected regions
  const [selectedRegions, setSelectedRegions] = useState<
    string[]
  >([]);

  // Form input state
  const [formData, setFormData] = useState({
    protocolNumber: "",
    studyType: "",
    therapeuticArea: "",
    studyDetails: "",
    inclusionCriteria: "",
    exclusionCriteria: "",
  });

  // Processing protocol sets (for Upload Documents section)
  const [processingSets, setProcessingSets] = useState<
    ProcessingProtocolSet[]
  >([]);

  // Processing state for Fill Study Ask form (independent)
  const [isGeneratingGoldenSite, setIsGeneratingGoldenSite] =
    useState(false);
  const [goldenSiteProgress, setGoldenSiteProgress] =
    useState(0);
  const [goldenSiteComplete, setGoldenSiteComplete] =
    useState(false);

  // Dropdown state for protocol selection when multiple sets completed
  const [selectedProtocolId, setSelectedProtocolId] =
    useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Track if we have any completed sets
  const hasCompletedSet = processingSets.some(
    (set) => set.isComplete,
  );
  const completedSets = processingSets.filter(
    (set) => set.isComplete,
  );

  // Check if form has at least one field filled (any field with data enables the button)
  const isFormComplete =
    formData.inclusionCriteria.trim() !== "" &&
    formData.exclusionCriteria.trim() !== "";

  // Check if any form field has data (to disable upload approach)
  const hasAnyFormData =
    formData.protocolNumber.trim() !== "" ||
    formData.studyType.trim() !== "" ||
    formData.therapeuticArea.trim() !== "" ||
    formData.studyDetails.trim() !== "" ||
    formData.inclusionCriteria.trim() !== "" ||
    formData.exclusionCriteria.trim() !== "";

  // Check if any documents are uploaded (to disable form approach)
  const hasAnyDocuments =
    protocolDoc !== null ||
    feasibilityDoc !== null ||
    studySynopsis.trim() !== "";

  // Determine active path
  const activeApproach = hasAnyDocuments
    ? "upload"
    : hasAnyFormData
      ? "form"
      : null;

  // Therapeutic area options
  const therapeuticAreas = [
    "Oncology",
    "Cardiovascular",
    "Neurology",
    "Respiratory",
    "Endocrinology",
    "Immunology",
    "Infectious Disease",
    "Dermatology",
    "Gastroenterology",
    "Rheumatology",
    "Other",
  ];

  // Sync processing sets to parent component
  useEffect(() => {
    if (onProtocolSetsUpdate) {
      onProtocolSetsUpdate(processingSets);
    }
  }, [processingSets, onProtocolSetsUpdate]);

  // Helper function to generate dummy protocol numbers
  const getProtocolNumber = (index: number) => {
    const protocols = [
      "PRO-2024-1847",
      "PRO-2024-1623",
      "PRO-2024-1509",
      "PRO-2024-1392",
      "PRO-2024-1281",
    ];
    return protocols[index % protocols.length];
  };

  const handleProtocolFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setProtocolDoc(file);
    }
  };

  const handleFeasibilityFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeasibilityDoc(file);
    }
  };

  const handleExtract = () => {
    // Create new processing set that can contain BOTH form data AND uploaded files
    const hasFormData =
      formData.protocolNumber.trim() !== "" ||
      formData.studyType.trim() !== "" ||
      formData.therapeuticArea.trim() !== "" ||
      formData.studyDetails.trim() !== "" ||
      formData.inclusionCriteria.trim() !== "" ||
      formData.exclusionCriteria.trim() !== "";

    const hasFiles =
      protocolDoc !== null || feasibilityDoc !== null;

    // Require at least one input
    if (!hasFormData && !hasFiles) return;

    // Create new processing set with both form data and files (if provided)
    const newSet: ProcessingProtocolSet = {
      id: `set-${Date.now()}`,
      // Include files if uploaded
      protocolDoc: protocolDoc || undefined,
      feasibilityDoc: feasibilityDoc || undefined,
      // Include form data if filled
      formData: hasFormData
        ? {
            protocolNumber:
              formData.protocolNumber.trim() !== ""
                ? formData.protocolNumber
                : "-",
            studyType:
              formData.studyType.trim() !== ""
                ? formData.studyType
                : "-",
            therapeuticArea:
              formData.therapeuticArea.trim() !== ""
                ? formData.therapeuticArea
                : "-",
            studyDetails:
              formData.studyDetails.trim() !== ""
                ? formData.studyDetails
                : "-",
            inclusionCriteria:
              formData.inclusionCriteria.trim() !== ""
                ? formData.inclusionCriteria
                : "-",
            exclusionCriteria:
              formData.exclusionCriteria.trim() !== ""
                ? formData.exclusionCriteria
                : "-",
          }
        : undefined,
      protocolProgress: 0,
      feasibilityProgress: feasibilityDoc ? 0 : 100, // Set to 100 if no FQ doc
      protocolStatus: "processing",
      feasibilityStatus: feasibilityDoc ? "pending" : "complete", // Mark as complete if no FQ doc
      isComplete: false,
      addedAt: Date.now(),
      uploadedAt: new Date().toISOString(), // Add live timestamp for upload
      // Add the mock extracted data so it can be viewed later
      studyTitle: mockExtractedData.studyTitle,
      studyPhase: mockExtractedData.studyPhase,
      therapeuticAreas: mockExtractedData.therapeuticAreas,
      protocolInput: {
        studyTitle: mockExtractedData.studyTitle,
        studyPhase: mockExtractedData.studyPhase,
        therapeuticAreas: mockExtractedData.therapeuticAreas,
        primaryIndication: mockExtractedData.primaryIndication,
        targetEnrollment: mockExtractedData.targetEnrollment,
        enrollmentDuration: mockExtractedData.enrollmentDuration,
        targetStartDate: mockExtractedData.targetStartDate,
        countries: mockExtractedData.countries,
        structuredStudyAskProfile: mockExtractedData.structuredStudyAskProfile,
        humanComprehensibleLabel: mockExtractedData.humanComprehensibleLabel,
        statusFlags: mockExtractedData.statusFlags,
        inclusionCriteria: mockExtractedData.inclusionCriteria,
        exclusionCriteria: mockExtractedData.exclusionCriteria,
      },
      hasFeasibilityDoc: feasibilityDoc !== null, // Track if FQ doc was uploaded
    };

    console.log('Creating new protocol set:', {
      id: newSet.id,
      hasFeasibilityDoc: newSet.hasFeasibilityDoc,
      protocolDoc: !!protocolDoc,
      feasibilityDoc: !!feasibilityDoc,
      feasibilityProgress: newSet.feasibilityProgress,
      feasibilityStatus: newSet.feasibilityStatus
    });

    setProcessingSets((prev) => [...prev, newSet]);

    // Reset both upload form and manual form
    setProtocolDoc(null);
    setFeasibilityDoc(null);
    const feasibilityInput = document.getElementById(
      "feasibilityFile",
    ) as HTMLInputElement;
    const protocolInput = document.getElementById(
      "protocolFile",
    ) as HTMLInputElement;
    if (feasibilityInput) feasibilityInput.value = "";
    if (protocolInput) protocolInput.value = "";

    setFormData({
      protocolNumber: "",
      studyType: "",
      therapeuticArea: "",
      studyDetails: "",
      inclusionCriteria: "",
      exclusionCriteria: "",
    });

    // Start processing the new set
    startProcessing(newSet.id);
  };

  const startProcessing = (setId: string) => {
    const currentSet = processingSets.find(set => set.id === setId);
    const hasFeasibilityDoc = currentSet?.hasFeasibilityDoc ?? true;

    // Start processing documents
    setProcessingSets((prev) =>
      prev.map((set) =>
        set.id === setId
          ? {
              ...set,
              protocolStatus: "processing",
              feasibilityStatus: hasFeasibilityDoc ? "processing" : "complete",
            }
          : set,
      ),
    );

    // Process Protocol Document - Slower for POC
    let protocolProgress = 0;
    const protocolInterval = setInterval(() => {
      protocolProgress += Math.random() * 2 + 1; // Slower increment: 1-3% per tick

      if (protocolProgress >= 100) {
        protocolProgress = 100;
        clearInterval(protocolInterval);

        // Update set with completed protocol
        setProcessingSets((prev) =>
          prev.map((set) =>
            set.id === setId
              ? {
                  ...set,
                  protocolProgress: 100,
                  protocolStatus: "complete",
                  // If no feasibility doc, mark as complete now
                  isComplete: !hasFeasibilityDoc ? true : set.feasibilityProgress === 100,
                }
              : set,
          ),
        );
        
        console.log('Protocol processing complete for set:', setId, {
          hasFeasibilityDoc,
          markedAsComplete: !hasFeasibilityDoc
        });
      } else {
        setProcessingSets((prev) =>
          prev.map((set) =>
            set.id === setId
              ? { ...set, protocolProgress }
              : set,
          ),
        );
      }
    }, 300); // Update every 300ms for realistic slower progress

    // Process Feasibility Document (in parallel) - only if it exists
    if (hasFeasibilityDoc) {
      let feasibilityProgress = 0;
      const feasibilityInterval = setInterval(() => {
        feasibilityProgress += Math.random() * 2 + 1; // Slower increment: 1-3% per tick

        if (feasibilityProgress >= 100) {
          feasibilityProgress = 100;
          clearInterval(feasibilityInterval);

          // Update set with completed feasibility and check if both are done
          setProcessingSets((prev) =>
            prev.map((set) => {
              if (set.id === setId) {
                const isComplete =
                  set.protocolProgress === 100 &&
                  feasibilityProgress === 100;
                return {
                  ...set,
                  feasibilityProgress: 100,
                  feasibilityStatus: "complete",
                  isComplete,
                };
              }
              return set;
            }),
          );
        } else {
          setProcessingSets((prev) =>
            prev.map((set) =>
              set.id === setId
                ? { ...set, feasibilityProgress }
                : set,
            ),
          );
        }
      }, 300); // Update every 300ms for realistic slower progress

      // Also check protocol completion to mark set as complete
      const completeCheckInterval = setInterval(() => {
        setProcessingSets((prev) => {
          const updated = prev.map((set) => {
            if (set.id === setId && !set.isComplete) {
              if (
                set.protocolProgress === 100 &&
                set.feasibilityProgress === 100
              ) {
                return { ...set, isComplete: true };
              }
            }
            return set;
          });

          // Clear interval if set is complete
          const currentSet = updated.find((s) => s.id === setId);
          if (currentSet?.isComplete) {
            clearInterval(completeCheckInterval);
          }

          return updated;
        });
      }, 400);
    }
  };

  // Handler for "View Study Ask" button (from Upload Documents - left column)
  const handleViewStudyAsk = () => {
    onSubmit(
      {
        studyTitle: mockExtractedData.studyTitle,
        studyPhase: mockExtractedData.studyPhase,
        therapeuticAreas: mockExtractedData.therapeuticAreas,
        primaryIndication: mockExtractedData.primaryIndication,
        targetEnrollment: mockExtractedData.targetEnrollment,
        enrollmentDuration:
          mockExtractedData.enrollmentDuration,
        targetStartDate: mockExtractedData.targetStartDate,
        countries: mockExtractedData.countries,
        structuredStudyAskProfile:
          mockExtractedData.structuredStudyAskProfile,
        humanComprehensibleLabel:
          mockExtractedData.humanComprehensibleLabel,
        statusFlags: mockExtractedData.statusFlags,
        inclusionCriteria: mockExtractedData.inclusionCriteria,
        exclusionCriteria: mockExtractedData.exclusionCriteria,
      },
      "studyAsk",
    ); // Navigate to Study Ask Profile section
  };

  // Handler for "View Golden Site Profile" button (from Submit Study Ask form - right column)
  const handleEvaluateSites = () => {
    // Create a protocol set entry from the form data
    const newProtocolSet: ProcessingProtocolSet = {
      id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID
      // No files uploaded - this is a form-only submission
      protocolDoc: undefined,
      feasibilityDoc: undefined,
      formData: {
        protocolNumber:
          formData.protocolNumber.trim() !== ""
            ? formData.protocolNumber
            : "-",
        studyType:
          formData.studyType.trim() !== ""
            ? formData.studyType
            : "-",
        therapeuticArea:
          formData.therapeuticArea.trim() !== ""
            ? formData.therapeuticArea
            : "-",
        studyDetails:
          formData.studyDetails.trim() !== ""
            ? formData.studyDetails
            : "-",
        inclusionCriteria:
          formData.inclusionCriteria.trim() !== ""
            ? formData.inclusionCriteria
            : "-",
        exclusionCriteria:
          formData.exclusionCriteria.trim() !== ""
            ? formData.exclusionCriteria
            : "-",
      },
      protocolProgress: 100,
      feasibilityProgress: 100,
      protocolStatus: "complete",
      feasibilityStatus: "complete",
      isComplete: true,
      addedAt: Date.now(),
      uploadedAt: new Date().toISOString(), // Add live timestamp for form submission
      studyTitle: mockExtractedData.studyTitle,
      studyPhase: mockExtractedData.studyPhase,
      therapeuticAreas: mockExtractedData.therapeuticAreas,
      protocolInput: {
        studyTitle: mockExtractedData.studyTitle,
        studyPhase: mockExtractedData.studyPhase,
        therapeuticAreas: mockExtractedData.therapeuticAreas,
        primaryIndication: mockExtractedData.primaryIndication,
        targetEnrollment: mockExtractedData.targetEnrollment,
        enrollmentDuration: mockExtractedData.enrollmentDuration,
        targetStartDate: mockExtractedData.targetStartDate,
        countries: mockExtractedData.countries,
        structuredStudyAskProfile: mockExtractedData.structuredStudyAskProfile,
        humanComprehensibleLabel: mockExtractedData.humanComprehensibleLabel,
        statusFlags: mockExtractedData.statusFlags,
        inclusionCriteria: mockExtractedData.inclusionCriteria,
        exclusionCriteria: mockExtractedData.exclusionCriteria,
      },
      hasFeasibilityDoc: true, // Form submission includes FQ data
    };

    // Add to protocol sets
    if (onProtocolSetsUpdate) {
      onProtocolSetsUpdate([newProtocolSet]);
    }

    // Navigate to Site Scorecards directly
    onSubmit(
      {
        studyTitle: mockExtractedData.studyTitle,
        studyPhase: mockExtractedData.studyPhase,
        therapeuticAreas: mockExtractedData.therapeuticAreas,
        primaryIndication: mockExtractedData.primaryIndication,
        targetEnrollment: mockExtractedData.targetEnrollment,
        enrollmentDuration:
          mockExtractedData.enrollmentDuration,
        targetStartDate: mockExtractedData.targetStartDate,
        countries: mockExtractedData.countries,
        structuredStudyAskProfile:
          mockExtractedData.structuredStudyAskProfile,
        humanComprehensibleLabel:
          mockExtractedData.humanComprehensibleLabel,
        statusFlags: mockExtractedData.statusFlags,
        inclusionCriteria: mockExtractedData.inclusionCriteria,
        exclusionCriteria: mockExtractedData.exclusionCriteria,
      },
      "scorecard",
    ); // Navigate to Site Scorecards
  };

  const handleStartEvaluation = () => {
    // Start processing the form data
    setIsGeneratingGoldenSite(true);
    setGoldenSiteProgress(0);
    setGoldenSiteComplete(false);

    // Simulate processing progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 2 + 1; // Slower increment: 1-3% per tick

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        // Mark as complete - DO NOT auto-redirect
        setGoldenSiteProgress(100);
        setGoldenSiteComplete(true);
        setIsGeneratingGoldenSite(false);
      } else {
        setGoldenSiteProgress(Math.min(progress, 100));
      }
    }, 300); // Update every 300ms for realistic slower progress
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/30 flex flex-col">
      {/* Header */}
      <Header onDashboardClick={onDashboardClick} />

      {/* Animated Background Elements - Very Subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs - Ultra Light */}
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

      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col">
        {/* Title Section with Dashboard Button */}
        <div className="w-[90%] mx-auto px-8 pt-2 pb-3 mt-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between gap-6"
          >
            {/* Left - Title */}
            <div className="text-left flex-shrink-0">
              <h2 className="text-2xl text-[rgb(40,68,151)] text-[18px] font-bold">
                Choose your preferred method
              </h2>
              <p className="text-sm text-gray-600 mt-1 text-[14px]">
                Upload documents or define your study.
              </p>
            </div>

            {/* Right - Dashboard Button */}
            <Button
              onClick={onDashboardClick}
              className="bg-white/80 backdrop-blur-sm text-[#284497] border border-[#284497]/20 hover:border-[#284497]/40 hover:bg-[#284497]/5 transition-all duration-300 shadow-sm flex-shrink-0"
            >
              Go to Dashboard
            </Button>
          </motion.div>
        </div>

        {/* Study Scope - Full Width */}
        <div className="w-[90%] mx-auto px-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/60 px-4 py-3 shadow-sm"
          >
            <div className="flex items-center gap-4">
              {/* Label */}
              <div className="flex-shrink-0">
                <h3 className="font-semibold text-gray-600 text-[14px] mb-0.5">
                  Select regions for feasibility assessment:
                </h3>
               
              </div>

              {/* Region Chips */}
              <div className="flex items-center gap-2">
                {[
                  { code: "USA", flag: "🇺🇸", name: "USA" },
                  { code: "UK", flag: "🇬🇧", name: "UK" },
                  { code: "Germany", flag: "🇩🇪", name: "Germany" },
                  { code: "Poland", flag: "🇵🇱", name: "Poland" },
                ].map((region) => {
                  const isSelected = selectedRegions.includes(region.code);
                  return (
                    <button
                      key={region.code}
                      onClick={() => {
                        setSelectedRegions((prev) =>
                          prev.includes(region.code)
                            ? prev.filter((r) => r !== region.code)
                            : [...prev, region.code]
                        );
                      }}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-200
                        ${isSelected
                          ? "bg-blue-50/80 border-blue-200/60 shadow-sm"
                          : "bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50/30"
                        }
                      `}
                    >
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-[#284497]" />
                      )}
                      <span className="text-sm leading-none">{region.flag}</span>
                      <span className={`text-[12px] font-medium ${isSelected ? "text-[#284497]" : "text-gray-700"}`}>
                        {region.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Region Count Badge */}
              {selectedRegions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-3 py-1.5 bg-green-50/80 border border-green-200/60 rounded-full"
                >
                  <span className="text-xs font-medium text-green-700">
                    {selectedRegions.length} {selectedRegions.length === 1 ? "region" : "regions"} selected
                  </span>
                </motion.div>
              )}

              {/* Select All Button */}
              <button
                onClick={() => {
                  if (selectedRegions.length === 4) {
                    setSelectedRegions([]);
                  } else {
                    setSelectedRegions(["USA", "UK", "Germany", "Poland"]);
                  }
                }}
                className="text-xs font-medium text-[#284497] hover:text-[#35bdd4] transition-colors underline underline-offset-2"
              >
                {selectedRegions.length === 4 ? "Clear all" : "Select all"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Always show the same two-column layout */}
        <div className="w-[90%] mx-auto px-8 pb-8">
          <div className="grid grid-cols-12 gap-6 items-stretch">
            {/* Left Section - Upload Documents (6 columns) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: activeApproach === "form" ? 0.5 : 1,
                x: 0,
              }}
              transition={{ duration: 0.6 }}
              className={`col-span-6 bg-blue-50/60 backdrop-blur-xl rounded-2xl shadow-xl border p-6 flex flex-col transition-all ${
                activeApproach === "form"
                  ? "border-gray-300/50 pointer-events-none"
                  : "border-blue-100/50"
              }`}
            >
              {/* Locked Message */}
              {activeApproach === "form" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-blue-100/90 backdrop-blur-sm border border-blue-300/80 rounded-lg flex items-start gap-2 shadow-sm"
                >
                  <Info className="h-4 w-4 text-blue-700 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900 font-medium">
                    You're manually defining your study. To
                    upload documents, clear the form fields
                    first.
                  </p>
                </motion.div>
              )}

              {/* Header */}
              <div className="border-b border-gray-200 pb-3 mb-6">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-1.5 bg-gradient-to-br from-[#284497]/10 to-[#35bdd4]/10 rounded-lg">
                    <Upload className="h-4.5 w-4.5 text-[#284497]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#061e47]">
                    Upload Documents
                  </h3>
                </div>
                <p className="text-xs text-gray-600 text-[14px]">
                  Use this option if you already have a
                  finalized protocol and feasibility
                  questionnaire.
                </p>
              </div>

              {/* Upload Fields */}
              <div className="space-y-4 mb-4">
                {/* Protocol Document Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="protocolFile"
                      className="text-sm font-medium text-[#061e47]"
                    >
                      Protocol / Study Synopsis{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    {!protocolDoc && (
                      <Label
                        htmlFor="protocolFile"
                        className="cursor-pointer"
                      >
                        <span className="text-xs text-[#284497] border border-[#284497] hover:bg-[#284497] hover:text-white px-4 py-1.5 rounded-md transition-colors">
                          Select File
                        </span>
                      </Label>
                    )}
                  </div>

                  {protocolDoc ? (
                    <div className="border rounded-md p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-[#284497] flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">
                            {protocolDoc.name}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setProtocolDoc(null);
                            const input =
                              document.getElementById(
                                "protocolFile",
                              ) as HTMLInputElement;
                            if (input) input.value = "";
                          }}
                          className="text-red-600 hover:text-red-700 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <Input
                    id="protocolFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleProtocolFileChange}
                    className="hidden"
                  />
                </div>

                {/* Feasibility Document Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="feasibilityFile"
                      className="text-sm font-medium text-[#061e47]"
                    >
                      Feasibility Questionnaire
                    </Label>
                    {!feasibilityDoc && (
                      <Label
                        htmlFor="feasibilityFile"
                        className="cursor-pointer"
                      >
                        <span className="text-xs text-[#284497] border border-[#284497] hover:bg-[#284497] hover:text-white px-4 py-1.5 rounded-md transition-colors">
                          Select File
                        </span>
                      </Label>
                    )}
                  </div>

                  {feasibilityDoc ? (
                    <div className="border rounded-md p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-[#284497] flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">
                            {feasibilityDoc.name}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setFeasibilityDoc(null);
                            const input =
                              document.getElementById(
                                "feasibilityFile",
                              ) as HTMLInputElement;
                            if (input) input.value = "";
                          }}
                          className="text-red-600 hover:text-red-700 flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <Input
                    id="feasibilityFile"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFeasibilityFileChange}
                    className="hidden"
                  />
                </div>

                {/* Study Synopsis (optional) - Text Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="studySynopsis"
                    className="text-sm font-regular text-[#061e47]"
                  >
                    Additional Information (optional)
                  </Label>
                  <Textarea
                    id="studySynopsis"
                    value={studySynopsis}
                    onChange={(e) =>
                      setStudySynopsis(e.target.value)
                    }
                    placeholder="Enter additional study details..."
                    className="text-xs min-h-[100px] resize-none bg-white/50 backdrop-blur-sm border-gray-200 hover:border-[#284497]/30 transition-all rounded-lg"
                  />
                </div>
              </div>

              {/* Support Info */}
              <p className="text-xs text-gray-500 mb-4">
                *Supports: Pdf, Docx, lsx
              </p>

              {/* Info Message & CTA */}
              <div className="space-y-3">
                {/* Region selection reminder - only show if user has uploaded/entered data */}
                {selectedRegions.length === 0 &&
                  hasAnyDocuments && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2"
                    >
                      <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 font-medium">
                        Please select at least one region to proceed.
                      </p>
                    </motion.div>
                  )}

                <Button
                  onClick={handleExtract}
                  disabled={
                    !protocolDoc ||
                    hasAnyFormData ||
                    selectedRegions.length === 0
                  }
                  className="w-full h-11 bg-gradient-to-r from-[#284497] to-[#35bdd4] hover:from-[#1e3a5f] hover:to-[#2c8fa3] text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Extract and Analyse
                </Button>

                {/* Processing Status - Show when processing */}
                {processingSets.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-3"
                  >
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-[#061e47] mb-3">
                        Processing Status
                      </h4>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                          {processingSets.map((set, index) => (
                            <motion.div
                              key={set.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg border border-gray-200/70 p-3 space-y-2"
                            >
                              {/* Set Header */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {set.isComplete ? (
                                    <>
                                      <CheckCircle2 className="text-[#40b54d] h-4 w-4" />
                                      <span className="text-xs font-semibold text-[#061e47]">
                                        {getProtocolNumber(
                                          processingSets.length -
                                            1 -
                                            index,
                                        )}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#284497]" />
                                      <span className="text-xs text-[#284497] font-semibold">
                                        Processing
                                        <ProcessingDots />
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* File Names */}
                              <div className="space-y-1.5 text-xs">
                                {set.formData && (
                                  <div className="flex items-start gap-1.5">
                                    <Edit3 className="h-3 w-3 text-[#40b54d] flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-600 truncate">
                                      Form Input
                                    </span>
                                  </div>
                                )}
                                {set.protocolDoc && (
                                  <div className="flex items-start gap-1.5">
                                    <FileText className="h-3 w-3 text-[#284497] flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-600 truncate">
                                      {set.protocolDoc.name}
                                    </span>
                                  </div>
                                )}
                                {set.feasibilityDoc && (
                                  <div className="flex items-start gap-1.5">
                                    <FileText className="h-3 w-3 text-[#35bdd4] flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-600 truncate">
                                      {set.feasibilityDoc.name}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Progress Bar */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span
                                    className={`font-medium ${
                                      set.isComplete
                                        ? "text-[#40b54d]"
                                        : "text-[#35bdd4]"
                                    }`}
                                  >
                                    {set.isComplete
                                      ? "Complete"
                                      : "Processing..."}
                                  </span>
                                  <span className="font-bold text-[#284497]">
                                    {Math.round(
                                      (set.protocolProgress +
                                        set.feasibilityProgress) /
                                        2,
                                    )}
                                    %
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-300 ease-out rounded-full ${
                                      set.isComplete
                                        ? "bg-[#40b54d]"
                                        : "bg-gradient-to-r from-[#284497] to-[#35bdd4]"
                                    }`}
                                    style={{
                                      width: `${(set.protocolProgress + set.feasibilityProgress) / 2}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>

                              {/* View Study Ask CTA for completed */}
                              {set.isComplete && set.protocolInput && (
                                <Button
                                  onClick={() => onSubmit(set.protocolInput!, "studyAsk")}
                                  size="sm"
                                  className="w-full h-9 mt-2 bg-gradient-to-r from-[#284497] to-[#35bdd4] hover:from-[#1e3a5f] hover:to-[#2c8fa3] text-white text-xs"
                                >
                                  <span className="mr-1">
                                    View Study Ask
                                  </span>
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Right Section - Define Your Study (6 columns) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity: activeApproach === "upload" ? 0.5 : 1,
                x: 0,
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`col-span-6 bg-green-50/40 backdrop-blur-xl rounded-2xl shadow-xl border p-5 flex flex-col transition-all ${
                activeApproach === "upload"
                  ? "border-gray-300/50 pointer-events-none"
                  : "border-green-100/50"
              }`}
            >
              {/* Locked Message */}
              {activeApproach === "upload" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-100/90 backdrop-blur-sm border border-green-300/80 rounded-lg flex items-start gap-2 shadow-sm"
                >
                  <Info className="h-4 w-4 text-green-700 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-900 font-medium">
                    You're using document upload. To manually
                    define your study, clear uploaded files
                    first.
                  </p>
                </motion.div>
              )}

              {/* Header */}
              <div className="border-b border-gray-200 pb-3 mb-3">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-1.5 bg-gradient-to-br from-[#40b54d]/10 to-[#35bdd4]/10 rounded-lg">
                    <Edit3 className="h-4.5 w-4.5 text-[#40b54d]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#061e47]">
                    Define Your Study
                  </h3>
                </div>
                <p className="text-xs text-gray-600 text-[14px]">
                  Use this option if documents are not yet
                  available.
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {/* Row 1: Protocol Number and Therapeutic Area side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="protocolNumber"
                      className="text-xs font-medium text-[#061e47]"
                    >
                      Protocol Number
                    </Label>
                    <Input
                      id="protocolNumber"
                      value={formData.protocolNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          protocolNumber: e.target.value,
                        })
                      }
                      placeholder="e.g., PRO-2024-001"
                      className="text-xs h-9 bg-white/50 backdrop-blur-sm border-gray-200 hover:border-[#284497]/30 transition-all rounded-[4px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="therapeuticArea"
                      className="text-xs font-medium text-[#061e47]"
                    >
                      Therapeutic Area
                    </Label>
                    <div className="relative">
                      <select
                        id="therapeuticArea"
                        value={formData.therapeuticArea}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            therapeuticArea: e.target.value,
                          })
                        }
                        className="w-full h-9 px-3 text-xs rounded-lg border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 hover:border-[#284497]/30 focus:outline-none focus:ring-2 focus:ring-[#284497]/20 focus:border-[#284497] appearance-none cursor-pointer transition-all"
                      >
                        <option value="">Select area</option>
                        {therapeuticAreas.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Study Type - Full Width */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="studyType"
                    className="text-xs font-medium text-[#061e47]"
                  >
                    Study Type
                  </Label>
                  <Input
                    id="studyType"
                    value={formData.studyType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        studyType: e.target.value,
                      })
                    }
                    placeholder="e.g., Phase 3, Randomized, Double-Blind"
                    className="text-xs h-9 bg-white/50 backdrop-blur-sm border-gray-200 hover:border-[#284497]/30 transition-all rounded-lg"
                  />
                </div>

                {/* Study Details - Full Width Textarea */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="studyDetails"
                    className="text-xs font-medium text-[#061e47]"
                  >
                    Study Details
                  </Label>
                  <Textarea
                    id="studyDetails"
                    value={formData.studyDetails}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        studyDetails: e.target.value,
                      })
                    }
                    placeholder="Describe patient population, study design, clinical assessments, and site requirements..."
                    className="text-xs min-h-[160px] resize-none bg-white/50 backdrop-blur-sm border-gray-200 hover:border-[#284497]/30 transition-all rounded-lg"
                  />
                </div>

                {/* Inclusion & Exclusion Criteria - Side by Side */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="inclusionCriteria"
                      className="text-xs font-medium text-[#061e47]"
                    >
                      Inclusion Criteria{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="inclusionCriteria"
                      value={formData.inclusionCriteria}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          inclusionCriteria: e.target.value,
                        })
                      }
                      placeholder="List key inclusion criteria"
                      className="text-xs min-h-[85px] resize-none bg-white/50 backdrop-blur-sm border-gray-200 hover:border-[#284497]/30 transition-all rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="exclusionCriteria"
                      className="text-xs font-medium text-[#061e47]"
                    >
                      Exclusion Criteria{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="exclusionCriteria"
                      value={formData.exclusionCriteria}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          exclusionCriteria: e.target.value,
                        })
                      }
                      placeholder="List key exclusion criteria"
                      className="text-xs min-h-[85px] resize-none bg-white/50 backdrop-blur-sm border-gray-200 hover:border-[#284497]/30 transition-all rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* CTA - Button with inline progress */}
              <div className="mt-3 pt-3 border-gray-200">
                {/* Region selection reminder - only show if user has entered form data */}
                {selectedRegions.length === 0 &&
                  hasAnyFormData && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start gap-2 mb-3"
                    >
                      <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 font-medium">
                        Please select at least one region to proceed.
                      </p>
                    </motion.div>
                  )}

                <Button
                  onClick={
                    goldenSiteComplete
                      ? handleEvaluateSites
                      : handleStartEvaluation
                  }
                  disabled={
                    (!isFormComplete && !goldenSiteComplete) ||
                    hasAnyDocuments ||
                    selectedRegions.length === 0
                  }
                  className="w-full h-11 bg-gradient-to-r from-[#40b54d] to-[#35bdd4] hover:from-[#38a043] hover:to-[#2c8fa3] text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl group"
                >
                  {/* Progress bar background - shows when generating */}
                  {isGeneratingGoldenSite && (
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${goldenSiteProgress}%`,
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-[#38a043] to-[#2c8fa3] opacity-50"
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Button content */}
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isGeneratingGoldenSite ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        <span className="font-medium text-sm">
                          Evaluating sites{" "}
                          {Math.round(goldenSiteProgress)}%
                        </span>
                      </>
                    ) : goldenSiteComplete ? (
                      <>
                        <CheckCircle2 className="h-4.5 w-4.5" />
                        <span className="font-medium text-sm">
                          View Sites
                        </span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4.5 w-4.5" />
                        <span className="font-medium text-sm">
                          Evaluate Sites
                        </span>
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}