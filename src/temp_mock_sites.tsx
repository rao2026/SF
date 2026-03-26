// Temporary file with new mock sites data
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
    overallScore: 94,
    priority: "High",
    siteInvestigatorScore: 95,
    staffingCapacityScore: 92,
    patientEnrollmentScore: 95,
    infrastructureScore: 94,
    detailedAssessment: [
      "Excellent COPD patient enrollment",
      "Experienced pulmonology team",
      "Modern spirometry facilities",
      "Strong cardiovascular assessment capabilities",
      "High retention rates in long-term studies"
    ],
    recommendation: {
      action: "Highly recommended for immediate activation. Site demonstrates exceptional capabilities in respiratory trials with strong CV endpoints experience.",
      nextSteps: "Send feasibility questionnaire, schedule site initiation visit, begin contract negotiations."
    },
    compliance: 94,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 180,
    enrollmentRate: "5-7",
    criticalGapsCount: 0,
    startupTimeline: "4-5 weeks",
    competitiveAdvantages: [
      "Strong COPD patient database with documented CV history",
      "Experienced in event-driven cardiovascular outcomes studies",
      "98% retention rate in 36-month respiratory trials",
      "Fast regulatory approval process in Poland",
      "Cost-effective site operations"
    ],
    riskFactors: [],
    strategicDirection: [
      { category: "Revenue Focus" }
    ],
    shortfall: 10
  },
  {
    id: "PL002",
    name: "Lublin Respiratory Institute",
    country: "Poland",
    city: "Lublin",
    address: "ul. Jaczewskiego 8, 20-090 Lublin, Poland",
    siteCode: "SITE-PL002",
    status: "Eligible",
    overallScore: 91,
    priority: "High",
    siteInvestigatorScore: 92,
    staffingCapacityScore: 88,
    patientEnrollmentScore: 93,
    infrastructureScore: 91,
    detailedAssessment: [
      "Academic medical center with strong research background",
      "Large COPD patient population",
      "Experienced clinical trial team",
      "Good infrastructure for complex protocols",
      "Established CV monitoring capabilities"
    ],
    recommendation: {
      action: "Recommended for activation. Site shows strong performance in respiratory and cardiovascular studies.",
      nextSteps: "Proceed with feasibility questionnaire, schedule qualification visit."
    },
    compliance: 91,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 220,
    enrollmentRate: "4-6",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "Large university hospital with extensive patient referral network",
      "Strong publication record in respiratory research",
      "Dedicated cardio-pulmonary unit",
      "Experience with ICS-naïve COPD population enrichment",
      "Bilingual staff (Polish/English) for international studies"
    ],
    riskFactors: [
      "High patient load may affect enrollment velocity during peak seasons"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 15
  },
  {
    id: "PL003",
    name: "Skierniewice Clinical Research",
    country: "Poland",
    city: "Skierniewice",
    address: "ul. Reymonta 64, 96-100 Skierniewice, Poland",
    siteCode: "SITE-PL003",
    status: "Eligible",
    overallScore: 87,
    priority: "High",
    siteInvestigatorScore: 85,
    staffingCapacityScore: 88,
    patientEnrollmentScore: 89,
    infrastructureScore: 86,
    detailedAssessment: [
      "Growing respiratory research program",
      "Good COPD patient access",
      "Modern clinical facilities",
      "Dedicated research staff",
      "Adequate CV assessment infrastructure"
    ],
    recommendation: {
      action: "Recommended for activation. Site demonstrates solid capabilities for COPD CV outcomes trials.",
      nextSteps: "Send feasibility questionnaire, conduct site qualification assessment."
    },
    compliance: 87,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 145,
    enrollmentRate: "3-5",
    criticalGapsCount: 0,
    startupTimeline: "6-7 weeks",
    competitiveAdvantages: [
      "Competitive pricing structure",
      "Strong community connections for patient recruitment",
      "Fast contract negotiations",
      "Growing track record in respiratory trials"
    ],
    riskFactors: [
      "Smaller patient database compared to academic centers",
      "Limited experience with large-scale CV outcomes studies"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 20
  },
  {
    id: "PL004",
    name: "Staszów Medical Research Center",
    country: "Poland",
    city: "Staszów",
    address: "ul. Opatowska 39, 28-200 Staszów, Poland",
    siteCode: "SITE-PL004",
    status: "Eligible",
    overallScore: 83,
    priority: "Medium",
    siteInvestigatorScore: 80,
    staffingCapacityScore: 85,
    patientEnrollmentScore: 84,
    infrastructureScore: 83,
    detailedAssessment: [
      "Established primary care research facility",
      "Good COPD patient population",
      "Reliable research team",
      "Basic spirometry and CV monitoring",
      "Growing trial experience"
    ],
    recommendation: {
      action: "Consider for activation as a reliable enrollment site. May need some additional support for complex endpoints.",
      nextSteps: "Assess CV endpoint capabilities, provide training if needed."
    },
    compliance: 83,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 0 }
    ],
    activationReadiness: "Needs Support",
    patientPoolSize: 120,
    enrollmentRate: "2-4",
    criticalGapsCount: 1,
    startupTimeline: "7-8 weeks",
    competitiveAdvantages: [
      "Very cost-effective operations",
      "High patient compliance and retention",
      "Strong local community relationships"
    ],
    riskFactors: [
      "Limited CRC staffing - requires additional coordinator support",
      "Less experience with CV event adjudication processes",
      "May need training on complex spirometry protocols"
    ],
    strategicDirection: [],
    shortfall: 25
  },
  {
    id: "PL005",
    name: "Zamość Pulmonary Center",
    country: "Poland",
    city: "Zamość",
    address: "ul. Kolegiacka 6, 22-400 Zamość, Poland",
    siteCode: "SITE-PL005",
    status: "Eligible",
    overallScore: 89,
    priority: "High",
    siteInvestigatorScore: 90,
    staffingCapacityScore: 87,
    patientEnrollmentScore: 91,
    infrastructureScore: 88,
    detailedAssessment: [
      "Specialized pulmonary clinic",
      "Strong COPD patient base",
      "Experienced in respiratory trials",
      "Good spirometry quality control",
      "Adequate CV monitoring capabilities"
    ],
    recommendation: {
      action: "Recommended for activation. Site shows strong respiratory trial capabilities with good patient recruitment.",
      nextSteps: "Send feasibility questionnaire, schedule site qualification visit."
    },
    compliance: 89,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 165,
    enrollmentRate: "4-6",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "Dedicated pulmonary research unit",
      "Strong ICS-naïve patient population (~50% not on ICS)",
      "High quality spirometry data with low rejection rates",
      "Experienced with long-term follow-up studies"
    ],
    riskFactors: [
      "Moderate competition from other ongoing respiratory trials"
    ],
    strategicDirection: [
      { category: "Revenue Focus" }
    ],
    shortfall: 12
  },

  // Germany Sites
  {
    id: "DE001",
    name: "Lübeck Cardiovascular Research Institute",
    country: "Germany",
    city: "Lübeck",
    address: "Ratzeburger Allee 160, 23538 Lübeck, Germany",
    siteCode: "SITE-DE001",
    status: "Eligible",
    overallScore: 96,
    priority: "High",
    siteInvestigatorScore: 98,
    staffingCapacityScore: 95,
    patientEnrollmentScore: 97,
    infrastructureScore: 96,
    detailedAssessment: [
      "Premier cardiovascular and respiratory research center",
      "World-class PI with extensive COPD CV outcomes experience",
      "State-of-the-art spirometry and cardiac monitoring",
      "Exceptional patient recruitment and retention",
      "Outstanding data quality and compliance record"
    ],
    recommendation: {
      action: "Top priority site for immediate activation. Exceptional track record in COPD cardiovascular outcomes trials.",
      nextSteps: "Fast-track activation, prioritize contract execution, schedule immediate SIV."
    },
    compliance: 96,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 320,
    enrollmentRate: "7-9",
    criticalGapsCount: 0,
    startupTimeline: "3-4 weeks",
    competitiveAdvantages: [
      "Leading center for cardio-pulmonary disease research in Northern Europe",
      "PI is international expert in COPD CV complications",
      "Integrated cardiology-pulmonology patient database (2,500+ COPD patients with CV history)",
      "99% retention rate in 36-month event-driven trials",
      "Advanced CEC capabilities with 18-day average endpoint package turnaround",
      "Strong diversity in smoking status and ICS use patterns"
    ],
    riskFactors: [],
    strategicDirection: [
      { category: "Revenue Focus" },
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 5
  },
  {
    id: "DE002",
    name: "Wiesbaden Respiratory Clinical Trials",
    country: "Germany",
    city: "Wiesbaden",
    address: "Ludwig-Erhard-Straße 100, 65199 Wiesbaden, Germany",
    siteCode: "SITE-DE002",
    status: "Eligible",
    overallScore: 92,
    priority: "High",
    siteInvestigatorScore: 93,
    staffingCapacityScore: 90,
    patientEnrollmentScore: 94,
    infrastructureScore: 91,
    detailedAssessment: [
      "Established respiratory research center",
      "Strong PI with pulmonary and cardiac expertise",
      "Excellent patient recruitment network",
      "Modern research facilities",
      "High quality data management"
    ],
    recommendation: {
      action: "Highly recommended for activation. Proven track record in respiratory trials with CV monitoring.",
      nextSteps: "Send feasibility questionnaire, schedule site qualification visit."
    },
    compliance: 92,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 275,
    enrollmentRate: "6-8",
    criticalGapsCount: 0,
    startupTimeline: "4-5 weeks",
    competitiveAdvantages: [
      "Strong referral network from regional pulmonologists",
      "Experience with ICS stratification and enrichment",
      "Excellent spirometry QC with <5% rejection rate",
      "Bilingual staff fluent in German and English",
      "Fast regulatory submissions and approvals"
    ],
    riskFactors: [
      "High demand site - may have capacity constraints in Q4"
    ],
    strategicDirection: [
      { category: "Revenue Focus" }
    ],
    shortfall: 8
  },
  {
    id: "DE003",
    name: "Ahrensburg Medical Research",
    country: "Germany",
    city: "Ahrensburg",
    address: "Hagener Allee 40, 22926 Ahrensburg, Germany",
    siteCode: "SITE-DE003",
    status: "Eligible",
    overallScore: 88,
    priority: "High",
    siteInvestigatorScore: 87,
    staffingCapacityScore: 88,
    patientEnrollmentScore: 90,
    infrastructureScore: 87,
    detailedAssessment: [
      "Well-established clinical research site",
      "Good COPD patient population with CV comorbidities",
      "Experienced research coordinators",
      "Adequate spirometry and cardiac facilities",
      "Reliable enrollment history"
    ],
    recommendation: {
      action: "Recommended for activation. Solid performance across key metrics with good patient access.",
      nextSteps: "Complete feasibility assessment, conduct site qualification visit."
    },
    compliance: 88,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 190,
    enrollmentRate: "4-6",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "Proximity to Hamburg provides access to large metropolitan patient population",
      "Strong community relationships for patient recruitment",
      "Cost-effective operations",
      "Experience with event-driven cardiovascular endpoints"
    ],
    riskFactors: [
      "Smaller facility - may need additional CRC support for complex protocols"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 15
  },
  {
    id: "DE004",
    name: "Berlin Pulmonary Research Center",
    country: "Germany",
    city: "Berlin",
    address: "Charitéplatz 1, 10117 Berlin, Germany",
    siteCode: "SITE-DE004",
    status: "Eligible",
    overallScore: 95,
    priority: "High",
    siteInvestigatorScore: 96,
    staffingCapacityScore: 94,
    patientEnrollmentScore: 96,
    infrastructureScore: 95,
    detailedAssessment: [
      "World-renowned academic medical center",
      "Internationally recognized PI in respiratory medicine",
      "State-of-the-art research infrastructure",
      "Large diverse patient population",
      "Outstanding data quality and regulatory compliance"
    ],
    recommendation: {
      action: "Highest priority site. Immediate activation essential. Exceptional capabilities across all domains.",
      nextSteps: "Expedite activation, fast-track contracts, schedule immediate SIV."
    },
    compliance: 95,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 450,
    enrollmentRate: "8-10",
    criticalGapsCount: 0,
    startupTimeline: "3-4 weeks",
    competitiveAdvantages: [
      "Leading European center for respiratory and cardiovascular research",
      "Access to highly diverse patient population (35% non-German ethnicity)",
      "Integrated pulmonology-cardiology clinical and research programs",
      "Exceptional retention: 97% at 36 months in prior COPD outcomes studies",
      "Advanced CEC capabilities with dedicated endpoint adjudication team",
      "Strong publication record enhancing site reputation"
    ],
    riskFactors: [
      "High patient volume may require careful study coordination"
    ],
    strategicDirection: [
      { category: "Revenue Focus" },
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 6
  },
  {
    id: "DE005",
    name: "Hamburg Respiratory Institute",
    country: "Germany",
    city: "Hamburg",
    address: "Martinistraße 52, 20246 Hamburg, Germany",
    siteCode: "SITE-DE005",
    status: "Eligible",
    overallScore: 93,
    priority: "High",
    siteInvestigatorScore: 94,
    staffingCapacityScore: 92,
    patientEnrollmentScore: 94,
    infrastructureScore: 93,
    detailedAssessment: [
      "Premier respiratory research institute",
      "Highly experienced PI with extensive COPD trial portfolio",
      "Excellent patient recruitment capabilities",
      "Advanced spirometry and cardiac monitoring facilities",
      "Strong quality control and compliance record"
    ],
    recommendation: {
      action: "Top priority site for immediate activation. Outstanding track record in COPD CV trials.",
      nextSteps: "Fast-track feasibility, prioritize contract negotiations, schedule early SIV."
    },
    compliance: 93,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 380,
    enrollmentRate: "7-9",
    criticalGapsCount: 0,
    startupTimeline: "4-5 weeks",
    competitiveAdvantages: [
      "Major port city with diverse patient demographics",
      "Strong network of referring pulmonologists across Northern Germany",
      "Experience with ICS-naïve population enrichment strategies",
      "98% retention rate in long-term respiratory outcomes trials",
      "Efficient CEC processes with 20-day average turnaround",
      "Dedicated cardiovascular assessment unit"
    ],
    riskFactors: [],
    strategicDirection: [
      { category: "Revenue Focus" }
    ],
    shortfall: 9
  },
  {
    id: "DE006",
    name: "Leipzig Clinical Research Center",
    country: "Germany",
    city: "Leipzig",
    address: "Liebigstraße 20, 04103 Leipzig, Germany",
    siteCode: "SITE-DE006",
    status: "Eligible",
    overallScore: 90,
    priority: "High",
    siteInvestigatorScore: 91,
    staffingCapacityScore: 89,
    patientEnrollmentScore: 91,
    infrastructureScore: 90,
    detailedAssessment: [
      "Established university hospital research program",
      "Experienced respiratory medicine team",
      "Good COPD patient database with CV enrichment",
      "Modern research facilities",
      "Strong regulatory compliance"
    ],
    recommendation: {
      action: "Highly recommended for activation. Strong capabilities in respiratory and cardiovascular trials.",
      nextSteps: "Send feasibility questionnaire, schedule site qualification visit."
    },
    compliance: 90,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 240,
    enrollmentRate: "5-7",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "Strong academic reputation in respiratory research",
      "Access to regional patient population in Eastern Germany",
      "Cost-effective site operations",
      "Good experience with complex CV endpoint protocols",
      "Efficient regulatory approval processes"
    ],
    riskFactors: [
      "Moderate competition from other ongoing trials"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 12
  },

  // United Kingdom Sites
  {
    id: "UK001",
    name: "Bristol Heart and Lung Institute",
    country: "United Kingdom",
    city: "Bristol",
    address: "Upper Maudlin Street, Bristol BS2 8HW, UK",
    siteCode: "SITE-UK001",
    status: "Eligible",
    overallScore: 94,
    priority: "High",
    siteInvestigatorScore: 95,
    staffingCapacityScore: 93,
    patientEnrollmentScore: 95,
    infrastructureScore: 94,
    detailedAssessment: [
      "Leading UK center for cardio-respiratory research",
      "Renowned PI with extensive COPD CV outcomes expertise",
      "Exceptional patient recruitment network",
      "State-of-the-art research facilities",
      "Outstanding retention and data quality"
    ],
    recommendation: {
      action: "Top priority UK site for immediate activation. Exceptional track record in COPD cardiovascular outcomes trials.",
      nextSteps: "Fast-track feasibility, expedite HRA approval, prioritize contract execution."
    },
    compliance: 94,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 340,
    enrollmentRate: "6-8",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "UK center of excellence for integrated cardio-respiratory research",
      "Strong NHS patient referral network across Southwest England",
      "PI chairs national COPD guidelines committee",
      "97% retention rate in 36-month event-driven trials",
      "Advanced spirometry with <3% QC rejection rate",
      "Dedicated CEC team with rapid endpoint adjudication",
      "Experience with diverse UK population including underserved communities"
    ],
    riskFactors: [],
    strategicDirection: [
      { category: "Revenue Focus" },
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 7
  },
  {
    id: "UK002",
    name: "High Wycombe Clinical Trials Unit",
    country: "United Kingdom",
    city: "High Wycombe",
    address: "Queen Alexandra Road, High Wycombe HP11 2TT, UK",
    siteCode: "SITE-UK002",
    status: "Eligible",
    overallScore: 86,
    priority: "High",
    siteInvestigatorScore: 85,
    staffingCapacityScore: 87,
    patientEnrollmentScore: 88,
    infrastructureScore: 85,
    detailedAssessment: [
      "Well-established NHS research facility",
      "Experienced respiratory medicine team",
      "Good COPD patient access",
      "Adequate spirometry and cardiac monitoring",
      "Reliable enrollment performance"
    ],
    recommendation: {
      action: "Recommended for activation. Solid performance in respiratory trials with good patient recruitment.",
      nextSteps: "Send feasibility questionnaire, conduct site qualification assessment."
    },
    compliance: 86,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 175,
    enrollmentRate: "4-5",
    criticalGapsCount: 0,
    startupTimeline: "6-7 weeks",
    competitiveAdvantages: [
      "Strategic location serving Thames Valley region",
      "Strong community connections for patient recruitment",
      "Cost-effective NHS site operations",
      "Good experience with CV endpoint monitoring"
    ],
    riskFactors: [
      "Moderate staffing - may need additional CRC support for complex protocols",
      "HRA approval timelines can vary"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 18
  },
  {
    id: "UK003",
    name: "Leicester Respiratory Research Unit",
    country: "United Kingdom",
    city: "Leicester",
    address: "Glenfield Hospital, Groby Road, Leicester LE3 9QP, UK",
    siteCode: "SITE-UK003",
    status: "Eligible",
    overallScore: 92,
    priority: "High",
    siteInvestigatorScore: 93,
    staffingCapacityScore: 91,
    patientEnrollmentScore: 93,
    infrastructureScore: 92,
    detailedAssessment: [
      "Premier respiratory research center in UK",
      "Highly experienced PI with strong COPD trial portfolio",
      "Excellent patient recruitment capabilities",
      "Advanced research infrastructure",
      "Strong quality and compliance record"
    ],
    recommendation: {
      action: "Highly recommended for activation. Outstanding capabilities in COPD research with proven CV outcomes experience.",
      nextSteps: "Proceed with feasibility questionnaire, fast-track HRA submission, schedule SIV."
    },
    compliance: 92,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 310,
    enrollmentRate: "6-8",
    criticalGapsCount: 0,
    startupTimeline: "5-6 weeks",
    competitiveAdvantages: [
      "National center for respiratory research in UK",
      "PI is internationally recognized COPD expert",
      "Access to highly diverse patient population (42% ethnic minorities)",
      "Strong track record in event-driven cardiovascular outcomes studies",
      "96% retention rate in long-term respiratory trials",
      "Efficient CEC processes with dedicated endpoint team"
    ],
    riskFactors: [],
    strategicDirection: [
      { category: "Revenue Focus" }
    ],
    shortfall: 10
  },
  {
    id: "UK004",
    name: "North London Respiratory Centre",
    country: "United Kingdom",
    city: "North London",
    address: "Pond Street, London NW3 2QG, UK",
    siteCode: "SITE-UK004",
    status: "Eligible",
    overallScore: 89,
    priority: "High",
    siteInvestigatorScore: 90,
    staffingCapacityScore: 88,
    patientEnrollmentScore: 90,
    infrastructureScore: 89,
    detailedAssessment: [
      "Established London teaching hospital",
      "Experienced respiratory research team",
      "Large diverse patient population",
      "Good spirometry and CV monitoring facilities",
      "Solid enrollment track record"
    ],
    recommendation: {
      action: "Recommended for activation. Strong capabilities with access to diverse London patient population.",
      nextSteps: "Send feasibility questionnaire, schedule site qualification visit."
    },
    compliance: 89,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 25 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Ready to Activate",
    patientPoolSize: 280,
    enrollmentRate: "5-7",
    criticalGapsCount: 0,
    startupTimeline: "6-7 weeks",
    competitiveAdvantages: [
      "Access to large metropolitan London patient base",
      "Highly diverse patient population for inclusion",
      "Strong NHS infrastructure and support",
      "Experience with complex CV endpoint protocols",
      "Good connectivity for patient visits"
    ],
    riskFactors: [
      "High competition from other ongoing trials in London",
      "Complex hospital logistics may affect visit scheduling"
    ],
    strategicDirection: [
      { category: "Therapeutic Area Growth" }
    ],
    shortfall: 14
  },
  {
    id: "UK005",
    name: "Romford Clinical Research",
    country: "United Kingdom",
    city: "Romford",
    address: "Rom Valley Way, Romford RM7 0AG, UK",
    siteCode: "SITE-UK005",
    status: "Under Review",
    overallScore: 78,
    priority: "Medium",
    siteInvestigatorScore: 75,
    staffingCapacityScore: 80,
    patientEnrollmentScore: 80,
    infrastructureScore: 77,
    detailedAssessment: [
      "Growing NHS research program",
      "Developing respiratory trial capabilities",
      "Adequate patient population",
      "Basic spirometry and CV monitoring",
      "Some trial experience"
    ],
    recommendation: {
      action: "Under review. Site shows potential but requires assessment of capabilities for complex CV outcomes protocols.",
      nextSteps: "Request detailed capability documentation, assess CEC experience, consider additional training."
    },
    compliance: 78,
    criticalRequirements: [
      { text: "Experienced pulmonology PI with COPD trial background", points: 25 },
      { text: "Access to COPD patients with CV comorbidities", points: 25 },
      { text: "Spirometry and CV assessment capabilities", points: 0 },
      { text: "Dedicated clinical research coordinators", points: 25 }
    ],
    activationReadiness: "Under Assessment",
    patientPoolSize: 140,
    enrollmentRate: "3-4",
    criticalGapsCount: 1,
    startupTimeline: "8-10 weeks",
    competitiveAdvantages: [
      "Good patient population in East London area",
      "Cost-effective site operations",
      "Motivated team eager to expand respiratory research"
    ],
    riskFactors: [
      "Limited experience with CV outcomes event adjudication",
      "Spirometry quality control requires enhancement",
      "May need additional CRC support",
      "Longer HRA approval timeline"
    ],
    strategicDirection: [],
    shortfall: 28
  }
];
