const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_EMAIL = "DSC Society <volunteer@dscsociety.org>";
const ADMIN_EMAIL = "dscsociety.org@gmail.com";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Application = {
  full_name: unknown;
  email: unknown;
  phone: unknown;
  college?: unknown;
  interests?: unknown;
  message?: unknown;
  application_type?: unknown;
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

const cleanText = (
  value: unknown,
  maxLength: number
): string => {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

    const fullName = cleanText(application.full_name, 100);
    const email = cleanText(application.email, 254).toLowerCase();
    const phone = cleanText(application.phone, 20);
    const college = cleanText(application.college, 200);
    const interests = cleanText(application.interests, 500);
    const message = cleanText(application.message, 5000);
    const applicationType = cleanText(
      application.application_type,
      20
    );

    if (!fullName || !email) {
      return jsonResponse(
        { error: "Name and email are required." },
        400
      );
    }

    if (!isValidEmail(email)) {
      return jsonResponse(
        { error: "Please provide a valid email address." },
        400
      );
    }

    if (
      applicationType !== "Volunteer" &&
      applicationType !== "Internship"
    ) {
      return jsonResponse(
        { error: "Invalid application type." },
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

    const safeApplicationType = escapeHtml(applicationType);
    const safeFullName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Not provided");
    const safeCollege = escapeHtml(college || "Not provided");
    const safeInterests = escapeHtml(
      interests || "Not provided"
    );
    const safeMessage = escapeHtml(
      message || "Not provided"
    );

    const adminEmailHtml = `
      <h2>New DSC Society Application</h2>

      <p><strong>Application Type:</strong> ${safeApplicationType}</p>
      <p><strong>Name:</strong> ${safeFullName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone:</strong> ${safePhone}</p>
      <p><strong>College:</strong> ${safeCollege}</p>
      <p><strong>Interests:</strong> ${safeInterests}</p>
      <p><strong>Message:</strong> ${safeMessage}</p>

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
        reply_to: email,
        subject: `New ${applicationType} Application - ${fullName}`,
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

      <p>Dear ${safeFullName},</p>

      <p>
        Thank you for your interest in joining DSC Society.
        We have successfully received your ${escapeHtml(
          applicationType.toLowerCase()
        )} application.
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
        to: [email],
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
