import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate submission
    console.log('Feedback submitted:', formData);
    
    setIsSubmitted(true);
    
    toast.success('Feedback Submitted', {
      description: 'Thank you for your valuable feedback!'
    });
    
    // Reset after 2 seconds
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        message: ''
      });
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSubmitted(false);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#284497] to-[#35bdd4] shadow-2xl hover:shadow-3xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group"
        aria-label="Open Feedback"
      >
        <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#40b54d] rounded-full animate-pulse" />
      </motion.button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />

            {/* Feedback Panel */}
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[480px] bg-white/95 backdrop-blur-xl shadow-2xl z-[70] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8d] p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold">Share Your Feedback</h2>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-white/90">
                  Help us enhance the Golden Site Profile assessment with your insights.
                </p>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto h-[calc(100vh-140px)]">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-[#061e47]">
                        Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="border-gray-300 focus:border-[#35bdd4] focus:ring-[#35bdd4]"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-[#061e47]">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="border-gray-300 focus:border-[#35bdd4] focus:ring-[#35bdd4]"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium text-[#061e47]">
                        Your Feedback <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Share your thoughts, suggestions, or report an issue..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={8}
                        className="border-gray-300 focus:border-[#35bdd4] focus:ring-[#35bdd4] resize-none"
                      />
                      <p className="text-xs text-gray-500">
                        Be as specific as possible to help us address your feedback effectively
                      </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-xs text-gray-700">
                        <strong className="text-[#284497]">Note:</strong> Your feedback will be reviewed by our product team. 
                        We may reach out via email if we need additional information.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-[#1e3a5f] to-[#2c5f8d] hover:from-[#142842] hover:to-[#234a6f] text-white transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Submit Feedback
                    </Button>
                  </form>
                ) : (
                  /* Success State */
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full space-y-4"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#061e47]">Thank You!</h3>
                    <p className="text-center text-gray-600 max-w-sm">
                      Your feedback has been successfully submitted. We appreciate you taking the time to help us improve.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}