import { Header } from "./Header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="pt-[60px] h-screen overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
