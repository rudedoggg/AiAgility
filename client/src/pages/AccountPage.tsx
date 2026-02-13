import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  return (
    <div className="h-screen w-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 pt-[60px] overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground" data-testid="text-account-label">
              Account
            </div>
            <div className="text-2xl font-bold font-heading" data-testid="text-account-title">
              Account
            </div>
            <div className="text-sm text-muted-foreground mt-1" data-testid="text-account-subtitle">
              Manage account preferences and data.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 space-y-2">
              <div className="text-sm font-semibold" data-testid="text-account-data-title">Data</div>
              <div className="text-sm text-muted-foreground" data-testid="text-account-data-desc">
                Download or clear local prototype data.
              </div>
              <div className="pt-3 flex gap-2">
                <Button data-testid="button-account-export" variant="outline">Export</Button>
                <Button data-testid="button-account-clear" variant="destructive">Clear local data</Button>
              </div>
            </Card>

            <Card className="p-5 space-y-2">
              <div className="text-sm font-semibold" data-testid="text-account-sessions-title">Sessions</div>
              <div className="text-sm text-muted-foreground" data-testid="text-account-sessions-desc">
                View and revoke active sessions (mock).
              </div>
              <div className="pt-3">
                <Button data-testid="button-account-manage" variant="secondary">Manage sessions</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
