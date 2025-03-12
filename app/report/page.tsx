"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReportPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    doctorName: "",
    licenseNumber: "",
    location: "",
    concernType: "",
    description: "",
    contactEmail: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, concernType: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real implementation, this would connect to your backend API
      // which would then store the report in MongoDB
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      setIsSubmitted(true)
      toast({
        title: "Report submitted",
        description: "Thank you for your report. Our team will review it shortly.",
      })
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      doctorName: "",
      licenseNumber: "",
      location: "",
      concernType: "",
      description: "",
      contactEmail: "",
    })
    setIsSubmitted(false)
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
            <AlertTriangle className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Report Suspicious Activity</CardTitle>
          </div>
          <CardDescription>
            Help maintain the integrity of healthcare by reporting suspicious practitioners
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="doctorName">Doctor's Name</Label>
                <Input
                  id="doctorName"
                  name="doctorName"
                  placeholder="Dr. John Doe"
                  value={formData.doctorName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number (if known)</Label>
                <Input
                  id="licenseNumber"
                  name="licenseNumber"
                  placeholder="MD12345678"
                  value={formData.licenseNumber}
                  placeholder="MD12345678"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="City, State or Medical Facility"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Type of Concern</Label>
                <RadioGroup value={formData.concernType} onValueChange={handleRadioChange} required>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fake_credentials" id="fake_credentials" />
                    <Label htmlFor="fake_credentials">Fake or Falsified Credentials</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="impersonation" id="impersonation" />
                    <Label htmlFor="impersonation">Impersonating a Licensed Doctor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expired_license" id="expired_license" />
                    <Label htmlFor="expired_license">Practicing with Expired License</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other Concern</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description of Concern</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please provide details about your concern..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Your Email (optional)</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.contactEmail}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  Provide your email if you'd like to be contacted about this report
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="consent" className="rounded border-gray-300" required />
                  <Label htmlFor="consent" className="text-sm font-normal">
                    I confirm that this report is made in good faith and the information provided is accurate to the
                    best of my knowledge
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 py-4">
              <div className="flex flex-col items-center justify-center text-center gap-2">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <h3 className="text-xl font-semibold">Report Submitted Successfully</h3>
                <p className="text-muted-foreground">
                  Thank you for helping maintain the integrity of healthcare. Our team will review your report and take
                  appropriate action.
                </p>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <p className="font-medium">What happens next?</p>
                <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                  <li>Our admin team will review your report</li>
                  <li>If necessary, we'll investigate the reported practitioner</li>
                  <li>Appropriate actions will be taken based on findings</li>
                  <li>If you provided an email, we may contact you for additional information</li>
                </ul>
              </div>

              <Button onClick={resetForm} variant="outline" className="w-full">
                Submit Another Report
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-xs text-muted-foreground">
            All reports are confidential and will be handled with discretion.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

