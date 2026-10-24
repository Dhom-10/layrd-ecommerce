import { redirect } from "next/navigation";

// The home page now lives at "/". Keep this route so old links still work.
export default function OldHomeRoute() {
  redirect("/");
}
