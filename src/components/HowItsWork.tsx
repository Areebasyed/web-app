// components/landing/HowItWorks.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  {
    title: "Create an Account",
    description: "Sign up and complete your profile to get started."
  },
  {
    title: "Create or Browse Services",
    description: "List your skills or find services you need."
  },
  {
    title: "Connect and Communicate",
    description: "Use our real-time chat to discuss details."
  },
  {
    title: "Complete the Transaction",
    description: "Securely pay for services through our platform."
  }
]

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <h2 className="mb-8 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">How It Works</h2>
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-12 md:space-y-0">
          {steps.map((step, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}