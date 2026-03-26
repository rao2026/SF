import jsPDF from 'jspdf';

export const generateStudyAskPDF = (protocolNumber: string = 'NCT05165485') => {
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number, fontSize: number) => {
    pdf.setFontSize(fontSize);
    return pdf.splitTextToSize(text, maxWidth);
  };

  // Header
  pdf.setFillColor(40, 68, 151);
  pdf.rect(0, 0, pageWidth, 80, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.text('Study Ask Profile', pageWidth / 2, 40, { align: 'center' });
  pdf.setFontSize(10);
  pdf.text(`Protocol: ${protocolNumber} | Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 60, { align: 'center' });
  
  yPosition = 100;

  // Protocol Information Header
  pdf.setTextColor(6, 30, 71);
  pdf.setFontSize(18);
  pdf.text('Protocol Information', margin, yPosition);
  yPosition += 20;
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  const introText = wrapText('AI-extracted protocol details and study requirements', contentWidth, 10);
  pdf.text(introText, margin, yPosition);
  yPosition += 35;

  // Protocol Number and Classification
  const halfWidth = (contentWidth - 10) / 2;
  
  pdf.setFillColor(239, 246, 255);
  pdf.roundedRect(margin, yPosition, halfWidth, 40, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(55, 65, 81);
  pdf.text('Protocol Number:', margin + 10, yPosition + 18);
  pdf.setTextColor(6, 30, 71);
  pdf.setFontSize(10);
  pdf.text(protocolNumber, margin + 10, yPosition + 32);

  pdf.setFillColor(239, 246, 255);
  pdf.roundedRect(margin + halfWidth + 10, yPosition, halfWidth, 40, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(55, 65, 81);
  pdf.text('Classification Label:', margin + halfWidth + 20, yPosition + 18);
  pdf.setTextColor(6, 30, 71);
  const classText = wrapText('COPD Flow-Limited Inhalation Therapy Study', halfWidth - 20, 9);
  pdf.text(classText, margin + halfWidth + 20, yPosition + 32);
  
  yPosition += 60;

  // Study Ask Profile Header
  pdf.setTextColor(6, 30, 71);
  pdf.setFontSize(16);
  pdf.text('Study Ask Profile', margin, yPosition);
  yPosition += 30;

  // Helper function for card sections
  const addCard = (title: string, items: string[], color: number[]) => {
    checkPageBreak(100);
    
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin, yPosition, contentWidth, 20, 3, 3, 'F');
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.rect(margin, yPosition, 4, 20);
    
    pdf.setFontSize(12);
    pdf.setTextColor(6, 30, 71);
    pdf.text(title, margin + 15, yPosition + 14);
    yPosition += 25;
    
    items.forEach(item => {
      checkPageBreak(20);
      pdf.setTextColor(40, 68, 151);
      pdf.setFontSize(8);
      pdf.text('●', margin + 15, yPosition);
      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(9);
      const wrappedText = wrapText(item, contentWidth - 40, 9);
      pdf.text(wrappedText, margin + 28, yPosition);
      yPosition += Math.max(wrappedText.length * 12, 18);
    });
    
    yPosition += 15;
  };

  // Recruitment
  addCard('Recruitment', [
    'Enroll 366 participants (183 per arm) within a 4–5 month window',
    'Execute multi-channel recruitment strategies',
    'Manage recruitment challenges and competing studies'
  ], [40, 68, 151]);

  // Staff & Procedures
  addCard('Staff & Procedures', [
    'Perform vendor-standard spirometry (with required space & equipment)',
    'Conduct repeated PIFR assessments',
    'Train participants and manage study devices (nebulizer, HandiHaler, etc.)',
    'Support daily eDiary use and home PEF training',
    'Execute dense, multi-visit schedules',
    'Administer PRO assessments (BDI, TDI, CAT, E-RS)'
  ], [53, 189, 212]);

  // Infrastructure & Facilities
  addCard('Infrastructure & Facilities', [
    'ATS/ERS-compliant spirometry equipment and trained personnel',
    'In-Check™ PIFR device (or similar validated tool)',
    'Dedicated clinic space for spirometry/PIFR testing',
    'Pharmacy capacity for study drug management (nebulizer solution + DPI)',
    'Freezer capability for biospecimen storage (if applicable)'
  ], [34, 197, 94]);

  // Coordination & Oversight
  addCard('Coordination & Oversight', [
    'Coordinate trial activities across teams (clinical, pharmacy, data)',
    'Monitor enrollment progress and adjust recruitment as needed',
    'Implement retention strategies (call reminders, flexible visit windows)',
    'Support monitoring and timely data entry'
  ], [249, 115, 22]);

  // Additional Details Section
  checkPageBreak(100);
  pdf.setTextColor(6, 30, 71);
  pdf.setFontSize(14);
  pdf.text('Additional Details', margin, yPosition);
  yPosition += 25;

  const addSubSection = (title: string, items: string[]) => {
    checkPageBreak(60);
    pdf.setFillColor(249, 250, 251);
    pdf.roundedRect(margin, yPosition, contentWidth, 18, 2, 2, 'F');
    pdf.setFontSize(10);
    pdf.setTextColor(55, 65, 81);
    pdf.text(title, margin + 10, yPosition + 12);
    yPosition += 22;
    
    items.forEach(item => {
      checkPageBreak(18);
      pdf.setTextColor(156, 163, 175);
      pdf.setFontSize(8);
      pdf.text('○', margin + 15, yPosition);
      pdf.setTextColor(75, 85, 99);
      pdf.setFontSize(8);
      const wrappedText = wrapText(item, contentWidth - 40, 8);
      pdf.text(wrappedText, margin + 28, yPosition);
      yPosition += Math.max(wrappedText.length * 11, 16);
    });
    yPosition += 8;
  };

  addSubSection('Staff Training', [
    'GCP training required for all staff (standard requirement)',
    'Protocol-specific training and competency assessments',
    'Delegation of authority log maintenance'
  ]);

  addSubSection('Study Timeline', [
    'Screening visit (Visit 1) within 28 days of baseline',
    'Follow-up visits at Weeks 2, 4, 8, and 12',
    'Early termination visit if participant withdraws'
  ]);

  addSubSection('Common Procedures', [
    'Routine physical examinations and vital sign measurements',
    'Standard urine pregnancy testing for women of childbearing potential',
    'Blood sample collection for hematology and chemistry panels'
  ]);

  addSubSection('Safety Monitoring', [
    'Continuous adverse event monitoring and reporting per ICH-GCP',
    'Concomitant medication review at each visit',
    '12-lead ECG at screening and end-of-study'
  ]);

  addSubSection('Documentation', [
    'Informed consent documentation prior to any study procedures',
    'Source document verification and essential document filing',
    'Regulatory binder maintenance per sponsor requirements'
  ]);

  addSubSection('Quality & Compliance', [
    'Site readiness for monitoring visits (remote and on-site)',
    'Query resolution within 5 business days',
    'Protocol deviation reporting and corrective action plans'
  ]);

  // Inclusion Criteria
  checkPageBreak(100);
  pdf.setTextColor(6, 30, 71);
  pdf.setFontSize(14);
  pdf.text('Inclusion Criteria', margin, yPosition);
  yPosition += 25;

  const inclusionItems = [
    'Lung Function: Post-ipratropium FEV1 <50% predicted and >700 mL absolute',
    'Inspiratory Flow: PIFR <55 L/min (measured by In-Check™ device set to DISKUS resistance)',
    'Smoking History: Active/former smoker with ≥10 pack-years',
    'Technical Competency: Capable of performing reproducible spirometry per ATS Guidelines'
  ];

  inclusionItems.forEach(item => {
    checkPageBreak(20);
    pdf.setTextColor(34, 197, 94);
    pdf.setFontSize(9);
    pdf.text('✓', margin + 15, yPosition);
    pdf.setTextColor(31, 41, 55);
    pdf.setFontSize(9);
    const wrappedText = wrapText(item, contentWidth - 40, 9);
    pdf.text(wrappedText, margin + 28, yPosition);
    yPosition += Math.max(wrappedText.length * 12, 18);
  });

  yPosition += 15;

  // Exclusion Criteria
  checkPageBreak(100);
  pdf.setTextColor(6, 30, 71);
  pdf.setFontSize(14);
  pdf.text('Exclusion Criteria', margin, yPosition);
  yPosition += 25;

  const exclusionItems = [
    'Recent Instability: Hospitalization for COPD/pneumonia within 8 weeks',
    'Medications: Systemic corticosteroids or antibiotics for respiratory infections within 8 weeks',
    'Contraindications: Narrow-angle glaucoma, symptomatic BPH, bladder neck obstruction, urinary retention',
    'Organ Function: Moderate-to-severe hepatic impairment or severe renal insufficiency'
  ];

  exclusionItems.forEach(item => {
    checkPageBreak(20);
    pdf.setTextColor(239, 68, 68);
    pdf.setFontSize(9);
    pdf.text('✗', margin + 15, yPosition);
    pdf.setTextColor(31, 41, 55);
    pdf.setFontSize(9);
    const wrappedText = wrapText(item, contentWidth - 40, 9);
    pdf.text(wrappedText, margin + 28, yPosition);
    yPosition += Math.max(wrappedText.length * 12, 18);
  });

  // Footer
  yPosition = pageHeight - 60;
  pdf.setDrawColor(229, 231, 235);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  pdf.text('© 2025 Velocity Clinical Research, United States. All rights reserved.', pageWidth / 2, yPosition + 20, { align: 'center' });
  pdf.text('This document is confidential and intended for authorized personnel only.', pageWidth / 2, yPosition + 35, { align: 'center' });

  // Save the PDF
  pdf.save(`Study Ask ${protocolNumber}.pdf`);
};
