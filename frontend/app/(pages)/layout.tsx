import { Header } from '@/components/Header';
import { cookies } from 'next/headers';
import React from 'react'

const PagesLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookiesStore = await cookies()
  const token = cookiesStore.get("jwt_token")?.value;

  return (
    <div className="h-full">
        <Header />
        {children}
    </div>
  )
}

export default PagesLayout;