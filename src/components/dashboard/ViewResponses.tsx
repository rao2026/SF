import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  FileText,
  Edit2,
  Save,
  Download,
  Building2,
  Users,
  Activity,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  X,
  Home,
} from "lucide-react";
import { Button } from "../ui/button";
import { Header } from "../Header";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Checkbox } from "../ui/checkbox";
import { generateFeasibilityQuestionnairePDF } from "../../utils/generateFeasibilityQuestionnairePDF";

interface Site {
  id: string;
  name: string;
  address: string;
  siteCode?: string;
}

interface FQSection {
  id: string;
  title: string;
  icon: React.ElementType;
  questions: FQQuestion[];
}

interface FQQuestion {
  id: string;
  question: string;
  isCommon: boolean; // true = common to all sites, false = site-specific
}

interface FQResponse {
  questionId: string;
  siteId: string;
  response: string;
}

interface Props {
  selectedSites: Site[];
  onBack: () => void;
  onDashboardClick: () => void;
  onGoldenSiteClick: () => void;
  onScorecardClick: () => void;
}

// Mock FQ sections with questions
const fqSections: FQSection[] = [
  {
    id: "common",
    title: "Common Questionnaire",
    icon: FileText,
    questions: [
      {
        id: "cq1",
        question: "What is the overall study objective and therapeutic area?",
        isCommon: true,
      },
      {
        id: "cq2",
        question: "What are the primary and secondary endpoints?",
        isCommon: true,
      },
      {
        id: "cq3",
        question: "What are the key inclusion and exclusion criteria?",
        isCommon: true,
      },
      {
        id: "cq4",
        question: "What is the anticipated study duration per patient?",
        isCommon: true,
      },
    ],
  },
    {
    id: "enrollment",
    title: "Enrollment Capacity",
    icon: Activity,
    questions: [
      {
        id: "enr1",
        question: "What is your site's patient database size for this indication?",
        isCommon: false,
      },
      {
        id: "enr2",
        question: "How many eligible patients do you anticipate screening per month?",
        isCommon: false,
      },
      {
        id: "enr3",
        question: "What is your historical screen failure rate for similar studies?",
        isCommon: false,
      },
      {
        id: "enr4",
        question: "What patient recruitment strategies will you employ?",
        isCommon: false,
      },
      {
        id: "enr5",
        question: "What is your anticipated enrollment timeline for completing target enrollment?",
        isCommon: false,
      },
    ],
  },
  
  {
    id: "pi-subi",
    title: "PI & Sub-Investigators",
    icon: Users,
    questions: [
      {
        id: "pi1",
        question: "Provide PI name, credentials, and years of clinical research experience.",
        isCommon: false,
      },
      {
        id: "pi2",
        question: "How many active studies is the PI currently managing?",
        isCommon: false,
      },
      {
        id: "pi3",
        question: "List all sub-investigators with their credentials and experience.",
        isCommon: false,
      },
      {
        id: "pi4",
        question: "Has the PI participated in similar therapeutic area studies?",
        isCommon: false,
      },
      {
        id: "pi5",
        question: "What is the PI's publication record in the last 5 years?",
        isCommon: false,
      },
    ],
  },
{
    id: "infrastructure",
    title: "Infrastructure",
    icon: Building2,
    questions: [
      {
        id: "inf1",
        question: "Does your site have dedicated research space?",
        isCommon: false,
      },
      {
        id: "inf2",
        question: "What laboratory capabilities are available on-site?",
        isCommon: false,
      },
      {
        id: "inf3",
        question: "What temperature-controlled storage facilities are available?",
        isCommon: false,
      },
      {
        id: "inf4",
        question: "What emergency equipment is available at your facility?",
        isCommon: false,
      },
      {
        id: "inf5",
        question: "Describe your site's data management and electronic systems.",
        isCommon: false,
      },
    ],
  },
];

// Generate default mock responses
const generateDefaultResponses = (sites: Site[]): FQResponse[] => {
  const responses: FQResponse[] = [];
  
  fqSections.forEach((section) => {
    section.questions.forEach((question) => {
      if (question.isCommon) {
        // Common questions have one response for all sites
        responses.push({
          questionId: question.id,
          siteId: "all",
          response: getDefaultResponse(question.id, sites[0]?.name || "Site"),
        });
      } else {
        // Site-specific questions have one response per site
        sites.forEach((site) => {
          responses.push({
            questionId: question.id,
            siteId: site.id,
            response: getDefaultResponse(question.id, site.name),
          });
        });
      }
    });
  });
  
  return responses;
};

const getDefaultResponse = (questionId: string, siteName: string): string => {
  // Common questions - same for all sites
  const commonResponses: Record<string, string> = {
    cq1: "Phase III randomized, double-blind, placebo-controlled study evaluating the efficacy and safety of investigational compound XYZ in patients with moderate to severe COPD.",
    cq2: "Primary: Change from baseline in FEV1 at Week 12. Secondary: Time to first COPD exacerbation, quality of life measured by SGRQ, safety and tolerability.",
    cq3: "Inclusion: Age 40-80, confirmed COPD diagnosis (FEV1/FVC <0.70), current or former smoker (≥10 pack-years). Exclusion: Significant cardiovascular disease, recent hospitalization, concurrent respiratory conditions.",
    cq4: "24 weeks treatment period plus 4-week follow-up, total 28 weeks per patient.",
  };
  
  if (commonResponses[questionId]) {
    return commonResponses[questionId];
  }
  
  // Site-specific responses - varied by site
  const siteSpecificResponses: Record<string, Record<string, string>> = {
    inf1: {
      "Austin": "Yes, dedicated 3,000 sq ft clinical research unit with 5 exam rooms, 2 procedure rooms, private consultation areas, and patient waiting lounge with HIPAA-compliant check-in.",
      "Dallas": "Yes, 2,200 sq ft research facility with 4 examination rooms, 1 procedure room, dedicated pharmacy area, and secure document storage within hospital complex.",
      "Houston": "Yes, state-of-the-art 4,500 sq ft research center with 8 exam rooms, 3 procedure rooms, on-site imaging suite, and separate entrance for research participants.",
      "San Antonio": "Yes, 1,800 sq ft dedicated research space with 3 exam rooms, 1 procedure room, and shared access to hospital facilities including radiology and laboratory services.",
      "default": "Yes, dedicated clinical research facility with examination rooms, procedure areas, and private consultation spaces for research participants.",
    },
    inf2: {
      "Austin": "CLIA-certified on-site laboratory with capabilities for CBC, CMP, lipid panels, HbA1c, urinalysis, coagulation studies, and rapid point-of-care testing. Specialized tests sent to Quest Diagnostics within 1 hour.",
      "Dallas": "On-site laboratory with CAP accreditation performing routine hematology, chemistry, and urinalysis. Advanced testing (PFTs, biomarkers) sent to central lab via courier with same-day pickup.",
      "Houston": "Comprehensive on-site laboratory suite with automated analyzers for hematology, chemistry, immunology, and molecular diagnostics. Spirometry and DLCO testing available in-house.",
      "San Antonio": "Basic on-site point-of-care testing for vitals and urinalysis. Partnership with local reference lab (LabCorp) for routine and specialized testing with 2-hour turnaround for stat orders.",
      "default": "On-site laboratory capabilities for routine testing with established relationships with certified reference laboratories for specialized analyses.",
    },
    inf3: {
      "Austin": "Dual -80°C ultra-low freezers, three -20°C freezers, six 2-8°C pharmaceutical-grade refrigerators, ambient storage with dehumidification. All units on backup generator with 24/7 monitoring, dual temperature probes, and automated alert system.",
      "Dallas": "Single -80°C freezer, two -20°C freezers, four 2-8°C refrigerators with continuous temperature monitoring and backup power. Wireless monitoring system with SMS alerts to on-call coordinator.",
      "Houston": "Walk-in cold room (2-8°C), three -80°C freezers, four -20°C freezers, controlled room temperature storage with environmental monitoring. Redundant power systems and daily manual temperature verification.",
      "San Antonio": "-80°C freezer, two -20°C freezers, three 2-8°C refrigerators, all with digital temperature logging. Backup generator and emergency protocols for equipment failure with 4-hour response time.",
      "default": "Temperature-controlled storage facilities including ultra-low freezers, standard freezers, refrigerators with continuous monitoring and backup power systems.",
    },
    inf4: {
      "Austin": "Comprehensive crash cart with defibrillator, emergency airway equipment, full ACLS medications, oxygen delivery systems. All research staff maintain current BLS/ACLS certification. Located within hospital with ER access in <2 minutes.",
      "Dallas": "Standard crash cart, AED, emergency medications (epinephrine, atropine, naloxone), oxygen, and suction equipment. Staff trained in BLS with physician available on-site during study visits. Hospital emergency services 5 minutes away.",
      "Houston": "Advanced life support equipment including defibrillator/pacer, full intubation kit, emergency medication formulary, and point-of-care diagnostics. On-site ICU and emergency department with immediate physician response.",
      "San Antonio": "Basic emergency equipment including AED, oxygen, emergency medication kit, and BLS supplies. Physician on-call during study procedures. Adjacent to community hospital with ER access in <4 minutes.",
      "default": "Emergency equipment and trained personnel available with established protocols and proximity to emergency medical services.",
    },
    inf5: {
      "Austin": "Medidata Rave EDC, Oracle Siebel CTMS, eTMF (Veeva Vault), eSource (Medrio), secure SFTP for data transfers. Full 21 CFR Part 11 compliance with validated systems and annual audit trail reviews.",
      "Dallas": "OpenClinica EDC, in-house CTMS (FileMaker), electronic regulatory binder system. HIPAA-compliant servers with encrypted data transmission and nightly backups. SOPs for system validation and maintenance.",
      "Houston": "Integrated Medidata Clinical Cloud (Rave, CTMS, eTMF), Epic EHR integration for source data, RedCap for patient-reported outcomes. Advanced cybersecurity with penetration testing and multi-factor authentication.",
      "San Antonio": "REDCap for data capture, Excel-based CTMS, hybrid paper/electronic source documentation. Secure network with firewall protection and quarterly IT security assessments. Moving toward fully electronic systems.",
      "default": "Electronic data capture and management systems with security protocols compliant with regulatory requirements and data protection standards.",
    },
    pi1: {
      "Austin": "Dr. Sarah Johnson, MD, PhD - Board Certified Pulmonologist, 15 years clinical research experience, 50+ completed studies in respiratory medicine, FDA audit experience with zero findings.",
      "Dallas": "Dr. Michael Chen, MD - Board Certified Internal Medicine/Pulmonology, 10 years research experience, 35 completed studies, site PI for 8 currently active trials, GCP certified.",
      "Houston": "Dr. Emily Rodriguez, MD, FCCP - Board Certified Pulmonary/Critical Care, 18 years research experience, 65+ completed studies including 12 registrational trials, frequent FDA/sponsor audits with excellent track record.",
      "San Antonio": "Dr. James Martinez, MD - Board Certified Pulmonologist, 7 years clinical research experience, 20 completed studies in respiratory and cardiovascular medicine, active faculty at university medical school.",
      "default": "Experienced principal investigator with board certification, extensive clinical research experience, and proven track record in conducting clinical trials.",
    },
    pi2: {
      "Austin": "Currently managing 8 active studies (3 Phase III, 4 Phase II, 1 Phase IV) across respiratory, cardiology, and infectious disease. No major protocol deviations in past 2 years.",
      "Dallas": "Managing 5 active trials (2 Phase III, 2 Phase II, 1 observational) in respiratory medicine. Excellent compliance record with sponsor quality metrics consistently >95%.",
      "Houston": "Overseeing 12 active studies (5 Phase III, 6 Phase II, 1 Phase I) across multiple therapeutic areas. Dedicated sub-investigators for each study. Recognition as top-enrolling site for 3 ongoing trials.",
      "San Antonio": "Currently PI for 4 active studies (1 Phase III, 2 Phase II, 1 real-world evidence) in pulmonary and critical care. Clean FDA inspection history, no warning letters or 483 observations.",
      "default": "Managing multiple active clinical trials with strong compliance record and regulatory standing.",
    },
    pi3: {
      "Austin": "Sub-I: Dr. Michael Chen, MD (10 yrs, 30 studies); Dr. Emily Roberts, DO (7 yrs, 22 studies); Dr. James Park, MD (5 yrs, 15 studies). All maintain independent patient panels.",
      "Dallas": "Sub-I: Dr. Lisa Wang, MD (8 yrs, 25 studies); Dr. Robert Thompson, MD (6 yrs, 18 studies). Both are board-certified pulmonologists with hospital privileges.",
      "Houston": "Sub-I: Dr. David Kim, MD, PhD (12 yrs, 40 studies); Dr. Ana Silva, MD (9 yrs, 28 studies); Dr. John Taylor, DO (8 yrs, 24 studies); Dr. Maria Lopez, MD (5 yrs, 16 studies). Team covers 7-day availability.",
      "San Antonio": "Sub-I: Dr. Patricia Nguyen, MD (6 yrs, 19 studies); Dr. Carlos Ramirez, MD (4 yrs, 12 studies). Both have academic appointments and maintain clinical practices.",
      "default": "Multiple qualified sub-investigators with clinical research experience and credentials supporting study conduct.",
    },
    pi4: {
      "Austin": "Yes, 23 COPD studies including 8 Phase III trials with investigational bronchodilators, anti-inflammatory agents, and biologics. Therapeutic area expertise recognized by multiple sponsors.",
      "Dallas": "Yes, 14 COPD/asthma studies including Phase II-IV trials. Additional experience in pulmonary fibrosis and lung cancer screening studies. Published 3 papers on COPD management.",
      "Houston": "Yes, 31 respiratory studies including 15 COPD trials (LABA/LAMA combinations, PDE4 inhibitors, triple therapy). Served on steering committee for 2 international COPD trials. KOL in the field.",
      "San Antonio": "Yes, conducted 11 COPD studies over past 5 years including Phase III trials for maintenance therapies. Growing expertise in respiratory medicine with focus on underserved populations.",
      "default": "Previous experience conducting studies in similar therapeutic areas and patient populations.",
    },
    pi5: {
      "Austin": "15 peer-reviewed publications in NEJM, Lancet Respiratory Medicine, AJRCCM; h-index 28; frequent speaker at ATS and ERS conferences; editorial board member for Journal of Clinical Research.",
      "Dallas": "8 publications in respiratory journals including CHEST and Respiratory Medicine; co-investigator on 3 published registrational trials; regular presenter at regional medical conferences.",
      "Houston": "27 peer-reviewed publications including first-author papers in high-impact journals; h-index 34; named among top 100 respiratory researchers; grant funding from NIH and industry; mentor to fellows.",
      "San Antonio": "5 publications in peer-reviewed journals; contributed to 2 published trial manuscripts; active in teaching and education; developing research portfolio with university collaboration.",
      "default": "Academic contributions through publications, presentations, and participation in scientific community.",
    },
    enr1: {
      "Austin": "Active database of 3,200+ COPD patients with 850 meeting preliminary inclusion criteria based on EMR screening (FEV1 range, smoking history, age). Additional 400+ in community physician referral network.",
      "Dallas": "Database of 2,100 COPD patients with approximately 600 potentially eligible based on initial chart review. Partnership with 4 community pulmonologists for additional patient access.",
      "Houston": "Extensive database of 5,800+ respiratory patients including 1,400+ COPD patients. Established patient registry with longitudinal data and annual follow-up. Academic medical center with broad catchment area.",
      "San Antonio": "Database of 1,600 COPD patients from practice and affiliated clinics. Estimated 350-400 potentially eligible. Strong community ties and reputation facilitating recruitment from Hispanic population.",
      "default": "Patient database with candidates meeting preliminary eligibility criteria and established recruitment channels.",
    },
    enr2: {
      "Austin": "Anticipate screening 15-20 eligible candidates per month based on patient flow, referral patterns, and recruitment plan. Historical screening-to-enrollment ratio 60%.",
      "Dallas": "Estimate 10-12 eligible screens per month during active recruitment phase utilizing EMR alerts, physician referrals, and approved advertising. Previous studies average 65% screen success rate.",
      "Houston": "Project 25-30 screening visits per month leveraging large patient population, multi-physician team, and institutional recruitment infrastructure. Track record of exceeding enrollment targets.",
      "San Antonio": "Anticipate 8-10 eligible screens monthly through patient outreach, community education events, and referral network. Focus on bilingual recruitment materials to reach broader population.",
      "default": "Anticipated screening rate based on patient population, recruitment strategies, and historical performance.",
    },
    enr3: {
      "Austin": "Historical screen failure rate 35-40% for COPD studies, primarily due to FEV1 criteria (45%), concomitant medications (30%), and comorbidities (25%). Implementing pre-screening to improve efficiency.",
      "Dallas": "Screen failure rate approximately 38% in recent respiratory trials. Main reasons: spirometry values out of range (40%), prohibited medications (35%), patient withdrawal of consent (15%), other (10%).",
      "Houston": "Screen failure rate 30-35% for COPD trials due to sophisticated pre-screening process. Common exclusions: cardiovascular comorbidities (35%), COPD too mild/severe (30%), concomitant medications (25%).",
      "San Antonio": "Historical screen failure 42-45% in respiratory studies. Contributing factors: restrictive inclusion criteria (50%), patient logistical constraints (20%), medical exclusions (20%), other (10%).",
      "default": "Historical screen failure rates with analysis of common reasons for screening failures in similar studies.",
    },
    enr4: {
      "Austin": "Multi-channel approach: EMR screening with physician alerts, patient registry outreach, IRB-approved advertising (Facebook, Google, community newspapers), patient referral incentive program, education seminars, and partnerships with support groups.",
      "Dallas": "Recruitment strategy includes: chart review and direct physician referral, approved digital advertising campaign, community health fairs, collaboration with pulmonary rehabilitation programs, and patient database mailings.",
      "Houston": "Comprehensive recruitment: institutional clinical trials matching service, Epic Best Practice Advisory alerts, multimedia advertising (TV, radio, digital), community outreach events, patient ambassadors, and academic-community partnerships.",
      "San Antonio": "Bilingual recruitment through: EMR screening, community clinics partnerships, Spanish-language advertising (radio, print), health screenings at community centers, church/community organization outreach, and physician referral network.",
      "default": "Multi-faceted recruitment strategy utilizing various channels and community resources to identify and engage potential participants.",
    },
    enr5: {
      "Austin": "Target enrollment of 25 patients achievable within 4-5 months based on recruitment plan, historical performance (3-4 enrollments/month average), and accounting for screening ratios. Contingency plans for recruitment challenges.",
      "Dallas": "Anticipate completing enrollment of 18-20 patients within 5-6 months. Conservative estimate accounting for screening failures and seasonal respiratory illness patterns. Quarterly enrollment reviews with sponsor.",
      "Houston": "Project completion of 35-40 patient enrollment within 3-4 months given large patient pool, experienced recruitment team, and proven enrollment velocity. Capable of serving as backup site if needed.",
      "San Antonio": "Estimate 6-7 months to complete enrollment of 15-18 patients. Timeline considers slower ramp-up period (2-3 months), building community awareness, and optimizing referral channels. Committed to meeting target.",
      "default": "Projected enrollment timeline based on site capabilities, patient population, and historical recruitment performance with realistic assessment.",
    },
  };
  
  if (siteSpecificResponses[questionId]) {
    return siteSpecificResponses[questionId][siteName] || siteSpecificResponses[questionId]["default"];
  }
  
  return `Response for ${siteName} will be provided here.`;
};

export const FeasibilityQuestionnaireView: React.FC<Props> = ({
  selectedSites = [],
  onBack,
  onDashboardClick,
  onGoldenSiteClick,
  onScorecardClick,
}) => {
  const [responses, setResponses] = useState<FQResponse[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<{ questionId: string; siteId: string } | null>(null);
  const [editedResponse, setEditedResponse] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["common"]));
  const [selectedSitesForView, setSelectedSitesForView] = useState<Set<string>>(new Set((selectedSites || []).map(s => s.id)));
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Safety check - redirect back if no sites selected
  useEffect(() => {
    if (!selectedSites || selectedSites.length === 0) {
      onBack();
    }
  }, [selectedSites, onBack]);

  // Initialize responses
  useEffect(() => {
    const storedResponses = localStorage.getItem("fq-responses");
    let loadedResponses: FQResponse[] = [];
    
    if (storedResponses) {
      try {
        loadedResponses = JSON.parse(storedResponses);
        // Check if we have responses for all selected sites
        const hasAllResponses = selectedSites.every(site => 
          fqSections.some(section => 
            section.questions.some(q => 
              !q.isCommon && loadedResponses.some(r => 
                r.questionId === q.id && r.siteId === site.id && r.response && r.response.trim() !== ""
              )
            )
          )
        );
        
        if (!hasAllResponses || loadedResponses.length === 0) {
          // Regenerate if incomplete or empty
          loadedResponses = generateDefaultResponses(selectedSites);
          localStorage.setItem("fq-responses", JSON.stringify(loadedResponses));
        }
      } catch (e) {
        // If parse fails, regenerate
        loadedResponses = generateDefaultResponses(selectedSites);
        localStorage.setItem("fq-responses", JSON.stringify(loadedResponses));
      }
    } else {
      // No stored responses, generate new ones
      loadedResponses = generateDefaultResponses(selectedSites);
      localStorage.setItem("fq-responses", JSON.stringify(loadedResponses));
    }
    
    setResponses(loadedResponses);
  }, [selectedSites]);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set<string>();
    if (!expandedSections.has(sectionId)) {
      // Only open the clicked section, close all others
      newExpanded.add(sectionId);
    }
    // If clicking the already open section, it stays closed (empty set)
    setExpandedSections(newExpanded);
  };

  const getResponse = (questionId: string, siteId: string): string => {
    const response = responses.find(
      (r) => r.questionId === questionId && (r.siteId === siteId || r.siteId === "all")
    );
    return response?.response || "";
  };

  const handleEdit = (questionId: string, siteId: string) => {
    const currentResponse = getResponse(questionId, siteId);
    setEditedResponse(currentResponse);
    setEditingQuestion({ questionId, siteId });
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditedResponse("");
  };

  const handleSaveClick = () => {
    setShowSaveDialog(true);
  };

  const handleSaveResponse = (applyToAll: boolean) => {
    if (!editingQuestion) return;

    const newResponses = [...responses];
    
    if (applyToAll && editingQuestion.siteId !== "all") {
      // Apply to all selected sites
      selectedSites.forEach((site) => {
        const existingIndex = newResponses.findIndex(
          (r) => r.questionId === editingQuestion.questionId && r.siteId === site.id
        );
        
        if (existingIndex >= 0) {
          newResponses[existingIndex].response = editedResponse;
        } else {
          newResponses.push({
            questionId: editingQuestion.questionId,
            siteId: site.id,
            response: editedResponse,
          });
        }
      });
    } else {
      // Apply to current site only or common question
      const existingIndex = newResponses.findIndex(
        (r) =>
          r.questionId === editingQuestion.questionId &&
          r.siteId === editingQuestion.siteId
      );
      
      if (existingIndex >= 0) {
        newResponses[existingIndex].response = editedResponse;
      } else {
        newResponses.push({
          questionId: editingQuestion.questionId,
          siteId: editingQuestion.siteId,
          response: editedResponse,
        });
      }
    }

    setResponses(newResponses);
    localStorage.setItem("fq-responses", JSON.stringify(newResponses));
    setShowSaveDialog(false);
    setEditingQuestion(null);
    setEditedResponse("");
  };

  const handleDownloadAll = () => {
    // Download PDFs for selected sites for view only
    const sitesToDownload = selectedSites.filter(site => selectedSitesForView.has(site.id));
    sitesToDownload.forEach((site) => {
      const siteResponses = responses.filter(
        (r) => r.siteId === site.id || r.siteId === "all"
      );
      generateFeasibilityQuestionnairePDF([site], fqSections, siteResponses);
    });
  };

  const handleDownloadSingle = (site: Site) => {
    const siteResponses = responses.filter(
      (r) => r.siteId === site.id || r.siteId === "all"
    );
    generateFeasibilityQuestionnairePDF([site], fqSections, siteResponses);
  };

  const toggleSiteSelection = (siteId: string) => {
    const newSelection = new Set(selectedSitesForView);
    if (newSelection.has(siteId)) {
      newSelection.delete(siteId);
    } else {
      newSelection.add(siteId);
    }
    setSelectedSitesForView(newSelection);
  };

  const selectAllSites = () => {
    setSelectedSitesForView(new Set(selectedSites.map(s => s.id)));
  };

  const deselectAllSites = () => {
    setSelectedSitesForView(new Set());
  };

  const getSelectedSitesDisplay = () => {
    if (selectedSitesForView.size === selectedSites.length) {
      return `All Sites (${selectedSites.length})`;
    }
    if (selectedSitesForView.size === 0) {
      return "No sites selected";
    }
    return `${selectedSitesForView.size} site${selectedSitesForView.size !== 1 ? 's' : ''} selected`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Header
        onDashboardClick={onDashboardClick}
        onGoldenSiteClick={onGoldenSiteClick}
        onScorecardClick={onScorecardClick}
      />

      <div className="relative z-10 w-[90%] mx-auto px-8 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-4">
          <button
            onClick={onBack}
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
          <button
            onClick={onScorecardClick}
            className="text-gray-600 hover:text-[#284497] transition-colors font-medium"
          >
            Site Selection Portfolio
          </button>
          <span className="text-gray-400">|</span>
          <span className="text-[#284497] font-semibold">Feasibility Questionnaire</span>
        </nav>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-lg p-6 mb-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#284497]/10">
                <FileText className="h-6 w-6 text-[#284497]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#284497]">
                  Generated FQ and Responses
                </h1>
                
              </div>
            </div>
            <Button
              onClick={handleDownloadAll}
              disabled={selectedSitesForView.size === 0}
              className={selectedSitesForView.size === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#284497] hover:bg-[#1e3470] text-white"}
            >
              <Download className="h-4 w-4 mr-2" />
              {selectedSitesForView.size === selectedSites.length
                ? `Download Responses`
                : `Download Responses`}
            </Button>
          </div>
        </motion.div>

        {/* Site Filter for site-specific sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-2 mb-2"
        >
          
        </motion.div>

        {/* FQ Sections */}
        {fqSections.map((section, sectionIndex) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + sectionIndex * 0.1 }}
            className="mb-6"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#284497]/10">
                    <section.icon className="h-5 w-5 text-[#284497]" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-[#061e47]">{section.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {section.questions.length} question{section.questions.length !== 1 ? "s" : ""}
                      {section.id === "common" && " · Applies to all sites"}
                    </p>
                  </div>
                </div>
                {expandedSections.has(section.id) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {/* Section Content */}
              <AnimatePresence>
                {expandedSections.has(section.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200/50"
                  >
                    <div className="p-6 space-y-6">
                      {section.questions.map((question) => {
                        // For common questions, show once
                        if (question.isCommon) {
                          const isEditing =
                            editingQuestion?.questionId === question.id &&
                            editingQuestion?.siteId === "all";
                          const response = getResponse(question.id, "all");

                          return (
                            <div
                              key={question.id}
                              className="p-5 bg-blue-50/30 border border-blue-100 rounded-xl"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    
                                  </div>
                                  <h4 className="font-semibold text-[#061e47]">
                                    {question.question}
                                  </h4>
                                </div>
                                {!isEditing && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(question.id, "all")}
                                    className="ml-4"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              {isEditing ? (
                                <div className="space-y-3">
                                  <Textarea
                                    value={editedResponse}
                                    onChange={(e) => setEditedResponse(e.target.value)}
                                    className="min-h-[120px] bg-white"
                                    placeholder="Enter response..."
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={handleSaveClick}
                                      className="bg-[#284497] hover:bg-[#1e3470] text-white"
                                    >
                                      <Save className="h-4 w-4 mr-2" />
                                      Save
                                    </Button>
                                    <Button variant="outline" onClick={handleCancelEdit}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                  {response}
                                </p>
                              )}
                            </div>
                          );
                        }

                        // For site-specific questions
                        const sitesToShow = selectedSites.filter((s) => selectedSitesForView.has(s.id));

                        return (
                          <div key={question.id} className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                              
                              
                            </div>
                            {sitesToShow.map((site) => {
                              const isEditing =
                                editingQuestion?.questionId === question.id &&
                                editingQuestion?.siteId === site.id;
                              const response = getResponse(question.id, site.id);

                              return (
                                <div
                                  key={`${question.id}-${site.id}`}
                                  className="p-5 bg-gray-50/50 border border-gray-200 rounded-xl"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <h4 className="font-semibold text-[#061e47]">{question.question}</h4>
                                    {!isEditing && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(question.id, site.id)}
                                      >
                                        <Edit2 className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                  {isEditing ? (
                                    <div className="space-y-3">
                                      <Textarea
                                        value={editedResponse}
                                        onChange={(e) => setEditedResponse(e.target.value)}
                                        className="min-h-[80px] bg-white"
                                        placeholder="Enter response..."
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          onClick={handleSaveClick}
                                          className="bg-[#284497] hover:bg-[#1e3470] text-white"
                                        >
                                          <Save className="h-3 w-3 mr-1" />
                                          Save
                                        </Button>
                                        <Button variant="outline" onClick={handleCancelEdit}>
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                      {response}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-[90%] mx-auto px-8 py-6 border-t border-gray-200/50 mt-8">
        <div className="text-center text-sm text-gray-500">
          © 2025 Velocity Clinical Research, United States. All
          rights reserved.
        </div>
      </footer>
      
      {/* Save Confirmation Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Response</DialogTitle>
            <DialogDescription>
              {editingQuestion?.siteId === "all"
                ? "This is a common question. Changes will apply to all sites."
                : "How would you like to save this response?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {editingQuestion?.siteId !== "all" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleSaveResponse(true)}
                  className="w-full sm:w-auto"
                >
                  Apply to all selected sites
                </Button>
                <Button
                  onClick={() => handleSaveResponse(false)}
                  className="bg-[#284497] hover:bg-[#1e3470] text-white w-full sm:w-auto"
                >
                  Save for this site only
                </Button>
              </>
            )}
            {editingQuestion?.siteId === "all" && (
              <Button
                onClick={() => handleSaveResponse(false)}
                className="bg-[#284497] hover:bg-[#1e3470] text-white w-full sm:w-auto"
              >
                Save
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Export alias for compatibility
export const ViewResponses = FeasibilityQuestionnaireView;