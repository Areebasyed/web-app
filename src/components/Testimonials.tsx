// components/landing/Testimonials.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Sarah L.",
    role: "Freelance Designer",
    content: "SkillSwap has been a game-changer for my freelance business. The platform is intuitive and the payment system is reliable.",
    avatar: "/path-to-avatar-1.jpg"
  },
  {
    name: "John D.",
    role: "Small Business Owner",
    content: "I've found amazing talent on SkillSwap. The real-time chat feature makes communication a breeze.",
    avatar: "/path-to-avatar-2.jpg"
  }
]

export default function Testimonials() {
  return (
    <section className="bg-white dark:bg-gray-800">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Testimonials</h2>
          <p className="mb-8 font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">Discover how SkillSwap is helping professionals and businesses grow.</p>
        </div> 
        <div className="grid mb-8 lg:mb-12 lg:grid-cols-2 gap-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <Avatar>
                  <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <CardTitle>{testimonial.name}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}