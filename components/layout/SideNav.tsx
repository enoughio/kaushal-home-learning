'use server';

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NavLinks from "./NavLinks";

// TODO : make signout a server action
// import { signOut } from "@/auth";
import { PowerIcon } from "lucide-react";

export default async function SideNav() {

  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value ?? "guest";


  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 md:overflow-y-auto">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          {/* TODO : Import Logo as a Component  */}
          LOGO
        </div>
      </Link>

  <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks role={role} />

        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form action={signOutAction}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}

  // Exported server action to handle sign out. Exporting it (instead of using an
  // inline anonymous function) avoids passing a function that Next has to
  // serialize to client components which triggers the runtime error.
  export async function signOutAction() {
    "use server";
    // Perform any server-side sign-out logic here (clear cookies, revoke tokens).
    // Minimal behavior: redirect to home.
    try {
      const cookieStore = typeof cookies === "function" ? await cookies() : undefined;
      // If the runtime supports deletion, attempt to delete the role cookie.
      
      cookieStore?.delete?.("role");
    } catch (_err) {
      // ignore
      console.error(_err);
    }

    redirect("/");
  }
