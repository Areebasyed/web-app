import { Button } from "@/components/ui/button"
import { SignInButton } from "@clerk/nextjs"
import Image from 'next/image'

export default function Hero() {
  const imageSrc='/constructionWorker.jpg'
  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background dark:from-primary/10 dark:to-background"></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="text-center lg:text-left lg:w-1/2">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight leading-none text-foreground sm:text-5xl lg:text-6xl">
              Your Skills, Your Market
            </h1>
            <p className="mb-8 text-lg font-normal text-muted-foreground sm:text-xl max-w-2xl mx-auto lg:mx-0">
              BuildXpert connects talented individuals with those seeking services. Create, sell, or buy services with ease and security in the construction industry.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <SignInButton mode='modal'>Get Started</SignInButton>
              </Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:w-1/2">
            <div className="relative">
              <Image 
                src={imageSrc} 
                alt="Construction workers" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
                <p className="font-bold text-lg">Join 10,000+ professionals</p>
                <p className="text-sm">Building the future, one project at a time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}