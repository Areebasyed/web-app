import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { QuoteIcon } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah L.",
    role: "Independent Contractor",
    content: "BuildXpert has been a game-changer for my construction business. The platform is intuitive and the payment system is reliable.",
    avatar: "/path-to-avatar-1.jpg"
  },
  {
    name: "John D.",
    role: "Construction Company Owner",
    content: "I've found amazing talent on BuildXpert. The real-time chat feature makes communication with subcontractors a breeze.",
    avatar: "/path-to-avatar-2.jpg"
  }
]

export default function Testimonials() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto">
            Discover how BuildXport is helping construction professionals and businesses grow.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-primary/10 hover:border-primary/30 transition-colors duration-300">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <QuoteIcon className="absolute top-0 left-0 w-8 h-8 text-primary/20" />
                <p className="pl-10 text-muted-foreground italic">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}