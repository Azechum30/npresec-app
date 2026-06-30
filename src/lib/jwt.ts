import "server-only";

import jwt from "jsonwebtoken";
import { env } from "./server-only-actions/validate-env";

export const generateToken = (sub: string) => {
  return jwt.sign({ sub }, env.JWT_SECRET, {
    expiresIn: "2yr",
    algorithm: "HS256",
  });
};

export const verifyToken = (token: string) => {
  try {
    const decodedToken = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    }) as {
      sub: string;
      exp: number;
      iat: number;
    };

    if (decodedToken.exp < Date.now() / 1000) {
      return null;
    }

    return decodedToken.sub;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};

export const generateResultsVerificationToken = (
  studentId: string,
  semester: string,
  academicYear: number,
) => {
  const payload = {
    sub: studentId,
    sem: semester,
    year: academicYear,
    purpose: "results_verification",
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "2y",
    algorithm: "HS256",
  });
};

export const verifyResultsVerificationToken = (token: string) => {
  try {
    const verifiedToken = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    }) as {
      sub: string;
      sem: string;
      year: number;
      purpose: string;
      exp: number;
      iat: number;
    };

    if (verifiedToken.purpose !== "results_verification")
      throw new Error("Invalid token purpose");

    if (verifiedToken.exp < Date.now() / 1000)
      throw new Error("Token has expired");

    return verifiedToken;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const decodeResultVerificationTokenPayload = (token: string) => {
  return jwt.decode(token) as {
    sub: string;
    sem: string;
    year: number;
    purpose: string;
    exp: number;
    iat: number;
  };
};
