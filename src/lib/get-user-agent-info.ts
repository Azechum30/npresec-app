import { UAParser } from "ua-parser-js";
import { getSession } from "./get-session";

export const getUserAgentInfo = async () => {
  const session = await getSession();

  const userAgentInfo = session?.session.userAgent
    ? UAParser(session.session.userAgent)
    : null;

  if (userAgentInfo?.device == null)
    return { userAgentInfo, device: "Unknown Device" };

  if (userAgentInfo.browser.name === null && userAgentInfo.os.name === null)
    return { userAgentInfo, device: "Unknown Device" };

  if (userAgentInfo.browser.name === null)
    return { userAgentInfo, device: userAgentInfo.os.name };
  if (userAgentInfo.os.name === null)
    return { userAgentInfo, device: userAgentInfo.browser.name };
  return {
    userAgentInfo,
    device: `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`,
  };
};
