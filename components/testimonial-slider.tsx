"use client"

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Quote } from 'lucide-react'
import { testimonials } from '@/lib/data'

export default function TestimonialSlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }, [])
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [nextSlide])
  
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="absolute -top-6 left-0 text-primary opacity-20">
        <Quote className="h-20 w-20" />
      </div>
      
      {testimonials.map((testimonial, index) => (
        <div 
          key={index}
          className={cn(
            "transition-opacity duration-500 p-6 text-center",
            activeIndex === index ? "opacity-100" : "opacity-0 absolute inset-0"
          )}
        >
          <p className="text-xl md:text-2xl font-playfair italic mb-8 relative z-10">
            "{testimonial.quote}"
          </p>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 relative rounded-full overflow-hidden mb-4 border-2 border-primary">
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold">{testimonial.name}</h4>
              <p className="text-sm text-muted-foreground">{testimonial.title}, {testimonial.company}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}