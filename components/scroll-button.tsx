'use client'

import { ArrowRight } from 'lucide-react'

export default function ScrollButton() {
  const handleClick = () => {
    const servicesSection = document.getElementById('services-section');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button 
      onClick={handleClick}
      className="group p-2 hover:bg-primary/10 rounded-full transition-colors flex items-center justify-center"
      aria-label="Scroll to services"
    >
      <ArrowRight className="h-6 w-6 transform rotate-90 transition-transform group-hover:translate-y-0.5" />
    </button>
  );
} 