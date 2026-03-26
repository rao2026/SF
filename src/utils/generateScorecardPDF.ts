import jsPDF from 'jspdf';

interface Site {
  id: string;
  name: string;
  address: string;
  siteCode: string;
  status: "Eligible" | "Under Review" | "Not Eligible";
  overallScore: number;
  priority: "High" | "Medium" | "Low";
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
  competitiveAdvantages?: string[];
  riskFactors?: string[];
}

export const generateScorecardPDF = (sites: Site[], protocolNumber: string = 'NCT05165485', totalMatchedSites: number = 0) => {
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin - 70) {
      addFooter();
      pdf.addPage();
      addHeader();
      yPosition = 130;
      return true;
    }
    return false;
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number, fontSize: number) => {
    pdf.setFontSize(fontSize);
    return pdf.splitTextToSize(text, maxWidth);
  };

  // Helper function to add header
  const addHeader = () => {
    // Header background with gradient effect
    pdf.setFillColor(40, 68, 151);
    pdf.rect(0, 0, pageWidth, 100, 'F');
    
    // Light overlay for depth
    pdf.setFillColor(255, 255, 255);
    pdf.setGState(new pdf.GState({ opacity: 0.05 }));
    pdf.rect(0, 0, pageWidth, 100, 'F');
    pdf.setGState(new pdf.GState({ opacity: 1 }));
    
    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(26);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Site Selection Scorecard', pageWidth / 2, 45, { align: 'center' });
    
    // Subtitle
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(220, 230, 255);
    pdf.text(`Protocol: ${protocolNumber}`, pageWidth / 2, 70, { align: 'center' });
    pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 87, { align: 'center' });
  };

  // Helper function to add footer
  const addFooter = () => {
    const footerY = pageHeight - 60;
    
    // Footer line
    pdf.setDrawColor(40, 68, 151);
    pdf.setLineWidth(1.5);
    pdf.line(margin, footerY, pageWidth - margin, footerY);
    
    // Footer text
    pdf.setFontSize(8);
    pdf.setTextColor(100, 110, 130);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Velocity Clinical Research | Confidential & Proprietary', pageWidth / 2, footerY + 20, { align: 'center' });
    pdf.text('© 2025 All Rights Reserved. This document is intended for authorized personnel only.', pageWidth / 2, footerY + 33, { align: 'center' });
    
    // Page number
    pdf.setFontSize(9);
    pdf.setTextColor(40, 68, 151);
    const pageNum = (pdf as any).internal.getNumberOfPages();
    pdf.text(`Page ${pageNum}`, pageWidth - margin, footerY + 26, { align: 'right' });
  };

  // Add first page header
  addHeader();
  yPosition = 130;

  // Executive Summary Section
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(40, 68, 151);
  pdf.setFontSize(20);
  pdf.text('Executive Summary', margin, yPosition);
  
  // Decorative underline
  pdf.setDrawColor(40, 68, 151);
  pdf.setLineWidth(2);
  pdf.line(margin, yPosition + 5, margin + 180, yPosition + 5);
  
  yPosition += 35;

  const selectedSites = sites.length;
  const highPerformers = sites.filter(s => s.overallScore >= 85).length;

  // Summary Cards - Professional redesign
  const summaryData = [
    { 
      label: 'Total Sites Matched', 
      value: totalMatchedSites.toString(), 
      color: [40, 68, 151],
      bgColor: [235, 240, 255]
    },
    { 
      label: 'Selected Sites', 
      value: selectedSites.toString(), 
      color: [34, 197, 94],
      bgColor: [233, 255, 243]
    },
    { 
      label: 'High Performers (≥85%)', 
      value: highPerformers.toString(), 
      color: [16, 185, 129],
      bgColor: [209, 250, 229]
    },
  ];

  const cardWidth = (contentWidth - 20) / 3;
  let xPos = margin;

  summaryData.forEach((data) => {
    // Card background with subtle shadow
    pdf.setFillColor(data.bgColor[0], data.bgColor[1], data.bgColor[2]);
    pdf.roundedRect(xPos, yPosition, cardWidth, 70, 5, 5, 'F');
    
    // Left accent bar
    pdf.setFillColor(data.color[0], data.color[1], data.color[2]);
    pdf.roundedRect(xPos, yPosition, 6, 70, 3, 3, 'F');
    
    // Label
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(80, 90, 110);
    pdf.text(data.label, xPos + 18, yPosition + 22);
    
    // Value
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(32);
    pdf.setTextColor(data.color[0], data.color[1], data.color[2]);
    pdf.text(data.value, xPos + 18, yPosition + 55);

    xPos += cardWidth + 10;
  });

  yPosition += 100;

  // Add context text
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(10);
  pdf.setTextColor(100, 110, 130);
  const contextText = `Out of ${totalMatchedSites} matched sites, ${selectedSites} ${selectedSites === 1 ? 'site has' : 'sites have'} been selected for this report.`;
  pdf.text(contextText, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 40;

  // Sites Overview Section
  checkPageBreak(80);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(40, 68, 151);
  pdf.setFontSize(20);
  pdf.text('Selected Sites Overview', margin, yPosition);
  
  // Decorative underline
  pdf.setDrawColor(40, 68, 151);
  pdf.setLineWidth(2);
  pdf.line(margin, yPosition + 5, margin + 220, yPosition + 5);
  
  yPosition += 35;

  // Sort sites by overall score (descending)
  const sortedSites = [...sites].sort((a, b) => b.overallScore - a.overallScore);

  sortedSites.forEach((site, index) => {
    checkPageBreak(160);

    // Site Card with professional styling
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(220, 225, 235);
    pdf.setLineWidth(1);
    pdf.roundedRect(margin, yPosition, contentWidth, 140, 8, 8, 'FD');

    // Colored left border based on score
    let borderColor: number[] = [239, 68, 68];
    if (site.overallScore >= 85) borderColor = [34, 197, 94];
    else if (site.overallScore >= 70) borderColor = [234, 179, 8];

    pdf.setFillColor(borderColor[0], borderColor[1], borderColor[2]);
    pdf.roundedRect(margin, yPosition, 6, 140, 3, 3, 'F');

    let cardY = yPosition + 22;

    // Ranking badge
    pdf.setFillColor(40, 68, 151);
    pdf.circle(margin + 25, yPosition - 8, 14, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text(`#${index + 1}`, margin + 25, yPosition - 5, { align: 'center' });

    // Site Name
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.setTextColor(30, 40, 60);
    pdf.text(site.name, margin + 20, cardY);
    
    // Site Code
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(120, 130, 150);
    pdf.text(site.siteCode, margin + 20, cardY + 16);

    // Overall Score - Enhanced circular badge
    const scoreX = pageWidth - margin - 85;
    
    let scoreColor: number[] = [239, 68, 68];
    if (site.overallScore >= 85) scoreColor = [34, 197, 94];
    else if (site.overallScore >= 70) scoreColor = [234, 179, 8];

    // Outer ring
    pdf.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.setLineWidth(3);
    pdf.circle(scoreX + 30, cardY + 5, 30, 'S');
    
    // Inner fill
    pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.setGState(new pdf.GState({ opacity: 0.1 }));
    pdf.circle(scoreX + 30, cardY + 5, 27, 'F');
    pdf.setGState(new pdf.GState({ opacity: 1 }));
    
    // Score value
    pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.text(site.overallScore.toString(), scoreX + 30, cardY + 10, { align: 'center' });
    
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text('OVERALL', scoreX + 30, cardY + 21, { align: 'center' });

    cardY += 35;

    // Address
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(90, 100, 120);
    const wrappedAddress = wrapText(site.address, contentWidth - 140, 9);
    pdf.text(wrappedAddress, margin + 20, cardY);
    cardY += wrappedAddress.length * 12 + 15;

    // Performance Metrics Section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(60, 70, 90);
    pdf.text('Performance Metrics', margin + 20, cardY);
    cardY += 18;
    
    const categories = [
      { label: 'Site & Investigator', score: site.siteInvestigatorScore },
      { label: 'Staffing & Capacity', score: site.staffingCapacityScore },
      { label: 'Patient Enrollment', score: site.patientEnrollmentScore },
      { label: 'Infrastructure', score: site.infrastructureScore },
    ];

    const catWidth = (contentWidth - 60) / 4;
    let catX = margin + 20;

    categories.forEach((cat) => {
      // Category label
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 110, 130);
      const wrappedLabel = wrapText(cat.label, catWidth - 5, 8);
      pdf.text(wrappedLabel, catX, cardY);
      
      // Score with color
      let catColor: number[] = [239, 68, 68];
      if (cat.score >= 90) catColor = [34, 197, 94];
      else if (cat.score >= 75) catColor = [234, 179, 8];
      
      pdf.setTextColor(catColor[0], catColor[1], catColor[2]);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.text(`${cat.score}%`, catX, cardY + 20);
      
      catX += catWidth;
    });

    cardY += 30;

    // Competitive Advantages & Risk Factors
    const hasAdvantages = site.competitiveAdvantages && site.competitiveAdvantages.length > 0;
    const hasRisks = site.riskFactors && site.riskFactors.length > 0;
    
    if (hasAdvantages || hasRisks) {
      const prosConsStartY = cardY;
      
      // Competitive Advantages (Left Side)
      if (hasAdvantages) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(16, 185, 129);
        pdf.text('✓ STRENGTHS', margin + 20, cardY);
        cardY += 10;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(50, 60, 80);
        site.competitiveAdvantages!.slice(0, 3).forEach((advantage) => {
          const wrappedAdv = wrapText(`• ${advantage}`, (contentWidth - 40) / 2 - 20, 7);
          pdf.text(wrappedAdv, margin + 20, cardY);
          cardY += wrappedAdv.length * 9;
        });
      }
      
      // Risk Factors (Right Side)
      if (hasRisks) {
        let riskY = prosConsStartY;
        const rightColX = margin + (contentWidth / 2) + 10;
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(234, 179, 8);
        pdf.text('⚠ RISKS', rightColX, riskY);
        riskY += 10;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(50, 60, 80);
        site.riskFactors!.slice(0, 3).forEach((risk) => {
          const wrappedRisk = wrapText(`• ${risk}`, (contentWidth - 40) / 2 - 20, 7);
          pdf.text(wrappedRisk, rightColX, riskY);
          riskY += wrappedRisk.length * 9;
        });
        
        if (riskY > cardY) cardY = riskY;
      }
    }

    yPosition += 155 + (hasAdvantages || hasRisks ? 25 : 0);
  });

  // Detailed Site Information
  yPosition += 30;
  
  sortedSites.forEach((site, index) => {
    checkPageBreak(250);

    // Site detail header
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40, 68, 151);
    pdf.setFontSize(16);
    pdf.text(`${index + 1}. ${site.name} - Detailed Assessment`, margin, yPosition);
    yPosition += 30;

    // Assessment section
    pdf.setFillColor(245, 248, 255);
    pdf.roundedRect(margin, yPosition, contentWidth, 22, 4, 4, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(40, 68, 151);
    pdf.text('Key Strengths', margin + 15, yPosition + 14);
    yPosition += 28;

    site.detailedAssessment.forEach(item => {
      checkPageBreak(22);
      
      // Checkmark
      pdf.setFillColor(34, 197, 94);
      pdf.circle(margin + 20, yPosition - 2, 3, 'F');
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(50, 60, 80);
      pdf.setFontSize(9);
      const wrappedText = wrapText(item, contentWidth - 50, 9);
      pdf.text(wrappedText, margin + 32, yPosition);
      yPosition += Math.max(wrappedText.length * 12, 18);
    });

    yPosition += 20;
    checkPageBreak(90);

    // Selection Recommendation
    pdf.setFillColor(245, 248, 255);
    pdf.roundedRect(margin, yPosition, contentWidth, 22, 4, 4, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(40, 68, 151);
    pdf.text('Recommendation', margin + 15, yPosition + 14);
    yPosition += 28;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(80, 90, 110);
    pdf.text('Action:', margin + 15, yPosition);
    yPosition += 14;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 60, 80);
    const actionText = wrapText(site.recommendation.action, contentWidth - 50, 9);
    pdf.text(actionText, margin + 15, yPosition);
    yPosition += actionText.length * 12 + 15;

    checkPageBreak(50);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(80, 90, 110);
    pdf.text('Next Steps:', margin + 15, yPosition);
    yPosition += 14;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(50, 60, 80);
    const nextStepsText = wrapText(site.recommendation.nextSteps, contentWidth - 50, 9);
    pdf.text(nextStepsText, margin + 15, yPosition);
    yPosition += nextStepsText.length * 12 + 20;

    // Critical Requirements (if there are gaps)
    const gaps = site.criticalRequirements.filter(req => req.points === 0);
    if (gaps.length > 0) {
      checkPageBreak(90);
      
      pdf.setFillColor(254, 242, 242);
      pdf.roundedRect(margin, yPosition, contentWidth, 22, 4, 4, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(220, 38, 38);
      pdf.text('Identified Gaps', margin + 15, yPosition + 14);
      yPosition += 28;

      gaps.forEach(gap => {
        checkPageBreak(22);
        
        // X mark
        pdf.setTextColor(239, 68, 68);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.text('✗', margin + 18, yPosition);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(50, 60, 80);
        pdf.setFontSize(9);
        const wrappedText = wrapText(gap.text, contentWidth - 50, 9);
        pdf.text(wrappedText, margin + 32, yPosition);
        yPosition += Math.max(wrappedText.length * 12, 18);
      });

      yPosition += 20;
    }

    yPosition += 25;
  });

  // Add footer to last page
  addFooter();

  // Save the PDF
  pdf.save(`Site-Selection-Scorecard-${protocolNumber}-${new Date().toISOString().split('T')[0]}.pdf`);
};
