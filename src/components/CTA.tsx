import { Button } from "@/components/ui/button"
import { SignUpButton } from "@clerk/nextjs"

export default function CTA() {
  return (
    <section className="py-16 bg-primary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl mb-4">
          Start Your Construction Journey Today
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join BuildXport and unlock a world of opportunities in the construction industry. Whether you are looking to offer your skills or find the perfect service, we have got you covered.
        </p>
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
          <SignUpButton mode='modal'>Sign Up Now</SignUpButton>
        </Button>
      </div>
    </section>
  )
}