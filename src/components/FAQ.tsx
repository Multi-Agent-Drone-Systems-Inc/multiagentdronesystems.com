import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { useFAQ } from '../hooks/useSupabaseData';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  is_active: boolean;
  order: number;
}

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const { data: faqData, isLoading, error } = useFAQ();

  const toggleItem = (index: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <section id="faq" className="relative z-20 bg-white">
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading FAQ...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="faq" className="relative z-20 bg-white">
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (faqData.length === 0) {
    return (
      <section id="faq" className="relative z-20 bg-white">
        <div className="relative min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">No FAQ items available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="faq" className="relative z-40 bg-white -mt-20 pt-20 pb-32">
      <div className="relative min-h-screen flex">
        {/* Background Image Section - Left Side */}
        <div className="w-1/3 min-h-screen relative overflow-hidden hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
            {/* Animated FAQ Elements */}
            <div className="absolute inset-0">
              {/* Large Question Mark - Center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-white/5 text-[200px] font-bold animate-pulse">?</div>
              </div>
              
              {/* Floating Help Icons */}
              <div className="absolute top-20 left-8 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                <HelpCircle className="w-8 h-8 text-white/10" />
              </div>
              
              <div className="absolute top-32 right-12 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
                <MessageCircle className="w-6 h-6 text-white/8" />
              </div>
              
              <div className="absolute top-48 left-16 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
                <Info className="w-7 h-7 text-white/12" />
              </div>
              
              <div className="absolute bottom-32 right-8 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}>
                <AlertCircle className="w-5 h-5 text-white/9" />
              </div>
              
              <div className="absolute bottom-48 left-12 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.8s' }}>
                <CheckCircle className="w-6 h-6 text-white/11" />
              </div>
              
              <div className="absolute top-64 right-20 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '4.2s' }}>
                <HelpCircle className="w-4 h-4 text-white/7" />
              </div>
              
              {/* Floating Question Marks */}
              <div className="absolute top-16 right-6 text-white/8 text-2xl font-bold animate-pulse" style={{ animationDelay: '0s' }}>?</div>
              <div className="absolute top-40 left-6 text-white/6 text-xl font-bold animate-pulse" style={{ animationDelay: '1s' }}>?</div>
              <div className="absolute bottom-20 right-16 text-white/10 text-3xl font-bold animate-pulse" style={{ animationDelay: '2s' }}>?</div>
              <div className="absolute bottom-40 left-20 text-white/7 text-lg font-bold animate-pulse" style={{ animationDelay: '1.5s' }}>?</div>
              <div className="absolute top-72 left-4 text-white/9 text-2xl font-bold animate-pulse" style={{ animationDelay: '0.8s' }}>?</div>
              
              {/* Orbiting Elements */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <MessageCircle className="w-4 h-4 text-white/8" />
                    </div>
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <Info className="w-5 h-5 text-white/6" />
                    </div>
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '30s' }}>
                    <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <HelpCircle className="w-3 h-3 text-white/10" />
                    </div>
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '35s', animationDirection: 'reverse' }}>
                    <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
                      <CheckCircle className="w-4 h-4 text-white/7" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pulsing Dots */}
              <div className="absolute top-24 left-24 w-2 h-2 bg-white/10 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-56 right-24 w-1 h-1 bg-white/8 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-24 left-32 w-3 h-3 bg-white/6 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-56 right-32 w-1.5 h-1.5 bg-white/9 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
              
              {/* Subtle Grid Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                      radial-gradient(circle at 75% 75%, white 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    backgroundPosition: '0 0, 25px 25px'
                  }}
                ></div>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-6xl lg:text-8xl font-bold text-white/10 tracking-wider">FAQ</h3>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5"></div>
          </div>
        </div>

        {/* Content Section - Right Side */}
        <div className="w-full md:w-2/3 px-6 py-12 lg:py-20 lg:px-16 flex items-center">
          <div className="max-w-5xl w-full">
            <div className="mb-8 md:mb-12">
              <p className="text-[#E8A87C] text-sm font-semibold tracking-wider mb-3">FAQ</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Find answers to common questions about our multi-agent drone systems</p>
            </div>

            <div className="space-y-4 pb-8 md:pb-0">
              {faqData.map((item: FAQ, index: number) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100 mb-4"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-4 md:px-8 py-4 md:py-5 text-left flex items-center justify-between focus:outline-none hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-base md:text-lg font-semibold text-gray-900 pr-4 md:pr-6 leading-tight">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ml-4 ${
                        openItems.has(index) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      openItems.has(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <p className="px-4 md:px-8 pb-4 md:pb-5 text-gray-600 bg-white leading-relaxed text-sm md:text-base">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;