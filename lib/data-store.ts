// This file provides a simple in-memory data store as a fallback when MongoDB is not available

// Types for our data models
export interface Doctor {
  id: string
  name: string
  email: string
  licenseNumber: string
  specialization: string
  institution: string
  graduationYear: string
  address?: string
  bio?: string
  status: "pending" | "verified" | "rejected"
  submittedDate: string
  verifiedDate?: string
  expiryDate?: string
  isActive: boolean
  documents?: string[]
}

export interface Report {
  id: string
  doctorName: string
  licenseNumber?: string
  location: string
  concernType: string
  description: string
  contactEmail?: string
  status: "pending" | "investigating" | "resolved"
  priority: "high" | "medium" | "low"
  reportDate: string
  resolved: boolean
}

// Mock data
const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Jane Smith",
    email: "jane.smith@example.com",
    licenseNumber: "MD12345678",
    specialization: "Cardiology",
    institution: "Harvard Medical School",
    graduationYear: "2010",
    address: "123 Medical Center Dr, Boston, MA",
    bio: "Experienced cardiologist with over 10 years of practice",
    status: "verified",
    submittedDate: "2023-05-10",
    verifiedDate: "2023-05-15",
    expiryDate: "2025-05-15",
    isActive: true,
  },
  {
    id: "2",
    name: "Dr. Michael Johnson",
    email: "michael.johnson@example.com",
    licenseNumber: "MD87654321",
    specialization: "Neurology",
    institution: "Johns Hopkins University",
    graduationYear: "2012",
    address: "456 Health Blvd, Baltimore, MD",
    bio: "Specializing in neurological disorders and treatments",
    status: "verified",
    submittedDate: "2023-04-05",
    verifiedDate: "2023-04-10",
    expiryDate: "2025-04-10",
    isActive: true,
  },
  {
    id: "3",
    name: "Dr. Sarah Williams",
    email: "sarah.williams@example.com",
    licenseNumber: "MD23456789",
    specialization: "Pediatrics",
    institution: "Stanford Medical School",
    graduationYear: "2015",
    address: "789 Children's Way, Palo Alto, CA",
    bio: "Dedicated to providing exceptional care for children",
    status: "pending",
    submittedDate: "2023-06-13",
    isActive: false,
  },
  {
    id: "4",
    name: "Dr. Robert Brown",
    email: "robert.brown@example.com",
    licenseNumber: "MD34567890",
    specialization: "Orthopedics",
    institution: "UCLA Medical Center",
    graduationYear: "2008",
    address: "321 Bone & Joint Ave, Los Angeles, CA",
    bio: "Specializing in sports medicine and joint replacements",
    status: "verified",
    submittedDate: "2023-06-05",
    verifiedDate: "2023-06-10",
    expiryDate: "2025-06-10",
    isActive: true,
  },
  {
    id: "5",
    name: "Dr. Emily Davis",
    email: "emily.davis@example.com",
    licenseNumber: "MD45678901",
    specialization: "Dermatology",
    institution: "NYU School of Medicine",
    graduationYear: "2011",
    address: "555 Skin Health St, New York, NY",
    bio: "Expert in treating various skin conditions and cosmetic procedures",
    status: "verified",
    submittedDate: "2023-06-04",
    verifiedDate: "2023-06-09",
    expiryDate: "2025-06-09",
    isActive: true,
  },
]

const mockReports: Report[] = [
  {
    id: "1",
    doctorName: "Dr. John Doe",
    licenseNumber: "MD98765432",
    location: "Chicago, IL",
    concernType: "fake_credentials",
    description: "This doctor claims to have graduated from Harvard, but I couldn't find any record of this.",
    contactEmail: "reporter1@example.com",
    status: "pending",
    priority: "high",
    reportDate: "2023-06-12",
    resolved: false,
  },
  {
    id: "2",
    doctorName: "Dr. Lisa Anderson",
    licenseNumber: "MD56789012",
    location: "Miami Medical Center",
    concernType: "expired_license",
    description: "I believe this doctor's license has expired but they are still practicing.",
    contactEmail: "reporter2@example.com",
    status: "investigating",
    priority: "medium",
    reportDate: "2023-06-11",
    resolved: false,
  },
  {
    id: "3",
    doctorName: "Dr. Mark Wilson",
    licenseNumber: "MD67890123",
    location: "Seattle, WA",
    concernType: "impersonation",
    description: "I suspect this person is impersonating a real doctor. Their behavior seemed unprofessional.",
    status: "resolved",
    priority: "low",
    reportDate: "2023-06-10",
    resolved: true,
  },
]

// In-memory data store
class InMemoryDataStore {
  private doctors: Doctor[] = [...mockDoctors]
  private reports: Report[] = [...mockReports]

  // Doctor methods
  async getDoctors(filter = {}) {
    return this.doctors.filter((doctor) => {
      for (const [key, value] of Object.entries(filter)) {
        if (doctor[key] !== value) return false
      }
      return true
    })
  }

  async getDoctorByLicense(licenseNumber: string) {
    return this.doctors.find((doctor) => doctor.licenseNumber === licenseNumber) || null
  }

  async getDoctorById(id: string) {
    return this.doctors.find((doctor) => doctor.id === id) || null
  }

  async addDoctor(doctor: Omit<Doctor, "id">) {
    const newDoctor = {
      ...doctor,
      id: Math.random().toString(36).substring(2, 15),
    } as Doctor

    this.doctors.push(newDoctor)
    return newDoctor
  }

  async updateDoctor(id: string, updates: Partial<Doctor>) {
    const index = this.doctors.findIndex((doctor) => doctor.id === id)
    if (index === -1) return null

    this.doctors[index] = { ...this.doctors[index], ...updates }
    return this.doctors[index]
  }

  // Report methods
  async getReports(filter = {}) {
    return this.reports.filter((report) => {
      for (const [key, value] of Object.entries(filter)) {
        if (report[key] !== value) return false
      }
      return true
    })
  }

  async addReport(report: Omit<Report, "id">) {
    const newReport = {
      ...report,
      id: Math.random().toString(36).substring(2, 15),
    } as Report

    this.reports.push(newReport)
    return newReport
  }

  async updateReport(id: string, updates: Partial<Report>) {
    const index = this.reports.findIndex((report) => report.id === id)
    if (index === -1) return null

    this.reports[index] = { ...this.reports[index], ...updates }
    return this.reports[index]
  }
}

// Singleton instance
const dataStore = new InMemoryDataStore()
export default dataStore

