import RecentConvs from '@/components/ai-analyzer/RecentConvs'
import React from 'react'

const AIAnalyzerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-full text-text-primary">
        <RecentConvs/>
        <main className="flex-1 h-full flex flex-col relative overflow-hidden py-7 px-5">
            {children}
        </main>
    </div>
  )
}

export default AIAnalyzerLayout