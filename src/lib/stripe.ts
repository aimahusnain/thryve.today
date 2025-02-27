import Stripe from "stripe"
import { Agent } from "http"

// Initialize Stripe with better timeout and connection settings
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion, // Use the latest API version
  timeout: 10000, // 10 second timeout
  maxNetworkRetries: 3, // Retry failed requests
  httpAgent: new Agent({ keepAlive: true }),
})