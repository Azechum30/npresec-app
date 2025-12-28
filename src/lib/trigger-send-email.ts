import { client } from "@/utils/qstash";
import { env } from "./server-only-actions/validate-env";

type EmailServiceData = {
  to: string[];
  username: string;
  data: {
    lastName: string;
    password: string;
    email: string;
  };
};
export const triggerSendEmail = async (emailServiceData: EmailServiceData) => {
  const rs = await client.publishJSON({
    url: `${env.NEXT_PUBLIC_URL}/api/send/emails`,
    body: emailServiceData,
  });

  return rs.url
    ? `Email send triggered successfully to ${emailServiceData.to.join(", ")}`
    : `Failed to trigger email send to ${emailServiceData.to.join(", ")}`;
};
