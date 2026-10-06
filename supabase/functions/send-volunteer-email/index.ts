const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_EMAIL = "DSC Society <volunteer@dscsociety.org>";
const ADMIN_EMAIL = "dscsociety.org@gmail.com";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Application = {
  full_name: string;
  email: string;
  phone: string;
  college?: string | null;
  interests?: string | null;
  message?: string | null;
  application_type?: string | null;
};

const jsonResponse = (
  body: Record<string, unknown>,
  status = 200
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: CORS_HEADERS,
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { error: "Method not allowed" },
      405
    );
  }

  try {
    const application = (await req.json()) as Application;

    if (!application.full_name || !application.email) {
      return jsonResponse(
        { error: "Name and email are required." },
        400
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured.");

      return jsonResponse(
        { error: "Email service is not configured." },
        500
      );
    }

    const applicationType =
      application.application_type || "Volunteer";

    const adminEmailHtml = `
      <h2>New DSC Society Application</h2>

      <p><strong>Application Type:</strong> ${applicationType}</p>
      <p><strong>Name:</strong> ${application.full_name}</p>
      <p><strong>Email:</strong> ${application.email}</p>
      <p><strong>Phone:</strong> ${application.phone || "Not provided"}</p>
      <p><strong>College:</strong> ${application.college || "Not provided"}</p>
      <p><strong>Interests:</strong> ${application.interests || "Not provided"}</p>
      <p><strong>Message:</strong> ${application.message || "Not provided"}</p>

      <hr />

      <p>This application has been saved in the DSC Society admin panel.</p>
    `;

    const adminResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        reply_to: application.email,
        subject: `New ${applicationType} Application - ${application.full_name}`,
        html: adminEmailHtml,
      }),
    });

    if (!adminResponse.ok) {
      console.error(
        "Admin email failed:",
        adminResponse.status
      );

      return jsonResponse(
        { error: "Failed to send notification email." },
        502
      );
    }

    const applicantEmailHtml = `
      <h2>Thank you for contacting DSC Society</h2>

      <p>Dear ${application.full_name},</p>

      <p>
        Thank you for your interest in joining DSC Society.
        We have successfully received your ${applicationType.toLowerCase()} application.
      </p>

      <p>
        Our team will review your application and get back to you soon.
      </p>

      <p>
        Regards,<br />
        <strong>DSC Society</strong><br />
        volunteer@dscsociety.org
      </p>
    `;

    const applicantResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [application.email],
        subject: "DSC Society - Application Received",
        html: applicantEmailHtml,
      }),
    });

    if (!applicantResponse.ok) {
      console.error(
        "Applicant email failed:",
        applicantResponse.status
      );

      return jsonResponse(
        {
          success: false,
          message:
            "Application received, but confirmation email could not be sent.",
        },
        502
      );
    }

    return jsonResponse({
      success: true,
      message: "Emails processed successfully.",
    });
  } catch (error) {
    console.error("Email function error:", error);

    return jsonResponse(
      { error: "Unexpected server error." },
      500
    );
  }
});
