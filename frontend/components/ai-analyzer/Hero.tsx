import React from 'react'
import { Sparkles } from 'lucide-react'

const Hero = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto">
        <div className="w-16 h-16 bg-[#2772CE]/10 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="text-[#2772CE]" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-[#1F2324] mb-4 tracking-tight">
            How can I help you today?
        </h1>
        <p className="text-lg text-[#5A5E63] leading-relaxed">
            I can analyze your data, generate insightful charts, and help you 
            make sense of complex business metrics in seconds.
        </p>
    </div>
  )
}

export default Hero