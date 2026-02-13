import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SecurityPage() {
  return (
    <div className="h-screen w-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 pt-[60px] overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground" data-testid="text-security-label">
              Account
            </div>
            <div className="text-2xl font-bold font-heading" data-testid="text-security-title">
              Security
            </div>
            <div className="text-sm text-muted-foreground mt-1" data-testid="text-security-subtitle">
              Password, 2FA, and sign-in protections. (Mock UI)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 space-y-3">
              <div className="text-sm font-semibold" data-testid="text-security-password-title">Password</div>
              <div className="text-sm text-muted-foreground" data-testid="text-security-password-desc">Update your password.</div>
              <Button data-testid="button-security-change-password" variant="secondary">Change password</Button>
            </Card>

            <Card className="p-5 space-y-3">
              <div className="text-sm font-semibold" data-testid="text-security-2fa-title">Two-factor authentication</div>
              <div className="text-sm text-muted-foreground" data-testid="text-security-2fa-desc">Add an extra layer of security to your account.</div>
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm" data-testid="text-security-2fa-state">Enabled</div>
                <Switch data-testid="switch-security-2fa" defaultChecked />
              </div>
            </Card>

            <Card className="p-5 md:col-span-2 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold" data-testid="text-security-signout-title">Sign out everywhere</div>
                <div className="text-sm text-muted-foreground" data-testid="text-security-signout-desc">
                  Revoke all active sessions.
                </div>
              </div>
              <Button data-testid="button-security-signout" variant="destructive">Sign out all</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
