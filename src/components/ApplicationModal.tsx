import React, { useState } from 'react';
import { X, Upload, AlertCircle, User, Mail, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  positionId: string;
  positionTitle: string;
}

interface FormData {
  name: string;
  email: string;
  resume: File | null;
  coverLetter: File | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  resume?: string;
  coverLetter?: string;
  submit?: string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  positionId,
  positionTitle
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    resume: null,
    coverLetter: null
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Resume validation
    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    } else if (formData.resume.type !== 'application/pdf') {
      newErrors.resume = 'Resume must be a PDF file';
    } else if (formData.resume.size > 5 * 1024 * 1024) { // 5MB limit
      newErrors.resume = 'Resume file size must be less than 5MB';
    }

    // Cover letter validation (optional)
    if (formData.coverLetter) {
      if (formData.coverLetter.type !== 'application/pdf') {
        newErrors.coverLetter = 'Cover letter must be a PDF file';
      } else if (formData.coverLetter.size > 5 * 1024 * 1024) { // 5MB limit
        newErrors.coverLetter = 'Cover letter file size must be less than 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // Clear submit error when user makes changes
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'resume' | 'coverLetter') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [fileType]: file }));

    // Clear file error when user selects a file
    if (errors[fileType]) {
      setErrors(prev => ({ ...prev, [fileType]: undefined }));
    }

    // Clear submit error when user makes changes
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: undefined }));
    }
  };

  const uploadFile = async (file: File, fileName: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from('mads-website')
        .upload(`applications/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('File upload error:', error);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('mads-website')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
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
      // Generate unique file names
      const timestamp = Date.now();
      const resumeFileName = `${positionId}/${timestamp}_${formData.name.replace(/\s+/g, '_')}_resume.pdf`;
      const coverLetterFileName = formData.coverLetter 
        ? `${positionId}/${timestamp}_${formData.name.replace(/\s+/g, '_')}_cover_letter.pdf`
        : null;

      // Upload resume
      const resumeUrl = await uploadFile(formData.resume!, resumeFileName);
      if (!resumeUrl) {
        setErrors({ submit: 'Failed to upload resume. Please try again.' });
        return;
      }

      // Upload cover letter if provided
      let coverLetterUrl = null;
      if (formData.coverLetter && coverLetterFileName) {
        coverLetterUrl = await uploadFile(formData.coverLetter, coverLetterFileName);
        if (!coverLetterUrl) {
          setErrors({ submit: 'Failed to upload cover letter. Please try again.' });
          return;
        }
      }

      // Submit application via Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          positionId,
          positionTitle,
          applicantName: formData.name,
          applicantEmail: formData.email,
          resumeUrl,
          coverLetterUrl
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage('Your application has been submitted successfully! We\'ll review it and get back to you soon.');
        setSubmitSuccess(true);
        setShowConfirmation(true);
        
        // Reset form
        setFormData({
          name: user?.user_metadata?.full_name || '',
          email: user?.email || '',
          resume: null,
          coverLetter: null
        });

      } else {
        setErrors({ submit: result.error || 'Failed to submit application. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors({ submit: 'An unexpected error occurred. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setErrors({});
      setSubmitMessage('');
      setSubmitSuccess(false);
      setShowConfirmation(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 relative rounded-t-2xl">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                {showConfirmation ? 'Application Submitted' : 'Apply for Position'}
              </h2>
              <p className="text-white/70 text-sm mt-1">
                {showConfirmation ? 'Thank you for your interest' : positionTitle}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            {/* Confirmation View */}
            {showConfirmation ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Application Submitted Successfully!</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Thank you for applying to the <strong>{positionTitle}</strong> position. 
                  We've received your application and will review it carefully. 
                  We'll get back to you soon with next steps.
                </p>
                <button
                  onClick={handleClose}
                  className="bg-gray-900 text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <>
                {/* Success Message */}
                {submitSuccess && submitMessage && !showConfirmation && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-start gap-2"
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
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2"
                  >
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{errors.submit}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 transition-colors ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 transition-colors ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume * (PDF only, max 5MB)
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      errors.resume ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-600 mb-2">
                        {formData.resume ? formData.resume.name : 'Click to upload your resume'}
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, 'resume')}
                        className="hidden"
                        id="resume-upload"
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="resume-upload"
                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Choose File
                      </label>
                    </div>
                    {errors.resume && (
                      <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
                    )}
                  </div>

                  {/* Cover Letter Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter (Optional - PDF only, max 5MB)
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      errors.coverLetter ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-600 mb-2">
                        {formData.coverLetter ? formData.coverLetter.name : 'Click to upload your cover letter'}
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, 'coverLetter')}
                        className="hidden"
                        id="cover-letter-upload"
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor="cover-letter-upload"
                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Choose File
                      </label>
                    </div>
                    {errors.coverLetter && (
                      <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApplicationModal;