import { CheckCircle } from 'lucide-react'

const features = [
  {
    title: "Create and sell services",
    description: "Easily list your construction services and reach a wide audience of potential clients."
  },
  {
    title: "Find and buy services",
    description: "Browse through a variety of construction services and find the perfect match for your project."
  },
  {
    title: "Secure authentication",
    description: "Your account is protected with state-of-the-art security measures to ensure your data stays safe."
  },
  {
    title: "Real-time chat",
    description: "Communicate directly with clients or service providers to discuss project details and requirements."
  },
  {
    title: "Online payments",
    description: "Secure and convenient payment system for hassle-free transactions."
  },
  {
    title: "Notification system",
    description: "Stay updated with real-time notifications about your projects and messages."
  }
]

export default function Features() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Designed for construction industry growth
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
            At BuildXport, we focus on connecting skilled professionals with those who need their expertise, driving innovation and growth in the construction sector.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="relative p-6 bg-card rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
              <div className="absolute top-0 left-0 -mt-4 -ml-4 bg-primary rounded-full p-2">
                <CheckCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}