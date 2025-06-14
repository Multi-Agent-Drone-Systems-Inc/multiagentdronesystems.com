import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

const validateFormData = (data: ContactFormData): string[] => {
  const errors: string[] = [];

  if (!data.firstName?.trim()) {
    errors.push('First name is required');
  }

  if (!data.lastName?.trim()) {
    errors.push('Last name is required');
  }

  if (!data.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.phone?.trim()) {
    errors.push('Phone number is required');
  }

  if (!data.message?.trim()) {
    errors.push('Message is required');
  } else if (data.message.length > 500) {
    errors.push('Message must be 500 characters or less');
  }

  return errors;
};

const saveContactToDatabase = async (formData: ContactFormData): Promise<boolean> => {
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert contact form data into the contact table
    const { error } = await supabase
      .from('contact')
      .insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Database error:', error);
      return false;
    }

    console.log('Contact form data saved to database successfully');
    return true;
  } catch (error) {
    console.error('Error saving to database:', error);
    return false;
  }
};

const sendEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    // Create email content
    const emailContent = `
New Contact Form Submission

From: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}

Message:
${formData.message}

Submitted at: ${new Date().toISOString()}
    `.trim();

    // For production, you would integrate with an email service like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Postmark
    
    // Example with Resend (you would need to add your API key):
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
        subject: `New Contact Form Submission from ${formData.firstName} ${formData.lastName}`,
        text: emailContent,
      }),
    });

    return response.ok;
    */

    // For now, we'll just log the email content
    console.log('Email would be sent with content:', emailContent);
    
    // Simulate email sending success
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

Deno.serve(async (req) => {
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

    const formData: ContactFormData = await req.json();

    // Validate form data
    const validationErrors = validateFormData(formData);
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

    // Save to database
    const savedToDatabase = await saveContactToDatabase(formData);
    
    if (!savedToDatabase) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to save your message. Please try again later.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Send email (optional - can be disabled if you only want database storage)
    const emailSent = await sendEmail(formData);
    
    // Log successful submission
    console.log('Contact form submission processed successfully:', {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      savedToDatabase,
      emailSent,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Your message has been sent successfully. We\'ll get back to you soon!'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error processing contact form:', error);
    
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