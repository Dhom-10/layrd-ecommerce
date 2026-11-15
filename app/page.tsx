import { redirect } from "next/navigation";

// The site opens on the log in page. The store's home page lives at /home.
export default function RootPage() {
  redirect("/login");
}
