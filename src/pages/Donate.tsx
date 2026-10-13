import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Heart, ShieldCheck, Smartphone, QrCode, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdvisoryMarquee from "@/components/AdvisoryMarquee";

const upiId = import.meta.env.VITE_DONATION_UPI_ID?.trim() ?? "";
const beneficiaryName =
  import.meta.env.VITE_DONATION_BENEFICIARY_NAME?.trim() ?? "";

const suggestedAmounts = [100, 250, 500, 1000];

const Donate = () => {
  const [amount, setAmount] = useState("500");
  const [customAmount, setCustomAmount] = useState("");
  const [upiCopied, setUpiCopied] = useState(false);

  const selectedAmount = customAmount ? customAmount : amount;
  const numericAmount = Number(selectedAmount);
  const validAmount =
    selectedAmount.trim() !== "" &&
    Number.isSafeInteger(numericAmount) &&
    numericAmount >= 1 &&
    numericAmount <= 1000000;

  const paymentUri = useMemo(() => {
    if (
      !upiId ||
      !beneficiaryName ||
      !validAmount
    ) {
      return "";
    }

    const params = new URLSearchParams({
      pa: upiId,
      pn: beneficiaryName,
      am: numericAmount.toFixed(2),
      cu: "INR",
      tn: "Donation to DSC Society",
    });

    return `upi://pay?${params.toString().replace(/\+/g, "%20")}`;
  }, [numericAmount, validAmount]);

  const paymentConfigured = Boolean(upiId && beneficiaryName);

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <AdvisoryMarquee />

      <section className="container-narrow px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Heart size={28} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Support Our Mission
          </p>

          <h1 className="font-heading text-3xl font-bold text-foreground sm:text-5xl">
            Make a Difference with DSC Society
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            Your contribution can help support environmental protection,
            sustainability, waste reduction and community development
            initiatives.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="font-heading text-xl font-bold">
              Choose your contribution
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Select an amount in Indian rupees.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {suggestedAmounts.map((suggested) => (
                <Button
                  key={suggested}
                  type="button"
                  variant={
                    !customAmount && amount === String(suggested)
                      ? "default"
                      : "outline"
                  }
                  className="h-12"
                  onClick={() => {
                    setAmount(String(suggested));
                    setCustomAmount("");
                  }}
                >
                  ₹{suggested.toLocaleString("en-IN")}
                </Button>
              ))}
            </div>

            <label
              htmlFor="custom-donation"
              className="mt-6 block text-sm font-medium"
            >
              Or enter a custom amount (₹)
            </label>
            <input
              id="custom-donation"
              type="number"
              min="1"
              max="1000000"
              step="1"
              inputMode="numeric"
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              placeholder="Enter amount"
              className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
            />

            <div className="mt-6 rounded-xl bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Your selected contribution
              </p>
              <p className="mt-1 text-3xl font-bold text-primary">
                ₹
                {validAmount
                  ? numericAmount.toLocaleString("en-IN")
                  : "—"}
              </p>
            </div>

            {paymentConfigured ? (
              <Button
                type="button"
                disabled={!upiId}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(upiId);
                    setUpiCopied(true);
                    window.setTimeout(() => setUpiCopied(false), 2500);
                  } catch {
                    setUpiCopied(false);
                  }
                }}
                className="mt-6 h-12 w-full gradient-green border-0 font-semibold text-primary-foreground"
              >
                <Copy className="mr-2 h-4 w-4" />
                {upiCopied ? "UPI ID Copied" : "Copy UPI ID"}
              </Button>
            ) : (
              <Button disabled className="mt-6 h-12 w-full">
                UPI payment setup pending
              </Button>
            )}

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              After completing a payment, check your UPI app or bank account
              for confirmation. This website does not automatically verify
              payments or issue payment receipts.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <QrCode size={23} />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold">
                  Scan & Donate
                </h2>
                <p className="text-sm text-muted-foreground">
                  Use a compatible UPI app.
                </p>
              </div>
            </div>

            <div className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
              {paymentUri ? (
                <>
                  <div className="rounded-xl bg-white p-4">
                    <QRCodeSVG
                      value={paymentUri}
                      size={220}
                      level="M"
                      includeMargin
                      title="DSC Society UPI donation QR code"
                    />
                  </div>
                  <p className="mt-4 text-sm font-medium">
                    Scan using your UPI app
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Verify the recipient and amount in your app before paying.
                  </p>
                </>
              ) : (
                <>
                  <QrCode size={44} className="text-muted-foreground" />
                  <p className="mt-4 font-semibold">
                    Donation QR code will appear here
                  </p>
                  <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    The official UPI ID and beneficiary name must be configured
                    before payments can be enabled.
                  </p>
                </>
              )}
            </div>

            {paymentConfigured && (
              <div className="mt-4 break-all rounded-lg bg-muted/50 p-3 text-sm">
                <span className="text-muted-foreground">UPI ID: </span>
                <span className="font-medium">{upiId}</span>
              </div>
            )}

            <div className="mt-6 flex items-start gap-3">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-primary"
              />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Always confirm the recipient name and amount shown in your UPI
                app before authorising a transaction.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-5xl rounded-xl bg-muted/40 p-5 text-sm leading-relaxed text-muted-foreground">
          Please donate only after verifying the beneficiary details. Any
          applicable donation acknowledgements, tax benefits or receipts must
          be confirmed with DSC Society; they are not implied by making a UPI
          payment.
        </div>
      </section>
    </div>
  );
};

export default Donate;
