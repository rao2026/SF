import jsPDF from 'jspdf';

export const generateGoldenSiteProfilePDF = (protocolNumber: string = 'NCT05165485') => {
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
  pdf.text('Golden Site Profile', pageWidth / 2, 40, { align: 'center' });
  pdf.setFontSize(10);
  pdf.text(`Protocol ID: ${protocolNumber} | Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 60, { align: 'center' });
  
  yPosition = 100;

  // Introduction
  pdf.setTextColor(6, 30, 71);
  pdf.setFontSize(18);
  pdf.text('Golden Site Profile', margin, yPosition);
  yPosition += 20;
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  const introText = wrapText('Ideal site characteristics and requirements for this protocol', contentWidth, 10);
  pdf.text(introText, margin, yPosition);
  yPosition += 25;

  // Priority Legend
  pdf.setFillColor(249, 250, 251);
  pdf.roundedRect(margin, yPosition, contentWidth, 50, 3, 3, 'F');
  yPosition += 15;
  
  const legendStartX = margin + 15;
  const legendSpacing = contentWidth / 3;
  
  // Red - Critical
  pdf.setFillColor(220, 38, 38);
  pdf.circle(legendStartX, yPosition, 4, 'F');
  pdf.setFontSize(9);
  pdf.setTextColor(55, 65, 81);
  pdf.text('Critical - Must Have', legendStartX + 10, yPosition + 3);
  
  // Amber - Strong Preference
  pdf.setFillColor(245, 158, 11);
  pdf.circle(legendStartX + legendSpacing, yPosition, 4, 'F');
  pdf.text('Strong Preference - Highly Preferred', legendStartX + legendSpacing + 10, yPosition + 3);
  
  // Blue - Nice to Have
  pdf.setFillColor(59, 130, 246);
  pdf.circle(legendStartX + (legendSpacing * 2), yPosition, 4, 'F');
  pdf.text('Nice to Have - Differentiator', legendStartX + (legendSpacing * 2) + 10, yPosition + 3);
  
  yPosition += 40;

  // Helper for adding a section with items
  const addSection = (title: string, items: { priority: string; text: string }[]) => {
    checkPageBreak(100);
    
    // Section Title
    pdf.setFillColor(249, 250, 251);
    pdf.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(6, 30, 71);
    pdf.text(title, margin + 10, yPosition + 16);
    yPosition += 35;
    
    // Items
    items.forEach(item => {
      checkPageBreak(30);
      
      // Determine bullet color based on priority
      let bulletColor: number[];
      if (item.priority === 'Critical') {
        bulletColor = [220, 38, 38]; // Red
      } else if (item.priority === 'Strong Preference') {
        bulletColor = [245, 158, 11]; // Amber
      } else if (item.priority === 'Nice to Have') {
        bulletColor = [59, 130, 246]; // Blue
      } else {
        bulletColor = [107, 114, 128]; // Gray
      }
      
      pdf.setTextColor(bulletColor[0], bulletColor[1], bulletColor[2]);
      pdf.setFontSize(10);
      pdf.text('●', margin + 15, yPosition);
      
      pdf.setTextColor(31, 41, 55);
      pdf.setFontSize(9);
      const wrappedText = wrapText(item.text, contentWidth - 40, 9);
      pdf.text(wrappedText, margin + 28, yPosition);
      
      yPosition += Math.max(wrappedText.length * 12, 18);
    });
    
    yPosition += 10;
  };

  // Site & Investigator Profile
  addSection('Site & Investigator Profile', [
    { priority: 'Critical', text: 'PI: Board-certified Pulmonologist or IM physician with COPD expertise' },
    { priority: 'Strong Preference', text: '2-3 completed COPD/respiratory trials' },
    { priority: 'Strong Preference', text: 'Access to COPD patients with FEV1 <80% predicted' }
  ]);

  // Staffing & Operational Capacity
  addSection('Staffing & Operational Capacity', [
    { priority: 'Critical', text: '≥2 experienced research coordinators' },
    { priority: 'Critical', text: '≥1 respiratory therapist/RT' },
    { priority: 'Strong Preference', text: 'Staff trained in spirometry and PIFR measurements' },
    { priority: 'Nice to Have', text: 'Coordinator + clinician coverage available for all study visits' }
  ]);

  // Patient Population & Enrollment Performance
  addSection('Patient Population & Enrollment Performance', [
    { priority: 'Critical', text: '≥50-100 active/early severe COPD patients available' },
    { priority: 'Critical', text: 'Ability to assess PIFR (<60 L/min) on site' },
    { priority: 'Strong Preference', text: 'Screen-fail: 20-40% | Retention: >80%' },
    { priority: 'Nice to Have', text: 'Enrollment: 2-4 participants/month' }
  ]);

  // Clinical Facilities & Capabilities
  addSection('Clinical Facilities & Capabilities', [
    { priority: 'Critical', text: 'ATS/ERS-compliant spirometry' },
    { priority: 'Critical', text: 'PIFR meter (In-Check or equivalent)' },
    { priority: 'Strong Preference', text: 'Support for nebulizer and DPI procedures' },
    { priority: 'Strong Preference', text: 'Pharmacy capable of double-dummy drug handling' },
    { priority: 'Nice to Have', text: '≥3 exam/procedure rooms' }
  ]);

  // Other Organisation Level Expectations
  checkPageBreak(120);
  pdf.setTextColor(6, 30, 71);
  pdf.setFontSize(14);
  pdf.text('Other Organisation Level Expectations', margin, yPosition);
  yPosition += 15;
  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  const orgText = wrapText('Evaluated separately during organizational review; does not factor into primary site selection scoring', contentWidth, 9);
  pdf.text(orgText, margin, yPosition);
  yPosition += 30;

  const organizationItems = [
    'Ability to use Central IRB (e.g., Advarra, WCG)',
    'Contract execution: 10-20 business days',
    'IRB approval: 5-10 business days',
    'Typical activation: 30-45 days',
    'Validated eSource/EHR + eCRF',
    'Experience with eDiary/ePRO for symptom tracking',
    'Remote monitoring enabled (secure read-only)'
  ];

  organizationItems.forEach(item => {
    checkPageBreak(20);
    pdf.setTextColor(156, 163, 175);
    pdf.setFontSize(9);
    pdf.text('○', margin + 15, yPosition);
    pdf.setTextColor(107, 114, 128);
    const wrappedText = wrapText(item, contentWidth - 40, 9);
    pdf.text(wrappedText, margin + 28, yPosition);
    yPosition += Math.max(wrappedText.length * 12, 18);
  });

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
  pdf.save(`Golden Site Profile ${protocolNumber}.pdf`);
};