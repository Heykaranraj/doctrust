import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, UserCheck, QrCode, AlertTriangle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DocVerify</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/verify" className="text-sm font-medium">
              Verify Doctor
            </Link>
            <Link href="/report" className="text-sm font-medium">
              Report
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Verify Doctor Credentials with Blockchain
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  DocVerify uses blockchain technology to securely verify doctor licenses and credentials, ensuring
                  trust and transparency in healthcare.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/verify">
                  <Button size="lg" className="gap-2">
                    <QrCode className="h-5 w-5" />
                    Verify a Doctor
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg">
                    Register as a Doctor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <UserCheck className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Doctor Registration</CardTitle>
                  <CardDescription>Doctors can register their credentials securely on the blockchain</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Submit your license number, certifications, and credentials through our secure form. Once verified
                    by admins, your information is stored on the blockchain.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/register" className="w-full">
                    <Button className="w-full">Register Now</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <QrCode className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>QR Code Verification</CardTitle>
                  <CardDescription>Patients can verify doctor credentials by scanning QR codes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Each verified doctor receives a unique QR code. Patients can scan this code to instantly verify the
                    doctor's credentials from the blockchain.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/verify" className="w-full">
                    <Button variant="outline" className="w-full">
                      Verify a Doctor
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <AlertTriangle className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Report Suspicious Activity</CardTitle>
                  <CardDescription>Help maintain integrity by reporting suspicious practitioners</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    If you encounter suspicious activity or potential fraud, our reporting system allows you to submit
                    concerns that will be reviewed by our admin team.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/report" className="w-full">
                    <Button variant="outline" className="w-full">
                      Report
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 px-4 md:px-6 items-center justify-between">
          <p className="text-sm text-muted-foreground">© 2023 DocVerify. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

