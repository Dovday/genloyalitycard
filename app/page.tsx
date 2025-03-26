import { LoyaltyCardGenerator } from "@/components/loyalty-card-generator"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-gray-100">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Digital Card Wallet</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <LoyaltyCardGenerator />
        </div>
      </div>
    </main>
  )
}

