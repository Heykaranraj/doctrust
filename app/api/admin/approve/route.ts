import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { registerDoctor } from "@/lib/blockchain"

// POST endpoint to approve a doctor
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { doctorId, adminAddress } = body

    if (!doctorId) {
      return NextResponse.json({ error: "Doctor ID is required" }, { status: 400 })
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase()

    // Find the doctor in the database
    const doctor = await db.collection("doctors").findOne({ id: doctorId })

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    if (doctor.status === "verified") {
      return NextResponse.json({ error: "Doctor is already verified" }, { status: 400 })
    }

    // Calculate expiry date (2 years from now)
    const expiryDate = Math.floor((Date.now() + 2 * 365 * 24 * 60 * 60 * 1000) / 1000)

    // Register doctor on blockchain
    const result = await registerDoctor(
      doctor.licenseNumber,
      doctor.name,
      doctor.specialization,
      doctor.institution,
      doctor.graduationYear,
      expiryDate,
      adminAddress || "0x1234567890123456789012345678901234567890", // Use dummy address if not provided
    )

    if (!result.success) {
      return NextResponse.json({ error: "Failed to register doctor on blockchain" }, { status: 500 })
    }

    // Update doctor status in database
    await db.collection("doctors").updateOne(
      { id: doctorId },
      {
        $set: {
          status: "verified",
          verifiedDate: new Date().toISOString().split("T")[0],
          expiryDate: new Date(expiryDate * 1000).toISOString().split("T")[0],
          isActive: true,
          transactionHash: result.transactionHash,
        },
      },
    )

    return NextResponse.json({
      success: true,
      message: "Doctor approved and registered on blockchain",
      transactionHash: result.transactionHash,
    })
  } catch (error) {
    console.error("Error approving doctor:", error)
    return NextResponse.json({ error: "Failed to approve doctor" }, { status: 500 })
  }
}

