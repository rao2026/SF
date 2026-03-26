import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Sparkles, X, FileText, ChevronDown, ChevronUp, Edit3, AlignLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

interface FormData {
  protocolNumber: string;
  studyName: string;
  therapeuticArea: string;
  studyDetails: string;
  inclusionCriteria: string;
  exclusionCriteria: string;
}

interface ProtocolInputAccordionProps {
  // Upload state
  protocolDoc: File | null;
  setProtocolDoc: (file: File | null) => void;
  feasibilityDoc: File | null;
  setFeasibilityDoc: (file: File | null) => void;
  isUploadingProtocol: boolean;
  protocolUploadProgress: number;
  isUploadingFeasibility: boolean;
  feasibilityUploadProgress: number;
  handleProtocolFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFeasibilityFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  // Form state
  formData: FormData;
  setFormData: (data: FormData) => void;
  
  // Accordion state
  activeInputMethod: 'upload' | 'form';
  setActiveInputMethod: (method: 'upload' | 'form') => void;
  
  // Submit handler
  onSubmit: () => void;
}

const therapeuticAreas = [
  'Oncology',
  'Cardiovascular',
  'Neurology',
  'Respiratory',
  'Endocrinology',
  'Immunology',
  'Infectious Disease',
  'Dermatology',
  'Gastroenterology',
  'Rheumatology',
  'Other'
];

export function ProtocolInputAccordion({
  protocolDoc,
  setProtocolDoc,
  feasibilityDoc,
  setFeasibilityDoc,
  isUploadingProtocol,
  protocolUploadProgress,
  isUploadingFeasibility,
  feasibilityUploadProgress,
  handleProtocolFileChange,
  handleFeasibilityFileChange,
  formData,
  setFormData,
  activeInputMethod,
  setActiveInputMethod,
  onSubmit
}: ProtocolInputAccordionProps) {
  
  // Check if form has all required fields filled
  const isFormComplete = 
    formData.protocolNumber.trim() !== '' &&
    formData.studyName.trim() !== '' &&
    formData.therapeuticArea.trim() !== '' &&
    formData.studyDetails.trim() !== '' &&
    formData.inclusionCriteria.trim() !== '' &&
    formData.exclusionCriteria.trim() !== '';
  
  // Check if upload has at least one document
  const hasUploadedDocs = protocolDoc !== null || feasibilityDoc !== null;
  
  // Enable submit if either form is complete OR at least one document is uploaded
  const isSubmitDisabled = !isFormComplete && !hasUploadedDocs;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-6 space-y-4 sticky top-8">
      {/* Card Title */}
      <div className="border-b border-gray-200 pb-3">
        <h3 className="text-lg font-semibold text-[#061e47]">Protocol Input</h3>
        <p className="text-sm text-gray-600 mt-1">Upload protocol documents or fill the form manually.</p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setActiveInputMethod('upload')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
            activeInputMethod === 'upload'
              ? 'bg-white text-[#284497] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Upload Documents</span>
          </div>
        </button>
        <button
          onClick={() => setActiveInputMethod('form')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
            activeInputMethod === 'form'
              ? 'bg-white text-[#284497] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Edit3 className="h-4 w-4" />
            <span>Fill the Form</span>
          </div>
        </button>
      </div>

      {/* Upload Section Content */}
      {activeInputMethod === 'upload' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {/* Protocol Document */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-[#061e47]">
                Protocol Document
              </Label>
              {!protocolDoc && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs border-gray-300 text-gray-700 hover:bg-[#284497] hover:text-white hover:border-[#284497] transition-all"
                  type="button"
                  onClick={() => document.getElementById('protocolFile')?.click()}
                >
                  Select File
                </Button>
              )}
            </div>
            
            {isUploadingProtocol ? (
              <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#284497] to-[#35bdd4] transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${protocolUploadProgress}%` }}
                ></div>
              </div>
            ) : protocolDoc ? (
              <div className="flex items-center justify-between p-2 bg-blue-50/50 rounded-md border border-blue-200/60">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="h-3.5 w-3.5 text-[#284497] flex-shrink-0" />
                  <span className="text-xs text-[#061e47] truncate">{protocolDoc.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-5 w-5 p-0"
                  onClick={() => {
                    setProtocolDoc(null);
                    const fileInput = document.getElementById('protocolFile') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : null}
            
            <input
              id="protocolFile"
              type="file"
              accept=".pdf,.doc,.docx,.xlsx,.xls"
              className="hidden"
              onChange={handleProtocolFileChange}
            />
          </div>

          {/* Feasibility Questionnaire */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-[#061e47]">
                Feasibility Questionnaire
              </Label>
              {!feasibilityDoc && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs border-gray-300 text-gray-700 hover:bg-[#284497] hover:text-white hover:border-[#284497] transition-all"
                  type="button"
                  onClick={() => document.getElementById('feasibilityFile')?.click()}
                >
                  Select File
                </Button>
              )}
            </div>
            
            {isUploadingFeasibility ? (
              <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#284497] to-[#35bdd4] transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${feasibilityUploadProgress}%` }}
                ></div>
              </div>
            ) : feasibilityDoc ? (
              <div className="flex items-center justify-between p-2 bg-blue-50/50 rounded-md border border-blue-200/60">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="h-3.5 w-3.5 text-[#284497] flex-shrink-0" />
                  <span className="text-xs text-[#061e47] truncate">{feasibilityDoc.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-5 w-5 p-0"
                  onClick={() => {
                    setFeasibilityDoc(null);
                    const fileInput = document.getElementById('feasibilityFile') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : null}
            
            <input
              id="feasibilityFile"
              type="file"
              accept=".pdf,.doc,.docx,.xlsx,.xls"
              className="hidden"
              onChange={handleFeasibilityFileChange}
            />
          </div>

          {/* File Format Support Text */}
          <p className="text-xs text-gray-500 pt-1">
            Supports: pdf, doc, docx, xls, xlsx
          </p>
        </motion.div>
      )}

      {/* Form Section Content */}
      {activeInputMethod === 'form' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar"
        >
          {/* Protocol Number and Therapeutic Area - Side by Side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Protocol Number */}
            <div className="space-y-1">
              <Label className="text-xs font-medium text-[#061e47]">
                Protocol Number <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g., NCT05165485"
                value={formData.protocolNumber}
                onChange={(e) => setFormData({ ...formData, protocolNumber: e.target.value })}
                className="h-8 text-sm placeholder:text-sm placeholder:text-gray-400 bg-white border-gray-300/80 focus:border-[#284497]/40 focus:ring-[0.5px] focus:ring-[#284497]/10 focus-visible:ring-[0.5px]"
              />
            </div>

            {/* Therapeutic Area */}
            <div className="space-y-1 relative">
              <Label className="text-xs font-medium text-[#061e47]">
                Therapeutic Area <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <select
                  value={formData.therapeuticArea}
                  onChange={(e) => setFormData({ ...formData, therapeuticArea: e.target.value })}
                  className="w-full h-8 rounded-md border border-gray-300/80 bg-white px-3 pr-8 text-sm focus:border-[#284497]/40 focus:ring-[0.5px] focus:ring-[#284497]/10 focus:ring-offset-0 outline-none appearance-none"
                  style={{ color: formData.therapeuticArea ? 'inherit' : '#9ca3af' }}
                >
                  <option value="" className="text-gray-400">Select a therapeutic area</option>
                  {therapeuticAreas.map((area) => (
                    <option key={area} value={area} className="text-gray-900">{area}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Study Name */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-[#061e47]">
              Study Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g., COPD Phase 4 Study"
              value={formData.studyName}
              onChange={(e) => setFormData({ ...formData, studyName: e.target.value })}
              className="h-8 text-sm placeholder:text-sm placeholder:text-gray-400 bg-white border-gray-300/80 focus:border-[#284497]/40 focus:ring-[0.5px] focus:ring-[#284497]/10 focus-visible:ring-[0.5px]"
            />
          </div>

          {/* Study Details */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-[#061e47]">
              Study Details <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Enter patient population, study design, assessments, and site readiness details"
              value={formData.studyDetails}
              onChange={(e) => setFormData({ ...formData, studyDetails: e.target.value })}
              className="h-[95px] resize-none text-sm placeholder:text-sm placeholder:text-gray-400 border-gray-300/80 focus:border-[#284497]/40 focus:ring-[0.5px] focus:ring-[#284497]/10"
            />
          </div>

          {/* Inclusion Criteria */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-[#061e47]">
              Inclusion Criteria <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Enter inclusion criteria..."
              value={formData.inclusionCriteria}
              onChange={(e) => setFormData({ ...formData, inclusionCriteria: e.target.value })}
              className="h-[80px] resize-none text-sm placeholder:text-sm placeholder:text-gray-400 border-gray-300/80 focus:border-[#284497]/40 focus:ring-[0.5px] focus:ring-[#284497]/10"
            />
          </div>

          {/* Exclusion Criteria */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-[#061e47]">
              Exclusion Criteria <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Enter exclusion criteria..."
              value={formData.exclusionCriteria}
              onChange={(e) => setFormData({ ...formData, exclusionCriteria: e.target.value })}
              className="h-[80px] resize-none text-sm placeholder:text-sm placeholder:text-gray-400 border-gray-300/80 focus:border-[#284497]/40 focus:ring-[0.5px] focus:ring-[#284497]/10"
            />
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <Button
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        className="w-full h-10 bg-gradient-to-r from-[#284497] to-[#35bdd4] hover:from-[#1e3a5f] hover:to-[#2c8fa3] text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Begin Analysis
      </Button>
    </div>
  );
}