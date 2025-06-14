import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
    <section id="faq" className="relative z-20 bg-white">
      <div className="relative min-h-screen flex">
        {/* Background Image Section - Left Side */}
        <div className="w-1/3 min-h-screen relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-6xl lg:text-8xl font-bold text-white/10 tracking-wider">FAQ</h3>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5"></div>
          </div>
        </div>

        {/* Content Section - Right Side */}
        <div className="w-2/3 px-6 py-12 lg:py-20 lg:px-16 flex items-center">
          <div className="max-w-5xl w-full">
            <div className="mb-12">
              <p className="text-[#E8A87C] text-sm font-semibold tracking-wider mb-3">FAQ</p>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Find answers to common questions about our multi-agent drone systems</p>
            </div>

            <div className="space-y-4">
              {faqData.map((item: FAQ, index: number) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-8 py-5 text-left flex items-center justify-between focus:outline-none hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-lg font-semibold text-gray-900 pr-6 leading-tight">{item.question}</span>
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
                    <p className="px-8 pb-5 text-gray-600 bg-white leading-relaxed">{item.answer}</p>
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