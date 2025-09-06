import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    let emailAddresses: string[]
    let subject: string
    let content: string
    let attachments: File[] = []
    let batchSize = 3

    const contentType = request.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      const { emailAddresses: emails, subject: subj, content: cont, batchSize: size } = await request.json()
      emailAddresses = emails
      subject = subj
      content = cont
      batchSize = size || 3
    } else {
      // Handle FormData
      const formData = await request.formData()
      emailAddresses = JSON.parse(formData.get("emailAddresses") as string)
      subject = formData.get("subject") as string
      content = formData.get("content") as string
      batchSize = Number.parseInt(formData.get("batchSize") as string) || 3

      const attachmentFiles = formData.getAll("attachments") as File[]
      attachments = attachmentFiles.filter((file) => file && file.size > 0)
    }

    if (!emailAddresses || !Array.isArray(emailAddresses) || emailAddresses.length === 0) {
      return NextResponse.json({ error: "Email addresses are required" }, { status: 400 })
    }

    if (!subject || !content) {
      return NextResponse.json({ error: "Subject and content are required" }, { status: 400 })
    }

    // Split emails into batches
    const batches = []
    for (let i = 0; i < emailAddresses.length; i += batchSize) {
      batches.push(emailAddresses.slice(i, i + batchSize))
    }

    const allResults = []
    const allFailures = []
    let totalSent = 0

    console.log(`[v0] Starting batch email process: ${emailAddresses.length} emails in ${batches.length} batches`)
    console.log(
      `[v0] Batch breakdown: ${batches.map((batch, i) => `Batch ${i + 1}: ${batch.length} emails`).join(", ")}`,
    )

    console.log(`[v0] 📧 EMAIL BATCHING SEQUENCE:`)
    batches.forEach((batch, i) => {
      console.log(`[v0] API Call ${i + 1}: Will send to ${batch.length} recipients - ${batch.join(", ")}`)
    })

    // Process each batch sequentially
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex]

      try {
        console.log(
          `[v0] 🚀 EXECUTING API CALL ${batchIndex + 1}/${batches.length} - Sending to ${batch.length} recipients: ${batch.join(", ")}`,
        )

        // Create FormData for this batch
        const formData = new FormData()
        formData.append("to", JSON.stringify(batch))
        formData.append("subject", subject)
        formData.append("content", content)
        formData.append("batchSize", batch.length.toString()) // Use actual batch size for this batch

        // Add attachments if provided
        if (attachments && attachments.length > 0) {
          attachments.forEach((attachment: File) => {
            formData.append("attachments", attachment)
          })
        }

        const baseUrl = request.nextUrl.origin
        const response = await fetch(`${baseUrl}/api/send-email`, {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (response.ok) {
          allResults.push({
            batch: batchIndex + 1,
            recipients: batch,
            recipientCount: batch.length,
            success: true,
            result,
          })
          totalSent += result.recipients || batch.length
          console.log(`[v0] ✅ API CALL ${batchIndex + 1} COMPLETED - Successfully sent to ${batch.length} recipients`)
        } else {
          allFailures.push({
            batch: batchIndex + 1,
            recipients: batch,
            recipientCount: batch.length,
            error: result.error || "Unknown error",
          })
          console.error(`[v0] ❌ API CALL ${batchIndex + 1} FAILED:`, result.error)
        }

        // Add delay between batches to prevent overwhelming the server
        if (batchIndex < batches.length - 1) {
          console.log(`[v0] ⏳ Waiting 2 seconds before API CALL ${batchIndex + 2}...`)
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      } catch (batchError) {
        console.error(`[v0] ❌ Error processing batch ${batchIndex + 1}:`, batchError)
        allFailures.push({
          batch: batchIndex + 1,
          recipients: batch,
          recipientCount: batch.length,
          error: batchError instanceof Error ? batchError.message : "Unknown batch error",
        })
      }
    }

    const successfulBatches = allResults.length
    const failedBatches = allFailures.length

    console.log(
      `[v0] Batch processing completed: ${successfulBatches} successful batches, ${failedBatches} failed batches`,
    )
    console.log(`[v0] Total emails sent: ${totalSent}/${emailAddresses.length}`)

    if (successfulBatches === 0) {
      return NextResponse.json(
        {
          error: "All batches failed to send",
          totalAttempted: emailAddresses.length,
          totalBatches: batches.length,
          failures: allFailures,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${successfulBatches} out of ${batches.length} batches`,
      totalEmailsAttempted: emailAddresses.length,
      totalEmailsSent: totalSent,
      successfulBatches,
      failedBatches,
      batchResults: allResults,
      failures: allFailures.length > 0 ? allFailures : undefined,
      batchBreakdown: batches.map((batch, i) => ({
        batchNumber: i + 1,
        recipients: batch,
        count: batch.length,
      })),
    })
  } catch (error) {
    console.error("[v0] ❌ Batch email processing error:", error)
    return NextResponse.json(
      {
        error: "Internal server error during batch processing",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
