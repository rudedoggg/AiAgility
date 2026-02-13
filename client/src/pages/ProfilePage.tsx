import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  return (
    <div className="h-screen w-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 pt-[60px] overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground" data-testid="text-profile-label">
              Account
            </div>
            <div className="text-2xl font-bold font-heading" data-testid="text-profile-title">
              Profile
            </div>
            <div className="text-sm text-muted-foreground mt-1" data-testid="text-profile-subtitle">
              Your name, email, and avatar.
            </div>
          </div>

          <Card className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label data-testid="label-profile-name">Name</Label>
                <Input data-testid="input-profile-name" defaultValue="JD" />
              </div>
              <div className="space-y-2">
                <Label data-testid="label-profile-email">Email</Label>
                <Input data-testid="input-profile-email" defaultValue="jd@example.com" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button data-testid="button-profile-save">Save changes</Button>
              <Button data-testid="button-profile-cancel" variant="outline">Cancel</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
