// components/landing/CTA.tsx
import { Button } from "@/components/ui/button"
import { SignUpButton } from "@clerk/nextjs"

export default function CTA() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold leading-tight text-gray-900 dark:text-white">Start Your Journey Today</h2>
          <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">Join SkillSwap and unlock a world of opportunities. Whether you are looking to offer your skills or find the perfect service, we have got you covered.</p>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700" size={"lg"} variant={"outline"} asChild>
         <SignUpButton mode='modal' />
         </Button>
        </div>
      </div>
    </section>
  )
}