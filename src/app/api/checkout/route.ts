import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

let stripeClient: any = null;

function getStripe(): any {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.warn("STRIPE_SECRET_KEY environment variable is not defined. Operating in high-fidelity Sandbox mode.");
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: "2025-02-14" as any,
    });
  }
  return stripeClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, successUrl, cancelUrl, isPackage, packageDetails } = body;

    const stripe = getStripe();

    if (!stripe) {
      // Sandbox mode: construct a fallback success parameter redirect
      const mockSessionId = "stripe_sandbox_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);
      const redirectTargetUrl = new URL(successUrl);
      redirectTargetUrl.searchParams.set("session_id", mockSessionId);
      redirectTargetUrl.searchParams.set("sandbox", "true");
      
      // Add items metadata for local order insertion
      if (isPackage && packageDetails) {
        redirectTargetUrl.searchParams.set("item_type", "package");
        redirectTargetUrl.searchParams.set("item_name", packageDetails.name);
        redirectTargetUrl.searchParams.set("item_price", String(packageDetails.priceNumeric || 1499));
      } else if (items && items.length > 0) {
        redirectTargetUrl.searchParams.set("item_type", "merchandise");
        redirectTargetUrl.searchParams.set("item_count", String(items.length));
        redirectTargetUrl.searchParams.set("item_payload", JSON.stringify(items));
      }
      
      return NextResponse.json({ url: redirectTargetUrl.toString(), mock: true });
    }

    // Prepare line items
    let lineItems = [];
    if (isPackage && packageDetails) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: packageDetails.name,
            description: packageDetails.tagline || "GTMCE Strategic Investment/Service Package",
          },
          unit_amount: Math.round((packageDetails.priceNumeric || 1499) * 100),
        },
        quantity: 1,
      });
    } else if (items && items.length > 0) {
      lineItems = items.map((item: any) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));
    } else {
      return NextResponse.json({ error: "No products or packages selected for checkout." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url, mock: false });
  } catch (error: any) {
    console.error("Stripe Session Creation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to initiate payment session." }, { status: 500 });
  }
}
