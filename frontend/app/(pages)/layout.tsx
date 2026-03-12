import { Header } from '@/components/Header';
import React from 'react'

const PagesLayout = async ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="h-full">
        <Header />
        {children}
    </div>
  )
}

export default PagesLayout;