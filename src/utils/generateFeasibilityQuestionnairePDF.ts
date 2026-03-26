import jsPDF from 'jspdf';

interface FQQuestion {
  id: string;
  question: string;
  isCommon: boolean;
}

interface FQSection {
  id: string;
  title: string;
  questions: FQQuestion[];
}

interface FQResponse {
  questionId: string;
  siteId: string;
  response: string;
}

interface Site {
  id: string;
  name: string;
  address?: string;
  siteCode?: string;
}

export const generateFeasibilityQuestionnairePDF = (
  sites: Site[],
  sections: FQSection[],
  responses: FQResponse[],
  protocolNumber: string = 'NCT05165485'
) => {
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
    // Header background
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
    pdf.text('Feasibility Questionnaire', pageWidth / 2, 45, { align: 'center' });
    
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

  // Helper to get response for a question and site
  const getResponse = (questionId: string, siteId: string): string => {
    const response = responses.find(r => r.questionId === questionId && r.siteId === siteId);
    return response?.response || 'No response provided';
  };

  // Add first page header
  addHeader();
  yPosition = 130;

  // Sites included section
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(40, 68, 151);
  pdf.setFontSize(16);
  pdf.text('Sites Included in This Report', margin, yPosition);
  yPosition += 25;

  sites.forEach((site, index) => {
    checkPageBreak(25);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(50, 60, 80);
    pdf.text(`${index + 1}. ${site.name}${site.siteCode ? ` (${site.siteCode})` : ''}`, margin + 15, yPosition);
    yPosition += 18;
  });

  yPosition += 20;

  // Loop through each section
  sections.forEach((section) => {
    checkPageBreak(80);

    // Section title
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(40, 68, 151);
    pdf.setFontSize(18);
    pdf.text(section.title, margin, yPosition);
    
    // Decorative underline
    pdf.setDrawColor(40, 68, 151);
    pdf.setLineWidth(2);
    pdf.line(margin, yPosition + 5, margin + 180, yPosition + 5);
    
    yPosition += 35;

    // Loop through questions in this section
    section.questions.forEach((question) => {
      checkPageBreak(100);

      // Question box
      pdf.setFillColor(245, 248, 255);
      pdf.roundedRect(margin, yPosition, contentWidth, 20, 4, 4, 'F');
      
      // Question label
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(40, 68, 151);
      const questionLabel = question.isCommon ? 'COMMON QUESTION' : 'SITE-SPECIFIC QUESTION';
      pdf.text(questionLabel, margin + 10, yPosition + 14);
      yPosition += 28;

      // Question text
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(30, 40, 60);
      const wrappedQuestion = wrapText(question.question, contentWidth - 20, 11);
      pdf.text(wrappedQuestion, margin + 10, yPosition);
      yPosition += wrappedQuestion.length * 14 + 15;

      // Responses
      if (question.isCommon) {
        // Common question - single response for all sites
        checkPageBreak(80);
        const response = getResponse(question.id, 'all');
        
        pdf.setFillColor(250, 252, 255);
        pdf.setDrawColor(200, 210, 230);
        pdf.setLineWidth(0.5);
        
        const wrappedResponse = wrapText(response, contentWidth - 30, 9);
        const responseHeight = Math.max(wrappedResponse.length * 12 + 20, 40);
        
        pdf.roundedRect(margin + 10, yPosition, contentWidth - 20, responseHeight, 4, 4, 'FD');
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(50, 60, 80);
        pdf.text(wrappedResponse, margin + 20, yPosition + 15);
        yPosition += responseHeight + 10;
      } else {
        // Site-specific question - response for each site
        sites.forEach((site) => {
          checkPageBreak(80);
          
          const response = getResponse(question.id, site.id);
          
          // Site name badge
          pdf.setFillColor(240, 245, 255);
          pdf.roundedRect(margin + 10, yPosition, contentWidth - 20, 18, 4, 4, 'F');
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(40, 68, 151);
          pdf.text(site.name, margin + 20, yPosition + 12);
          yPosition += 24;
          
          // Response
          pdf.setFillColor(250, 252, 255);
          pdf.setDrawColor(200, 210, 230);
          pdf.setLineWidth(0.5);
          
          const wrappedResponse = wrapText(response, contentWidth - 30, 9);
          const responseHeight = Math.max(wrappedResponse.length * 12 + 20, 40);
          
          pdf.roundedRect(margin + 10, yPosition, contentWidth - 20, responseHeight, 4, 4, 'FD');
          
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(50, 60, 80);
          pdf.text(wrappedResponse, margin + 20, yPosition + 15);
          yPosition += responseHeight + 10;
        });
      }

      yPosition += 15;
    });

    yPosition += 25;
  });

  // Add footer to last page
  addFooter();

  // Save the PDF
  const sitesText = sites.length === 1 ? sites[0].name.replace(/[^a-zA-Z0-9]/g, '-') : `${sites.length}-Sites`;
  pdf.save(`Feasibility-Questionnaire-${sitesText}-${new Date().toISOString().split('T')[0]}.pdf`);
};
