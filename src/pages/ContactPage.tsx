import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  message?: string;
  submit?: string;
}

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleBackToHome = () => {
    navigate('/', { replace: true });
    // Restore scroll position after navigation
    setTimeout(() => {
      const savedScrollPosition = sessionStorage.getItem('scrollPosition');
      if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        sessionStorage.removeItem('scrollPosition');
      }
    }, 50);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 500) {
      newErrors.message = 'Message must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle message character limit
    if (name === 'message' && value.length > 500) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Clear submit error when user makes changes
    if (errors.submit) {
      setErrors(prev => ({
        ...prev,
        submit: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitSuccess(false);
    setErrors({});
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
        setSubmitSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        setErrors({ submit: result.error || 'Sorry, there was an error sending your message. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Sorry, there was an error sending your message. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={handleBackToHome}
          className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full font-medium hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>
      </div>

      {/* Left Side - Dark Design */}
      <motion.div 
        className="w-1/2 bg-gray-900 relative overflow-hidden flex items-center justify-center"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Geometric Pattern Background */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 400 600" fill="none">
            {/* Overlapping circles pattern */}
            <circle cx="100" cy="150" r="80" stroke="rgba(255,215,0,0.1)" strokeWidth="2" fill="none" />
            <circle cx="200" cy="150" r="80" stroke="rgba(255,215,0,0.15)" strokeWidth="2" fill="none" strokeDasharray="5,5" />
            <circle cx="300" cy="150" r="80" stroke="rgba(255,215,0,0.1)" strokeWidth="2" fill="none" />
            
            <circle cx="150" cy="250" r="80" stroke="rgba(255,215,0,0.08)" strokeWidth="2" fill="none" />
            <circle cx="250" cy="250" r="80" stroke="rgba(255,215,0,0.12)" strokeWidth="2" fill="none" strokeDasharray="10,5" />
            
            <circle cx="100" cy="350" r="80" stroke="rgba(255,215,0,0.1)" strokeWidth="2" fill="none" />
            <circle cx="200" cy="350" r="80" stroke="rgba(255,215,0,0.15)" strokeWidth="2" fill="none" />
            <circle cx="300" cy="350" r="80" stroke="rgba(255,215,0,0.1)" strokeWidth="2" fill="none" strokeDasharray="3,7" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          <motion.h1 
            className="text-5xl font-bold text-white mb-6 leading-tight"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            We'd love to
            <br />
            hear from you
          </motion.h1>
          
          <motion.div 
            className="w-24 h-1 bg-[#FFD700] mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
        </div>

        {/* Logo in bottom left */}
        <div className="absolute bottom-8 left-8">
          <img src="/images/icon.png" alt="MADS Logo" className="w-8 h-8 opacity-60" />
        </div>
      </motion.div>

      {/* Right Side - Contact Form */}
      <motion.div 
        className="w-1/2 bg-white flex items-center justify-center p-12"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="w-full max-w-md">
          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact</h2>
            <p className="text-[#E8A87C] font-semibold text-sm tracking-wider uppercase">Get in touch</p>
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {/* Success Message */}
            {submitSuccess && submitMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{submitMessage}</span>
              </motion.div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>{errors.submit}</span>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FIRST NAME *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className={`w-full px-0 py-3 border-0 border-b-2 focus:outline-none bg-transparent text-gray-900 placeholder-gray-400 transition-colors duration-300 ${
                    errors.firstName ? 'border-red-300' : 'border-gray-200 focus:border-[#E8A87C]'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LAST NAME *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className={`w-full px-0 py-3 border-0 border-b-2 focus:outline-none bg-transparent text-gray-900 placeholder-gray-400 transition-colors duration-300 ${
                    errors.lastName ? 'border-red-300' : 'border-gray-200 focus:border-[#E8A87C]'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`w-full px-0 py-3 border-0 border-b-2 focus:outline-none bg-transparent text-gray-900 placeholder-gray-400 transition-colors duration-300 ${
                    errors.email ? 'border-red-300' : 'border-gray-200 focus:border-[#E8A87C]'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PHONE NUMBER *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={`w-full px-0 py-3 border-0 border-b-2 focus:outline-none bg-transparent text-gray-900 placeholder-gray-400 transition-colors duration-300 ${
                    errors.phone ? 'border-red-300' : 'border-gray-200 focus:border-[#E8A87C]'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MESSAGE *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter your message (max 500 characters)"
                rows={4}
                className={`w-full px-0 py-3 border-0 border-b-2 focus:outline-none bg-transparent text-gray-900 placeholder-gray-400 resize-none transition-colors duration-300 ${
                  errors.message ? 'border-red-300' : 'border-gray-200 focus:border-[#E8A87C]'
                }`}
              />
              <div className="flex justify-between mt-1">
                {errors.message && (
                  <p className="text-sm text-red-600">{errors.message}</p>
                )}
                <p className={`text-sm ml-auto ${
                  formData.message.length >= 500 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {formData.message.length}/500 characters
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-10 py-4 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.form>

          {/* Contact Information */}
          <motion.div 
            className="mt-12 pt-8 border-t border-gray-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3 text-[#E8A87C]" />
                <span>Edmonton, Alberta, Canada</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-3 text-[#E8A87C]" />
                <a href="tel:+17802784283" className="hover:text-gray-900 transition-colors">
                  +1 (780) 278-4283
                </a>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-3 text-[#E8A87C]" />
                <a href="mailto:info@multiagentdronesystems.com" className="hover:text-gray-900 transition-colors">
                  info@multiagentdronesystems.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;