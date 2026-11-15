"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export type Role = "customer" | "wholesale" | "admin";

export interface Account {
  userId: string;
  email: string;
  role: Role;
  fullName: string | null;
  businessName: string | null;
}

async function loadAccount(): Promise<Account | null> {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const { data } = await supabase
    .from("profiles")
    .select("role, full_name, business_name")
    .eq("id", session.user.id)
    .maybeSingle();
  return {
    userId: session.user.id,
    email: session.user.email ?? "",
    role: (data?.role as Role) ?? "customer",
    fullName: data?.full_name ?? null,
    businessName: data?.business_name ?? null,
  };
}

/** Signs in with Supabase Auth and returns the account, or throws if the role is not allowed here. */
export async function signInAs(email: string, password: string, allowed: Role[]): Promise<Account> {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw new Error("Wrong email or password.");
  const account = await loadAccount();
  if (!account || !allowed.includes(account.role)) {
    await supabase.auth.signOut();
    throw new Error("This account does not have access to this area.");
  }
  return account;
}

export async function signOut() {
  await getSupabase().auth.signOut();
}

/** Current signed-in account. `loading` is true until we know. */
export function useAccount() {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const refresh = () =>
      loadAccount().then((a) => {
        if (!active) return;
        setAccount(a);
        setLoading(false);
      });
    refresh();
    const { data: sub } = getSupabase().auth.onAuthStateChange(() => {
      refresh();
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { account, loading };
}
