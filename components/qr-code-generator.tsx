"use client"

import { useState, useEffect } from "react"
import QRCode from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Share2 } from "lucide-react"

interface QRCodeGeneratorProps {
  doctorId: string
  doctorName: string
  licenseNumber: string
}

export default function QRCodeGenerator({ doctorId, doctorName, licenseNumber }: QRCodeGeneratorProps) {
  const [qrValue, setQrValue] = useState("")

  useEffect(() => {
    // Create a verification URL that includes the doctor's license number
    // This URL would be used to verify the doctor when scanned
    const verificationUrl = `${window.location.origin}/verify?id=${doctorId}`
    setQrValue(verificationUrl)
  }, [doctorId])

  const downloadQRCode = () => {
    const canvas = document.getElementById("doctor-qr-code") as HTMLCanvasElement
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")

      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = `${licenseNumber}-verification-qr.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  const shareQRCode = async () => {
    const canvas = document.getElementById("doctor-qr-code") as HTMLCanvasElement
    if (canvas && navigator.share) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `${licenseNumber}-verification-qr.png`, { type: "image/png" })

          try {
            await navigator.share({
              title: `${doctorName} Verification QR Code`,
              text: "Scan this QR code to verify doctor credentials",
              files: [file],
            })
          } catch (error) {
            console.error("Error sharing QR code:", error)
          }
        }
      })
    }
  }

  return (
    <Card className="w-full max-w-xs mx-auto">
      <CardContent className="p-6 flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCode id="doctor-qr-code" value={qrValue} size={200} level="H" includeMargin renderAs="canvas" />
        </div>
        <div className="text-center">
          <p className="font-medium">{doctorName}</p>
          <p className="text-sm text-muted-foreground">{licenseNumber}</p>
        </div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1 gap-2" onClick={downloadQRCode}>
            <Download className="h-4 w-4" />
            Download
          </Button>
          {navigator.share && (
            <Button variant="outline" className="flex-1 gap-2" onClick={shareQRCode}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

