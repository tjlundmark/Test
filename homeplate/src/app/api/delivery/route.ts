import { NextRequest, NextResponse } from "next/server";
import { DeliveryQuote } from "@/types";

/**
 * Courier Delivery Integration API
 *
 * In production, this would integrate with real courier APIs:
 * - DoorDash Drive API
 * - Uber Direct API
 * - Postmates API (via Uber)
 *
 * This mock simulates the delivery quote and dispatch flow.
 */

// POST /api/delivery - Request delivery quotes from courier networks
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { pickupAddress, dropoffAddress, orderId } = body;

  if (!pickupAddress || !dropoffAddress || !orderId) {
    return NextResponse.json(
      { error: "Missing required fields: pickupAddress, dropoffAddress, orderId" },
      { status: 400 }
    );
  }

  // Simulate getting quotes from multiple courier providers
  const quotes: DeliveryQuote[] = [
    {
      provider: "DoorDash",
      estimatedMinutes: 15 + Math.floor(Math.random() * 15),
      fee: 3.99 + Math.random() * 3,
    },
    {
      provider: "Uber Direct",
      estimatedMinutes: 18 + Math.floor(Math.random() * 15),
      fee: 4.49 + Math.random() * 3,
    },
    {
      provider: "Postmates",
      estimatedMinutes: 20 + Math.floor(Math.random() * 15),
      fee: 3.49 + Math.random() * 3,
    },
  ].map((q) => ({
    ...q,
    fee: Math.round(q.fee * 100) / 100,
  }));

  quotes.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);

  return NextResponse.json({
    orderId,
    quotes,
    bestOption: quotes[0],
  });
}

// PUT /api/delivery - Dispatch a courier (accept a quote)
export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { orderId, provider } = body;

  if (!orderId || !provider) {
    return NextResponse.json(
      { error: "Missing required fields: orderId, provider" },
      { status: 400 }
    );
  }

  const trackingId = `trk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const estimatedMinutes = 15 + Math.floor(Math.random() * 20);
  const estimatedDeliveryTime = new Date(
    Date.now() + estimatedMinutes * 60 * 1000
  ).toISOString();

  return NextResponse.json({
    success: true,
    orderId,
    provider,
    trackingId,
    trackingUrl: `https://${provider.toLowerCase().replace(" ", "")}.com/track/${trackingId}`,
    estimatedDeliveryTime,
    courierName: "John D.",
    courierPhone: "(555) 000-0000",
    status: "courier_assigned",
  });
}
