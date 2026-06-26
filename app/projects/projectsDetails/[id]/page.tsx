import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { projects } from '../data'
import { ArrowLeft } from 'lucide-react'
import './styles.css'

export function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }))
}

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const project = projects.find(p => p.id === params.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors mb-24"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects List</span>
        </Link>

        <div className="mb-8">
          <div className="relative w-full aspect-[21/9] mb-6 rounded-lg overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary" className="text-sm">
              {project.category}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-muted rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="prose prose-lg max-w-none text-foreground space-y-6">
          {typeof project.description === 'string' ? (
            <p>{project.description}</p>
          ) : (
            project.description
          )}
        </div>
      </div>
    </div>
  )
} 