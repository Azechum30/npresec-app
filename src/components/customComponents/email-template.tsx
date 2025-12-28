import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface EmailTemplateProps {
  firstName: string;
  lastName: string;
  loginCredentials: {
    email: string;
    password: string;
  };
  appUrl: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  lastName,
  loginCredentials,
  appUrl,
}) => (
  <div
    style={{
      fontFamily: "'Inter', Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
    }}>
    <Card
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
      }}>
      {/* Header with gradient */}
      <CardHeader
        style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          color: "white",
          padding: "24px",
          textAlign: "center",
        }}>
        <CardTitle
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "8px",
          }}>
          Presby SHTS, Nakpanduri
        </CardTitle>
        <CardDescription
          style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "16px" }}>
          Management Information System Onboarding
        </CardDescription>
      </CardHeader>

      <CardContent style={{ padding: "32px" }}>
        {/* Welcome section */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#4a5568" }}>
            Welcome,{" "}
            <span style={{ fontWeight: "600", color: "#1a202c" }}>
              {firstName} {lastName}
            </span>{" "}
            to the onboarding of all staff and students onto the School&apos;s
            Management Information System.
          </p>
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#4a5568",
              marginTop: "12px",
            }}>
            The system is designed to track data of all staff and students for
            efficient data management.
          </p>
        </div>

        {/* Credential card */}
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "8px",
            padding: "20px",
            margin: "24px 0",
            border: "1px solid #e2e8f0",
          }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#1e293b",
            }}>
            Your Login Credentials
          </h3>

          <div style={{ marginBottom: "12px" }}>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginBottom: "4px",
              }}>
              Email
            </p>
            <p
              style={{ fontSize: "16px", fontWeight: "500", color: "#1e293b" }}>
              {loginCredentials.email}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                marginBottom: "4px",
              }}>
              Temporary Password
            </p>
            <p
              style={{ fontSize: "16px", fontWeight: "500", color: "#1e293b" }}>
              {loginCredentials.password}
            </p>
          </div>
        </div>

        {/* App URL */}
        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              fontSize: "16px",
              color: "#4a5568",
              marginBottom: "12px",
            }}>
            Use the button below to access the system:
          </p>
          <a
            href={appUrl}
            style={{
              display: "inline-block",
              background: "#4f46e5",
              color: "white",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "500",
              fontSize: "16px",
              textAlign: "center",
            }}>
            Access Management System
          </a>
        </div>

        {/* Instructions */}
        <div
          style={{
            background: "#f0fdf4",
            borderRadius: "8px",
            padding: "16px",
            border: "1px solid #bbf7d0",
            marginBottom: "24px",
          }}>
          <p style={{ fontSize: "15px", color: "#166534", fontWeight: "500" }}>
            <span style={{ fontWeight: "600" }}>Important:</span> You will be
            prompted to change your password upon first login. Please do this
            immediately to secure your account.
          </p>
        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px" }}>
          <p
            style={{ fontSize: "15px", color: "#64748b", marginBottom: "8px" }}>
            Kind regards,
          </p>
          <p style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b" }}>
            IT Support Team
            <br />
            <span style={{ color: "#4f46e5" }}>
              support@nakpanduripresec.org
            </span>
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Email footer */}
    <div style={{ textAlign: "center", marginTop: "24px" }}>
      <p style={{ fontSize: "12px", color: "#94a3b8" }}>
        © {new Date().getFullYear()} Presby SHTS, Nakpanduri. All rights
        reserved.
      </p>
    </div>
  </div>
);
