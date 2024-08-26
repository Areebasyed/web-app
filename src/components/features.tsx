// components/landing/Features.tsx
import { CheckCircle } from 'lucide-react'

const features = [
  "Create and sell services / contracts",
  "Find and buy services",
  "Secure authentication",
  "Real-time chat",
  "Online payments",
  "Notification system"
]

export default function Features() {
  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed for business growth</h2>
          <p className="text-gray-500 sm:text-xl dark:text-gray-400">Here at SkillSwap, we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth.</p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          {features.map((feature, index) => (
            <div key={index}>
              <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                <CheckCircle className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">{feature}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}