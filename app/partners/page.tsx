import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { partners } from '@/lib/data'

export default function PartnersPage() {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
              Our Partners
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're proud to collaborate with forward-thinking organizations across various industries.
            </p>
          </div>
        </div>
      </section>
      
      {/* Partners Grid */}
      <section className="pb-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <div key={index} className="bg-card rounded-lg border border-border hover:border-primary/50 transition-all duration-300">
                <div className="h-48 relative overflow-hidden">
                  <Image 
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{partner.name}</h3>
                  <p className="text-muted-foreground mb-6">{partner.description}</p>
                  <blockquote className="border-l-2 border-primary pl-4 italic text-sm text-muted-foreground">
                    "{partner.testimonial}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Partnership Approach */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                Our Partnership Approach
              </h2>
              <p className="text-muted-foreground mb-8">
                We believe that true partnerships are built on shared values, open communication, and mutual growth. Here's how we work with our partners:
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    title: 'Collaborative Process',
                    description: 'We work closely with our partners at every stage, ensuring your voice is heard and your vision is realized.'
                  },
                  {
                    title: 'Long-term Relationships',
                    description: 'We focus on building lasting partnerships rather than one-off projects, allowing us to deeply understand your evolving needs.'
                  },
                  {
                    title: 'Shared Success',
                    description: 'Your success is our success. We measure our results by the positive impact we create for your business.'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Partnership approach"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Partnership Benefits */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">Partnership Benefits</h2>
            <p className="text-muted-foreground text-lg">
              What you can expect when you partner with Ascent
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Strategic Expertise',
                description: 'Access to our team of strategists, designers, and developers who bring years of experience to your projects.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 1 0 9 4.5 4.5 0 0 0 0-9 4.5 4.5 0 0 1 0-9Z"/>
                    <path d="M12 12h8.5"/>
                    <path d="M12 12H3.5"/>
                  </svg>
                )
              },
              {
                title: 'Innovative Solutions',
                description: 'We stay ahead of industry trends and technologies to bring innovative solutions to your challenges.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                    <path d="M2 12h1"/>
                    <path d="M6 12h1"/>
                    <path d="M10 12h1"/>
                    <path d="M14 12h1"/>
                    <path d="M18 12h1"/>
                    <path d="M22 12h1"/>
                    <path d="M12 2v1"/>
                    <path d="M12 6v1"/>
                    <path d="M12 10v1"/>
                    <path d="M12 14v1"/>
                    <path d="M12 18v1"/>
                    <path d="M12 22v1"/>
                    <circle cx="12" cy="12" r="9"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="12" cy="12" r="1"/>
                  </svg>
                )
              },
              {
                title: 'Dedicated Support',
                description: 'A dedicated team that\'s committed to your success, with ongoing support and optimization.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                )
              },
              {
                title: 'Results-Driven Approach',
                description: 'We focus on measurable outcomes that align with your business objectives and drive growth.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                )
              },
              {
                title: 'Transparent Communication',
                description: 'Clear and open communication throughout our partnership, with regular updates and insights.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                )
              },
              {
                title: 'Industry Connections',
                description: 'Access to our network of industry connections and resources to amplify your reach and impact.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
                  </svg>
                )
              }
            ].map((benefit, index) => (
              <div key={index} className="p-8 bg-card rounded-lg border border-border">
                <div className="text-primary mb-6">{benefit.icon}</div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Become a Partner */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                Become a Partner
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Interested in partnering with Ascent? Let's explore how we can create value together. Our partnership team is ready to discuss potential collaborations.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  Start the Conversation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Partnership"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}