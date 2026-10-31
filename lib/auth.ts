export interface AppUser {
  userId: string;
  email: string;
  name?: string;
  isDemo?: boolean;
  isAdmin?: boolean;
}

// Auth is a single demo user (Clerk removed).
export async function getCurrentUser(): Promise<AppUser | null> {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const demoEmail = "designer@promptwear.demo";
  const isAdmin = adminEmails.length === 0 || adminEmails.includes(demoEmail);

  return {
    userId: "demo-designer-1",
    email: demoEmail,
    name: "Demo Designer",
    isDemo: true,
    isAdmin,
  };
}
