import { redirect } from "next/navigation";

// Pre-registration has been replaced by full registration. Preserve any
// existing/bookmarked links by redirecting to the registration form.
export default function InterestRedirect() {
  redirect("/register/signup");
}
