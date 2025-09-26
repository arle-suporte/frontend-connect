import { cookies } from "next/headers";
import CRMClient from "./CRMClient";
import { redirect } from "next/navigation";

export default async function CRMPage() {
  const cookieStore = await cookies();
  // const accessToken = (await cookieStore).get("accessToken")?.value || null;
  const accessToken = cookieStore.get("accessToken")?.value || null;

  if (!accessToken) {
    redirect("/login");
  }

  return <CRMClient accessToken={accessToken} />;
}
