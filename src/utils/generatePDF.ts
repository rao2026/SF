import jsPDF from 'jspdf';

export const generateSiteFeasibilityPDF = (protocolLabel: string) => {
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
  pdf.text('Site Feasibility Report', pageWidth / 2, 40, { align: 'center' });
  pdf.setFontSize(10);
  pdf.text(`Protocol ID: PRO-2024-1847 | Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 60, { align: 'center' });
  
  yPosition = 100;

  // Protocol Information Section
  pdf.setTextColor(6, 30, 71);
  pdf.setFontSize(18);
  pdf.text('Protocol Information', margin, yPosition);
  yPosition += 25;

  // Classification
  pdf.setFillColor(239, 246, 255);
  pdf.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, 'F');
  pdf.setFontSize(10);
  pdf.setTextColor(55, 65, 81);
  pdf.text('Classification:', margin + 10, yPosition + 18);
  pdf.setTextColor(6, 30, 71);
  const classText = wrapText(protocolLabel, contentWidth - 120, 10);
  pdf.text(classText, margin + 100, yPosition + 18);
  yPosition += 45;

  // Study Ask Profile
  pdf.setTextColor(6, 30, 71);
  pdf.setFontSize(14);
  pdf.text('Study Ask Profile', margin, yPosition);
  yPosition += 20;

  // Helper for adding a card
  const addCard = (title: string, content: string[], bulletColor: number[]) => {
    checkPageBreak(80);
    pdf.setFillColor(249, 250, 251);
    const cardHeight = 60 + (content.length * 12);
    pdf.roundedRect(margin, yPosition, contentWidth, cardHeight, 3, 3, 'F');
    pdf.setFontSize(11);
    pdf.setTextColor(55, 65, 81);
    pdf.text(title, margin + 10, yPosition + 18);
    
    pdf.setFontSize(9);
    pdf.setTextColor(31, 41, 55);
    let itemY = yPosition + 35;
    content.forEach(item => {
      pdf.setTextColor(bulletColor[0], bulletColor[1], bulletColor[2]);
      pdf.text('•', margin + 15, itemY);
      pdf.setTextColor(31, 41, 55);
      const wrappedText = wrapText(item, contentWidth - 40, 9);
      pdf.text(wrappedText, margin + 25, itemY);
      itemY += wrappedText.length * 12;
    });
    
    yPosition = itemY + 10;
  };

  // Therapeutic Area & Study Design
  const halfWidth = (contentWidth - 10) / 2;
  checkPageBreak(100);
  
  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(margin, yPosition, halfWidth, 70, 3, 3, 'F');
  pdf.setFontSize(11);
  pdf.setTextColor(55, 65, 81);
  pdf.text('Therapeutic Area', margin + 10, yPosition + 18);
  pdf.setFontSize(9);
  pdf.setTextColor(31, 41, 55);
  const taText = wrapText('COPD (Chronic Obstructive Pulmonary Disease)', halfWidth - 20, 9);
  pdf.text(taText, margin + 10, yPosition + 35);

  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(margin + halfWidth + 10, yPosition, halfWidth, 70, 3, 3, 'F');
  pdf.setFontSize(11);
  pdf.setTextColor(55, 65, 81);
  pdf.text('Study Design', margin + halfWidth + 20, yPosition + 18);
  pdf.setFontSize(9);
  pdf.setTextColor(31, 41, 55);
  const sdText = wrapText('Randomized, Double-Blind, Double-Dummy, Parallel-Group comparison of nebulizer vs. dry powder inhaler delivery', halfWidth - 20, 9);
  pdf.text(sdText, margin + halfWidth + 20, yPosition + 35);
  yPosition += 85;

  // Inclusion Criteria
  addCard('Inclusion Criteria', [
    'Lung Function: Post-ipratropium FEV1 <50% predicted and >700 mL absolute',
    'Inspiratory Flow: PIFR <55 L/min (measured by In-Check device)',
    'Smoking History: Active/former smoker with ≥10 pack-years',
    'Technical Competency: Capable of performing reproducible spirometry'
  ], [40, 68, 151]);

  // Exclusion Criteria
  addCard('Exclusion Criteria', [
    'Recent Instability: Hospitalization for COPD/pneumonia within 8 weeks',
    'Medications: Systemic corticosteroids or antibiotics within 8 weeks',
    'Contraindications: Narrow-angle glaucoma, symptomatic BPH',
    'Organ Function: Moderate-to-severe hepatic/renal impairment'
  ], [239, 68, 68]);

  // Interventions
  addCard('Interventions', [
    'Test Arm: Revefenacin Inhalation Solution via Standard Jet Nebulizer',
    'Comparator Arm: Tiotropium delivered via Spiriva HandiHaler DPI'
  ], [53, 189, 212]);

  // Golden Site Profile - New Page
  pdf.addPage();
  yPosition = margin;

  pdf.setTextColor(6, 30, 71);
  pdf.setFontSize(18);
  pdf.text('Golden Site Profile', margin, yPosition);
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Ideal site characteristics and requirements for this protocol', margin, yPosition + 18);
  yPosition += 40;

  // Golden Site Profile Cards
  addCard('Site & Investigator Profile', [
    'PI: Board-certified Pulmonologist or IM physician with COPD expertise',
    '2-3 completed COPD/respiratory trials',
    'Access to COPD patients with FEV1 <80% predicted'
  ], [6, 182, 212]);

  addCard('Staffing & Operational Capacity', [
    '≥2 experienced research coordinators',
    '≥1 respiratory therapist/RT',
    'Staff trained in spirometry and PIFR measurements',
    'Coordinator + clinician coverage for all study visits'
  ], [236, 72, 153]);

  addCard('Patient Population & Enrollment Performance', [
    '≥50-100 active/early severe COPD patients available',
    'Ability to assess PIFR (<60 L/min) on site',
    'Screen-fail: 20-40% | Retention: >80%',
    'Enrollment: 2-4 participants/month'
  ], [34, 197, 94]);

  addCard('Clinical Facilities & Capabilities', [
    'ATS/ERS-compliant spirometry',
    'PIFR meter (In-Check or equivalent)',
    'Support for nebulizer and DPI procedures',
    'Pharmacy capable of double-dummy drug handling',
    '≥3 exam/procedure rooms'
  ], [249, 115, 22]);

  addCard('Regulatory & Start-Up Readiness', [
    'Ability to use Central IRB (e.g., Advarra, WCG)',
    'Contract execution: 10-20 business days',
    'IRB approval: 5-10 business days',
    'Typical activation: 30-45 days'
  ], [245, 158, 11]);

  addCard('Data Systems & Monitoring Support', [
    'Validated eSource/EHR + eCRF',
    'Experience with eDiary/ePRO for symptom tracking',
    'Remote monitoring enabled (secure read-only)'
  ], [20, 184, 166]);

  // Footer
  checkPageBreak(50);
  yPosition = pageHeight - 60;
  pdf.setDrawColor(229, 231, 235);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  pdf.text('© 2025 Velocity Clinical Research, United States. All rights reserved.', pageWidth / 2, yPosition + 20, { align: 'center' });
  pdf.text('This document is confidential and intended for authorized personnel only.', pageWidth / 2, yPosition + 35, { align: 'center' });

  // Save the PDF
  pdf.save('Site-Feasibility-Report-PRO-2024-1847.pdf');
};
