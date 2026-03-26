import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SiteDetailView } from "./SiteDetailViewNew";
import { ViewResponses } from "./ViewResponses";
import {
  ArrowLeft,
  Search,
  ArrowUpDown,
  Eye,
  BarChart3,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  MapPin,
  TrendingUp,
  Home,
  Download,
  Plus,
  Minus,
  ChevronRight,
  Lightbulb,
  Users,
  FileText,
  Activity,
  Building2,
  UserCheck,
  UsersRound,
  Stethoscope,
  ThumbsUp,
  AlertTriangle,
  Target,
  Clock,
  Shield,
  Zap,
  DollarSign,
  TrendingDown,
  Briefcase,
  Sparkles,
  ArrowUpRight,
  Percent,
  Award,
  Globe,
  Filter,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Checkbox } from "../ui/checkbox";
import { Header } from "../Header";
import { generateScorecardPDF } from "../../utils/generateScorecardPDF";
import { generateSiteDetailPDF } from "../../utils/generateSiteDetailPDF";
import { CircularProgressGauge } from "./GaugeOptions";

interface Site {
  id: string;
  name: string;
  address: string;
  siteCode?: string;
  status: "Eligible" | "Under Review" | "Not Eligible";
  overallScore: number; // percentage
  priority?: "High" | "Medium" | "Low";
  siteInvestigatorScore: number; // percentage
  staffingCapacityScore: number; // percentage
  patientEnrollmentScore: number; // percentage
  infrastructureScore: number; // percentage
  detailedAssessment: string[];
  recommendation: {
    action: string;
    nextSteps: string;
  };
  compliance: number;
  criticalRequirements: Array<{ text: string; points: number }>;
  // New fields for additional insights
  activationReadiness?: "Ready to Activate" | "Needs Support" | "Under Assessment" | "High Risk";
  patientPoolSize?: number;
  enrollmentRate?: string; // Enrollment rate range per month (e.g., "7-16", "12-21", "4-11")
  criticalGapsCount?: number;
  startupTimeline?: string;
  competitiveAdvantages?: string[];
  riskFactors?: string[];
  strategicDirection?: Array<{ 
    category: "Therapeutic Area Growth" | "Revenue Focus";
    gap?: number; // Gap percentage (negative values)
    percentOfTarget?: number; // Percentage of annual revenue target achieved (for Revenue Focus)
  }>;
  shortfall?: number; // Percentage shortfall for strategic direction
  country?: string; // Country where site is located
  region?: string; // Region for filtering (USA, Poland, Germany, UK)
  city?: string; // City where site is located
}

// European sites data for COPD cardiovascular trials
const mockSites: Site[] = [
  // Poland Sites
  {
    id: "PL001",
    name: "Biała Podlaska Medical Center",
    country: "Poland",
    city: "Biała Podlaska",
    address: "ul. Terebelska 57, 21-500 Biała Podlaska, Poland",
    siteCode: "SITE-PL001",
    status: "Eligible",
    overallScore: 96,
    priority: "High",
    siteInvestigatorScore: 100,
    staffingCapacityScore: 95,
    patientEnrollmentScore: 100,
    infrastructureScore: 100,
    detailedAssessment: [
      "Excellent enrollment track record",
      "Advanced imaging capabilities",
      "Experienced PI with 20+ oncology trials",
      "High retention rates (98%)",
      "Flexible scheduling",
      "Cost-effective",
    ],
    recommendation: {
      action: "Move forward with site activation immediately. This site exceeds all critical requirements and demonstrates strong performance across all categories.",
      nextSteps:
        "Initiate feasibility questionnaire, schedule site visit, begin contract negotiations.",
    },
    compliance: 96,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 25,
    enrollmentRate: "18-24",
    criticalGapsCount: 0,
    startupTimeline: "4-5 weeks",
    competitiveAdvantages: [
      "Integrated cardio-pulmonary center with shared COPD-cardiac patient registry (1,200+ patients)",
      "Strong ICS-naïve enrichment, with ~45% of COPD patients not receiving maintenance ICS therapy",
      "92% retention rate at 36 months across cardiovascular outcomes trials",
      "Established CV disease population: 58% with documented MI, angina, PCI, or heart failure"
    ],
    riskFactors: [],
    strategicDirection: [
      { category: "Revenue Focus", percentOfTarget: 88, gap: 12 }
    ],
    shortfall: 12,
    region: "Poland",
  },
  {
    id: "002",
    name: "Durham",
    country: "USA",
    address: "300 E Main St, Suite 200, Durham, NC 27701",
    siteCode: "SITE-002",
    status: "Eligible",
    overallScore: 92,
    priority: "High",
    siteInvestigatorScore: 100,
    staffingCapacityScore: 75,
    patientEnrollmentScore: 100,
    infrastructureScore: 100,
    detailedAssessment: [
      "Strong PI credentials with 15+ oncology trials",
      "Dedicated research team",
      "Good patient retention (94%)",
      "Adequate imaging facilities",
      "Reliable enrollment history",
    ],
    recommendation: {
      action: "Highly recommended for activation. Site meets all critical criteria with strong operational capacity.",
      nextSteps: "Send feasibility questionnaire, schedule site qualification visit.",
    },
    compliance: 92,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 24,
    enrollmentRate: "9-15",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "Strong COPD research program with 15+ respiratory trials",
      "5+ years avg CRC experience in pulmonary studies",
      "Priority institutional access for COPD recruitment",
      "94% patient retention rate in long-term respiratory trials",
      "Proven operational capacity for complex event-driven studies"
    ],
    riskFactors: [
      "75% staffing - may need CRC support",
      "Limited Q4 availability"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" },
      { category: "Revenue Focus", percentOfTarget: 52, gap: 48 }
    ],
    region: "USA",
  },
  {
    id: "003",
    name: "Denver",
    country: "USA",
    address: "401 W Hampden Pl, Suite 240, Englewood, CO 80110",
    siteCode: "SITE-003",
    status: "Eligible",
    overallScore: 88,
    priority: "High",
    siteInvestigatorScore: 100,
    staffingCapacityScore: 65,
    patientEnrollmentScore: 100,
    infrastructureScore: 100,
    detailedAssessment: [
      "Experienced oncology PI",
      "Good patient database",
      "Adequate staffing levels",
      "Strong institutional support",
      "Meets all critical requirements",
    ],
    recommendation: {
      action: "Recommended for activation. Site demonstrates solid performance across key metrics.",
      nextSteps: "Complete feasibility assessment, conduct virtual site visit.",
    },
    compliance: 88,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 24,
    enrollmentRate: "10-16",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "Dedicated pulmonary research division with spirometry expertise",
      "950+ COPD patient database with CV comorbidity enrichment",
      "Access to underserved rural population",
      "Strong community pulmonologist referral network",
      "Comprehensive EHR integration for CV history tracking"
    ],
    riskFactors: [
      "65% staffing - needs 1-2 nurses",
      "PI managing 3 concurrent trials"
    ],
    strategicDirection: [
      { category: "Revenue Focus", percentOfTarget: 63, gap: 37 }
    ],
    shortfall: 18,
    region: "USA",
  },
  {
    id: "004",
    name: "Cincinnati",
    country: "USA",
    address: "4250 Glendale Milford Road, Suite 201, Cincinnati, OH 45242",
    siteCode: "SITE-004",
    status: "Eligible",
    overallScore: 85,
    priority: "Medium",
    siteInvestigatorScore: 75,
    staffingCapacityScore: 80,
    patientEnrollmentScore: 100,
    infrastructureScore: 100,
    detailedAssessment: [
      "Competent research team",
      "Moderate enrollment capacity",
      "Some oncology trial experience",
      "Adequate facilities",
      "Acceptable patient access",
    ],
    recommendation: {
      action: "Consider for activation with additional support. Site shows promise but may need guidance on critical requirements.",
      nextSteps: "Request detailed capability documentation, assess training needs.",
    },
    compliance: 85,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "Needs Support",
    patientPoolSize: 23,
    enrollmentRate: "7-12",
    criticalGapsCount: 1,
    startupTimeline: "7-8 weeks",
    competitiveAdvantages: [
      "750+ COPD patient network with documented smoking history",
      "15% below regional cost average",
      "Strong local pulmonologist relationships",
      "Rapid patient screening capability with spirometry on-site"
    ],
    riskFactors: [
      "Spirometry QC: Requires additional technician training",
      "Limited CV outcomes trial experience (3 trials)",
      "6-8 week activation timeline",
      "Requires additional CEC monitoring"
    ],
    strategicDirection: [
      { category: "Revenue Focus", percentOfTarget: 45, gap: 55 }
    ],
    region: "USA",
  },
  {
    id: "005",
    name: "Baton Rouge",
    country: "USA",
    address: "7912 Summa Ave, Baton Rouge, LA 70809",
    siteCode: "SITE-005",
    status: "Eligible",
    overallScore: 83,
    priority: "Medium",
    siteInvestigatorScore: 75,
    staffingCapacityScore: 75,
    patientEnrollmentScore: 100,
    infrastructureScore: 100,
    detailedAssessment: [
      "Growing research program",
      "Motivated PI and team",
      "Emerging oncology capabilities",
      "Developing patient database",
      "Infrastructure being enhanced",
    ],
    recommendation: {
      action: "Consider as backup site with close monitoring. Requires additional assessment and support.",
      nextSteps: "Conduct detailed capability review, provide training plan.",
    },
    compliance: 83,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "Needs Support",
    patientPoolSize: 22,
    enrollmentRate: "5-11",
    criticalGapsCount: 1,
    startupTimeline: "8-9 weeks",
    competitiveAdvantages: [
      "Motivated team with respiratory focus, consistently meets enrollment targets",
      "40% YoY growth in pulmonary trials",
      "PI shows strong adaptability to complex protocols",
      "Favorable cost structure and fast contracting"
    ],
    riskFactors: [
      "Spirometry suite shared with clinical practice",
      "Limited historical COPD CV outcomes data",
      "Infrastructure still developing"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" },
      { category: "Revenue Focus", percentOfTarget: 68, gap: 32 }
    ],
    shortfall: 25,
    region: "USA",
  },
  {
    id: "006",
    name: "Chula Vista",
    country: "USA",
    address: "754 Medical Center Ct, Suite 202, Chula Vista, CA 91911",
    siteCode: "SITE-006",
    status: "Eligible",
    overallScore: 82,
    priority: "Medium",
    siteInvestigatorScore: 75,
    staffingCapacityScore: 70,
    patientEnrollmentScore: 100,
    infrastructureScore: 100,
    detailedAssessment: [
      "Developing research capabilities",
      "Adequate patient population",
      "Committed research staff",
      "Basic infrastructure in place",
      "Some trial experience",
    ],
    recommendation: {
      action: "Monitor closely. May require additional resources and training to reach optimal performance.",
      nextSteps: "Evaluate infrastructure readiness, develop support plan.",
    },
    compliance: 82,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "Under Assessment",
    patientPoolSize: 22,
    enrollmentRate: "6-13",
    criticalGapsCount: 1,
    startupTimeline: "9-10 weeks",
    competitiveAdvantages: [
      "Low staff turnover (4+ years) ensuring consistency",
      "Strategic Hispanic population access with bilingual coordinators",
      "12+ community pulmonologist partners",
      "Strong diversity enrollment potential for underrepresented populations"
    ],
    riskFactors: [
      "Spirometry suite requires external facility coordination",
      "Limited COPD research infrastructure",
      "External facility coordination for CV assessments needed",
      "Requires enhanced monitoring and site visits"
    ],
    strategicDirection: [
      { category: "Revenue Focus", percentOfTarget: 58, gap: 42 }
    ],
    region: "USA",
  },
  {
    id: "007",
    name: "Boston",
    country: "USA",
    address: "101 Cambridge St, Suite 500, Boston, MA 02114",
    siteCode: "SITE-007",
    status: "Eligible",
    overallScore: 93,
    priority: "High",
    siteInvestigatorScore: 100,
    staffingCapacityScore: 85,
    patientEnrollmentScore: 100,
    infrastructureScore: 85,
    detailedAssessment: [
      "Premier academic medical center",
      "Exceptional PI with 30+ oncology trials",
      "State-of-the-art imaging and infusion facilities",
      "Outstanding retention rates (99%)",
      "Large patient database with excellent diversity",
      "Rapid enrollment capabilities",
    ],
    recommendation: {
      action: "Top priority site. Immediate activation strongly recommended. Exceeds all requirements with proven track record.",
      nextSteps: "Fast-track site activation, prioritize contract execution, schedule immediate site initiation visit.",
    },
    compliance: 93,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 25,
    enrollmentRate: "16-22",
    criticalGapsCount: 1,
    startupTimeline: "4-5 weeks",
    competitiveAdvantages: [
      "Tier 1 academic medical center with pulmonary-cardiology integration",
      "30+ respiratory/CV outcomes trials, NIH-funded PI",
      "99% patient retention - best in class for long-term studies",
      "1-2 week fast-track activation for high-priority protocols",
      "Advanced spirometry, echocardiography, CEC endpoint lab",
      "35% minority enrollment exceeds diversity benchmarks"
    ],
    riskFactors: [
      "High ICS saturation: 82% of COPD patients on maintenance ICS therapy limits eligible enrollment pool"
    ],
    strategicDirection: [
      { category: "Revenue Focus", percentOfTarget: 82, gap: 18 }
    ],
    shortfall: 18,
    region: "USA",
  },
  {
    id: "008",
    name: "Phoenix",
    country: "USA",
    address: "5777 E Mayo Blvd, Phoenix, AZ 85054",
    siteCode: "SITE-008",
    status: "Under Review",
    overallScore: 78,
    priority: "Medium",
    siteInvestigatorScore: 75,
    staffingCapacityScore: 60,
    patientEnrollmentScore: 100,
    infrastructureScore: 100,
    detailedAssessment: [
      "Moderate research experience",
      "PI has limited Phase I experience",
      "Patient population needs verification",
      "Infrastructure meets minimum requirements",
      "Some concerns about enrollment capacity",
    ],
    recommendation: {
      action: "Under review. Requires additional documentation and site qualification assessment before decision.",
      nextSteps: "Request detailed capability documents, conduct virtual assessment, verify patient database.",
    },
    compliance: 78,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 0 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Under Assessment",
    patientPoolSize: 21,
    enrollmentRate: "4-9",
    criticalGapsCount: 1,
    startupTimeline: "10-11 weeks",
    competitiveAdvantages: [
      "800+ COPD patient population access",
      "$2M recent respiratory infrastructure investment including new spirometry suite",
      "Competitive bundled costs for CV assessment procedures",
      "Fast-growing metro area with aging population"
    ],
    riskFactors: [
      "Only 2 COPD CV outcomes trials completed",
      "60% staffing - needs 2 CRCs",
      "8-10 week activation timeline",
      "No dedicated cardio-pulmonary unit",
      "Higher training requirements for CEC procedures"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 15,
    region: "USA",
  },
  {
    id: "009",
    name: "Seattle",
    country: "USA",
    address: "1100 Fairview Ave N, Seattle, WA 98109",
    siteCode: "SITE-009",
    status: "Eligible",
    overallScore: 93,
    priority: "High",
    siteInvestigatorScore: 100,
    staffingCapacityScore: 80,
    patientEnrollmentScore: 100,
    infrastructureScore: 100,
    detailedAssessment: [
      "Highly regarded cancer research center",
      "Strong PI credentials and dedicated team",
      "Advanced research infrastructure",
      "Excellent patient recruitment network",
      "Proven track record in oncology trials",
    ],
    recommendation: {
      action: "Strongly recommended for activation. Site demonstrates exceptional capabilities across all critical areas.",
      nextSteps: "Proceed with feasibility questionnaire, schedule site qualification visit, begin contract discussions.",
    },
    compliance: 93,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 24,
    enrollmentRate: "17-23",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "NCI-designated comprehensive pulmonary center",
      "PI leads 800+ pulmonologist network across Pacific Northwest",
      "Dedicated cardio-pulmonary unit with CEC expertise",
      "120% enrollment velocity average for respiratory trials",
      "Strong patient advocacy partnerships and bilingual coordinators",
      "Efficient contracting process with 2-3 week turnaround"
    ],
    riskFactors: [],
    strategicDirection: [],
    region: "USA",
  },
  {
    id: "DE-004",
    name: "Berlin",
    country: "Germany",
    address: "Charité Universitätsmedizin, Berlin, Germany",
    siteCode: "SITE-DE-004",
    status: "Eligible",
    overallScore: 94,
    priority: "High",
    siteInvestigatorScore: 98,
    staffingCapacityScore: 92,
    patientEnrollmentScore: 95,
    infrastructureScore: 92,
    detailedAssessment: [
      "World-renowned university hospital",
      "International research leader",
      "Exceptional PI credentials",
      "State-of-the-art facilities",
      "Outstanding track record",
    ],
    recommendation: {
      action: "Highest priority. Immediate activation essential. Site represents gold standard.",
      nextSteps: "Expedite all processes, prioritize resource allocation.",
    },
    compliance: 94,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 26,
    enrollmentRate: "13-19",
    criticalGapsCount: 0,
    startupTimeline: "4-5 weeks",
    competitiveAdvantages: [
      "International research reputation",
      "Largest patient database in Germany",
      "Cutting-edge research infrastructure",
      "100% GCP audit pass rate",
      "Multi-language capabilities",
      "Rapid ethics approval track record"
    ],
    riskFactors: [],
    strategicDirection: [
      { category: "Revenue Focus", percentOfTarget: 94, gap: 6 }
    ],
    shortfall: 6,
    region: "Germany",
  },
  {
    id: "010",
    name: "Miami",
    country: "USA",
    address: "1475 NW 12th Ave, Miami, FL 33136",
    siteCode: "SITE-010",
    status: "Not Eligible",
    overallScore: 42,
    priority: "Low",
    siteInvestigatorScore: 45,
    staffingCapacityScore: 35,
    patientEnrollmentScore: 25,
    infrastructureScore: 30,
    detailedAssessment: [
      "Insufficient oncology trial experience",
      "Limited research staff availability",
      "Does not meet critical infrastructure requirements",
      "Patient database underdeveloped",
      "Lacks adequate sub-investigator support",
    ],
    recommendation: {
      action: "Not recommended for activation at this time. Site does not meet minimum critical requirements.",
      nextSteps: "Archive for future consideration. Site may be re-evaluated after infrastructure improvements.",
    },
    compliance: 42,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 0 },
      { text: "Prior Phase I oncology trial experience", points: 0 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "High Risk",
    patientPoolSize: 3,
    enrollmentRate: "1-3",
    criticalGapsCount: 6,
    startupTimeline: "13-14 weeks",
    competitiveAdvantages: [
      "High COPD prevalence area with underserved population",
      "Strong community relationships with primary care network"
    ],
    riskFactors: [
      "Minimal CV disease documentation: Only 18% of COPD patients have confirmed established CV disease",
      "Spirometry non-compliance: 22% test rejection rate from calibration and technique issues",
      "Enrollment velocity: Prior respiratory trial achieved 1 randomization over 18 months",
      "Staff turnover: 3 CRC changes in past 24 months affecting institutional knowledge",
      "Pharmacy limitations: No temperature-controlled storage or home delivery capability",
      "CEC inexperience: Estimated 90+ day package preparation"
    ],
    strategicDirection: [],
    region: "USA",
  },
  {
    id: "011",
    name: "Atlanta",
    country: "USA",
    address: "1365 Clifton Rd NE, Atlanta, GA 30322",
    siteCode: "SITE-011",
    status: "Eligible",
    overallScore: 90,
    priority: "High",
    siteInvestigatorScore: 100,
    staffingCapacityScore: 70,
    patientEnrollmentScore: 100,
    infrastructureScore: 100,
    detailedAssessment: [
      "Reputable research institution",
      "Experienced oncology PI and team",
      "Good patient enrollment history",
      "Adequate research facilities",
      "Strong institutional support",
    ],
    recommendation: {
      action: "Recommended for activation. Site meets all critical requirements and shows strong performance metrics.",
      nextSteps: "Send feasibility questionnaire, schedule site qualification visit, initiate contract process.",
    },
    compliance: 90,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 24,
    enrollmentRate: "11-17",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "Strong NIH funding & reputation for COPD research",
      "15+ years pulmonary research, 20+ respiratory trials",
      "Excellent diversity representation in patient database",
      "Dedicated research administration with cardio-pulmonary focus",
      "Consistently meets enrollment timelines & quality benchmarks"
    ],
    riskFactors: [
      "70% staffing - monitor trial load"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    region: "USA",
  },
  {
    id: "012",
    name: "Portland",
    country: "USA",
    address: "2801 N Gantenbein Ave, Portland, OR 97227",
    siteCode: "SITE-012",
    status: "Not Eligible",
    overallScore: 55,
    priority: "Low",
    siteInvestigatorScore: 50,
    staffingCapacityScore: 70,
    patientEnrollmentScore: 100,
    infrastructureScore: 100,
    detailedAssessment: [
      "Growing research program",
      "PI has some oncology experience but limited Phase I",
      "Patient population appears adequate",
      "Infrastructure needs verification",
      "Missing one critical requirement",
    ],
    recommendation: {
      action: "Under review. Site shows potential but requires further assessment of critical capabilities.",
      nextSteps: "Conduct detailed gap analysis, request additional documentation, consider site qualification visit.",
    },
    compliance: 55,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 0 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "Under Assessment",
    patientPoolSize: 21,
    enrollmentRate: "3-8",
    criticalGapsCount: 2,
    startupTimeline: "11-12 weeks",
    competitiveAdvantages: [
      "60% YoY pulmonary trial growth",
      "8 regional pulmonology referrals",
      "Competitive pricing structure for procedures"
    ],
    riskFactors: [
      "Limited CV outcomes trial experience (1 trial)",
      "Spirometry suite requires facility upgrade",
      "8-10 week activation timeline",
      "Infrastructure gaps for CEC procedures exist",
      "Uncertain enrollment predictions for COPD CV study"
    ],
    strategicDirection: [],
    region: "USA",
  },
  {
    id: "015",
    name: "Rockville",
    country: "USA",
    address: "11900 Rockville Pike, Suite 200, Rockville, MD 20852",
    siteCode: "SITE-015",
    status: "Eligible",
    overallScore: 91,
    priority: "High",
    siteInvestigatorScore: 95,
    staffingCapacityScore: 90,
    patientEnrollmentScore: 85,
    infrastructureScore: 92,
    detailedAssessment: [
      "Exceptional RCT experience with 166 total trials",
      "Deep T2D trial expertise across Phase 2-4 studies",
      "Strong liver-safety monitoring capabilities from NASH/MASH trials",
      "Minor documentation gaps requiring clarification",
      "Requires validation of startup timelines",
    ],
    recommendation: {
      action: "Highly recommended for activation. Site demonstrates exceptional trial experience with minor documentation gaps that can be quickly resolved.",
      nextSteps: "Request T2D management documentation, enrollment metrics for past 3 years, and historical startup timeline data. Schedule SIV upon documentation receipt.",
    },
    compliance: 90.6,
    criticalRequirements: [
      { text: "Documentation Gap: T2D management not explicitly documented (confirm active clinical role managing T2D and delegated oversight plan)", points: 0 },
      { text: "Feasibility Evidence Missing: T2D enrollment history ≥10 participants in past 3 years not provided (submit enrollment metrics/source data)", points: 0 },
      { text: "Startup Performance Missing: <90-day startup capability and prior cycle-time metrics not provided (provide historical startup timelines and process)", points: 0 },
    ],
    activationReadiness: "Needs Support",
    patientPoolSize: 250,
    enrollmentRate: "2-5",
    criticalGapsCount: 3,
    startupTimeline: "8-10 weeks",
    competitiveAdvantages: [
      "Exceptional Experience: Extensive RCT experience including numerous randomized, double-blind, placebo-controlled studies across Phase 2–4 (166 trials total)",
      "T2D Trial Experience Depth: Multiple Phase 2–3 T2D studies with major sponsors (e.g., Amgen 20210184; Novo Nordisk NN9388-4894/4896/7741; NN9541-4945)",
      "Liver-safety relevant exposure: Multiple NASH/MASH trials (e.g., Intercept 747-303 Phase 3; Inventiva 337HNAS20011 Phase 3; Boehringer 1404-0044/0064 Phase 3), which may support liver-safety signal monitoring expectations"
    ],
    riskFactors: [
      "Documentation Gap: T2D management not explicitly documented (confirm active clinical role managing T2D and delegated oversight plan)",
      "Feasibility Evidence Missing: T2D enrollment history ≥10 participants in past 3 years not provided (submit enrollment metrics/source data)",
      "Startup Performance Missing: <90-day startup capability and prior cycle-time metrics not provided (provide historical startup timelines and process)"
    ],
    strategicDirection: [
      { category: "Revenue Focus", percentOfTarget: 75, gap: 25 }
    ],
    shortfall: 25,
    region: "USA",
  },
  {
    id: "UK-003",
    name: "Leicester",
    country: "United Kingdom",
    address: "Leicester Royal Infirmary, Leicester, UK",
    siteCode: "SITE-UK-003",
    status: "Eligible",
    overallScore: 91,
    priority: "High",
    siteInvestigatorScore: 95,
    staffingCapacityScore: 90,
    patientEnrollmentScore: 90,
    infrastructureScore: 90,
    detailedAssessment: [
      "Premier academic center",
      "Highly experienced PI",
      "Excellent enrollment history",
      "State-of-the-art facilities",
      "Strong institutional support",
    ],
    recommendation: {
      action: "Strongly recommended. Top-tier site with proven track record.",
      nextSteps: "Fast-track activation, begin contract negotiations.",
    },
    compliance: 91,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 24,
    enrollmentRate: "10-17",
    criticalGapsCount: 0,
    startupTimeline: "4-5 weeks",
    competitiveAdvantages: [
      "Academic medical center with research excellence",
      "Multicultural patient database",
      "98% patient retention rates",
      "Advanced research infrastructure",
      "Fast NHS ethics approvals"
    ],
    riskFactors: [],
    strategicDirection: [
      { category: "Revenue Focus", percentOfTarget: 90, gap: 10 }
    ],
    shortfall: 10,
    region: "UK",
  },
  {
    id: "013",
    name: "San Diego",
    country: "USA",
    address: "3855 Health Sciences Dr, La Jolla, CA 92093",
    siteCode: "SITE-013",
    status: "Eligible",
    overallScore: 94,
    priority: "High",
    siteInvestigatorScore: 95,
    staffingCapacityScore: 90,
    patientEnrollmentScore: 100,
    infrastructureScore: 95,
    detailedAssessment: [
      "World-class cancer research center",
      "Internationally recognized PI with extensive oncology expertise",
      "Cutting-edge research infrastructure and technology",
      "Exceptional patient recruitment capabilities",
      "Outstanding retention and compliance rates",
      "Rapid study start-up capabilities",
    ],
    recommendation: {
      action: "Highest priority site. Immediate activation essential. Site exceeds all requirements and represents ideal profile.",
      nextSteps: "Expedite all activation processes, prioritize resource allocation, schedule immediate site initiation.",
    },
    compliance: 94,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 25,
    enrollmentRate: "19-26",
    criticalGapsCount: 1,
    startupTimeline: "4-5 weeks",
    competitiveAdvantages: [
      "Sizeable ICS-naïve COPD pool",
      "CV enrichment: 65% of database meets established CV disease criteria (MI, PCI, heart failure)",
      "Retention: 88% at 36 months in prior event-driven COPD trial",
      "Diversity: 40% underrepresented racial/ethnic enrollment",
      "CEC expertise: 25-day average endpoint package submission, 15% query rate"
    ],
    riskFactors: [
      "Spirometry scheduling: Shared suite requires 3-5 day advance booking"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" },
      { category: "Revenue Focus", percentOfTarget: 85, gap: 15 }
    ],
    shortfall: 15,
    region: "USA",
  },
  {
    id: "014",
    name: "Nashville",
    country: "USA",
    address: "2220 Pierce Ave, Nashville, TN 37232",
    siteCode: "SITE-014",
    status: "Not Eligible",
    overallScore: 48,
    priority: "Low",
    siteInvestigatorScore: 55,
    staffingCapacityScore: 40,
    patientEnrollmentScore: 35,
    infrastructureScore: 45,
    detailedAssessment: [
      "Limited oncology research experience",
      "Understaffed research team",
      "Does not meet multiple critical requirements",
      "Patient access uncertain",
      "Infrastructure deficiencies identified",
    ],
    recommendation: {
      action: "Not eligible for activation. Site lacks essential capabilities and does not meet critical requirements.",
      nextSteps: "⚠️ Infrastructure Development Required. 📈 Capacity Building Focus.",
    },
    compliance: 48,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 0 },
      { text: "Prior Phase I oncology trial experience", points: 0 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "High Risk",
    patientPoolSize: 4,
    enrollmentRate: "2-4",
    criticalGapsCount: 4,
    startupTimeline: "12-13 weeks",
    competitiveAdvantages: [
      "Established pulmonology practice with 12 years research experience",
      "Access to diverse Hispanic/Latino population (35% of database)"
    ],
    riskFactors: [
      "ICS saturation: 78% of COPD patients already on ICS maintenance therapy limiting eligible pool",
      "Retention challenges: 58% retention at 24 months in prior long-term trial",
      "Single CRC: No backup coverage for 36-month follow-up period",
      "Delayed CEC submissions: Prior study averaged 75-day endpoint package turnaround"
    ],
    strategicDirection: [],
    region: "USA",
  },
  // UK SITES
  {
    id: "UK-001",
    name: "Bristol",
    country: "United Kingdom",
    address: "Southmead Hospital, Bristol, UK",
    siteCode: "SITE-UK-001",
    status: "Eligible",
    overallScore: 89,
    priority: "High",
    siteInvestigatorScore: 95,
    staffingCapacityScore: 85,
    patientEnrollmentScore: 90,
    infrastructureScore: 85,
    detailedAssessment: [
      "Strong respiratory research program",
      "Experienced PI with pulmonary focus",
      "Good patient database",
      "Modern facilities",
      "Excellent track record",
    ],
    recommendation: {
      action: "Recommended for activation. Site demonstrates solid capabilities and strong regional presence.",
      nextSteps: "Complete feasibility assessment, schedule site visit.",
    },
    compliance: 89,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 23,
    enrollmentRate: "8-14",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "Strong NHS partnership with wide patient access",
      "Dedicated respiratory research unit",
      "95% retention rate in long-term trials",
      "Advanced spirometry and imaging capabilities"
    ],
    riskFactors: [
      "NHS approval timelines may extend startup"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 14,
    region: "UK",
  },
  {
    id: "UK-002",
    name: "High Wycombe",
    country: "United Kingdom",
    address: "Wycombe Hospital, High Wycombe, UK",
    siteCode: "SITE-UK-002",
    status: "Eligible",
    overallScore: 84,
    priority: "Medium",
    siteInvestigatorScore: 80,
    staffingCapacityScore: 80,
    patientEnrollmentScore: 85,
    infrastructureScore: 90,
    detailedAssessment: [
      "Growing research capabilities",
      "Motivated PI and staff",
      "Good patient access",
      "Modern infrastructure",
      "Solid trial experience",
    ],
    recommendation: {
      action: "Consider for activation. Site shows promise with good infrastructure.",
      nextSteps: "Request detailed documentation, conduct virtual assessment.",
    },
    compliance: 84,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "Needs Support",
    patientPoolSize: 21,
    enrollmentRate: "6-11",
    criticalGapsCount: 1,
    startupTimeline: "7-8 weeks",
    competitiveAdvantages: [
      "Strong community connections",
      "Bilingual staff for diverse populations",
      "Cost-effective site operations",
      "Flexible scheduling capabilities"
    ],
    riskFactors: [
      "Limited Phase I experience",
      "Needs CRC capacity expansion"
    ],
    strategicDirection: [],
    region: "UK",
  },
  {
    id: "UK-004",
    name: "North London",
    country: "United Kingdom",
    address: "Royal Free Hospital, North London, UK",
    siteCode: "SITE-UK-004",
    status: "Eligible",
    overallScore: 87,
    priority: "High",
    siteInvestigatorScore: 90,
    staffingCapacityScore: 85,
    patientEnrollmentScore: 85,
    infrastructureScore: 88,
    detailedAssessment: [
      "Strong urban center",
      "Experienced research team",
      "Large patient database",
      "Good infrastructure",
      "Diverse population access",
    ],
    recommendation: {
      action: "Recommended for activation. Strong metropolitan site with diverse patient access.",
      nextSteps: "Send feasibility questionnaire, schedule site visit.",
    },
    compliance: 87,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 23,
    enrollmentRate: "9-15",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "Large metropolitan patient pool",
      "Excellent diversity in enrollment",
      "Strong public transport access",
      "Experienced in complex protocols"
    ],
    riskFactors: [
      "High patient competition from other trials"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 16,
    region: "UK",
  },
  {
    id: "UK-005",
    name: "Romford",
    country: "United Kingdom",
    address: "Queen's Hospital, Romford, UK",
    siteCode: "SITE-UK-005",
    status: "Eligible",
    overallScore: 82,
    priority: "Medium",
    siteInvestigatorScore: 80,
    staffingCapacityScore: 75,
    patientEnrollmentScore: 85,
    infrastructureScore: 88,
    detailedAssessment: [
      "Developing research program",
      "Committed PI and team",
      "Good patient access",
      "Adequate facilities",
      "Growing capabilities",
    ],
    recommendation: {
      action: "Consider for activation with support. Site shows good potential.",
      nextSteps: "Assess training needs, develop support plan.",
    },
    compliance: 82,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "Needs Support",
    patientPoolSize: 20,
    enrollmentRate: "5-10",
    criticalGapsCount: 1,
    startupTimeline: "8-9 weeks",
    competitiveAdvantages: [
      "Strong community relationships",
      "Cost-effective operations",
      "Good patient retention",
      "Motivated research team"
    ],
    riskFactors: [
      "Limited staffing capacity",
      "Newer research program"
    ],
    strategicDirection: [],
    region: "UK",
  },
  // GERMANY SITES
  {
    id: "DE-001",
    name: "Lubeck",
    country: "Germany",
    address: "University Hospital Schleswig-Holstein, Lubeck, Germany",
    siteCode: "SITE-DE-001",
    status: "Eligible",
    overallScore: 93,
    priority: "High",
    siteInvestigatorScore: 95,
    staffingCapacityScore: 95,
    patientEnrollmentScore: 92,
    infrastructureScore: 90,
    detailedAssessment: [
      "Premier academic medical center",
      "World-class PI credentials",
      "Exceptional research infrastructure",
      "Outstanding enrollment track record",
      "High retention rates",
    ],
    recommendation: {
      action: "Top priority site. Immediate activation strongly recommended.",
      nextSteps: "Fast-track contract execution, schedule immediate SIV.",
    },
    compliance: 93,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 25,
    enrollmentRate: "13-20",
    criticalGapsCount: 0,
    startupTimeline: "4-5 weeks",
    competitiveAdvantages: [
      "Leading German respiratory research center",
      "Extensive COPD patient database (1,500+ patients)",
      "99% data quality scores",
      "Advanced spirometry and cardiopulmonary assessment lab",
      "Excellent GCP compliance history"
    ],
    riskFactors: [],
    strategicDirection: [
      { category: "Revenue Focus", percentOfTarget: 92, gap: 8 }
    ],
    shortfall: 8,
    region: "Germany",
  },
  {
    id: "DE-002",
    name: "Wiesbaden",
    country: "Germany",
    address: "Helios Dr. Horst Schmidt Kliniken, Wiesbaden, Germany",
    siteCode: "SITE-DE-002",
    status: "Eligible",
    overallScore: 88,
    priority: "High",
    siteInvestigatorScore: 90,
    staffingCapacityScore: 85,
    patientEnrollmentScore: 88,
    infrastructureScore: 90,
    detailedAssessment: [
      "Strong regional medical center",
      "Experienced PI with pulmonary focus",
      "Good enrollment capacity",
      "Modern research facilities",
      "Solid institutional support",
    ],
    recommendation: {
      action: "Recommended for activation. Demonstrates strong performance metrics.",
      nextSteps: "Complete feasibility questionnaire, schedule site qualification visit.",
    },
    compliance: 88,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 22,
    enrollmentRate: "9-16",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "Strong regional patient referral network",
      "Bilingual staff (German/English)",
      "96% retention in respiratory trials",
      "Efficient site operations"
    ],
    riskFactors: [
      "Moderate trial load - monitor capacity"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 12,
    region: "Germany",
  },
  {
    id: "DE-003",
    name: "Ahrensburg",
    country: "Germany",
    address: "Pneumologisches Forschungsinstitut, Ahrensburg, Germany",
    siteCode: "SITE-DE-003",
    status: "Eligible",
    overallScore: 86,
    priority: "High",
    siteInvestigatorScore: 88,
    staffingCapacityScore: 82,
    patientEnrollmentScore: 87,
    infrastructureScore: 87,
    detailedAssessment: [
      "Specialized pulmonary research institute",
      "Dedicated respiratory focus",
      "Good patient database",
      "Quality infrastructure",
      "Strong enrollment history",
    ],
    recommendation: {
      action: "Recommended for activation. Specialized site with respiratory expertise.",
      nextSteps: "Send feasibility questionnaire, conduct site assessment.",
    },
    compliance: 86,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 21,
    enrollmentRate: "7-13",
    criticalGapsCount: 0,
    startupTimeline: "6-7 weeks",
    competitiveAdvantages: [
      "Specialized in respiratory clinical research",
      "Strong COPD patient recruitment",
      "High-quality spirometry services",
      "Experienced in long-term studies"
    ],
    riskFactors: [
      "Smaller site - limited concurrent trial capacity"
    ],
    strategicDirection: [],
    region: "Germany",
  },
  {
    id: "DE-005",
    name: "Hamburg",
    country: "Germany",
    address: "University Medical Center Hamburg-Eppendorf, Hamburg, Germany",
    siteCode: "SITE-DE-005",
    status: "Eligible",
    overallScore: 90,
    priority: "High",
    siteInvestigatorScore: 92,
    staffingCapacityScore: 88,
    patientEnrollmentScore: 90,
    infrastructureScore: 90,
    detailedAssessment: [
      "Major academic medical center",
      "Highly experienced research team",
      "Large patient population",
      "Excellent facilities",
      "Strong performance history",
    ],
    recommendation: {
      action: "Strongly recommended for activation. Top-tier German site.",
      nextSteps: "Proceed with feasibility questionnaire, schedule site visit.",
    },
    compliance: 90,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 24,
    enrollmentRate: "11-18",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "Major metropolitan patient access",
      "Strong cardiovascular-respiratory research program",
      "97% patient retention rate",
      "Advanced diagnostic capabilities",
      "Efficient contracting process"
    ],
    riskFactors: [
      "High trial volume - ensure capacity confirmation"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 11,
    region: "Germany",
  },
  {
    id: "DE-006",
    name: "Leipzig",
    country: "Germany",
    address: "Leipzig University Hospital, Leipzig, Germany",
    siteCode: "SITE-DE-006",
    status: "Eligible",
    overallScore: 85,
    priority: "Medium",
    siteInvestigatorScore: 85,
    staffingCapacityScore: 82,
    patientEnrollmentScore: 86,
    infrastructureScore: 87,
    detailedAssessment: [
      "Established university hospital",
      "Competent research team",
      "Good patient access",
      "Adequate facilities",
      "Solid trial experience",
    ],
    recommendation: {
      action: "Consider for activation. Reliable site with good capabilities.",
      nextSteps: "Request documentation, conduct virtual assessment.",
    },
    compliance: 85,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "Needs Support",
    patientPoolSize: 21,
    enrollmentRate: "6-12",
    criticalGapsCount: 1,
    startupTimeline: "7-8 weeks",
    competitiveAdvantages: [
      "Strong regional presence",
      "Cost-effective site operations",
      "Good patient recruitment network",
      "Growing research capabilities"
    ],
    riskFactors: [
      "Infrastructure upgrade needed for infusion suite",
      "Moderate staffing levels"
    ],
    strategicDirection: [],
    region: "Germany",
  },
  // POLAND SITES
  {
    id: "PL-001",
    name: "Biała Podlaska",
    country: "Poland",
    address: "Clinical Research Center, Biała Podlaska, Poland",
    siteCode: "SITE-PL-001",
    status: "Eligible",
    overallScore: 81,
    priority: "Medium",
    siteInvestigatorScore: 80,
    staffingCapacityScore: 78,
    patientEnrollmentScore: 83,
    infrastructureScore: 82,
    detailedAssessment: [
      "Growing research center",
      "Motivated research team",
      "Good regional patient access",
      "Developing infrastructure",
      "Increasing trial experience",
    ],
    recommendation: {
      action: "Consider for activation with support. Shows promise in regional market.",
      nextSteps: "Conduct detailed capability assessment, provide training plan.",
    },
    compliance: 81,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "Needs Support",
    patientPoolSize: 19,
    enrollmentRate: "5-9",
    criticalGapsCount: 1,
    startupTimeline: "8-9 weeks",
    competitiveAdvantages: [
      "Strong regional patient population",
      "Low patient competition",
      "Cost-effective operations",
      "Motivated and committed team"
    ],
    riskFactors: [
      "Limited infrastructure requires support",
      "Newer to complex protocols"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 22,
    region: "Poland",
  },
  {
    id: "PL-002",
    name: "Lublin",
    country: "Poland",
    address: "Medical University of Lublin, Lublin, Poland",
    siteCode: "SITE-PL-002",
    status: "Eligible",
    overallScore: 87,
    priority: "High",
    siteInvestigatorScore: 88,
    staffingCapacityScore: 85,
    patientEnrollmentScore: 88,
    infrastructureScore: 87,
    detailedAssessment: [
      "Academic medical center",
      "Experienced research team",
      "Strong patient database",
      "Good infrastructure",
      "Excellent enrollment history",
    ],
    recommendation: {
      action: "Recommended for activation. Strong Polish academic site.",
      nextSteps: "Send feasibility questionnaire, schedule site visit.",
    },
    compliance: 87,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 25 },
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 22,
    enrollmentRate: "8-15",
    criticalGapsCount: 0,
    startupTimeline: "6-7 weeks",
    competitiveAdvantages: [
      "Leading Polish academic center",
      "Strong respiratory research program",
      "Large patient catchment area",
      "Excellent retention rates (94%)",
      "Quality data management"
    ],
    riskFactors: [
      "Regional regulatory timelines"
    ],
    strategicDirection: [
      { category: "Revenue Focus", percentOfTarget: 87, gap: 13 }
    ],
    shortfall: 13,
    region: "Poland",
  },
  {
    id: "PL-003",
    name: "Skierniewice",
    country: "Poland",
    address: "Regional Hospital, Skierniewice, Poland",
    siteCode: "SITE-PL-003",
    status: "Eligible",
    overallScore: 79,
    priority: "Medium",
    siteInvestigatorScore: 78,
    staffingCapacityScore: 75,
    patientEnrollmentScore: 80,
    infrastructureScore: 82,
    detailedAssessment: [
      "Regional hospital with research capabilities",
      "Developing PI experience",
      "Adequate patient population",
      "Basic infrastructure in place",
      "Growing trial portfolio",
    ],
    recommendation: {
      action: "Monitor closely. May require additional support and training.",
      nextSteps: "Evaluate infrastructure readiness, develop comprehensive support plan.",
    },
    compliance: 79,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "Under Assessment",
    patientPoolSize: 18,
    enrollmentRate: "4-8",
    criticalGapsCount: 1,
    startupTimeline: "9-10 weeks",
    competitiveAdvantages: [
      "Underserved regional population",
      "Low competition for patients",
      "Cost-effective site",
      "Good community relationships"
    ],
    riskFactors: [
      "Limited research infrastructure",
      "Requires enhanced training and monitoring",
      "Extended startup timeline"
    ],
    strategicDirection: [],
    region: "Poland",
  },
  {
    id: "PL-004",
    name: "Staszów",
    country: "Poland",
    address: "Healthcare Center, Staszów, Poland",
    siteCode: "SITE-PL-004",
    status: "Under Review",
    overallScore: 76,
    priority: "Medium",
    siteInvestigatorScore: 75,
    staffingCapacityScore: 72,
    patientEnrollmentScore: 78,
    infrastructureScore: 78,
    detailedAssessment: [
      "Community healthcare center",
      "Emerging research program",
      "Local patient access",
      "Developing capabilities",
      "Requires infrastructure investment",
    ],
    recommendation: {
      action: "Under review. Site requires significant support and infrastructure development.",
      nextSteps: "Request detailed capability documents, assess feasibility of infrastructure upgrades.",
    },
    compliance: 76,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 0 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "Under Assessment",
    patientPoolSize: 17,
    enrollmentRate: "3-7",
    criticalGapsCount: 2,
    startupTimeline: "10-12 weeks",
    competitiveAdvantages: [
      "Access to rural patient population",
      "Low operational costs",
      "Committed local team"
    ],
    riskFactors: [
      "Limited Phase I experience",
      "Infrastructure gaps require investment",
      "Small research team",
      "Extended activation timeline"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 20,
    region: "Poland",
  },
  {
    id: "PL-005",
    name: "Zamość",
    country: "Poland",
    address: "Specialist Hospital, Zamość, Poland",
    siteCode: "SITE-PL-005",
    status: "Eligible",
    overallScore: 83,
    priority: "Medium",
    siteInvestigatorScore: 82,
    staffingCapacityScore: 80,
    patientEnrollmentScore: 84,
    infrastructureScore: 85,
    detailedAssessment: [
      "Specialist regional hospital",
      "Competent research team",
      "Good patient recruitment potential",
      "Adequate facilities",
      "Improving trial capabilities",
    ],
    recommendation: {
      action: "Consider for activation. Solid regional site with growth potential.",
      nextSteps: "Complete feasibility assessment, schedule site qualification visit.",
    },
    compliance: 83,
    criticalRequirements: [
      { text: "Minimum 2 dedicated sub-investigators", points: 25 },
      { text: "Prior Phase I oncology trial experience", points: 25 },
      { text: "Access to 50+ mCRC patients annually", points: 25 },
      { text: "On-site infusion suite", points: 0 },
    ],
    activationReadiness: "Needs Support",
    patientPoolSize: 20,
    enrollmentRate: "6-10",
    criticalGapsCount: 1,
    startupTimeline: "7-9 weeks",
    competitiveAdvantages: [
      "Strong regional patient access",
      "Good local referral network",
      "Competitive pricing",
      "92% patient retention in prior trials"
    ],
    riskFactors: [
      "Infusion suite needs setup",
      "Monitor staffing capacity"
    ],
    strategicDirection: [],
    region: "Poland",
  },
];

interface SiteSelectionScorecardProps {
  onBack: () => void;
  onDashboardClick?: () => void;
  onClose?: () => void;
  onStudyAskClick?: () => void;
  onGoldenSiteClick?: () => void;
  protocolNumber?: string;
}

export function SiteSelectionScorecard({ 
  onBack, 
  onDashboardClick, 
  onClose, 
  onStudyAskClick,
  onGoldenSiteClick,
  protocolNumber = "NCT05165485" 
}: SiteSelectionScorecardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "name" | "status" | "patientEnrollment" | "siteInvestigator" | "staffingCapacity" | "infrastructure" | "enrollmentRate">("enrollmentRate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedSites, setSelectedSites] = useState<Set<string>>(new Set());
  const [isProtocolAssessmentExpanded, setIsProtocolAssessmentExpanded] = useState(false);
  const [activePresets, setActivePresets] = useState<Set<string>>(new Set());
  const [showMorePresets, setShowMorePresets] = useState(false);
  const [patientPopulation, setPatientPopulation] = useState<number>(0);
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions"); // New region filter state
  const [regionFilterOpen, setRegionFilterOpen] = useState(false); // Popover state for region filter
  const [viewResponsesSite, setViewResponsesSite] = useState<{ id: string; name: string } | null>(null); // For ViewResponses view
  
  // Multi-select region filter state
  const availableRegions = ["USA", "Poland", "Germany", "UK"];
  const [selectedRegions, setSelectedRegions] = useState<Set<string>>(new Set(availableRegions));
  
  // Map region codes to display names
  const regionDisplayNames: Record<string, string> = {
    "USA": "USA",
    "Poland": "Poland",
    "Germany": "Germany",
    "UK": "United Kingdom"
  };
  
  const toggleRegion = (region: string) => {
    const newSelection = new Set(selectedRegions);
    if (newSelection.has(region)) {
      newSelection.delete(region);
    } else {
      newSelection.add(region);
    }
    setSelectedRegions(newSelection);
  };
  
  const selectAllRegions = () => {
    setSelectedRegions(new Set(availableRegions));
  };
  
  const clearAllRegions = () => {
    setSelectedRegions(new Set());
  };

  // Scroll to top when selectedSite changes (when viewing site detail)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedSite]);

  // Handle preset toggle with multi-select
  const togglePreset = (preset: string) => {
    // Single-select behavior: if clicking the same preset, deselect it; otherwise select the new one
    if (activePresets.has(preset)) {
      setActivePresets(new Set());
    } else {
      setActivePresets(new Set([preset]));
    }
  };

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  // Helper function to get score background color
  const getScoreBgColor = (score: number) => {
    if (score >= 81) return "from-green-50 to-green-100";
    if (score >= 61) return "from-amber-50 to-amber-100";
    return "from-red-50 to-red-100";
  };

  // Helper function to get score ring color
  const getScoreRingColor = (score: number) => {
    if (score >= 81) return "stroke-green-500";
    if (score >= 61) return "stroke-amber-500";
    return "stroke-red-500";
  };

  // Helper function to get gradient progress bar class based on score
  const getProgressGradient = (score: number) => {
    if (score >= 81) {
      // Strong score: Green gradient
      return "bg-gradient-to-r from-green-400 to-green-600";
    } else if (score >= 61) {
      // Viable score: Amber/Yellow gradient
      return "bg-gradient-to-r from-amber-400 to-amber-600";
    } else {
      // High Risk score: Red gradient
      return "bg-gradient-to-r from-red-400 to-red-600";
    }
  };

  // Helper function to get clinical lab tube colors based on percentage
  const getHeatmapColors = (score: number) => {
    if (score >= 81) {
      // Strong: Pastel Sky Blue - Clinical Excellence
      return {
        bgColor: "bg-[#E0F2FE]",
        fillGradient: "bg-gradient-to-t from-[#7DD3FC] via-[#BAE6FD] to-[#E0F2FE]",
        textColor: "text-[#0369A1]",
        iconColor: "text-[#0369A1]",
        pillBg: "bg-sky-50",
        pillBorder: "border-sky-200",
        glowColor: "shadow-[0_0_10px_rgba(125,211,252,0.3)]"
      };
    } else if (score >= 61) {
      // Viable: Pastel Mint/Teal - Acceptable Performance
      return {
        bgColor: "bg-[#CCFBF1]",
        fillGradient: "bg-gradient-to-t from-[#5EEAD4] via-[#99F6E4] to-[#CCFBF1]",
        textColor: "text-[#0F766E]",
        iconColor: "text-[#0F766E]",
        pillBg: "bg-teal-50",
        pillBorder: "border-teal-200",
        glowColor: "shadow-[0_0_10px_rgba(94,234,212,0.3)]"
      };
    } else {
      // High Risk: Pastel Peach/Coral - Requires Attention
      return {
        bgColor: "bg-[#FEF3C7]",
        fillGradient: "bg-gradient-to-t from-[#FCD34D] via-[#FDE68A] to-[#FEF3C7]",
        textColor: "text-[#B45309]",
        iconColor: "text-[#B45309]",
        pillBg: "bg-amber-50",
        pillBorder: "border-amber-200",
        glowColor: "shadow-[0_0_10px_rgba(252,211,77,0.3)]"
      };
    }
  };

  // Helper function to get dot rating based on percentage
  const getDotRating = (score: number) => {
    if (score >= 80) return 4;
    if (score >= 60) return 3;
    return 2;
  };

  // Helper function to get dot color based on score
  const getDotColor = (score: number) => {
    return "text-gray-500"; // Neutral grey for all icons
  };

  // Helper function to generate strategic directions
  const generateStrategicDirection = (site: Site): Array<{ category: string }> => {
    const directions: Array<{ category: string }> = [];
    
    // Only assign strategic direction to high-performing sites
    // Therapeutic Area Growth for top scoring sites in key therapeutic areas
    // Revenue Focus for sites with strong commercial potential
    
    if (site.overallScore >= 85) {
      // Top tier sites get both strategic chips
      directions.push({ category: "Therapeutic Area Growth" });
      directions.push({ category: "Revenue Focus" });
    } else if (site.overallScore >= 80) {
      // High performing sites get one strategic chip
      directions.push({ category: "Therapeutic Area Growth" });
    }
    // Sites below 80 get no strategic direction chips (blank)
    
    return directions;
  };

  // Helper function to get background color for pills based on score
  const getPillBgColor = (score: number) => {
    if (score >= 76) return "bg-[#bdedd3]"; // 76-100% - Mint Green
    if (score >= 51) return "bg-[#a1c8fa]"; // 51-75% - Light Blue
    if (score >= 26) return "bg-[#f7d86e]"; // 26-50% - Yellow
    return "bg-[#f2a9b2]"; // 0-25% - Light Pink
  };

  // Helper function to get status level based on score (matches color thresholds)
  const getStatusLevel = (score: number) => {
    if (score >= 76) return 4;
    if (score >= 51) return 3;
    if (score >= 26) return 2;
    return 1;
  };

  // Helper function to round score to nearest 25%
  const roundToNearest25 = (score: number) => {
    return Math.round(score / 25) * 25;
  };

  // Helper function to parse enrollment rate (e.g., "7-16" -> 11.5)
  const parseEnrollmentRate = (rate?: string): number => {
    if (!rate) return 0;
    const parts = rate.split('-');
    if (parts.length === 2) {
      const min = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);
      return (min + max) / 2;
    }
    return parseFloat(rate) || 0;
  };

  // Apply preset filter logic with multi-select support
  const applyPresetFilter = (sites: Site[]): { sites: Site[], skipSort: boolean } => {
    // If no presets are selected, return all sites
    if (activePresets.size === 0) {
      return { sites, skipSort: false };
    }

    let filteredSites = sites;
    let shouldApplyTop5 = false;

    // Apply each active preset filter (single-select, so only one will be active)
    activePresets.forEach(preset => {
      switch (preset) {
        case "Top 5 Sites":
          shouldApplyTop5 = true;
          break;
      }
    });

    // Apply Top 5 limit last if selected
    if (shouldApplyTop5) {
      filteredSites = filteredSites
        .sort((a, b) => b.overallScore - a.overallScore)
        .slice(0, 5);
    }

    return { sites: filteredSites, skipSort: false };
  };

  // Filter and sort sites
  const searchFiltered = mockSites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.siteCode.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Apply region filter using multi-select
  const regionFiltered = selectedRegions.size === availableRegions.length
    ? searchFiltered 
    : searchFiltered.filter((site) => site.region && selectedRegions.has(site.region));
  
  // Apply patient population filter only when slider value is greater than 0
  const populationFiltered = patientPopulation > 0 
    ? regionFiltered.filter((site) => (site.patientPoolSize || 0) >= patientPopulation)
    : regionFiltered;
  
  // Calculate counts for each preset based on current search results
  const getPresetCount = (preset: string): number => {
    switch (preset) {
      case "Top 5 Sites":
        return Math.min(5, populationFiltered.length);
      default:
        return 0;
    }
  };
  
  const { sites: presetFiltered, skipSort } = applyPresetFilter(populationFiltered);
  
  const filteredAndSortedSites = skipSort ? presetFiltered : presetFiltered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "score") {
        comparison = a.overallScore - b.overallScore;
      } else if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "status") {
        comparison = a.status.localeCompare(b.status);
      } else if (sortBy === "enrollmentRate") {
        comparison = parseEnrollmentRate(a.enrollmentRate) - parseEnrollmentRate(b.enrollmentRate);
        // Apply sort order to primary comparison only
        comparison = sortOrder === "asc" ? comparison : -comparison;
        // Secondary sort by site name alphabetically (always A-Z)
        if (comparison === 0) {
          comparison = a.name.localeCompare(b.name);
        }
        return comparison;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Apply default view logic: when all regions are selected and sorting by enrollmentRate desc,
  // show USA sites primarily with 2-3 European sites randomly at positions 4, 6, 8
  let finalFilteredSites = filteredAndSortedSites;
  if (
    selectedRegions.size === availableRegions.length &&
    sortBy === "enrollmentRate" &&
    sortOrder === "desc"
  ) {
    // Separate USA and non-USA sites
    const usaSites = filteredAndSortedSites.filter((site) => site.country === "USA");
    const nonUsaSites = filteredAndSortedSites.filter((site) => site.country !== "USA");
    
    if (usaSites.length > 0 && nonUsaSites.length > 0) {
      // Create a mixed array with ALL sites
      const mixed: Site[] = [];
      let usaIndex = 0;
      let nonUsaIndex = 0;
      
      const insertPositions = [3, 5, 7]; // 0-based indices for positions 4, 6, 8 (first 3 non-USA sites)
      
      // Mix sites: USA sites primarily, with non-USA sites interspersed
      for (let i = 0; i < usaSites.length + nonUsaSites.length; i++) {
        // Check if we should insert a non-USA site at this position
        if (insertPositions.includes(i) && nonUsaIndex < nonUsaSites.length) {
          mixed.push(nonUsaSites[nonUsaIndex]);
          nonUsaIndex++;
        } else if (usaIndex < usaSites.length) {
          // Otherwise, add a USA site
          mixed.push(usaSites[usaIndex]);
          usaIndex++;
        } else if (nonUsaIndex < nonUsaSites.length) {
          // If we run out of USA sites, add remaining non-USA sites
          mixed.push(nonUsaSites[nonUsaIndex]);
          nonUsaIndex++;
        }
      }
      
      finalFilteredSites = mixed;
    }
  }

  const toggleSort = (field: "score" | "name" | "status" | "patientEnrollment" | "siteInvestigator" | "staffingCapacity" | "infrastructure" | "enrollmentRate") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      // For "name" field, default to ascending (A-Z), for others default to descending
      setSortOrder(field === "name" ? "asc" : "desc");
    }
  };

  // Checkbox handlers
  const toggleSiteSelection = (siteId: string) => {
    const newSelected = new Set(selectedSites);
    if (newSelected.has(siteId)) {
      newSelected.delete(siteId);
    } else {
      newSelected.add(siteId);
    }
    setSelectedSites(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedSites.size === finalFilteredSites.length) {
      setSelectedSites(new Set());
    } else {
      setSelectedSites(new Set(finalFilteredSites.map(site => site.id)));
    }
  };

  const handleGenerateReport = () => {
    const selectedSiteData = finalFilteredSites.filter(site => selectedSites.has(site.id));
    generateScorecardPDF(selectedSiteData, protocolNumber, finalFilteredSites.length);
  };

  const highPerformers = finalFilteredSites.filter((s) => s.overallScore >= 85).length;

  // Show ViewResponses if a site is selected for viewing responses
  if (viewResponsesSite) {
    const siteObject = mockSites.find(s => s.id === viewResponsesSite.id);
    if (!siteObject) return null;
    
    return (
      <ViewResponses
        selectedSites={[{
          id: siteObject.id,
          name: siteObject.name,
          address: siteObject.address,
          siteCode: siteObject.siteCode
        }]}
        onBack={() => setViewResponsesSite(null)}
        onDashboardClick={onDashboardClick || (() => {})}
        onGoldenSiteClick={onGoldenSiteClick || (() => {})}
        onScorecardClick={() => setViewResponsesSite(null)}
      />
    );
  }

  if (selectedSite) {
    return (
      <SiteDetailView
        site={selectedSite}
        onBack={() => setSelectedSite(null)}
        onDashboardClick={onDashboardClick}
        onClose={onClose}
        onGoldenSiteClick={onGoldenSiteClick}
        onScorecardClick={() => setSelectedSite(null)}
        protocolNumber={protocolNumber}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
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
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-[#284497] transition-colors"
                title="Go to Homepage"
              >
                <Home className="h-4 w-4" />
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-[#284497] transition-colors font-medium"
              >
                COPD cardiopulmonary trial
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={onGoldenSiteClick}
                className="text-gray-600 hover:text-[#284497] transition-colors font-medium"
              >
                Golden Site Profile
              </button>
              <span className="text-gray-400">|</span>
              <span className="text-[#284497] font-semibold">
                Site Selection
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleGenerateReport}
                size="sm"
                disabled={selectedSites.size === 0}
                title="Generate Report"
                className={`flex items-center gap-2 transition-all ${
                  selectedSites.size === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-600 hover:text-gray-800 border border-gray-200/60 hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                onClick={onBack}
                size="sm"
                title="Analyse New Protocol"
                className="flex items-center gap-2 bg-white text-gray-600 hover:text-gray-800 border border-gray-200/60 hover:border-gray-300 hover:bg-gray-50/50 transition-all"
              >
                <Plus className="h-4 w-4" />
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

        
          

          {/* Header Card - Subtle Version */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-6"
          >
            <div className="grid grid-cols-12 gap-6 items-center">
              {/* Left - Title (6/12) */}
              <div className="col-span-6 flex items-start gap-4">
                <div
                  className="w-8 h-8 bg-[#284497] flex items-center justify-center flex-shrink-0"
                  style={{ borderRadius: '6px 8px 10px 4px' }}
                >
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#061e47] text-[24px]">
                    Site Selection
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Evaluate and compare sites against Golden Site Profile criteria
                  </p>
                </div>
              </div>

              {/* Middle - Stats (3/12) */}
              <div className="col-span-3 flex items-center justify-center gap-3">
                <div className="px-3 py-1.5 rounded-full bg-blue-50/50 border border-blue-100">
                  <span className="font-semibold text-[#284497] text-[13px]">{filteredAndSortedSites.length}</span>
                  <span className="text-gray-600 text-[13px]"> sites matched</span>
                </div>
              </div>

              {/* Right - Search (3/12) */}
              <div className="col-span-3 flex gap-2">
                {/* Search Input */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search sites.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#284497] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Label */}
          <div className="flex justify-between items-center mb-4">
            {/* Results Label - Left */}
            <p className="text-sm text-gray-600 font-medium">
              Showing <span className="font-bold text-gray-900">{finalFilteredSites.length}</span> {finalFilteredSites.length === 1 ? 'site' : 'sites'} from{' '}
              <span className="font-bold text-gray-900">
                {selectedRegions.size === 0 
                  ? 'No Regions'
                  : selectedRegions.size === availableRegions.length 
                    ? 'All Regions'
                    : Array.from(selectedRegions).map(r => regionDisplayNames[r] || r).join(', ')}
              </span>
            </p>
          </div>

          {/* List View */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-visible relative"
          >
            {/* Table Header */}
            <div className="sticky top-[88px] z-40 bg-[#284497] text-white px-4 py-3 rounded-t-2xl">
              <div className="grid gap-3 text-sm font-semibold items-center" style={{ gridTemplateColumns: '40px 180px 85px 2fr 1.8fr 105px 95px 120px' }}>
                {/* Checkbox Column Header */}
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedSites.size === finalFilteredSites.length && finalFilteredSites.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                    style={{ colorScheme: 'light' }}
                  />
                </div>
                
                {/* Site Information Column Header */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleSort("name")}
                      className="flex items-center gap-1.5 hover:text-blue-200 transition-colors text-xs leading-snug text-left justify-start"
                    >
                      <span className="text-[12px]">Sites</span>
                      {sortBy === "name" ? (
                        sortOrder === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronUp className="h-4 w-4 opacity-50" />
                      )}
                    </button>
                    
                    {/* Region Filter Popover */}
                    <Popover open={regionFilterOpen} onOpenChange={setRegionFilterOpen}>
                      <PopoverTrigger asChild>
                        <button className="text-white hover:text-blue-200 transition-colors cursor-pointer focus:outline-none">
                          <Filter className="h-3.5 w-3.5" />
                        </button>
                      </PopoverTrigger>
                    <PopoverContent className="w-64 p-0" align="start">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-gray-200">
                          <h3 className="text-sm font-semibold text-gray-900">Filter by Region</h3>
                          <button 
                            onClick={() => setRegionFilterOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                          <button
                            onClick={selectAllRegions}
                            className="text-xs text-[#284497] hover:text-[#1e3470] font-medium"
                          >
                            Select All
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={clearAllRegions}
                            className="text-xs text-[#284497] hover:text-[#1e3470] font-medium"
                          >
                            Clear All
                          </button>
                        </div>
                        
                        {/* Region List */}
                        <div className="max-h-64 overflow-y-auto">
                          {availableRegions.map((region) => (
                            <div
                              key={region}
                              className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 cursor-pointer"
                              onClick={() => toggleRegion(region)}
                            >
                              <Checkbox
                                checked={selectedRegions.has(region)}
                                onCheckedChange={() => toggleRegion(region)}
                                className="data-[state=checked]:bg-[#284497] data-[state=checked]:border-[#284497]"
                              />
                              <label className="text-sm text-gray-700 cursor-pointer flex-1">
                                {regionDisplayNames[region] || region}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  </div>
                </div>
                
                {/* Enrollment Rate Column Header - Sortable */}
                <button
                  onClick={() => toggleSort("enrollmentRate")}
                  className="flex flex-col items-center gap-0.5 hover:text-blue-200 transition-colors text-xs leading-snug justify-center"
                >
                  <span className="text-center text-[11px] leading-tight">Enrollment Rate</span>
                  {sortBy === "enrollmentRate" ? (
                    sortOrder === "asc" ? <ChevronUp className="h-3.5 w-3.5 flex-shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
                  ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 opacity-50 flex-shrink-0" />
                  )}
                </button>
                
                <div className="text-left leading-snug text-[12px]">Competitive Advantages</div>
                <div className="text-left leading-snug text-[12px]">Critical Gaps</div>
                <div className="text-left leading-tight text-[12px]">
                  Strategic<br />Direction
                </div>
                <div className="text-center leading-tight text-[12px]">
                  Revenue<br />Coverage
                </div>
                <div className="text-center leading-tight text-[12px]">
                  FQ and<br />Responses
                </div>
                
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {finalFilteredSites.length === 0 ? (
                /* Empty State */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-16 px-8"
                >
                  {/* Illustration */}
                  <div className="relative mb-6">
                    <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="relative">
                        <Building2 className="h-20 w-20 text-gray-300" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No sites available
                  </h3>
                  <p className="text-sm text-gray-600 text-center max-w-md mb-6">
                    Adjust your filters to view available sites.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setActivePresets(new Set());
                        setSearchTerm("");
                        setSelectedRegion("All Regions");
                        setSelectedRegions(new Set(availableRegions));
                        setPatientPopulation(0);
                      }}
                      className="px-4 py-2 bg-[#284497] text-white rounded-lg text-sm font-medium hover:bg-[#1e3470] transition-all flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4" />
                      Reset All Filters
                    </button>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg text-sm font-medium hover:border-[#284497] hover:text-[#284497] transition-all"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <>
                  {finalFilteredSites.map((site, index) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-3 py-3 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedSite(site)}
                >
                  <div className="grid gap-3 items-center" style={{ gridTemplateColumns: '40px 180px 85px 2fr 1.8fr 105px 95px 120px' }}>
                    {/* Checkbox Column */}
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedSites.has(site.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSiteSelection(site.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 cursor-pointer"
                        style={{ colorScheme: 'light' }}
                      />
                    </div>
                    
                    {/* Sites Column */}
                    <div 
                      className="flex flex-col gap-0.5"
                    >
                      <div className="font-semibold text-[#061e47] text-sm break-words">{site.name}</div>
                    </div>

                     {/* Enrollment Rate/month Column - clickable for navigation */}
                    <div className="flex items-center justify-center cursor-pointer" onClick={() => setSelectedSite(site)}>
                      <div className="text-center" title={site.enrollmentRate && typeof site.enrollmentRate === 'string' && site.enrollmentRate.includes('-') ? `Using midpoint of range ${site.enrollmentRate}` : ''}>
                        <div className="text-lg font-bold text-[#284497]">
                          {site.enrollmentRate || '0'}
                        </div>
                        <div className="text-[9px] text-gray-500 mt-0.5">patients/mo</div>
                      </div>
                    </div>

                    {/* Competitive Advantages Column */}
                    <div className="text-left bg-gradient-to-br from-emerald-50/80 via-teal-50/70 to-white px-2 py-2 rounded-lg border border-emerald-100/70">
                      {(() => {
                        // Filter out setup/activation time mentions since it's already in Site Information
                        const filteredAdvantages = site.competitiveAdvantages?.filter(
                          adv => !/(setup|activation|startup|timeline|week)/i.test(adv)
                        ) || [];
                        
                        return filteredAdvantages.length > 0 ? (
                          <ul className="space-y-1">
                            {filteredAdvantages.slice(0, 2).map((advantage, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-700 leading-tight">
                                <span className="text-gray-500 font-bold text-xs flex-shrink-0 leading-none">+</span>
                                <span className="break-words">{advantage}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-gray-400 italic">None</span>
                        );
                      })()}
                    </div>

                    {/* Critical Gaps Column */}
                    <div className="text-left bg-gradient-to-br from-rose-50/80 via-pink-50/70 to-white px-2 py-2 rounded-lg border border-rose-100/70">
                      {(() => {
                        // Filter out setup/activation time mentions since it's already in Site Information
                        const filteredRisks = site.riskFactors?.filter(
                          risk => !/(setup|activation|startup|timeline|week)/i.test(risk)
                        ) || [];
                        
                        return filteredRisks.length > 0 ? (
                          <ul className="space-y-1">
                            {filteredRisks.slice(0, 2).map((risk, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-[11px] text-gray-700 leading-tight">
                                <span className="text-gray-500 font-bold text-xs flex-shrink-0 leading-none">−</span>
                                <span className="break-words">{risk}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-gray-400 italic">None</span>
                        );
                      })()}
                    </div>

                    {/* Strategic Direction Column */}
                    <div className="flex flex-wrap gap-1.5 items-center justify-center content-center max-w-full overflow-hidden">
                      {(() => {
                        const getCategoryIcon = (category: string) => {
                          if (category === "Therapeutic Area Growth") return Briefcase;
                          if (category === "Revenue Focus") return DollarSign;
                          if (category === "Infrastructure Development Required") return AlertTriangle;
                          if (category === "Capacity Building Focus") return TrendingUp;
                          if (category === "Geographic Balance") return Globe;
                          return Target;
                        };

                        const getCategoryStyle = (category: string) => {
                          if (category === "Therapeutic Area Growth") {
                            return { 
                              bg: "bg-gradient-to-br from-blue-100/90 to-blue-50/70", 
                              text: "text-gray-700", 
                              iconColor: "text-blue-600",
                              border: "border-blue-200/50" 
                            };
                          }
                          if (category === "Revenue Focus") {
                            return { 
                              bg: "bg-gradient-to-br from-orange-100/90 to-orange-50/70", 
                              text: "text-gray-700", 
                              iconColor: "text-orange-600",
                              border: "border-orange-200/50" 
                            };
                          }
                          if (category === "Infrastructure Development Required") {
                            return { 
                              bg: "bg-gradient-to-br from-red-100/90 to-red-50/70", 
                              text: "text-gray-700", 
                              iconColor: "text-red-600",
                              border: "border-red-200/50" 
                            };
                          }
                          if (category === "Capacity Building Focus") {
                            return { 
                              bg: "bg-gradient-to-br from-purple-100/90 to-purple-50/70", 
                              text: "text-gray-700", 
                              iconColor: "text-purple-600",
                              border: "border-purple-200/50" 
                            };
                          }
                          if (category === "Geographic Balance") {
                            return { 
                              bg: "bg-gradient-to-br from-teal-100/90 to-teal-50/70", 
                              text: "text-gray-700", 
                              iconColor: "text-teal-600",
                              border: "border-teal-200/50" 
                            };
                          }
                          
                          return { 
                            bg: "bg-gray-100/80", 
                            text: "text-gray-600", 
                            iconColor: "text-gray-500",
                            border: "border-gray-200" 
                          };
                        };

                        const directions = site.strategicDirection || generateStrategicDirection(site);
                        // Filter to only show Therapeutic Area Growth
                        const taGrowthDirections = directions ? directions.filter(item => item.category === "Therapeutic Area Growth") : [];
                        
                        return taGrowthDirections && taGrowthDirections.length > 0 ? (
                          <div className="flex flex-col gap-1.5">
                            {taGrowthDirections.slice(0, 2).map((item, idx) => {
                              const Icon = getCategoryIcon(item.category);
                              const style = getCategoryStyle(item.category);
                              
                              // Only render TA Growth
                              if (item.category === "Therapeutic Area Growth") {
                                return (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 + idx * 0.1 }}
                                    className="relative group/strategic"
                                  >
                                    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border ${style.bg} ${style.border} max-w-full`}>
                                      <Icon className={`h-3 w-3 flex-shrink-0 ${style.iconColor}`} />
                                      <span className={`text-[9px] font-semibold ${style.text} leading-tight whitespace-nowrap`}>
                                        TA Growth
                                      </span>
                                    </div>
                                    
                                    {/* Tooltip for TA Growth */}
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/strategic:block z-50 pointer-events-none">
                                      <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                                        Therapeutic Area Growth
                                      </div>
                                      <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                                    </div>
                                  </motion.div>
                                );
                              }
                              
                              return null;
                            })}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        );
                      })()}
                    </div>

                    {/* Revenue Coverage Column - Radial Mini Indicator */}
                    <div className="flex items-center justify-center">
                      {(() => {
                        const directions = site.strategicDirection || generateStrategicDirection(site);
                        const revenueFocus = directions ? directions.find(item => item.category === "Revenue Focus") : null;
                        
                        if (!revenueFocus) {
                          return <span className="text-xs text-gray-400">—</span>;
                        }
                        
                        const percentOfTarget = revenueFocus.percentOfTarget || 0;
                        const gap = revenueFocus.gap || (100 - percentOfTarget);
                        
                        // Get color based on percentage
                        const getRadialColor = (percent: number) => {
                          if (percent >= 90) return { stroke: '#f59e0b', bg: '#fef3c7' }; // Light amber
                          if (percent >= 75) return { stroke: '#f97316', bg: '#fed7aa' }; // Medium orange
                          if (percent >= 60) return { stroke: '#ea580c', bg: '#ffedd5' }; // Deeper orange
                          return { stroke: '#c2410c', bg: '#fed7aa' }; // Dark orange
                        };
                        
                        const colors = getRadialColor(percentOfTarget);
                        const radius = 22;
                        const circumference = 2 * Math.PI * radius;
                        const strokeDashoffset = circumference - (percentOfTarget / 100) * circumference;
                        
                        return (
                          <div className="relative group/radial">
                            {/* Radial Progress Ring */}
                            <svg width="56" height="56" className="transform -rotate-90">
                              {/* Background circle */}
                              <circle
                                cx="28"
                                cy="28"
                                r={radius}
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="4"
                              />
                              {/* Progress circle */}
                              <motion.circle
                                cx="28"
                                cy="28"
                                r={radius}
                                fill="none"
                                stroke={colors.stroke}
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 0.8, delay: index * 0.05, ease: "easeOut" }}
                              />
                              {/* Center percentage text */}
                              <text
                                x="28"
                                y="28"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="text-[12px] font-bold fill-gray-700 transform rotate-90"
                                style={{ transformOrigin: '28px 28px' }}
                              >
                                {percentOfTarget}%
                              </text>
                            </svg>
                            
                            {/* Tooltip */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/radial:block z-50 pointer-events-none">
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
                              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* FQ Responses Column - View Generated Responses Button */}
                    <div className="flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewResponsesSite({ id: site.id, name: site.name });
                        }}
                        className="px-3 py-1.5 bg-sky-100 text-sky-700 hover:bg-sky-200 hover:text-sky-800 rounded-lg text-[10px] font-medium transition-all flex items-center gap-1.5 whitespace-nowrap"
                      >
                        
                        View Generated <br></br>Responses
                      </button>
                    </div>

                    
                  </div>
                </motion.div>
              ))}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="relative z-0 w-[90%] mx-auto px-8 py-6 border-t border-gray-200/50 mt-12">
          <div className="text-center text-sm text-gray-500">
            © 2025 Velocity Clinical Research, United States. All
            rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}

// Site Detail View Component is now imported from SiteDetailViewNew.tsx