import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// POST endpoint to submit a report
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { doctorName, licenseNumber, location, concernType, description, contactEmail } = body

    // Validate required fields
    if (!doctorName || !location || !concernType || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Determine priority based on concern type
    let priority = "medium"
    if (concernType === "fake_credentials" || concernType === "impersonation") {
      priority = "high"
    } else if (concernType === "expired_license") {
      priority = "medium"
    } else {
      priority = "low"
    }

    // Store report in MongoDB
    await db.collection("reports").insertOne({
      doctorName,
      licenseNumber,
      location,
      concernType,
      description,
      contactEmail,
      status: "pending",
      priority,
      reportDate: new Date().toISOString().split("T")[0],
      resolved: false,
    })

    return NextResponse.json({
      success: true,
      message: "Report submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting report:", error)
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 })
  }
}

// GET endpoint to fetch reports (admin only)
export async function GET(request: Request) {
  try {
    // In a real application, you would verify that the request is from an admin
    // This is just a simplified example

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Build query based on filters
    const query: any = {}
    if (status) query.status = status
    if (priority) query.priority = priority

    // Fetch reports from MongoDB
    const reports = await db.collection("reports").find(query).sort({ reportDate: -1 }).toArray()

    return NextResponse.json({ reports })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

