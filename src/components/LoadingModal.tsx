import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
  bodyOnly?: boolean; // New prop to mask only body area (not header)
}

export function LoadingModal({ isOpen, message = 'Processing your request', bodyOnly = false }: LoadingModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={bodyOnly ? "fixed left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-50" : "fixed inset-0 bg-black/20 backdrop-blur-sm z-50"}
            style={bodyOnly ? { top: '80px' } : undefined}
          />
          
          {/* Modal - always fixed to center on viewport */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="pointer-events-auto"
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-8 min-w-[400px]">
                <div className="flex flex-col items-center gap-6">
                  {/* Spinner */}
                  <div className="relative">
                    {/* Outer ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                      className="w-20 h-20 rounded-full border-4 border-gray-200"
                      style={{
                        borderTopColor: '#284497',
                        borderRightColor: '#35bdd4',
                      }}
                    />
                    
                    {/* Inner circle */}
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="absolute inset-2 rounded-full bg-gradient-to-br from-[#284497]/10 to-[#35bdd4]/10"
                    />
                    
                    {/* Center icon */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Loader2 className="h-8 w-8 text-[#284497]" />
                    </motion.div>
                  </div>
                  
                  {/* Message */}
                  <div className="text-center space-y-2">
                    <h3 className="text-xl text-[#061e47]">{message}</h3>
                    <p className="text-sm text-gray-500">
                      {message.includes('Scorecard') 
                        ? 'Analyzing site data and generating scorecards...' 
                        : 'Please wait while we prepare your data...'}
                    </p>
                  </div>
                  
                  {/* Loading dots animation */}
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                        className="w-2 h-2 rounded-full bg-[#284497]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}