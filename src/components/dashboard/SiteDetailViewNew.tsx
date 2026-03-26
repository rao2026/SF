import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Home,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Activity,
  Building2,
  FileText,
  Lightbulb,
  MapPin,
  Award,
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Briefcase,
  Globe,
  Sparkles,
  AlertTriangle,
  ThumbsUp,
  UserCheck,
  Settings,
  Stethoscope,
  DollarSign,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";
import { Button } from "../ui/button";
import { Header } from "../Header";
import { generateSiteDetailPDF } from "../../utils/generateSiteDetailPDF";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { SimpleTooltip } from "../ui/simple-tooltip";
import { ResponsiveContainer } from "recharts";

// Site Detail View Component
interface Site {
  id: string;
  name: string;
  address: string;
  siteCode?: string;
  status: "Eligible" | "Under Review" | "Not Eligible";
  overallScore: number;
  priority?: "High" | "Medium" | "Low";
  siteInvestigatorScore: number;
  staffingCapacityScore: number;
  patientEnrollmentScore: number;
  infrastructureScore: number;
  detailedAssessment: string[];
  recommendation: {
    action: string;
    nextSteps: string;
  };
  compliance: number;
  criticalRequirements: Array<{ text: string; points: number }>;
  activationReadiness?: "Ready to Activate" | "Needs Support" | "Under Assessment" | "High Risk";
  patientPoolSize?: number;
  enrollmentRate?: number;
  criticalGapsCount?: number;
  startupTimeline?: string;
  competitiveAdvantages?: string[];
  riskFactors?: string[];
  strategicDirection?: Array<{ 
    category: "Therapeutic Area Growth" | "Revenue Focus"
  }>;
  shortfall?: number; // Percentage shortfall for strategic direction
}

interface SiteDetailViewProps {
  site: Site;
  onBack: () => void;
  onDashboardClick?: () => void;
  onClose?: () => void;
  onStudyAskClick?: () => void;
  onGoldenSiteClick?: () => void;
  onScorecardClick?: () => void;
  protocolNumber?: string;
}

export function SiteDetailView({
  site,
  onBack,
  onDashboardClick,
  onClose,
  onStudyAskClick,
  onGoldenSiteClick,
  onScorecardClick,
  protocolNumber
}: SiteDetailViewProps) {
  // State for database toggle (default to Velocity DB)
  const [selectedDatabase, setSelectedDatabase] = useState<'velocity' | 'public'>('velocity');
  
  // State for Historic Performance collapsible
  const [showHistoricPerformance, setShowHistoricPerformance] = useState(false);

  // Add keyboard Esc listener
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onBack();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onBack]);

  // Calculate intelligent metrics based on site scores (memoized to avoid Math.random re-calc on re-render)
  const metrics = React.useMemo(() => {
    // Special handling for Austin site (SITE-001) - null similar trial experience
    if (site.id === "001") {
      const baseEnrollment = Math.round(15 + (site.patientEnrollmentScore / 100) * 25);
      const startupMin = Math.max(4, Math.round(14 - (site.infrastructureScore / 100) * 8));
      const piCollaborations = Math.max(2, Math.round(2 + (site.siteInvestigatorScore / 100) * 6));
      const siteCollaborations = Math.max(piCollaborations + 2, Math.round(4 + (site.overallScore / 100) * 10));
      const regulatoryCompliance = Math.max(85, Math.min(100, Math.round(site.compliance + (Math.random() * 5 - 2.5))));
      
      const eligiblePatientPool = Math.round(500 + Math.random() * 1000);
      const localDiseasePrevalence = Math.round(eligiblePatientPool * (1.25 + Math.random() * 0.25)); // 1.25x to 1.5x
      
      return {
        eligiblePatientPool,
        localDiseasePrevalence,
        forecastedMin: baseEnrollment,
        forecastedMax: baseEnrollment + 4,
        startupMin,
        startupMax: startupMin + 2,
        coldStartConfidence: Math.round(
          (site.compliance * 0.4) + 
          (site.infrastructureScore * 0.35) + 
          (site.staffingCapacityScore * 0.25)
        ),
        piExperience: site.siteInvestigatorScore >= 90 ? "20+" :
                     site.siteInvestigatorScore >= 75 ? "15+" :
                     site.siteInvestigatorScore >= 60 ? "10+" :
                     site.siteInvestigatorScore >= 45 ? "7+" : "5+",
        piCollaborations,
        siteCollaborations,
        subIExperience: site.siteInvestigatorScore >= 90 ? "12+" :
                       site.siteInvestigatorScore >= 75 ? "10+" :
                       site.siteInvestigatorScore >= 60 ? "7+" :
                       site.siteInvestigatorScore >= 45 ? "5+" : "3+",
        subICollaborations: Math.max(1, Math.round(piCollaborations * 0.75)),
        subISponsorExperience: Math.max(
          Math.max(1, Math.round(piCollaborations * 0.75)) + 1, 
          Math.round(2 + (site.overallScore / 100) * 7)
        ),
        regulatoryCompliance,
        currentStudyLoad: Math.max(3, Math.round(12 - (site.staffingCapacityScore / 100) * 7)),
        researchRooms: Math.max(2, Math.round(2 + (site.infrastructureScore / 100) * 6)),
        imagingLabAccess: site.infrastructureScore >= 75 ? "On-site" : "Partnered",
        inspectionReadiness: (site.compliance >= 90 && regulatoryCompliance >= 95) ? "Yes" : "No",
        retentionRate: 94,
        similarTrialExperience: 6,
        competingTrials: Math.max(2, Math.min(8, 
          Math.round(3 + (site.overallScore / 100) * 5 + (Math.random() * 2 - 1))
        ))
      };
    }
    
    // Special handling for Rockville site (SITE-015)
    if (site.id === "015") {
      return {
        eligiblePatientPool: 250,
        localDiseasePrevalence: 340, // Ensure it's greater than eligiblePatientPool
        forecastedMin: 0,
        forecastedMax: 0,
        monthlySiteCapacity: 0,
        estimatedScreenFailure: 0,
        expectedEnrollment: 0,
        siteCollaborations: 45,
        regulatoryCompliance: 65,
        currentStudyLoad: 14,
        researchRooms: 2,
        imagingLabAccess: "Partnered",
        inspectionReadiness: "No",
        retentionRate: 100,
        similarTrialExperience: 4,
        competingTrials: 7
      };
    }
    
    // Eligible Patient Pool: Random number between 500 and 1500 for each site
    const eligiblePatientPool = Math.round(500 + Math.random() * 1000);
    
    // Local Disease Prevalence: Always greater than Eligible Patient Pool (1.25x to 1.5x)
    const localDiseasePrevalence = Math.round(eligiblePatientPool * (1.25 + Math.random() * 0.25));

    // Forecasted Enrollment: Based on patientEnrollmentScore and patientPoolSize
    const baseEnrollment = Math.round(15 + (site.patientEnrollmentScore / 100) * 25);
    const forecastedMin = baseEnrollment;
    const forecastedMax = baseEnrollment + 4;

    // Startup Velocity: Lower weeks = better scores (inverse relationship)
    const startupMin = Math.max(4, Math.round(14 - (site.infrastructureScore / 100) * 8));
    const startupMax = startupMin + 2;

    // Cold Start Confidence: Based on overall compliance and infrastructure
    const coldStartConfidence = Math.round(
      (site.compliance * 0.4) + 
      (site.infrastructureScore * 0.35) + 
      (site.staffingCapacityScore * 0.25)
    );

    // PI Experience: Based on siteInvestigatorScore
    const piExperience = site.siteInvestigatorScore >= 90 ? "20+" :
                        site.siteInvestigatorScore >= 75 ? "15+" :
                        site.siteInvestigatorScore >= 60 ? "10+" :
                        site.siteInvestigatorScore >= 45 ? "7+" : "5+";

    // PI Collaborations: Based on siteInvestigatorScore (typically fewer than site collaborations)
    const piCollaborations = Math.max(2, Math.round(2 + (site.siteInvestigatorScore / 100) * 6));

    // Site Collaborations: Usually higher than PI collaborations, based on overallScore
    const siteCollaborations = Math.max(
      piCollaborations + 2, 
      Math.round(4 + (site.overallScore / 100) * 10)
    );

    // Sub I Experience: Typically less than PI (60-80% of PI experience)
    const subIExperience = site.siteInvestigatorScore >= 90 ? "12+" :
                          site.siteInvestigatorScore >= 75 ? "10+" :
                          site.siteInvestigatorScore >= 60 ? "7+" :
                          site.siteInvestigatorScore >= 45 ? "5+" : "3+";

    // Sub I Collaborations: Typically fewer than PI (70-85% of PI collaborations)
    const subICollaborations = Math.max(1, Math.round(piCollaborations * 0.75));

    // Sub I Sponsor-Led Protocol Experience: Typically fewer than PI
    const subISponsorExperience = Math.max(
      subICollaborations + 1, 
      Math.round(2 + (site.overallScore / 100) * 7)
    );

    // Regulatory Compliance: Based on compliance score with some variation
    const regulatoryCompliance = Math.max(85, Math.min(100, 
      Math.round(site.compliance + (Math.random() * 5 - 2.5))
    ));

    // Current Study Load: Based on staffingCapacityScore (inverse - lower capacity = higher load)
    const currentStudyLoad = Math.max(3, Math.round(12 - (site.staffingCapacityScore / 100) * 7));

    // Research Rooms: Based on infrastructureScore
    const researchRooms = Math.max(2, Math.round(2 + (site.infrastructureScore / 100) * 6));

    // Imaging/Lab Access: Based on infrastructureScore
    const imagingLabAccess = site.infrastructureScore >= 75 ? "On-site" : "Partnered";

    // Inspection Readiness: Based on compliance and regulatory
    const inspectionReadiness = (site.compliance >= 90 && regulatoryCompliance >= 95) ? "Yes" : "No";

    // Competing Trials: Based on site's overall activity and location (2-8 trials)
    const competingTrials = Math.max(2, Math.min(8, 
      Math.round(3 + (site.overallScore / 100) * 5 + (Math.random() * 2 - 1))
    ));

    return {
      eligiblePatientPool,
      localDiseasePrevalence,
      forecastedMin,
      forecastedMax,
      startupMin,
      startupMax,
      coldStartConfidence,
      piExperience,
      piCollaborations,
      siteCollaborations,
      subIExperience,
      subICollaborations,
      subISponsorExperience,
      regulatoryCompliance,
      currentStudyLoad,
      researchRooms,
      imagingLabAccess,
      inspectionReadiness,
      retentionRate: 94,
      similarTrialExperience: 12,
      competingTrials
    };
  }, [site]);

  // Historic performance data for bubble chart
  const historicPerformanceData = React.useMemo(() => {
    // Generate consistent data based on site ID
    const hash = site.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Get the site's observed enrollment rate - parse if it's a range like "13-20"
    let targetRate = 4; // default
    if (typeof site.enrollmentRate === 'number') {
      targetRate = site.enrollmentRate;
    } else if (typeof site.enrollmentRate === 'string') {
      // Parse range like "13-20" to get the midpoint
      const match = site.enrollmentRate.match(/(\d+)-(\d+)/);
      if (match) {
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        targetRate = (min + max) / 2;
      } else {
        targetRate = parseFloat(site.enrollmentRate) || 4;
      }
    }
    
    // All COPD-related therapeutic areas
    const allTherapeuticAreas = ["Respiratory", "Asthma", "Bronchiectasis", "Autoimmune", "Emphysema"];
    
    // Randomly select 3-5 therapeutic areas for this site (minimum 3 for POC)
    const numAreas = 3 + Math.floor(seededRandom(hash + 100) * 3); // 3-5 areas
    const selectedAreas: string[] = [];
    const availableAreas = [...allTherapeuticAreas];
    
    for (let i = 0; i < numAreas; i++) {
      const index = Math.floor(seededRandom(hash + 101 + i) * availableAreas.length);
      selectedAreas.push(availableAreas[index]);
      availableAreas.splice(index, 1);
    }
    
    // Study name templates for COPD-related areas
    const studyTemplates = [
      { name: "COPD Management Trial", sponsor: "AstraZeneca", area: "Respiratory" },
      { name: "Chronic Asthma Control", sponsor: "GSK", area: "Asthma" },
      { name: "COPD Exacerbation Study", sponsor: "Boehringer Ingelheim", area: "Respiratory" },
      { name: "Severe Asthma Trial", sponsor: "Sanofi", area: "Asthma" },
      { name: "Bronchiectasis Management", sponsor: "Insmed", area: "Bronchiectasis" },
      { name: "Pulmonary Rehabilitation Study", sponsor: "Novartis", area: "Respiratory" },
      { name: "Asthma Biologics Study", sponsor: "Regeneron", area: "Asthma" },
      { name: "Emphysema Treatment Trial", sponsor: "GSK", area: "Emphysema" },
      { name: "Autoimmune Lung Disease Study", sponsor: "Bristol Myers Squibb", area: "Autoimmune" },
      { name: "Chronic Bronchiectasis Trial", sponsor: "AstraZeneca", area: "Bronchiectasis" },
      { name: "Advanced Emphysema Study", sponsor: "Boehringer Ingelheim", area: "Emphysema" },
      { name: "Allergic Asthma Trial", sponsor: "Teva", area: "Asthma" },
      { name: "Respiratory Autoimmune Study", sponsor: "Amgen", area: "Autoimmune" },
      { name: "COPD Prevention Trial", sponsor: "Pfizer", area: "Respiratory" },
      { name: "Non-CF Bronchiectasis Study", sponsor: "Grifols", area: "Bronchiectasis" },
    ];
    
    // Filter templates to only include selected therapeutic areas
    const filteredTemplates = studyTemplates.filter(t => selectedAreas.includes(t.area));
    
    // Fallback to all templates if filtering resulted in empty array
    const templatesToUse = filteredTemplates.length > 0 ? filteredTemplates : studyTemplates;
    
    const years = [2021, 2022, 2023, 2024, 2025];
    // Today is March 4, 2026 - all historical studies must have ended BEFORE today
    const today = new Date(2026, 2, 4); // March 4, 2026 (month is 0-indexed)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Generate 12-18 studies per site for busy chart
    const numStudies = 12 + Math.round(seededRandom(hash) * 6);
    const studies = [];
    
    for (let i = 0; i < numStudies; i++) {
      // Pick a random study template from filtered templates
      const template = templatesToUse[Math.floor(seededRandom(hash + i * 3) * templatesToUse.length)];
      
      // Generate enrollment rates based on site's actual enrollment rate (±30-40% variation)
      // This creates realistic distribution around the site's performance
      const variationFactor = 0.6 + seededRandom(hash + i * 13) * 0.8; // 0.6 to 1.4 (±40%)
      const enrollmentRate = Math.max(1.0, Math.round((targetRate * variationFactor) * 10) / 10);
      
      // Add some outliers (10% of studies) for realism
      const isOutlier = seededRandom(hash + i * 19) < 0.1;
      const finalEnrollmentRate = isOutlier 
        ? Math.max(1.0, Math.round((targetRate * (0.4 + seededRandom(hash + i * 23) * 0.3)) * 10) / 10) // Low outliers
        : enrollmentRate;
      
      // Varied patient counts for different bubble sizes
      const totalPatients = 30 + Math.round(seededRandom(hash + i * 17) * 150);
      const durationMonths = Math.max(8, Math.min(18, Math.round(totalPatients / finalEnrollmentRate)));
      
      // Pick a random END date that is BEFORE today (March 2026)
      // Studies could have ended anytime from Jan 2021 to Feb 2026
      const endYear = 2021 + Math.floor(seededRandom(hash + i * 5) * 5); // 2021-2025
      let endMonth = Math.floor(seededRandom(hash + i * 7) * 12); // 0-11
      
      // If end year is 2025, allow full year 
      // If end year would be 2026, cap it to 2025
      if (endYear === 2025) {
        const potentialEndDate = new Date(endYear, endMonth, 28);
        if (potentialEndDate >= today) {
          endMonth = 1; // Set to February 2025 at latest
        }
      }
      
      // Calculate START date by going backwards from end date
      const startMonth = endMonth - durationMonths;
      let startYear = endYear;
      let finalStartMonth = startMonth;
      
      if (startMonth < 0) {
        // Study started in previous year(s)
        const monthsInPreviousYear = Math.abs(startMonth);
        startYear = endYear - Math.ceil(monthsInPreviousYear / 12);
        const adjustedStartMonth = 12 - (monthsInPreviousYear % 12);
        finalStartMonth = adjustedStartMonth === 12 ? 0 : adjustedStartMonth;
      }
      
      studies.push({
        id: `${site.id}-study-${i}-${hash}`, // Unique ID for each study with hash for extra entropy
        studyName: template.name + (i > 0 && i % 5 === 0 ? " Phase " + (2 + (i % 2)) : ""),
        sponsor: template.sponsor,
        timeline: new Date(startYear, finalStartMonth, 15).getTime(),
        enrollmentRate: finalEnrollmentRate,
        totalPatients,
        durationMonths,
        bubbleSize: 12, // Uniform bubble size for all studies
        therapeuticArea: template.area,
        recruitmentPeriod: `${months[finalStartMonth]} ${startYear} - ${months[endMonth]} ${endYear}`,
      });
    }

    return studies;
  }, [site.id, site.enrollmentRate]);

  // Generate jitter plot data - monthly enrollment dots per study
  const jitterPlotData = React.useMemo(() => {
    // Random seed based on site name for consistency
    const siteHash = site.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    const years = [2022, 2023, 2024, 2025];
    const studies: any[] = [];
    
    // Generate 3-4 studies
    const totalStudies = 3 + Math.floor(seededRandom(siteHash) * 2);
    
    // Timeline bounds: Jan 2022 to Dec 2025
    const timelineStart = new Date('2022-01-01').getTime();
    const timelineEnd = new Date('2025-12-31').getTime();
    const timelineRange = timelineEnd - timelineStart;
    
    historicPerformanceData.forEach((study, studyIndex) => {
      if (studyIndex >= totalStudies) return;
      
      const hash = study.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Generate study start date (somewhere in 2022-2025)
      const startOffset = seededRandom(hash + 1000);
      const startDate = new Date(timelineStart + startOffset * timelineRange * 0.6); // Start in first 60%
      
      // Generate study duration (6-15 months for better visualization)
      const durationMonths = 6 + Math.floor(seededRandom(hash + 2000) * 10);
      
      // Determine which year band this study belongs to (based on start date)
      const startYear = startDate.getFullYear();
      const yearIndex = years.indexOf(startYear);
      
      // Add jitter offset for vertical positioning within year row
      const jitterOffset = (seededRandom(hash + 5000) - 0.5) * 0.8;
      
      // Generate monthly enrollment rates for this study
      const monthlyData: any[] = [];
      let cumulativePatients = 0;
      
      for (let monthOffset = 0; monthOffset < durationMonths; monthOffset++) {
        const monthDate = new Date(startDate.getTime() + monthOffset * 30 * 24 * 60 * 60 * 1000);
        const monthHash = hash + 3000 + monthOffset * 100;
        
        // Generate enrollment rate for this month (0-40 pts/month with variation)
        const baseRate = 5 + seededRandom(monthHash) * 30;
        const monthlyRate = Math.round(Math.max(0, Math.min(40, baseRate)));
        
        cumulativePatients += monthlyRate;
        
        // Calculate position on timeline
        const monthTime = monthDate.getTime();
        const xPercent = ((monthTime - timelineStart) / timelineRange) * 100;
        
        monthlyData.push({
          month: monthOffset,
          monthDate: monthDate,
          monthLabel: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          enrollmentRate: monthlyRate,
          cumulativePatients: cumulativePatients,
          xPercent: xPercent,
        });
      }
      
      studies.push({
        studyId: study.id,
        studyName: study.studyName,
        therapeuticArea: study.therapeuticArea,
        sponsor: study.sponsor,
        startDate: startDate,
        startYear: startYear,
        yearIndex: yearIndex >= 0 ? yearIndex : 0,
        jitterOffset: jitterOffset,
        durationMonths: durationMonths,
        monthlyData: monthlyData,
        totalPatients: cumulativePatients,
      });
    });
    
    // Find min/max enrollment rates across all months for sizing
    const allRates = studies.flatMap(s => s.monthlyData.map((m: any) => m.enrollmentRate));
    const minRate = Math.min(...allRates);
    const maxRate = Math.max(...allRates);
    
    return { 
      studies, 
      years, 
      timelineStart, 
      timelineEnd, 
      timelineRange,
      minRate,
      maxRate,
    };
  }, [historicPerformanceData, site.name]);

  // Position calculator for monthly dots scattered by enrollment rate
  const getMonthlyDotPosition = (study: any, monthData: any, monthIndex: number) => {
    const { minRate, maxRate, years, timelineStart, timelineRange } = jitterPlotData;
    
    // Y-axis: Enrollment Rate (pts/month) - inverted for bottom-to-top
    const rateNormalized = maxRate > minRate 
      ? (monthData.enrollmentRate - minRate) / (maxRate - minRate)
      : 0.5;
    const yPercent = 90 - (rateNormalized * 80); // 10% top margin, inverted (higher rate = lower yPercent = higher on screen)
    
    // X-axis: Time position (horizontal scatter across years)
    // Use consistent seed for same study+month combo for horizontal jitter
    const hash = study.studyId.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const monthHash = hash + monthIndex * 7919; // Prime number for better distribution
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    // Calculate year position with jitter
    const monthTime = monthData.monthDate.getTime();
    const timePercent = ((monthTime - timelineStart) / timelineRange);
    const jitter = (seededRandom(monthHash) - 0.5) * 0.15; // ±7.5% jitter within year
    const xPercent = 5 + (timePercent * 90) + (jitter * 90); // 5% left margin, 90% range
    
    // Dot size: Based on monthly enrollment rate (4-32px proportionate to rate)
    const size = 4 + rateNormalized * 28;
    
    return { x: xPercent, y: yPercent, size };
  };



  // Get unique therapeutic areas from the data for dynamic legend
  const uniqueTherapeuticAreas = React.useMemo(() => {
    const areas = Array.from(new Set(historicPerformanceData.map(study => study.therapeuticArea)));
    return areas.sort(); // Sort alphabetically for consistent display
  }, [historicPerformanceData]);



  // Color mapping for therapeutic areas
  const getTherapeuticAreaColor = (area: string) => {
    switch (area) {
      case "Respiratory":
        return "#284497"; // Blue
      case "Asthma":
        return "#40b54d"; // Green
      case "Bronchiectasis":
        return "#06b6d4"; // Cyan
      case "Autoimmune":
        return "#f59e0b"; // Amber
      case "Emphysema":
        return "#ef4444"; // Red
      default:
        return "#64748b"; // Gray
    }
  };

  // Generate consistent ethnicity data based on site ID
  const generateEthnicityData = () => {
    // Simple hash function to generate consistent random values
    const hash = site.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (hash % 30) + 70; // Value between 70-100
    
    return {
      notHispanicOrLatino: random,
      hispanicOrLatino: 100 - random
    };
  };

  const ethnicityData = generateEthnicityData();

  // Generate consistent diversity data based on site ID and database selection
  const generateDiversityData = (database: 'velocity' | 'public' = 'velocity') => {
    const hash = site.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Seeded random number generator
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    // Public DB generally has higher numbers (more comprehensive historical data)
    // Velocity DB has more recent, refined data with lower counts
    const isPublicDB = database === 'public';
    
    // Race data - ensure it adds to 100%
    // Public DB shows significantly higher percentages across minority groups for POC visibility
    const raceMultiplier = isPublicDB ? 1.6 : 1.0;
    const raceValues = [
      Math.max(1, Math.round((seededRandom(hash + 1) * 5 + 1) * raceMultiplier)),  // American Indian
      Math.max(2, Math.round((seededRandom(hash + 2) * 10 + 3) * raceMultiplier)), // Asian
      Math.max(8, Math.round((seededRandom(hash + 3) * 25 + 10) * raceMultiplier)), // Black
      Math.max(1, Math.round((seededRandom(hash + 4) * 5 + 1) * raceMultiplier)),  // Pacific Islander
    ];
    const raceSum = raceValues.reduce((a, b) => a + b, 0);
    const whiteValue = 100 - raceSum;
    
    // Ethnicity data - Public DB shows significantly higher Hispanic percentages for POC visibility
    const ethnicityOffset = isPublicDB ? 15 : 0;
    const notHispanic = Math.round(seededRandom(hash + 5) * 30) + 70 - ethnicityOffset; // 55-85% for public, 70-100% for velocity
    const hispanic = 100 - notHispanic;
    
    // Gender data - ensure it adds to 100%
    const maleValue = Math.round(seededRandom(hash + 6) * 15) + 45; // 45-60%
    const otherValue = Math.round(seededRandom(hash + 7) * 3) + 1; // 1-4%
    const femaleValue = 100 - maleValue - otherValue;
    
    // Age Group data with gender breakdown - ensure it adds to 100%
    // Public DB shows higher percentages in younger/middle age groups for POC visibility
    // Generate base percentages first, then apply database-specific adjustments
    const ageUnder5Base = Math.round(seededRandom(hash + 8) * 3 + 2);  // 2-5%
    const age6_17Base = Math.round(seededRandom(hash + 9) * 5 + 3);    // 3-8%
    const age18_29Base = Math.round(seededRandom(hash + 10) * 10 + 8); // 8-18%
    const age30_44Base = Math.round(seededRandom(hash + 11) * 15 + 20); // 20-35%
    const age45_59Base = Math.round(seededRandom(hash + 12) * 15 + 25); // 25-40%
    const age60_74Base = Math.round(seededRandom(hash + 13) * 12 + 15); // 15-27%
    
    // Apply database-specific multipliers (Public DB shifts toward younger/middle ages)
    const ageUnder5Raw = isPublicDB ? Math.round(ageUnder5Base * 1.35) : ageUnder5Base;
    const age6_17Raw = isPublicDB ? Math.round(age6_17Base * 1.35) : age6_17Base;
    const age18_29Raw = isPublicDB ? Math.round(age18_29Base * 1.35) : age18_29Base;
    const age30_44Raw = isPublicDB ? Math.round(age30_44Base * 1.35) : age30_44Base;
    const age45_59Raw = isPublicDB ? Math.round(age45_59Base * 1.25) : age45_59Base;
    const age60_74Raw = isPublicDB ? Math.round(age60_74Base * 0.9) : age60_74Base;
    
    // Calculate the sum and normalize to ensure exactly 100%
    const ageSum = ageUnder5Raw + age6_17Raw + age18_29Raw + age30_44Raw + age45_59Raw + age60_74Raw;
    const ageUnder5 = Math.round((ageUnder5Raw / ageSum) * 100);
    const age6_17 = Math.round((age6_17Raw / ageSum) * 100);
    const age18_29 = Math.round((age18_29Raw / ageSum) * 100);
    const age30_44 = Math.round((age30_44Raw / ageSum) * 100);
    const age45_59 = Math.round((age45_59Raw / ageSum) * 100);
    const age60_74 = Math.round((age60_74Raw / ageSum) * 100);
    const age75plus = Math.max(0, 100 - ageUnder5 - age6_17 - age18_29 - age30_44 - age45_59 - age60_74);
    
    // Calculate patient counts based on eligible patient pool (assuming ~700 average)
    // Public DB typically has significantly higher total patient counts for POC visibility
    const basePatients = metrics.eligiblePatientPool || 700;
    const totalPatients = isPublicDB ? Math.round(basePatients * 1.45) : basePatients;
    
    // Calculate patient counts and gender breakdown for ethnicity
    const hispanicCount = Math.round((hispanic / 100) * totalPatients);
    const notHispanicCount = Math.round((notHispanic / 100) * totalPatients);
    
    // Special adaptive display test cases for Austin site
    let hispanicMale, hispanicFemale, notHispanicMale, notHispanicFemale;
    if (site.id === 'austin') {
      // Austin: Test adaptive display with different percentage ranges
      hispanicMale = 88; // >20% range - should show full label
      hispanicFemale = 12; // 8-19% range - should show symbol only
      notHispanicMale = 93; // >20% range - should show full label
      notHispanicFemale = 7; // <8% range - should show nothing
    } else {
      // Public DB shows more pronounced gender distributions for POC visibility
      const genderOffset = isPublicDB ? 5 : 0;
      hispanicMale = Math.round(seededRandom(hash + 50) * 20) + 40 + genderOffset; // 40-60% (velocity) or 43-63% (public)
      hispanicFemale = 100 - hispanicMale;
      notHispanicMale = Math.round(seededRandom(hash + 51) * 20) + 40 + genderOffset; // 40-60% (velocity) or 43-63% (public)
      notHispanicFemale = 100 - notHispanicMale;
    }
    
    // Generate gender breakdown for each age group
    const generateGenderBreakdown = (agePercent: number) => {
      const genderVariance = isPublicDB ? 4 : 0;
      const malePercent = Math.round(seededRandom(hash + agePercent) * 20) + 40 + genderVariance; // 40-60% (velocity) or 42-62% (public)
      const femalePercent = 100 - malePercent;
      return { male: malePercent, female: femalePercent };
    };
    
    return {
      race: {
        americanIndian: raceValues[0],
        asian: raceValues[1],
        black: raceValues[2],
        pacificIslander: raceValues[3],
        white: whiteValue
      },
      ethnicity: {
        hispanicOrLatino: { 
          percent: hispanic, 
          count: hispanicCount,
          gender: { male: hispanicMale, female: hispanicFemale }
        },
        notHispanicOrLatino: { 
          percent: notHispanic, 
          count: notHispanicCount,
          gender: { male: notHispanicMale, female: notHispanicFemale }
        }
      },
      gender: {
        male: maleValue,
        female: femaleValue,
        other: otherValue
      },
      ageGroup: {
        ageUnder5: { 
          percent: ageUnder5, 
          count: Math.round((ageUnder5 / 100) * totalPatients),
          gender: generateGenderBreakdown(ageUnder5)
        },
        age6_17: { 
          percent: age6_17, 
          count: Math.round((age6_17 / 100) * totalPatients),
          gender: generateGenderBreakdown(age6_17)
        },
        age18_29: { 
          percent: age18_29, 
          count: Math.round((age18_29 / 100) * totalPatients),
          gender: generateGenderBreakdown(age18_29)
        },
        age30_44: { 
          percent: age30_44, 
          count: Math.round((age30_44 / 100) * totalPatients),
          gender: generateGenderBreakdown(age30_44)
        },
        age45_59: { 
          percent: age45_59, 
          count: Math.round((age45_59 / 100) * totalPatients),
          gender: generateGenderBreakdown(age45_59)
        },
        age60_74: { 
          percent: age60_74, 
          count: Math.round((age60_74 / 100) * totalPatients),
          gender: generateGenderBreakdown(age60_74)
        },
        age75plus: { 
          percent: age75plus, 
          count: Math.round((age75plus / 100) * totalPatients),
          gender: generateGenderBreakdown(age75plus)
        }
      }
    };
  };

  const diversityData = generateDiversityData(selectedDatabase);

  // Helper function to bold key phrases in competitive advantages
  const boldKeywords = (text: string) => {
    // Pattern matches for common keywords to highlight
    const patterns = [
      /(\d+\+?\s*years?)/gi, // Years (e.g., "15+ years", "5 years")
      /(\d+%)/gi, // Percentages (e.g., "94%", "40% YoY")
      /(strong|excellent|proven|dedicated|priority|consistently)/gi, // Strong descriptors
      /(COPD|respiratory|pulmonary)/gi, // Medical terms
      /(\d+\+?\s*\w+\s*trials?)/gi, // Trial counts (e.g., "15+ respiratory trials", "20+ trials")
      /(NIH funding)/gi, // Specific achievements
    ];

    let processedText = text;
    const matches: Array<{ text: string; index: number }> = [];

    // Find all matches
    patterns.forEach(pattern => {
      const found = text.match(pattern);
      if (found) {
        found.forEach(match => {
          const index = text.indexOf(match);
          if (index !== -1 && !matches.some(m => m.index === index)) {
            matches.push({ text: match, index });
          }
        });
      }
    });

    // Sort by index and take first 2
    const topMatches = matches.sort((a, b) => a.index - b.index).slice(0, 2);

    // Replace matches with bolded versions
    topMatches.reverse().forEach(match => {
      processedText = processedText.replace(
        match.text,
        `<strong>${match.text}</strong>`
      );
    });

    return processedText;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex flex-col">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-50">
        <Header onDashboardClick={onDashboardClick} />
      </div>

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
      <div className="relative z-10 w-[90%] mx-auto px-8 py-6 flex-grow overflow-visible">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 overflow-visible"
        >
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={onBack}
                size="sm"
                className="flex items-center gap-2 bg-white text-gray-600 hover:text-gray-800 border border-gray-200/60 hover:border-gray-300 hover:bg-gray-50/50 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sites List
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => generateSiteDetailPDF(site, protocolNumber)}
                size="sm"
                title="Export PDF"
                className="flex items-center gap-2 bg-white text-gray-600 hover:text-gray-800 border border-gray-200/60 hover:border-gray-300 hover:bg-gray-50/50 transition-all"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                onClick={onClose}
                size="sm"
                className="flex items-center gap-2 bg-sky-100 text-sky-700 hover:bg-sky-200 hover:text-sky-800 transition-all"
              >
                <FileText className="h-4 w-4" />
                Study Ask Profile
              </Button>
              <Button
                onClick={onGoldenSiteClick}
                size="sm"
                className="flex items-center gap-2 bg-sky-100 text-sky-700 hover:bg-sky-200 hover:text-sky-800 transition-all"
              >
                <Award className="h-4 w-4" />
                Golden Site Profile
              </Button>
            </div>
          </nav>

          {/* Site Header Card - New Horizontal Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6"
          >
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-white/90 to-blue-50/60 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 p-6"
          >
            <div className="grid grid-cols-1 gap-6">
              {/* Site Info */}
              <div>
                {/* Study Name */}
                <div className="grid grid-cols-12 gap-6 mb-4">
                  {/* Left 6 Columns: Study Name + Site Name + Status Badge */}
                  <div className="col-span-6">
                    {/* Study Name */}
                    <p className="text-base text-gray-700 mb-2">COPD Exacerbation Prevention Study - Phase III</p>
                    
                    {/* Site Name + Status Badge */}
                    <div className="flex items-center gap-4">
                      <h1 className="text-4xl font-bold text-[#061e47]">{site.name}</h1>
                      
                     
                    </div>
                  </div>
                  
                  {/* Right 6 Columns: Strategic Direction */}
                  <div className="col-span-6">
                    {site.strategicDirection && site.strategicDirection.length > 0 && (
                      <div className="flex flex-col items-end gap-3 h-full justify-center">
                        <div className="flex gap-3">
                          {site.strategicDirection.map((item, index) => {
                            // Different rendering for TA Growth vs Revenue Focus
                            if (item.category === "Therapeutic Area Growth") {
                              return (
                                <div
                                  key={index}
                                  className="relative group/strategic"
                                >
                                  {/* Label */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <Briefcase className="h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
                                    <span className="text-[11px] font-semibold text-gray-500">Strategic Direction</span>
                                  </div>
                                  
                                  {/* Card */}
                                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-gradient-to-br from-blue-100/90 to-blue-50/70 border-blue-200/50 shadow-sm">
                                    <span className="text-[11px] font-semibold text-gray-700 leading-tight whitespace-nowrap">
                                      Therapeutic Area Growth
                                    </span>
                                  </div>
                                  
                                  {/* Hover Tooltip */}
                                  <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 invisible group-hover/strategic:opacity-100 group-hover/strategic:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
                                    Therapeutic Area Growth Initiative
                                    <div className="absolute right-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                                  </div>
                                </div>
                              );
                            } else if (item.category === "Revenue Focus") {
                              const percentOfTarget = item.percentOfTarget || 75;
                              const gap = item.gap || (100 - percentOfTarget);
                              
                              // Get color based on percentage
                              const getRadialColor = (percent: number) => {
                                if (percent >= 90) return '#f59e0b'; // Light amber
                                if (percent >= 75) return '#f97316'; // Medium orange
                                if (percent >= 60) return '#ea580c'; // Deeper orange
                                return '#c2410c'; // Dark orange
                              };
                              
                              const radialColor = getRadialColor(percentOfTarget);
                              const radius = 30;
                              const circumference = 2 * Math.PI * radius;
                              const strokeDashoffset = circumference - (percentOfTarget / 100) * circumference;
                              
                              return (
                                <div key={index}>
                                  {/* Label */}
                                  <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="h-3.5 w-3.5 flex-shrink-0 text-orange-600" />
                                    <span className="text-[11px] font-semibold text-gray-500">Revenue Coverage</span>
                                  </div>
                                  
                                  {/* Card */}
                                  <div className="flex flex-col gap-2 px-3 py-2.5 rounded-lg border bg-amber-50/40 border-amber-200/40 shadow-sm min-w-[160px]">
                                    {/* Radial Mini Indicator with Tooltip */}
                                    <div className="flex items-center gap-3 relative group/revenue">
                                      <div className="relative">
                                        <svg width="70" height="70" className="transform -rotate-90">
                                          {/* Background circle */}
                                          <circle
                                            cx="35"
                                            cy="35"
                                            r={radius}
                                            fill="none"
                                            stroke="#e5e7eb"
                                            strokeWidth="5"
                                          />
                                          {/* Progress circle */}
                                          <circle
                                            cx="35"
                                            cy="35"
                                            r={radius}
                                            fill="none"
                                            stroke={radialColor}
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                                          />
                                          {/* Center percentage text */}
                                          <text
                                            x="35"
                                            y="35"
                                            textAnchor="middle"
                                            dominantBaseline="central"
                                            className="text-[15px] font-bold fill-gray-700 transform rotate-90"
                                            style={{ transformOrigin: '35px 35px' }}
                                          >
                                            {percentOfTarget}%
                                          </text>
                                        </svg>
                                      </div>
                                      
                                      {/* Info text next to radial */}
                                      <div className="flex flex-col gap-1">
                                        <div className="text-[10px] font-medium text-gray-700">
                                          {percentOfTarget}% of target
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                          <TrendingDown className="h-3 w-3 text-red-600" />
                                          <span className="text-[10px] font-medium text-red-600">
                                            Gap {gap}%
                                          </span>
                                        </div>
                                      </div>
                                      
                                      {/* Tooltip */}
                                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover/revenue:block z-50 pointer-events-none">
                                        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg min-w-[160px]">
                                          <div className="text-[10px] font-semibold mb-1.5 text-amber-300">Revenue Coverage</div>
                                          <div className="space-y-1">
                                            <div className="flex justify-between items-center gap-3">
                                              <span className="text-[9px] text-gray-300">Target Achievement:</span>
                                              <span className="text-[9px] font-semibold text-white">{percentOfTarget}%</span>
                                            </div>
                                            <div className="flex justify-between items-center gap-3">
                                              <span className="text-[9px] text-gray-300">Gap to Target:</span>
                                              <span className="text-[9px] font-semibold text-red-400">{gap}%</span>
                                            </div>
                                            <div className="flex justify-between items-center gap-3">
                                              <span className="text-[9px] text-gray-300">Annual Target:</span>
                                              <span className="text-[9px] font-semibold text-white">100%</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="absolute left-8 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            
                            return null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                
                
                {/* Quick Stats Row */}
                <div className="flex gap-4">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 flex-1 relative">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-sky-600" />
                      <div className="text-xs text-gray-500">Observed Enrollment Rate</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-[#284497] text-[26px]">{site.enrollmentRate || 4}<span className="text-sm font-normal text-gray-600">/month</span></div>
                      <button
                        onClick={() => setShowHistoricPerformance(!showHistoricPerformance)}
                        className="px-2 mt-2 py-0.5 rounded-md bg-[#284497]/10 hover:bg-[#284497]/20 text-[10px] font-medium text-[#284497] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <div className="relative w-3 h-3">
                          {/* Outer circle */}
                          <motion.div
                            className="absolute inset-0 rounded-full border border-[#284497]"
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.6, 0.3, 0.6],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          {/* Inner dot */}
                          <motion.div
                            className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-[#284497]"
                            style={{ translateX: "-50%", translateY: "-50%" }}
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.8, 1, 0.8],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        </div>
                        Track Record
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-purple-600" />
                      <div className="text-xs text-gray-500">Forecasted Enrolment</div>
                    </div>
                    <div className="font-bold text-[#284497] text-[26px]">{Math.round((metrics.forecastedMin + metrics.forecastedMax) / 2)} <span className="text-sm font-normal text-gray-600">patients</span></div>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-emerald-600" />
                      <div className="text-xs text-gray-500">Eligible Patient Population</div>
                    </div>
                    <div className="font-bold text-[#284497] text-[26px]">{metrics.eligiblePatientPool.toLocaleString()}<span className="text-sm font-normal text-gray-600"> patients</span></div>
                  </div>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-indigo-600" />
                      <div className="text-xs text-gray-500">Local Disease Prevalence</div>
                    </div>
                    <div className="font-bold text-[#284497] text-[26px]">{metrics.localDiseasePrevalence.toLocaleString()}<span className="text-sm font-normal text-gray-600"> patients</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          </motion.div>

          {/* Unified Site Detail Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl p-0"
          >
            <div className="space-y-4">
              {/* Capability Indicators Section */}
              <div className="mt-2 space-y-4">
                {/* 6:6 Grid Layout - KPIs and Competitive Advantages/Critical Gaps */}
                <div className="grid grid-cols-12 gap-4 pt-4">
                  
                  {/* Left Column (6 columns) - Site Performance and Investigator Capability */}
                  <div className="col-span-6 space-y-4 p-4 bg-white/60 border border-gray-200/40 rounded-2xl shadow-xl">

                    {/* Site Performance */}
                    <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/60 to-white border border-blue-200/40 rounded-2xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-3.5 w-3.5 text-[#284497]" />
                        <h3 className="text-sm font-bold text-[#284497]">Site Performance</h3>
                      </div>
                      <div className="border-t border-blue-200/30 mb-2"></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/60 border border-gray-200/40 rounded-lg p-2">
                          <div className="text-[10px] text-gray-600 mb-0.5">Similar Trials Experience</div>
                          <div className="text-lg font-bold text-[#284497]">{metrics.similarTrialExperience || '-'}</div>
                        </div>
                        <div className="bg-white/60 border border-gray-200/40 rounded-lg p-2">
                          <div className="text-[10px] text-gray-600 mb-0.5">Retention Rate in Similar Trials</div>
                          <div className="flex items-end gap-1">
                            <div className="text-lg font-bold text-[#284497]">{metrics.retentionRate || '-'}</div>
                            {metrics.retentionRate && <div className="text-[10px] text-gray-500 mb-0.5">%</div>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Investigator Capability */}
                    <div className="bg-gradient-to-br from-purple-50/70 via-violet-50/60 to-white border border-purple-200/40 rounded-2xl p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <UserCheck className="h-3.5 w-3.5 text-[#284497]" />
                        <h3 className="text-sm font-bold text-[#284497]">Investigator Capability</h3>
                      </div>
                      <div className="border-t border-purple-200/30 mb-2"></div>
                      
                      {/* Principal Investigator - 1x4 Grid */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2 pb-0">
                          <div className="text-xs font-semibold text-gray-700">Principal Investigator</div>
                          <span className="px-2 py-0.5 rounded-md bg-[#284497]/10 text-[10px] font-medium text-[#284497]">
                            Specialty: Pulmonology
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-white/60 border border-gray-200/40 rounded-lg p-2">
                            <div className="text-[10px] text-gray-600 mb-0.5">Total Trials experience</div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1">
                                <div className="text-[9px] text-gray-500">Velocity</div>
                                <div className="text-sm font-bold text-[#284497]">{metrics.similarTrialExperience ? Math.round(metrics.similarTrialExperience * 1.2 + Math.random() * 2) : '-'}</div>
                              </div>
                              <div className="w-px h-6 bg-gray-300"></div>
                              <div className="flex-1">
                                <div className="text-[9px] text-gray-500">Career</div>
                                <div className="text-sm font-bold text-[#284497]">{metrics.similarTrialExperience ? Math.round(metrics.similarTrialExperience * 2.5 + Math.random() * 5) : '-'}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white/60 border border-gray-200/40 rounded-lg p-2">
                            <div className="text-[10px] text-gray-600 mb-0.5">Similar Trial Experience</div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1">
                                <div className="text-[9px] text-gray-500">Velocity</div>
                                <div className="text-sm font-bold text-[#284497]">{Math.floor(Math.random() * 3) + 2}</div>
                              </div>
                              <div className="w-px h-6 bg-gray-300"></div>
                              <div className="flex-1">
                                <div className="text-[9px] text-gray-500">Career</div>
                                <div className="text-sm font-bold text-[#284497]">{Math.floor(Math.random() * 5) + 6}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white/60 border border-gray-200/40 rounded-lg p-2">
                            <div className="text-[10px] text-gray-600 mb-0.5">Medical Practice</div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1">
                                <div className="text-[9px] text-gray-500">Total Practice</div>
                                <div className="text-sm font-bold text-[#284497]">
                                  {Math.floor(Math.random() * 8) + 15}
                                  <span className="text-[9px] font-normal text-gray-500">/yrs</span>
                                </div>
                              </div>
                              <div className="w-px h-6 bg-gray-300"></div>
                              <div className="flex-1">
                                <div className="text-[9px] text-gray-500">Clinical Research</div>
                                <div className="text-sm font-bold text-[#284497]">
                                  {Math.floor(Math.random() * 6) + 8}
                                  <span className="text-[9px] font-normal text-gray-500">/yrs</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white/60 border border-gray-200/40 rounded-lg p-2">
                            <div className="text-[10px] text-gray-600 mb-0.5">Trials with Same Sponsor</div>
                            <div className="text-lg font-bold text-[#284497]">{metrics.siteCollaborations || '-'}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Sub-Investigator - Only Similar Trial Experience */}
                      <div>
                        <div className="flex items-center gap-2 mb-2 pb-0">
                          <div className="text-xs font-semibold text-gray-700">Sub-Investigator</div>
                          <span className="px-2 py-0.5 rounded-md bg-[#284497]/10 text-[10px] font-medium text-[#284497]">
                            Specialty: Internal Med.
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-white/60 border border-gray-200/40 rounded-lg p-2">
                            <div className="text-[10px] text-gray-600 mb-0.5">Similar Trial Experience</div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1">
                                <div className="text-[9px] text-gray-500">Velocity</div>
                                <div className="text-sm font-bold text-[#284497]">{Math.floor(Math.random() * 2) + 1}</div>
                              </div>
                              <div className="w-px h-6 bg-gray-300"></div>
                              <div className="flex-1">
                                <div className="text-[9px] text-gray-500">Career</div>
                                <div className="text-sm font-bold text-[#284497]">{Math.floor(Math.random() * 4) + 4}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (6 columns) - Competitive Advantages and Critical Gaps */}
                  <div className="col-span-6 space-y-4">
                    {/* Competitive Advantages */}
                    {site.competitiveAdvantages && site.competitiveAdvantages.length > 0 && (
                      <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/70 to-white rounded-2xl shadow-xl border border-emerald-200/70 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="h-5 w-5 text-emerald-600" />
                          <h3 className="text-sm font-bold text-[#061e47]">Competitive Advantages</h3>
                        </div>
                        <div className="border-t border-emerald-200/30 mb-3"></div>
                        <ul className="space-y-2">
                          {site.competitiveAdvantages.map((advantage, index) => (
                            <li key={index} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <span className="text-emerald-600 font-bold text-base flex-shrink-0 leading-none mt-0.5">+</span>
                              <span dangerouslySetInnerHTML={{ __html: boldKeywords(advantage) }} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Critical Gaps */}
                    {site.riskFactors && site.riskFactors.length > 0 && (
                      <div className="bg-gradient-to-br from-rose-50/80 via-pink-50/70 to-white rounded-2xl shadow-xl border border-rose-200/70 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="h-5 w-5 text-rose-600" />
                          <h3 className="text-sm font-bold text-[#061e47]">Critical Gaps</h3>
                        </div>
                        <div className="border-t border-rose-200/30 mb-3"></div>
                        <ul className="space-y-2">
                          {site.riskFactors.map((risk, index) => (
                            <li key={index} className="flex items-start gap-2.5 text-sm text-gray-700">
                              <span className="text-rose-600 font-bold text-base flex-shrink-0 leading-none mt-0.5">−</span>
                              <span dangerouslySetInnerHTML={{ __html: boldKeywords(risk) }} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Diversity Distribution - Full Width Below */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-6 overflow-visible mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-[#284497]/10 to-[#35bdd4]/10 rounded-lg">
                  <Users className="h-5 w-5 text-[#284497]" />
                </div>
                <h3 className="text-lg font-bold text-[#061e47]">Diversity Distribution</h3>
                <span className="text-xs text-gray-500">(at the site population level)</span>
              </div>
              
              {/* Database Toggle - Segmented Control */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedDatabase('velocity')}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedDatabase === 'velocity'
                      ? 'bg-white text-[#284497] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Velocity Demographics
                </button>
                <button
                  onClick={() => setSelectedDatabase('public')}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                    selectedDatabase === 'public'
                      ? 'bg-white text-[#284497] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Public Demographics
                </button>
              </div>
            </div>
            
            {/* 3-Column Layout: Race, Ethnicity, and Age Group */}
            <div className="grid grid-cols-3 gap-8 divide-x divide-gray-200 overflow-visible">
              {/* Race Distribution */}
              <div className="space-y-3 pr-8 overflow-visible">
                <div className="text-xs font-semibold text-gray-600 mb-4 text-[14px]">Race</div>
                
                {/* American Indian or Alaskan Native */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-700">American Indian or Alaskan Native</span>
                    <span className="text-xs font-semibold text-gray-900">{diversityData.race.americanIndian}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500 ease-in-out" style={{ width: `${diversityData.race.americanIndian}%`, backgroundColor: '#f4d5a6' }}></div>
                  </div>
                </div>
                
                {/* Asian */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-700">Asian</span>
                    <span className="text-xs font-semibold text-gray-900">{diversityData.race.asian}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500 ease-in-out" style={{ width: `${diversityData.race.asian}%`, backgroundColor: '#d4b5d4' }}></div>
                  </div>
                </div>
                
                {/* Black or African American */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-700">Black or African American</span>
                    <span className="text-xs font-semibold text-gray-900">{diversityData.race.black}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500 ease-in-out" style={{ width: `${diversityData.race.black}%`, backgroundColor: '#b4d7b4' }}></div>
                  </div>
                </div>
                
                {/* Native Hawaiian or Other Pacific Islander */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-700">Native Hawaiian or Other Pacific Islander</span>
                    <span className="text-xs font-semibold text-gray-900">{diversityData.race.pacificIslander}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500 ease-in-out" style={{ width: `${diversityData.race.pacificIslander}%`, backgroundColor: '#a7dbd8' }}></div>
                  </div>
                </div>
                
                {/* White or Caucasian */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-700">White or Caucasian</span>
                    <span className="text-xs font-semibold text-gray-900">{diversityData.race.white}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500 ease-in-out" style={{ width: `${diversityData.race.white}%`, backgroundColor: '#a7c7e7' }}></div>
                  </div>
                </div>
              </div>

              {/* Ethnicity Distribution - Donut Chart */}
              <div className="space-y-3 px-4">
                <div className="text-xs font-semibold text-gray-600 mb-4 text-[14px]">Ethnicity</div>
                
                {/* Donut Chart with Side Legend */}
                <div className="flex items-center gap-4 mb-6">
                  {/* Donut Chart */}
                  <div className="relative w-40 h-40 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="12"
                      />
                      {/* Not Hispanic or Latino segment */}
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#9ed4c6"
                        strokeWidth="12"
                        strokeDasharray={`${(diversityData.ethnicity.notHispanicOrLatino.percent * 220) / 100} 220`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                      />
                      {/* Hispanic or Latino segment */}
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        fill="none"
                        stroke="#d4bce6"
                        strokeWidth="12"
                        strokeDasharray={`${(diversityData.ethnicity.hispanicOrLatino.percent * 220) / 100} 220`}
                        strokeDashoffset={`-${(diversityData.ethnicity.notHispanicOrLatino.percent * 220) / 100}`}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 0.5s ease-in-out, stroke-dashoffset 0.5s ease-in-out' }}
                      />
                    </svg>
                  </div>

                  {/* Legend - Right Side with Gender Breakdown */}
                  <div className="flex flex-col gap-3">
                    {/* Not Hispanic or Latino */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#9ed4c6' }}></div>
                        <span className="text-[11px] text-gray-700 leading-tight">Not Hispanic or Latino - <span className="font-bold">{diversityData.ethnicity.notHispanicOrLatino.percent}% ({diversityData.ethnicity.notHispanicOrLatino.count})</span></span>
                      </div>
                      {/* Gender Display */}
                      <div className="pl-4">
                        <div className="flex items-center gap-2 text-[11px] text-gray-700">
                          <span><span className="text-base font-bold" style={{ color: '#7ba7d6', textShadow: '0 0 1px rgba(40, 68, 151, 0.3)' }}>♂</span> {diversityData.ethnicity.notHispanicOrLatino.gender.male}%</span>
                          <span><span className="text-base font-bold" style={{ color: '#f5a3cb', textShadow: '0 0 1px rgba(236, 72, 153, 0.3)' }}>♀</span> {diversityData.ethnicity.notHispanicOrLatino.gender.female}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hispanic or Latino */}
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#d4bce6' }}></div>
                        <span className="text-[11px] text-gray-700 leading-tight">Hispanic or Latino - <span className="font-bold">{diversityData.ethnicity.hispanicOrLatino.percent}% ({diversityData.ethnicity.hispanicOrLatino.count})</span></span>
                      </div>
                      {/* Gender Display */}
                      <div className="pl-4">
                        <div className="flex items-center gap-2 text-[11px] text-gray-700">
                          <span><span className="text-base font-bold" style={{ color: '#7ba7d6', textShadow: '0 0 1px rgba(40, 68, 151, 0.3)' }}>♂</span> {diversityData.ethnicity.hispanicOrLatino.gender.male}%</span>
                          <span><span className="text-base font-bold" style={{ color: '#f5a3cb', textShadow: '0 0 1px rgba(236, 72, 153, 0.3)' }}>♀</span> {diversityData.ethnicity.hispanicOrLatino.gender.female}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Age Group Distribution */}
              <div className="space-y-3 pl-2 p-0 overflow-visible">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-semibold text-gray-600 text-[14px]">Age Group</div>
                  
                  {/* Legend */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-base font-bold" style={{ color: '#7ba7d6', textShadow: '0 0 1px rgba(40, 68, 151, 0.3)' }}>♂</span>
                      <span className="text-[10px] text-gray-600">Male</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-base font-bold" style={{ color: '#f5a3cb', textShadow: '0 0 1px rgba(236, 72, 153, 0.3)' }}>♀</span>
                      <span className="text-[10px] text-gray-600">Female</span>
                    </div>
                  </div>
                </div>
                
                {/* Vertical Bar Graph */}
                <div className="flex items-end justify-center gap-2 h-40 p-3 bg-[rgba(255,255,255,0)]">
                  {/* <5 */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <SimpleTooltip content={
                      <div className="text-[10px]">
                        <div>M: {diversityData.ageGroup.ageUnder5.gender.male}% ({Math.round((diversityData.ageGroup.ageUnder5.gender.male / 100) * diversityData.ageGroup.ageUnder5.count)})</div>
                        <div>F: {diversityData.ageGroup.ageUnder5.gender.female}% ({Math.round((diversityData.ageGroup.ageUnder5.gender.female / 100) * diversityData.ageGroup.ageUnder5.count)})</div>
                        <div>Total: {diversityData.ageGroup.ageUnder5.percent}% ({diversityData.ageGroup.ageUnder5.count})</div>
                      </div>
                    }>
                      <div className="relative w-full flex flex-col justify-end items-center border-b border-gray-300/40" style={{ height: '150px' }}>
                        <div className="flex flex-col items-center mb-1 relative z-0">
                          <div className="text-xs font-semibold text-gray-900">{diversityData.ageGroup.ageUnder5.percent}%</div>
                        </div>
                        <div className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-default flex flex-col relative z-10" 
                          style={{ height: `${diversityData.ageGroup.ageUnder5.percent}%` }}>
                          <div 
                            className="w-full rounded-t-lg" 
                            style={{ 
                              height: `${diversityData.ageGroup.ageUnder5.gender.female}%`,
                              backgroundColor: '#fbd5e6'
                            }}
                          />
                          <div 
                            className="w-full" 
                            style={{ 
                              height: `${diversityData.ageGroup.ageUnder5.gender.male}%`,
                              backgroundColor: '#bdd7f1'
                            }}
                          />
                        </div>
                      </div>
                    </SimpleTooltip>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">≤5</div>
                    </div>
                  </div>

                  {/* 6-17 */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <SimpleTooltip content={
                      <div className="text-[10px]">
                        <div>M: {diversityData.ageGroup.age6_17.gender.male}% ({Math.round((diversityData.ageGroup.age6_17.gender.male / 100) * diversityData.ageGroup.age6_17.count)})</div>
                        <div>F: {diversityData.ageGroup.age6_17.gender.female}% ({Math.round((diversityData.ageGroup.age6_17.gender.female / 100) * diversityData.ageGroup.age6_17.count)})</div>
                        <div>Total: {diversityData.ageGroup.age6_17.percent}% ({diversityData.ageGroup.age6_17.count})</div>
                      </div>
                    }>
                      <div className="relative w-full flex flex-col justify-end items-center border-b border-gray-300/40" style={{ height: '150px' }}>
                        <div className="flex flex-col items-center mb-1 relative z-0">
                          <div className="text-xs font-semibold text-gray-900">{diversityData.ageGroup.age6_17.percent}%</div>
                        </div>
                        <div className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-default flex flex-col relative z-10" 
                          style={{ height: `${diversityData.ageGroup.age6_17.percent}%` }}>
                          <div 
                            className="w-full rounded-t-lg" 
                            style={{ 
                              height: `${diversityData.ageGroup.age6_17.gender.female}%`,
                              backgroundColor: '#fbd5e6'
                            }}
                          />
                          <div 
                            className="w-full" 
                            style={{ 
                              height: `${diversityData.ageGroup.age6_17.gender.male}%`,
                              backgroundColor: '#bdd7f1'
                            }}
                          />
                        </div>
                      </div>
                    </SimpleTooltip>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">6-17</div>
                    </div>
                  </div>

                  {/* 18-29 */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <SimpleTooltip content={
                      <div className="text-[10px]">
                        <div>M: {diversityData.ageGroup.age18_29.gender.male}% ({Math.round((diversityData.ageGroup.age18_29.gender.male / 100) * diversityData.ageGroup.age18_29.count)})</div>
                        <div>F: {diversityData.ageGroup.age18_29.gender.female}% ({Math.round((diversityData.ageGroup.age18_29.gender.female / 100) * diversityData.ageGroup.age18_29.count)})</div>
                        <div>Total: {diversityData.ageGroup.age18_29.percent}% ({diversityData.ageGroup.age18_29.count})</div>
                      </div>
                    }>
                      <div className="relative w-full flex flex-col justify-end items-center border-b border-gray-300/40" style={{ height: '150px' }}>
                        <div className="flex flex-col items-center mb-1 relative z-0">
                          <div className="text-xs font-semibold text-gray-900">{diversityData.ageGroup.age18_29.percent}%</div>
                        </div>
                        <div className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-default flex flex-col relative z-10" 
                          style={{ height: `${diversityData.ageGroup.age18_29.percent}%` }}>
                          <div 
                            className="w-full rounded-t-lg" 
                            style={{ 
                              height: `${diversityData.ageGroup.age18_29.gender.female}%`,
                              backgroundColor: '#fbd5e6'
                            }}
                          />
                          <div 
                            className="w-full" 
                            style={{ 
                              height: `${diversityData.ageGroup.age18_29.gender.male}%`,
                              backgroundColor: '#bdd7f1'
                            }}
                          />
                        </div>
                      </div>
                    </SimpleTooltip>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">18-29</div>
                    </div>
                  </div>

                  {/* 30-44 */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <SimpleTooltip content={
                      <div className="text-[10px]">
                        <div>M: {diversityData.ageGroup.age30_44.gender.male}% ({Math.round((diversityData.ageGroup.age30_44.gender.male / 100) * diversityData.ageGroup.age30_44.count)})</div>
                        <div>F: {diversityData.ageGroup.age30_44.gender.female}% ({Math.round((diversityData.ageGroup.age30_44.gender.female / 100) * diversityData.ageGroup.age30_44.count)})</div>
                        <div>Total: {diversityData.ageGroup.age30_44.percent}% ({diversityData.ageGroup.age30_44.count})</div>
                      </div>
                    }>
                      <div className="relative w-full flex flex-col justify-end items-center border-b border-gray-300/40" style={{ height: '150px' }}>
                        <div className="flex flex-col items-center mb-1 relative z-0">
                          <div className="text-xs font-semibold text-gray-900">{diversityData.ageGroup.age30_44.percent}%</div>
                        </div>
                        <div className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-default flex flex-col relative z-10" 
                          style={{ height: `${diversityData.ageGroup.age30_44.percent}%` }}>
                          <div 
                            className="w-full rounded-t-lg" 
                            style={{ 
                              height: `${diversityData.ageGroup.age30_44.gender.female}%`,
                              backgroundColor: '#fbd5e6'
                            }}
                          />
                          <div 
                            className="w-full" 
                            style={{ 
                              height: `${diversityData.ageGroup.age30_44.gender.male}%`,
                              backgroundColor: '#bdd7f1'
                            }}
                          />
                        </div>
                      </div>
                    </SimpleTooltip>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">30-44</div>
                    </div>
                  </div>

                  {/* 45-59 */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <SimpleTooltip content={
                      <div className="text-[10px]">
                        <div>M: {diversityData.ageGroup.age45_59.gender.male}% ({Math.round((diversityData.ageGroup.age45_59.gender.male / 100) * diversityData.ageGroup.age45_59.count)})</div>
                        <div>F: {diversityData.ageGroup.age45_59.gender.female}% ({Math.round((diversityData.ageGroup.age45_59.gender.female / 100) * diversityData.ageGroup.age45_59.count)})</div>
                        <div>Total: {diversityData.ageGroup.age45_59.percent}% ({diversityData.ageGroup.age45_59.count})</div>
                      </div>
                    }>
                      <div className="relative w-full flex flex-col justify-end items-center border-b border-gray-300/40" style={{ height: '150px' }}>
                        <div className="flex flex-col items-center mb-1 relative z-0">
                          <div className="text-xs font-semibold text-gray-900">{diversityData.ageGroup.age45_59.percent}%</div>
                        </div>
                        <div className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-default flex flex-col relative z-10" 
                          style={{ height: `${diversityData.ageGroup.age45_59.percent}%` }}>
                          <div 
                            className="w-full rounded-t-lg" 
                            style={{ 
                              height: `${diversityData.ageGroup.age45_59.gender.female}%`,
                              backgroundColor: '#fbd5e6'
                            }}
                          />
                          <div 
                            className="w-full" 
                            style={{ 
                              height: `${diversityData.ageGroup.age45_59.gender.male}%`,
                              backgroundColor: '#bdd7f1'
                            }}
                          />
                        </div>
                      </div>
                    </SimpleTooltip>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">45-59</div>
                    </div>
                  </div>

                  {/* 60-74 */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <SimpleTooltip content={
                      <div className="text-[10px]">
                        <div>M: {diversityData.ageGroup.age60_74.gender.male}% ({Math.round((diversityData.ageGroup.age60_74.gender.male / 100) * diversityData.ageGroup.age60_74.count)})</div>
                        <div>F: {diversityData.ageGroup.age60_74.gender.female}% ({Math.round((diversityData.ageGroup.age60_74.gender.female / 100) * diversityData.ageGroup.age60_74.count)})</div>
                        <div>Total: {diversityData.ageGroup.age60_74.percent}% ({diversityData.ageGroup.age60_74.count})</div>
                      </div>
                    }>
                      <div className="relative w-full flex flex-col justify-end items-center border-b border-gray-300/40" style={{ height: '150px' }}>
                        <div className="flex flex-col items-center mb-1 relative z-0">
                          <div className="text-xs font-semibold text-gray-900">{diversityData.ageGroup.age60_74.percent}%</div>
                        </div>
                        <div className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-default flex flex-col relative z-10" 
                          style={{ height: `${diversityData.ageGroup.age60_74.percent}%` }}>
                          <div 
                            className="w-full rounded-t-lg" 
                            style={{ 
                              height: `${diversityData.ageGroup.age60_74.gender.female}%`,
                              backgroundColor: '#fbd5e6'
                            }}
                          />
                          <div 
                            className="w-full" 
                            style={{ 
                              height: `${diversityData.ageGroup.age60_74.gender.male}%`,
                              backgroundColor: '#bdd7f1'
                            }}
                          />
                        </div>
                      </div>
                    </SimpleTooltip>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">60-74</div>
                    </div>
                  </div>

                  {/* 75+ */}
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <SimpleTooltip content={
                      <div className="text-[10px]">
                        <div>M: {diversityData.ageGroup.age75plus.gender.male}% ({Math.round((diversityData.ageGroup.age75plus.gender.male / 100) * diversityData.ageGroup.age75plus.count)})</div>
                        <div>F: {diversityData.ageGroup.age75plus.gender.female}% ({Math.round((diversityData.ageGroup.age75plus.gender.female / 100) * diversityData.ageGroup.age75plus.count)})</div>
                        <div>Total: {diversityData.ageGroup.age75plus.percent}% ({diversityData.ageGroup.age75plus.count})</div>
                      </div>
                    }>
                      <div className="relative w-full flex flex-col justify-end items-center border-b border-gray-300/40" style={{ height: '150px' }}>
                        <div className="flex flex-col items-center mb-1 relative z-0">
                          <div className="text-xs font-semibold text-gray-900">{diversityData.ageGroup.age75plus.percent}%</div>
                        </div>
                        <div className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-default flex flex-col relative z-10" 
                          style={{ height: `${diversityData.ageGroup.age75plus.percent}%` }}>
                          <div 
                            className="w-full rounded-t-lg" 
                            style={{ 
                              height: `${diversityData.ageGroup.age75plus.gender.female}%`,
                              backgroundColor: '#fbd5e6'
                            }}
                          />
                          <div 
                            className="w-full" 
                            style={{ 
                              height: `${diversityData.ageGroup.age75plus.gender.male}%`,
                              backgroundColor: '#bdd7f1'
                            }}
                          />
                        </div>
                      </div>
                    </SimpleTooltip>
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">≥75</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

         
          

          {/* Gap Analysis (if gaps exist) */}
          {site.criticalRequirements.filter(req => req.points === 0).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-slate-50/90 to-blue-50/90 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-200/40 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#061e47]">Gap Analysis & Recommendations</h3>
                  <p className="text-sm text-gray-600 mt-0.5">Actionable insights to enable site activation</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Gaps */}
                <div className="bg-white/70 rounded-xl p-6 border border-red-200/40">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h4 className="font-bold text-red-600">Identified Gaps</h4>
                  </div>
                  <ul className="space-y-3">
                    {site.criticalRequirements
                      .filter(req => req.points === 0)
                      .map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-800">{req.text}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-white/70 rounded-xl p-6 border border-blue-200/40">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <h4 className="font-bold text-blue-600">Remediation Strategies</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-700">Staffing & Capacity</div>
                      <ul className="space-y-1.5">
                        <li className="flex items-start gap-2 text-sm text-gray-800">
                          <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <span>Partner with nearby academic centers</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-gray-800">
                          <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          <span>Sponsor GCP training programs</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-0 w-[90%] mx-auto px-8 py-6 border-t border-gray-200/50 mt-auto">
        <div className="text-center text-sm text-gray-500">
          © 2025 Velocity Clinical Research, United States. All rights reserved.
        </div>
      </footer>

      {/* Historic Performance Popover - Speech Bubble Style */}
      <AnimatePresence>
        {showHistoricPerformance && (
          <div key="historic-performance-popover">
            {/* Backdrop - blurred with dark overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              onClick={() => setShowHistoricPerformance(false)}
            />
            
            {/* Popover Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-[220px] left-1/2 -translate-x-1/2 z-[101] w-[70%] max-w-3xl"
            >
              <div className="relative bg-white rounded-xl shadow-2xl border border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#284497]/10 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-[#284497]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#061e47]">Historical Enrollment Rate</h3>
                  </div>
                  <button
                    onClick={() => setShowHistoricPerformance(false)}
                    className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  
                  
                  {/* Horizontal Jitter Plot */}
                  <div className="relative bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl border border-gray-200">
                    <div className="flex flex-col">
                      {/* Plot area */}
                      <div className="flex">
                        {/* Y-axis labels (enrollment rate) */}
                        <div className="flex flex-col justify-between py-4 w-16 border-r border-gray-200">
                          <div className="text-center">
                            <span className="text-xs font-bold text-gray-700">{jitterPlotData.maxRate.toFixed(0)}</span>
                          </div>
                          <div className="text-center">
                            <span className="text-[10px] font-semibold text-gray-600 [writing-mode:vertical-lr] rotate-180">
                              Enrollment Rate
                            </span>
                          </div>
                          <div className="text-center">
                            <span className="text-xs font-bold text-gray-700">{jitterPlotData.minRate.toFixed(0)}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 relative">
                          {/* Horizontal and vertical reference lines */}
                          <div className="absolute inset-0 pointer-events-none">
                            {/* Vertical dividers for year columns */}
                            {jitterPlotData.years.map((year, index) => {
                              if (index === jitterPlotData.years.length - 1) return null;
                              const xPercent = ((index + 1) / jitterPlotData.years.length) * 100;
                              return (
                                <div
                                  key={`divider-${year}`}
                                  className="absolute top-0 bottom-0 w-px bg-gray-300/40"
                                  style={{ left: `${xPercent}%` }}
                                />
                              );
                            })}
                            
                            {/* Horizontal reference lines */}
                            {[25, 50, 75].map((y) => (
                              <div
                                key={`h-${y}`}
                                className="absolute left-0 right-0 h-px bg-gray-200/50"
                                style={{ top: `${y}%` }}
                              />
                            ))}
                          </div>
                        
                        {/* Plot container */}
                        <div className="relative h-[240px] px-4">
                          {/* Monthly enrollment dots for each study */}
                          {jitterPlotData.studies.flatMap((study: any) => {
                            const color = getTherapeuticAreaColor(study.therapeuticArea);
                            
                            return study.monthlyData.map((monthData: any, monthIndex: number) => {
                              const position = getMonthlyDotPosition(study, monthData, monthIndex);
                              
                              return (
                                <div
                                  key={`${study.studyId}-month-${monthIndex}`}
                                  className="absolute cursor-pointer group/dot hover:!z-[9999]"
                                  style={{
                                    left: `${position.x}%`,
                                    top: `${position.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 10,
                                  }}
                                >
                                  {/* Monthly dot */}
                                  <div
                                    className="rounded-full transition-all duration-300 group-hover/dot:scale-150 group-hover/dot:shadow-xl"
                                    style={{
                                      width: `${position.size}px`,
                                      height: `${position.size}px`,
                                      backgroundColor: color,
                                      opacity: 0.8,
                                    }}
                                  />
                                  
                                  {/* Hover card */}
                                  <div 
                                    className="hidden group-hover/dot:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none"
                                  >
                                    <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-2.5 whitespace-nowrap">
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <div
                                          className="w-2.5 h-2.5 rounded-full"
                                          style={{ backgroundColor: color }}
                                        />
                                        <span className="text-[10px] font-bold text-gray-900">{study.studyName}</span>
                                      </div>
                                      <div className="space-y-0.5 text-[9px] text-gray-600">
                                        <div className="flex justify-between gap-2">
                                          <span>Month:</span>
                                          <span className="font-semibold text-gray-900">{monthData.monthLabel}</span>
                                        </div>
                                        <div className="flex justify-between gap-2">
                                          <span>Enrolled:</span>
                                          <span className="font-semibold text-gray-900">{monthData.enrollmentRate} pts/month</span>
                                        </div>
                                        <div className="flex justify-between gap-2">
                                          <span>Study Duration:</span>
                                          <span className="font-semibold text-gray-900">{study.durationMonths} months</span>
                                        </div>
                                        <div className="flex justify-between gap-2">
                                          <span>Total Enrolled:</span>
                                          <span className="font-semibold text-gray-900">{study.totalPatients} pts</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            });
                          })}
                        </div>
                        
                        </div>
                      </div>
                      
                      {/* X-axis label and values (years) */}
                      <div className="border-t border-gray-200 px-4 py-2 ml-16">
                        <div className="flex items-center justify-between mb-1">
                          {jitterPlotData.years.map((year) => (
                            <span key={year} className="text-xs font-bold text-gray-700">
                              {year}
                            </span>
                          ))}
                        </div>
                        <div className="text-center">
                          <span className="text-[10px] font-semibold text-gray-600">
                            Year
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Therapeutic area legend */}
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                    {Array.from(new Set(jitterPlotData.studies.map((s: any) => s.therapeuticArea)))
                      .slice(0, 8)
                      .map((area: any) => (
                        <div key={area} className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: getTherapeuticAreaColor(area) }}
                          />
                          <span className="text-xs text-gray-700">{area}</span>
                        </div>
                      ))}
                  </div>
                  
                  {/* Key Insights */}
                  <div className="mt-4 p-2.5 bg-blue-50/60 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-[11px] text-gray-700 leading-relaxed">
                        <span className="font-semibold">Insight:</span> Each dot represents one month of enrollment across all studies. 
                        Vertical position and dot size both reflect enrollment rate that month. Dots are scattered horizontally across years to prevent overlap and show distribution.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}