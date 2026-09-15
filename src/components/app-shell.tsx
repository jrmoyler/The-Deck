import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, House, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { to: "/", label: "Home", icon: House, exact: true },
  { to: "/log", label: "Log", icon: BookOpen, exact: false },
  { to: "/coach", label: "Coach", icon: MessageCircle, exact: false },
] as const;

export function AppShell({ children, hideNav = false }: { children: React.ReactNode; hideNav?: boolean }) {
  const pathname = useLocation().pathname;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col">
      <main className={cn("flex-1", hideNav ? "pb-6" : "pb-24")}>{children}</main>
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg/95 backdrop-blur-md">
          <div className="mx-auto grid max-w-lg grid-cols-3 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
            {ITEMS.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex min-h-12 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] text-[11px] font-medium tracking-wide",
                    active ? "text-fg" : "text-faint",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
