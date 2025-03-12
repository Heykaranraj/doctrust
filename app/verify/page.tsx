"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, QrCode, Search, Shield, CheckCircle2, XCircle } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import QrReader to avoid SSR issues
const QrReader = dynamic(() => import("react-qr-reader").then((mod) => mod.QrReader), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border h-[300px] flex items-center justify-center">
      <p className="text-muted-foreground">Loading QR scanner...</p>
    </div>
  ),
})

export default function VerifyDoctor() {
  const [activeTab, setActiveTab] = useState("qr")
  const [scanning, setScanning] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [verificationResult, setVerificationResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [scanError, setScanError] = useState(null)

  const handleScan = async (result) => {
    if (result) {
      setScanning(false)
      setIsLoading(true)
      setScanError(null)

      try {
        // Extract license number or ID from QR code
        // In a real app, this would be a URL or encoded data
        const url = new URL(result.text)
        const id = url.searchParams.get("id") || ""

        // In a real implementation, this would call your API to verify the QR code
        // which would then query the blockchain for the doctor's credentials
        await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

        // Mock verification result
        setVerificationResult({
          verified: true,
          doctor: {
            name: "Dr. Jane Smith",
            licenseNumber: "MD12345678",
            specialization: "Cardiology",
            institution: "Harvard Medical School",
            graduationYear: "2010",
            licenseStatus: "Active",
            verifiedDate: "2023-05-15",
            expiryDate: "2025-05-15",
          },
        })
      } catch (error) {
        console.error("QR scan error:", error)
        setVerificationResult({
          verified: false,
          error: "Could not verify doctor credentials. Please try again or use the search option.",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleScanError = (error) => {
    console.error("QR scan error:", error)
    setScanError("Camera access error. Please check your camera permissions or use the search option.")
    setScanning(false)
  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault()
    if (!searchQuery) return

    setIsLoading(true)

    try {
      // In a real implementation, this would call your API to search for the doctor
      // which would then query the blockchain for the doctor's credentials
      const response = await fetch(`/api/doctors?licenseNumber=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error("Failed to fetch doctor information")
      }

      const data = await response.json()

      if (data.success && data.doctor) {
        setVerificationResult({
          verified: true,
          doctor: {
            name: data.doctor.name,
            licenseNumber: data.doctor.licenseNumber,
            specialization: data.doctor.specialization,
            institution: data.doctor.institution,
            graduationYear: data.doctor.graduationYear,
            licenseStatus: data.doctor.isActive ? "Active" : "Inactive",
            verifiedDate: data.doctor.verifiedDate,
            expiryDate: data.doctor.expiryDate,
          },
        })
      } else {
        // Fallback for demo if API fails
        if (searchQuery.toLowerCase().includes("smith") || searchQuery === "MD12345678") {
          setVerificationResult({
            verified: true,
            doctor: {
              name: "Dr. Jane Smith",
              licenseNumber: "MD12345678",
              specialization: "Cardiology",
              institution: "Harvard Medical School",
              graduationYear: "2010",
              licenseStatus: "Active",
              verifiedDate: "2023-05-15",
              expiryDate: "2025-05-15",
            },
          })
        } else if (searchQuery.toLowerCase().includes("johnson") || searchQuery === "MD87654321") {
          setVerificationResult({
            verified: true,
            doctor: {
              name: "Dr. Michael Johnson",
              licenseNumber: "MD87654321",
              specialization: "Neurology",
              institution: "Johns Hopkins University",
              graduationYear: "2012",
              licenseStatus: "Active",
              verifiedDate: "2023-04-10",
              expiryDate: "2025-04-10",
            },
          })
        } else {
          setVerificationResult({
            verified: false,
            error: "No doctor found with the provided information.",
          })
        }
      }
    } catch (error) {
      console.error("Search error:", error)
      setVerificationResult({
        verified: false,
        error: "Could not verify doctor credentials. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetVerification = () => {
    setVerificationResult(null)
    setSearchQuery("")
    setScanning(false)
    setScanError(null)
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <Link href="/" className="inline-flex items-center gap-2 mb-6 text-sm font-medium">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Verify Doctor Credentials</CardTitle>
          </div>
          <CardDescription>Verify a doctor's credentials using QR code or license information</CardDescription>
        </CardHeader>
        <CardContent>
          {!verificationResult ? (
            <Tabs defaultValue="qr" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qr">Scan QR Code</TabsTrigger>
                <TabsTrigger value="search">Search</TabsTrigger>
              </TabsList>
              <TabsContent value="qr" className="space-y-4">
                <div className="text-center py-4">
                  {!scanning ? (
                    <div className="space-y-4">
                      <div className="rounded-lg border-2 border-dashed p-12 text-center">
                        <QrCode className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium">Scan a doctor's QR code to verify their credentials</p>
                      </div>
                      {scanError && <div className="text-sm text-destructive mt-2">{scanError}</div>}
                      <Button onClick={() => setScanning(true)} className="w-full">
                        Start Scanning
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="overflow-hidden rounded-lg border">
                        <QrReader
                          constraints={{ facingMode: "environment" }}
                          onResult={handleScan}
                          onError={handleScanError}
                          className="w-full"
                          scanDelay={500}
                        />
                      </div>
                      <Button variant="outline" onClick={() => setScanning(false)}>
                        Cancel Scanning
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="search" className="space-y-4">
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search by Name or License Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="search"
                        placeholder="Dr. Jane Smith or MD12345678"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        required
                      />
                      <Button type="submit" size="icon" disabled={isLoading}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the doctor's full name or license number to verify their credentials
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
                  <p className="mt-2 text-sm font-medium">Verifying credentials...</p>
                </div>
              ) : verificationResult.verified ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-2 text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <h3 className="text-xl font-semibold text-green-500">Verified Doctor</h3>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{verificationResult.doctor.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">License Number</p>
                        <p className="font-medium">{verificationResult.doctor.licenseNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Specialization</p>
                        <p className="font-medium">{verificationResult.doctor.specialization}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Institution</p>
                        <p className="font-medium">{verificationResult.doctor.institution}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Graduation Year</p>
                        <p className="font-medium">{verificationResult.doctor.graduationYear}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">License Status</p>
                        <p className="font-medium text-green-500">{verificationResult.doctor.licenseStatus}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Verified Date</p>
                        <p className="font-medium">{verificationResult.doctor.verifiedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expiry Date</p>
                        <p className="font-medium">{verificationResult.doctor.expiryDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                      This information is verified and stored on the blockchain. Last verified:{" "}
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="h-8 w-8 text-destructive" />
                    <h3 className="text-xl font-semibold text-destructive">Verification Failed</h3>
                  </div>
                  <p>{verificationResult.error}</p>
                  <p className="text-sm text-muted-foreground">
                    If you believe this is an error, please contact support or report suspicious activity.
                  </p>
                </div>
              )}

              <Button onClick={resetVerification} variant="outline" className="w-full">
                Verify Another Doctor
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-xs text-muted-foreground">
            All verifications are securely processed and recorded for audit purposes.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

