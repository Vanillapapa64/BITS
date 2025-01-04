import { Button } from "@/components/ui/button";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Search, FileText, Hospital, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">HealthHub</div>
          <div className="space-x-4">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button variant="outline">Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Your Health, Your Control</h1>
          <p className="text-xl text-gray-600 mb-8">
            Find hospitals and manage your medical documents with ease.
          </p>
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" className="text-lg">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button size="lg" className="text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignInButton>
          </SignedOut>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <Search className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Hospital Search</h3>
                <p className="text-gray-600">
                  Find the right hospital for your needs with our advanced
                  search feature.
                </p>
              </div>
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Document Storage</h3>
                <p className="text-gray-600">
                  Securely store and access your medical documents anytime,
                  anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                <p className="text-gray-600">Create your account in minutes.</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Search Hospitals</h3>
                <p className="text-gray-600">
                  Find hospitals that meet your criteria.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Manage Documents</h3>
                <p className="text-gray-600">
                  Upload and organize your medical records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-blue-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xl mb-8">
              Join HealthHub today and experience healthcare management like
              never before.
            </p>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="text-lg">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <Button size="lg" variant="secondary" className="text-lg">
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignedOut>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 HealthHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
