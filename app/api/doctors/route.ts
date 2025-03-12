import { NextResponse } from "next/server"
import { getDoctorInfo } from "@/lib/blockchain"
import { connectToDatabase } from "@/lib/mongodb"

// GET endpoint to fetch doctor information by license number
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const licenseNumber = searchParams.get("licenseNumber")

  if (!licenseNumber) {
    return NextResponse.json({ error: "License number is required" }, { status: 400 })
  }

  try {
    // Get doctor info from blockchain
    const result = await getDoctorInfo(licenseNumber)

    if (!result.success) {
      return NextResponse.json({ error: "Doctor not found or blockchain error" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching doctor:", error)
    return NextResponse.json({ error: "Failed to fetch doctor information" }, { status: 500 })
  }
}

// POST endpoint to register a new doctor
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { licenseNumber, name, specialization, institution, graduationYear, expiryDate, email, address, bio } = body

    // Validate required fields
    if (!licenseNumber || !name || !specialization || !institution || !graduationYear || !expiryDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Store additional information in MongoDB
    const { db } = await connectToDatabase()

    // Check if doctor already exists in MongoDB
    const existingDoctor = await db.collection("doctors").findOne({ licenseNumber })

    if (existingDoctor) {
      return NextResponse.json({ error: "Doctor with this license number already exists" }, { status: 409 })
    }

    // Store in MongoDB (pending verification)
    await db.collection("doctors").insertOne({
      licenseNumber,
      name,
      email,
      specialization,
      institution,
      graduationYear,
      address,
      bio,
      status: "pending",
      submittedDate: new Date().toISOString().split("T")[0],
      isActive: false,
      documents: body.documents || [],
    })

    // Note: The actual blockchain registration would happen after admin approval
    // This is just the initial registration request

    return NextResponse.json({
      success: true,
      message: "Doctor registration submitted for verification",
    })
  } catch (error) {
    console.error("Error registering doctor:", error)
    return NextResponse.json({ error: "Failed to register doctor" }, { status: 500 })
  }
}

