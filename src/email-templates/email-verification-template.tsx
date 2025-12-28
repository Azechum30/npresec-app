import React from "react";

type EmailVerificationTemplateProps = {
  verificationUrl: string;
  userEmail?: string;
};

export const EmailVerificationTemplate: React.FC<
  Readonly<EmailVerificationTemplateProps>
> = ({ verificationUrl, userEmail }) => {
  return (
    <div
      style={{
        fontFamily:
          'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        color: "#333",
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)",
      }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ margin: "0 auto" }}>
          <path
            d="M3 8L10.89 4.26C11.2187 4.10222 11.5813 4.10222 11.91 4.26L19.8 8M21 8V16C21 16.5304 20.7893 17.0391 20.4142 17.4142C20.0391 17.7893 19.5304 18 19 18H5C4.46957 18 3.96086 17.7893 3.58579 17.4142C3.21071 17.0391 3 16.5304 3 16V8M21 8L19.8 8M3 8L4.2 8"
            stroke="#059669"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 12L11 14L15 10"
            stroke="#059669"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1
          style={{
            color: "#111827",
            fontSize: "24px",
            fontWeight: "600",
            margin: "20px 0 10px",
          }}>
          Verify Your Email Address
        </h1>
        {userEmail && (
          <p style={{ color: "#6B7280", margin: "0 0 20px" }}>
            For: {userEmail}
          </p>
        )}
      </div>

      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          padding: "30px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}>
        <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
          Welcome to Presbyterian SHTS! Please verify your email address to
          complete your registration and access your account.
        </p>

        <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
          Click the button below to verify your email address. This link will
          expire in 24 hours for security reasons.
        </p>

        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={verificationUrl}
            style={{
              backgroundColor: "#059669",
              color: "#FFFFFF",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "600",
              display: "inline-block",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
            }}>
            Verify Email Address
          </a>
        </div>

        <div
          style={{
            borderTop: "1px solid #E5E7EB",
            paddingTop: "20px",
            marginTop: "20px",
            color: "#6B7280",
            fontSize: "14px",
          }}>
          <p style={{ margin: "0" }}>
            If you&apos;re having trouble with the button above, copy and paste
            the URL below into your web browser.
          </p>
          <p
            style={{
              wordBreak: "break-all",
              margin: "10px 0 0",
              color: "#059669",
            }}>
            {verificationUrl}
          </p>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
          color: "#9CA3AF",
          fontSize: "12px",
        }}>
        <p style={{ margin: "0" }}>
          © {new Date().getFullYear()} Presbyterian SHTS, Nakpanduri. All
          rights reserved.
        </p>
        <p style={{ margin: "5px 0 0" }}>Nakpanduri, near the Escarpment</p>
      </div>
    </div>
  );
};
