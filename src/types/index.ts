// Type definitions for Site Feasibility Dashboard

export interface ProtocolInput {
  studyTitle: string;
  studyPhase: string;
  therapeuticAreas: string[];
  primaryIndication: string;
  targetEnrollment: number;
  enrollmentDuration: string;
  targetStartDate: string;
  countries: string[];
  structuredStudyAskProfile: string;
  humanComprehensibleLabel: string;
  statusFlags: {
    study_ask_generated: boolean;
    missing_information: boolean;
    requires_review: boolean;
  };
  inclusionCriteria: string[];
  exclusionCriteria: string[];
}

export interface ProcessingProtocolSet {
  id: string;
  protocolDoc?: File | { name: string; file: File };
  feasibilityDoc?: File | { name: string; file: File };
  textInput?: string;
  formData?: {
    protocolNumber: string;
    studyType: string;
    therapeuticArea: string;
    studyDetails: string;
    inclusionCriteria: string;
    exclusionCriteria: string;
  };
  studyName?: string; // Study name for the protocol
  studyTitle?: string; // Study title from form submission
  studyPhase?: string; // Study phase from form submission
  therapeuticAreas?: string[]; // Therapeutic areas from form submission
  protocolProgress: number;
  feasibilityProgress: number;
  protocolStatus: 'uploading' | 'processing' | 'complete' | 'error' | 'pending';
  feasibilityStatus: 'uploading' | 'processing' | 'complete' | 'error' | 'pending';
  isComplete: boolean;
  addedAt: number;
}
