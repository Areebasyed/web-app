import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Circle } from 'lucide-react'

const steps = [
  {
    title: "Create an Account",
    description: "Sign up and complete your profile to get started in the construction marketplace."
  },
  {
    title: "Create or Browse Services",
    description: "List your construction skills or find services you need for your project."
  },
  {
    title: "Connect and Communicate",
    description: "Use our real-time chat to discuss project details and requirements."
  },
  {
    title: "Complete the Transaction",
    description: "Securely pay for construction services through our trusted platform."
  }
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
            Get started with BuildXport in four easy steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="bg-card border-primary/10 hover:border-primary/30 transition-colors duration-300">
              <CardHeader className="relative pb-0">
                <div className="absolute -top-4 -left-4 bg-primary rounded-full p-2 shadow-lg">
                  <Circle className="w-6 h-6 text-primary-foreground" />
                  <span className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold">
                    {index + 1}
                  </span>
                </div>
                <CardTitle className="text-xl font-semibold text-foreground mt-4">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{step.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}