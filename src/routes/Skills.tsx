import { useState } from 'react'
import { SEO } from '../components/SEO'
import { Section } from '../components/Section'
import { cvData } from '../content/cv'
import type { SkillShowcase } from '../types'

function ShowcaseCard({ showcase, index }: { showcase: SkillShowcase; index: number }) {
  const [activeImage, setActiveImage] = useState(0)
  const hasImages = showcase.images.length > 0
  const isEven = index % 2 === 0

  return (
    <div className={`flex flex-col ${hasImages ? 'lg:flex-row' : ''} gap-6 lg:gap-10 items-center`}>
      {/* Text side */}
      <div className={`flex-1 ${hasImages && !isEven ? 'lg:order-2' : ''}`}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {showcase.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-5 leading-relaxed">
          {showcase.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {showcase.tools.map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Image side */}
      {hasImages && (
        <div className={`flex-1 w-full ${!isEven ? 'lg:order-1' : ''}`}>
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
            <img
              src={showcase.images[activeImage]}
              alt={`${showcase.title} screenshot`}
              className="w-full h-auto object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          {showcase.images.length > 1 && (
            <div className="flex gap-2 mt-3 justify-center">
              {showcase.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-10 rounded-md overflow-hidden border-2 transition-all ${
                    i === activeImage
                      ? 'border-blue-500 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${showcase.title} thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Skills() {
  return (
    <>
      <SEO
        title="Skills"
        description={`Skills and expertise of ${cvData.person.name}`}
      />

      <Section
        title="Skills & Expertise"
        description="A mix of business, engineering, and technology skills built through running real ventures and building real products"
        centered
      >
        <div className="max-w-5xl mx-auto">
          <div className="space-y-16">
            {cvData.skills.showcases.map((showcase, index) => (
              <ShowcaseCard key={showcase.title} showcase={showcase} index={index} />
            ))}
          </div>
        </div>
      </Section>
    </>
  )
}
