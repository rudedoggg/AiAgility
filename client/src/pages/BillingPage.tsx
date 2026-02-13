import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  return (
    <div className="h-screen w-screen bg-background text-foreground font-sans flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 pt-[60px] overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto space-y-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground" data-testid="text-billing-label">
              Settings
            </div>
            <div className="text-2xl font-bold font-heading" data-testid="text-billing-title">
              Billing
            </div>
            <div className="text-sm text-muted-foreground mt-1" data-testid="text-billing-subtitle">
              Plan, payment method, and invoices. (Mock UI)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 space-y-2">
              <div className="text-sm font-semibold" data-testid="text-billing-plan-title">Current plan</div>
              <div className="text-2xl font-bold font-heading" data-testid="text-billing-plan">Prototype</div>
              <div className="text-sm text-muted-foreground" data-testid="text-billing-plan-desc">Unlimited projects, local-only storage.</div>
              <div className="pt-3">
                <Button data-testid="button-billing-upgrade" variant="secondary">Upgrade plan</Button>
              </div>
            </Card>

            <Card className="p-5 space-y-2">
              <div className="text-sm font-semibold" data-testid="text-billing-payment-title">Payment method</div>
              <div className="text-sm text-muted-foreground" data-testid="text-billing-payment-desc">No payment method on file.</div>
              <div className="pt-3 flex gap-2">
                <Button data-testid="button-billing-add-card">Add card</Button>
                <Button data-testid="button-billing-manage" variant="outline">Manage</Button>
              </div>
            </Card>

            <Card className="p-5 md:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold" data-testid="text-billing-invoices-title">Invoices</div>
                  <div className="text-sm text-muted-foreground" data-testid="text-billing-invoices-desc">Download receipts and invoices.</div>
                </div>
                <Button data-testid="button-billing-download" variant="outline">Download latest</Button>
              </div>

              <div className="mt-4 text-sm text-muted-foreground" data-testid="text-billing-invoices-empty">
                No invoices yet.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
