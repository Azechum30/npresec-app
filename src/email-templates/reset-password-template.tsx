import React from "react";

type ResetPasswordTemplateProps = {
    resetUrl: string;
    userEmail?: string;
};

export const ResetPasswordTemplate: React.FC<
    Readonly<ResetPasswordTemplateProps>
> = ({ resetUrl, userEmail }) => {
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
            }}
        >
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "30px",
                }}
            >
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ margin: "0 auto" }}
                >
                    <path
                        d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
                        stroke="#4F46E5"
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
                    }}
                >
                    Password Reset Request
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
                }}
            >
                <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
                    You recently requested to reset your password for your account. Click
                    the button below to reset it.
                </p>

                <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
                    If you didn't request this, please ignore this email. Your password
                    will remain unchanged.
                </p>

                <div style={{ textAlign: "center", margin: "30px 0" }}>
                    <a
                        href={resetUrl}
                        style={{
                            backgroundColor: "#4F46E5",
                            color: "#FFFFFF",
                            padding: "12px 24px",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontWeight: "600",
                            display: "inline-block",
                            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        Reset Password
                    </a>
                </div>

                <div
                    style={{
                        borderTop: "1px solid #E5E7EB",
                        paddingTop: "20px",
                        marginTop: "20px",
                        color: "#6B7280",
                        fontSize: "14px",
                    }}
                >
                    <p style={{ margin: "0" }}>
                        If you're having trouble with the button above, copy and paste the
                        URL below into your web browser.
                    </p>
                    <p
                        style={{
                            wordBreak: "break-all",
                            margin: "10px 0 0",
                            color: "#4F46E5",
                        }}
                    >
                        {resetUrl}
                    </p>
                </div>
            </div>

            <div
                style={{
                    textAlign: "center",
                    marginTop: "30px",
                    color: "#9CA3AF",
                    fontSize: "12px",
                }}
            >
                <p style={{ margin: "0" }}>
                    © {new Date().getFullYear()} Presbyterian SHTS, Nakpanduri. All rights reserved.
                </p>
                <p style={{ margin: "5px 0 0" }}>
                    Nakpanduri, near the Escarpment
                </p>
            </div>
        </div>
    );
};