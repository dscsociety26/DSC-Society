import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Heart, ShieldCheck, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdvisoryMarquee from "@/components/AdvisoryMarquee";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void | Promise<void>;
  modal?: { ondismiss?: () => void };
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: string,
    callback: (response: { error?: { description?: string } }) => void
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const upiId = import.meta.env.VITE_DONATION_UPI_ID?.trim() ?? "";
const beneficiaryName =
  import.meta.env.VITE_DONATION_BENEFICIARY_NAME?.trim() ?? "";

const paymentConfigured = Boolean(upiId && beneficiaryName);

const suggestedAmounts = [100, 250, 500, 1000];

const Donate = () => {
  const [amount, setAmount] = useState("500");
  const [customAmount, setCustomAmount] = useState("");

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

  const [isPaying, setIsPaying] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const handleDonate = async () => {
    if (!validAmount || isPaying) return;

    setIsPaying(true);
    setPaymentMessage("");

    try {
      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: numericAmount }),
      });

      const order = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(order.error || "Unable to start your donation.");
      }

      if (!order.orderId || !order.keyId || !order.amount) {
        throw new Error("The payment service returned an invalid order.");
      }

      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error("Could not load Razorpay Checkout."));
          document.body.appendChild(script);
        });
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout is unavailable.");
      }

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "DSC Society",
        description: "Donation to DSC Society",
        order_id: order.orderId,
        handler: async (response) => {
          try {
            const verificationResponse = await fetch(
              "/api/verify-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }
            );

            const verification = await verificationResponse.json();

            if (
              verificationResponse.ok &&
              verification.verified &&
              verification.paid
            ) {
              setPaymentMessage(
                "Thank you! Your donation payment has been verified."
              );
            } else {
              setPaymentMessage(
                verification.error ||
                "Payment received a response but is not yet confirmed as captured. Please check your payment status before trying again."
              );
            }
          } catch {
            setPaymentMessage(
              "We couldn't confirm the payment status. Please contact DSC Society with your Razorpay payment details before trying again."
            );
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
      });

      checkout.on("payment.failed", (response) => {
        setPaymentMessage(
          response.error?.description ||
          "Payment failed. Please try again or use the UPI QR code."
        );
        setIsPaying(false);
      });

      checkout.open();
    } catch (error) {
      setPaymentMessage(
        error instanceof Error
          ? error.message
          : "Unable to start your donation. Please try again."
      );
      setIsPaying(false);
    }
  };

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

            <Button
              type="button"
              className="mt-6 h-12 w-full"
              disabled={true}
            >
              Razorpay donations temporarily unavailable
            </Button>

            {paymentMessage && (
              <p
                role="status"
                aria-live="polite"
                className="mt-3 text-sm leading-relaxed"
              >
                {paymentMessage}
              </p>
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
                  <a
                    href={paymentUri}
                    className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-primary px-5 py-2 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Open UPI payment app
                  </a>
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
