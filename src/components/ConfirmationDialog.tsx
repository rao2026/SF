import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'success' | 'info';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-6 w-6 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-[#284497]" />;
    }
  };

  const getIconBgColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50';
      case 'success':
        return 'bg-green-50';
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-200">
        {/* Icon and Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`${getIconBgColor()} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
            {getIcon()}
          </div>
          <h3 className="text-lg font-semibold text-[#061e47]">
            {title}
          </h3>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-4 py-2 text-sm"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm bg-[#284497] hover:bg-[#1e3a5f]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}