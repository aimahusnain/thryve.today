import Stripe from "stripe"
import { Agent } from "http"

// Initialize Stripe with better timeout and connection settings
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion, // Use the latest API version
  httpAgent: new Agent({ keepAlive: true }),
})