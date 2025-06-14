import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApplicationData {
  positionId: string;
  positionTitle: string;
  applicantName: string;
  applicantEmail: string;
  resumeUrl: string;
  coverLetterUrl?: string;
}

const validateApplicationData = (data: ApplicationData): string[] => {
  const errors: string[] = [];

  if (!data.positionId || !String(data.positionId).trim()) {
    errors.push('Position ID is required');
  }

  if (!data.positionTitle || !String(data.positionTitle).trim()) {
    errors.push('Position title is required');
  }

  if (!data.applicantName || !String(data.applicantName).trim()) {
    errors.push('Applicant name is required');
  }

  if (!data.applicantEmail || !String(data.applicantEmail).trim()) {
    errors.push('Applicant email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.applicantEmail))) {
    errors.push('Invalid email format');
  }

  if (!data.resumeUrl || !String(data.resumeUrl).trim()) {
    errors.push('Resume URL is required');
  }

  return errors;
};

const sendApplicationEmail = async (applicationData: ApplicationData): Promise<boolean> => {
  try {
    // Create email content
    const emailContent = `
New Job Application Received

Position: ${applicationData.positionTitle}
Position ID: ${applicationData.positionId}

Applicant Details:
Name: ${applicationData.applicantName}
Email: ${applicationData.applicantEmail}

Documents:
Resume: ${applicationData.resumeUrl}
${applicationData.coverLetterUrl ? `Cover Letter: ${applicationData.coverLetterUrl}` : 'Cover Letter: Not provided'}

Application submitted at: ${new Date().toISOString()}

Please review the application and contact the candidate if suitable for the position.
    `.trim();

    // For production, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Postmark
    
    // Example with Resend (you would need to add your API key to environment variables):
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@multiagentdronesystems.com',
        to: 'info@multiagentdronesystems.com',
        subject: `New Job Application: ${applicationData.positionTitle} - ${applicationData.applicantName}`,
        text: emailContent,
        attachments: [
          {
            filename: 'resume.pdf',
            content: applicationData.resumeUrl,
          },
          ...(applicationData.coverLetterUrl ? [{
            filename: 'cover_letter.pdf',
            content: applicationData.coverLetterUrl,
          }] : [])
        ]
      }),
    });

    return response.ok;
    */

    // For now, we'll just log the email content
    console.log('Application email would be sent with content:', emailContent);
    
    // Simulate email sending success
    return true;
  } catch (error) {
    console.error('Error sending application email:', error);
    return false;
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Method not allowed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 405,
        }
      );
    }

    const applicationData: ApplicationData = await req.json();

    // Validate application data
    const validationErrors = validateApplicationData(applicationData);
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: validationErrors.join(', ')
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Send application email
    const emailSent = await sendApplicationEmail(applicationData);
    
    if (!emailSent) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to submit application. Please try again later.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Log successful application submission
    console.log('Job application processed successfully:', {
      position: applicationData.positionTitle,
      applicant: applicationData.applicantName,
      email: applicationData.applicantEmail,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Your application has been submitted successfully. We\'ll review it and get back to you soon!'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error processing job application:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})