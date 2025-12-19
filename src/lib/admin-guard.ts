import { getAuthUser } from "./getAuthUser";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.role?.name !== "admin") {
    redirect("/403");
  }

  return user;
}
