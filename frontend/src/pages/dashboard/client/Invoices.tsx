import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { premiumCard } from "@/lib/styles";

const invoices = [
  {
    id: "INV-001",
    amount: 1000,
    tax: 100,
    total: 1100,
    status: "Paid",
  },
];

export default function ClientInvoicesPage() {
  return (
    <DashboardLayout role="client">
      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      <div className="space-y-4">
        {invoices.map((inv) => (
          <Card key={inv.id} className={premiumCard}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{inv.id}</span>

                <Badge
                  className={
                    inv.status === "Paid"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }
                >
                  {inv.status}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* Invoice breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-muted-foreground">Amount</p>
                  <p className="font-semibold">${inv.amount}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Tax</p>
                  <p className="font-semibold">${inv.tax}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-semibold text-lg">${inv.total}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Download */}
                <Button
                  className="bg-gradient-to-r from-[#7F77DD] to-[#1D9E75]"
                  onClick={() => alert("Download PDF")}
                >
                  Download PDF
                </Button>

                {/* QR CODE PLACEHOLDER */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white/10 border border-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">
                      QR CODE
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Scan to pay
                  </p>
                </div>

              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}