// components/landing/CTA.tsx
import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-gray-900 dark:text-white">Start Your Journey Today</h2>
          <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">Join SkillSwap and unlock a world of opportunities. Whether you are looking to offer your skills or find the perfect service, we have got you covered.</p>
          <Button size="lg">Sign Up Now</Button>
        </div>
      </div>
    </section>
  )
}