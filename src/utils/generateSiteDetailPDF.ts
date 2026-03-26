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

export const generateSiteDetailPDF = (site: Site, protocolNumber: string = 'NCT05165485') => {
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
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Site Detail Report', pageWidth / 2, 40, { align: 'center' });
    
    // Site name
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(site.name, pageWidth / 2, 62, { align: 'center' });
    
    // Subtitle
    pdf.setFontSize(10);
    pdf.setTextColor(220, 230, 255);
    pdf.text(`Protocol: ${protocolNumber} | Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 82, { align: 'center' });
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

  // Helper function to draw a score gauge/circle
  const drawScoreCircle = (x: number, y: number, score: number, label: string) => {
    const radius = 30;
    
    // Determine color based on score
    let color: [number, number, number];
    if (score >= 85) {
      color = [16, 185, 129]; // green
    } else if (score >= 70) {
      color = [234, 179, 8]; // yellow
    } else {
      color = [239, 68, 68]; // red
    }
    
    // Draw circle background
    pdf.setFillColor(245, 247, 250);
    pdf.circle(x, y, radius, 'F');
    
    // Draw colored circle
    pdf.setFillColor(...color);
    pdf.circle(x, y, radius - 3, 'F');
    
    // Draw score text
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text(score.toString(), x, y + 6, { align: 'center' });
    
    // Draw label
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 70, 90);
    pdf.text(label, x, y + radius + 15, { align: 'center' });
  };

  // Add first page header
  addHeader();
  yPosition = 130;

  // Site Information Section
  pdf.setFillColor(240, 245, 255);
  pdf.roundedRect(margin, yPosition, contentWidth, 110, 8, 8, 'F');
  
  yPosition += 20;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(40, 68, 151);
  pdf.text('Site Information', margin + 15, yPosition);
  
  yPosition += 25;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60, 70, 90);
  pdf.text(`Site Code: ${site.siteCode}`, margin + 15, yPosition);
  
  yPosition += 18;
  pdf.text(`Address: ${site.address}`, margin + 15, yPosition);
  
  yPosition += 18;
  pdf.text(`Status: ${site.status}`, margin + 15, yPosition);
  
  yPosition += 18;
  pdf.text(`Priority: ${site.priority}`, margin + 15, yPosition);
  
  yPosition += 35;

  // Overall Score and Category Scores Section
  checkPageBreak(200);
  
  pdf.setFillColor(40, 68, 151);
  pdf.roundedRect(margin, yPosition, contentWidth, 35, 8, 8, 'F');
  pdf.setFontSize(13);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('Performance Metrics', margin + 15, yPosition + 22);
  
  yPosition += 55;

  // Draw score circles
  const circleY = yPosition + 40;
  const circleSpacing = contentWidth / 5;
  const startX = margin + circleSpacing / 2;

  drawScoreCircle(startX, circleY, site.overallScore, 'Overall Score');
  drawScoreCircle(startX + circleSpacing, circleY, site.siteInvestigatorScore, 'Site Investigator');
  drawScoreCircle(startX + circleSpacing * 2, circleY, site.staffingCapacityScore, 'Staffing Capacity');
  drawScoreCircle(startX + circleSpacing * 3, circleY, site.patientEnrollmentScore, 'Patient Enrollment');
  drawScoreCircle(startX + circleSpacing * 4, circleY, site.infrastructureScore, 'Infrastructure');

  yPosition += 110;

  // Compliance Section
  checkPageBreak(80);
  
  pdf.setFillColor(240, 245, 255);
  pdf.roundedRect(margin, yPosition, contentWidth, 60, 8, 8, 'F');
  
  yPosition += 20;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(40, 68, 151);
  pdf.text('Compliance Score', margin + 15, yPosition);
  
  yPosition += 25;
  
  // Draw compliance bar
  const barWidth = contentWidth - 150;
  const barHeight = 12;
  const barX = margin + 130;
  
  // Background bar
  pdf.setFillColor(230, 235, 245);
  pdf.roundedRect(barX, yPosition - 8, barWidth, barHeight, 6, 6, 'F');
  
  // Compliance bar (gradient simulation)
  const complianceWidth = (site.compliance / 100) * barWidth;
  let barColor: [number, number, number];
  if (site.compliance >= 80) {
    barColor = [16, 185, 129]; // green
  } else if (site.compliance >= 60) {
    barColor = [234, 179, 8]; // yellow
  } else {
    barColor = [239, 68, 68]; // red
  }
  
  pdf.setFillColor(...barColor);
  pdf.roundedRect(barX, yPosition - 8, complianceWidth, barHeight, 6, 6, 'F');
  
  // Compliance percentage text
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 70, 90);
  pdf.text(`${site.compliance}%`, margin + 15, yPosition);
  
  yPosition += 35;

  // Critical Requirements Section
  if (site.criticalRequirements && site.criticalRequirements.length > 0) {
    checkPageBreak(150);
    
    pdf.setFillColor(40, 68, 151);
    pdf.roundedRect(margin, yPosition, contentWidth, 35, 8, 8, 'F');
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('Critical Requirements', margin + 15, yPosition + 22);
    
    yPosition += 50;
    
    site.criticalRequirements.forEach((req, index) => {
      checkPageBreak(35);
      
      // Requirement box
      pdf.setFillColor(250, 252, 255);
      pdf.roundedRect(margin, yPosition, contentWidth, 30, 6, 6, 'F');
      pdf.setDrawColor(200, 210, 230);
      pdf.setLineWidth(1);
      pdf.roundedRect(margin, yPosition, contentWidth, 30, 6, 6, 'S');
      
      // Requirement text
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 70, 90);
      const reqText = wrapText(req.text, contentWidth - 120, 10);
      pdf.text(reqText, margin + 10, yPosition + 12);
      
      // Points badge
      const pointsText = `${req.points > 0 ? '+' : ''}${req.points}`;
      const badgeWidth = 50;
      const badgeX = pageWidth - margin - badgeWidth - 10;
      
      const badgeColor: [number, number, number] = req.points >= 0 ? [16, 185, 129] : [239, 68, 68];
      pdf.setFillColor(...badgeColor);
      pdf.roundedRect(badgeX, yPosition + 7, badgeWidth, 16, 8, 8, 'F');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text(pointsText, badgeX + badgeWidth / 2, yPosition + 18, { align: 'center' });
      
      yPosition += 40;
    });
  }

  // Detailed Assessment Section
  if (site.detailedAssessment && site.detailedAssessment.length > 0) {
    checkPageBreak(100);
    
    pdf.setFillColor(40, 68, 151);
    pdf.roundedRect(margin, yPosition, contentWidth, 35, 8, 8, 'F');
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('Detailed Assessment', margin + 15, yPosition + 22);
    
    yPosition += 50;
    
    site.detailedAssessment.forEach((assessment, index) => {
      checkPageBreak(50);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 70, 90);
      
      // Bullet point
      pdf.setFillColor(40, 68, 151);
      pdf.circle(margin + 8, yPosition - 3, 2.5, 'F');
      
      const wrappedText = wrapText(assessment, contentWidth - 30, 10);
      pdf.text(wrappedText, margin + 20, yPosition);
      
      yPosition += wrappedText.length * 14 + 8;
    });
    
    yPosition += 15;
  }

  // Competitive Advantages Section
  if (site.competitiveAdvantages && site.competitiveAdvantages.length > 0) {
    checkPageBreak(100);
    
    pdf.setFillColor(16, 185, 129);
    pdf.roundedRect(margin, yPosition, contentWidth, 35, 8, 8, 'F');
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('Competitive Advantages', margin + 15, yPosition + 22);
    
    yPosition += 50;
    
    site.competitiveAdvantages.forEach((advantage, index) => {
      checkPageBreak(40);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 70, 90);
      
      // Green checkmark bullet
      pdf.setFillColor(16, 185, 129);
      pdf.circle(margin + 8, yPosition - 3, 2.5, 'F');
      
      const wrappedText = wrapText(advantage, contentWidth - 30, 10);
      pdf.text(wrappedText, margin + 20, yPosition);
      
      yPosition += wrappedText.length * 14 + 8;
    });
    
    yPosition += 15;
  }

  // Risk Factors Section
  if (site.riskFactors && site.riskFactors.length > 0) {
    checkPageBreak(100);
    
    pdf.setFillColor(239, 68, 68);
    pdf.roundedRect(margin, yPosition, contentWidth, 35, 8, 8, 'F');
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('Risk Factors', margin + 15, yPosition + 22);
    
    yPosition += 50;
    
    site.riskFactors.forEach((risk, index) => {
      checkPageBreak(40);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 70, 90);
      
      // Red warning bullet
      pdf.setFillColor(239, 68, 68);
      pdf.circle(margin + 8, yPosition - 3, 2.5, 'F');
      
      const wrappedText = wrapText(risk, contentWidth - 30, 10);
      pdf.text(wrappedText, margin + 20, yPosition);
      
      yPosition += wrappedText.length * 14 + 8;
    });
    
    yPosition += 15;
  }

  // Recommendation Section
  checkPageBreak(150);
  
  pdf.setFillColor(240, 245, 255);
  pdf.roundedRect(margin, yPosition, contentWidth, 120, 8, 8, 'F');
  
  yPosition += 20;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(40, 68, 151);
  pdf.text('Site Selection Recommendation', margin + 15, yPosition);
  
  yPosition += 25;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(60, 70, 90);
  pdf.text('Action:', margin + 15, yPosition);
  
  pdf.setFont('helvetica', 'normal');
  const actionText = wrapText(site.recommendation.action, contentWidth - 30, 11);
  pdf.text(actionText, margin + 15, yPosition + 15);
  
  yPosition += actionText.length * 13 + 25;
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Next Steps:', margin + 15, yPosition);
  
  pdf.setFont('helvetica', 'normal');
  const nextStepsText = wrapText(site.recommendation.nextSteps, contentWidth - 30, 11);
  pdf.text(nextStepsText, margin + 15, yPosition + 15);

  // Add footer to last page
  addFooter();

  // Save the PDF
  const fileName = `Site_Detail_Report_${site.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
