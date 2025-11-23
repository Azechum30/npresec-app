import "server-only";

import jwt from "jsonwebtoken";
import { env } from "./server-only-actions/validate-env";

export const generateToken = (userId: string) => {
  const token = jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "1hr" });
  // URL encode the token to make it safe for URLs
  return encodeURIComponent(token);
};

export const verifyToken = (encodedToken: string) => {
  try {
    // URL decode the token first
    const token = decodeURIComponent(encodedToken);
    const decodedToken = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      exp: number;
    };

    if (decodedToken.exp < Date.now() / 1000) {
      return null; // Return null for expired tokens instead of throwing
    }

    return decodedToken.userId;
  } catch (e) {
    return null; // Return null for invalid tokens instead of throwing
  }
};
