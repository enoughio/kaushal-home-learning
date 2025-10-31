'use server';

import SideNav from '@/components/layout/SideNav';
import React from 'react'


export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Let the document body handle scrolling; make sidebar sticky on md+.
    <div className="flex flex-col md:flex-row">
      <div className="w-full flex-none md:w-64 md:sticky md:top-0 md:max-h-screen">
        <SideNav />
      </div>
      <div className="flex-1 p-6 min-h-screen md:p-12">{children}</div>
    </div>
  );
}