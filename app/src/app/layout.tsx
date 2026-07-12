'use client';

// import { montserrat } from '@/fonts/montserrat'
import AppThemeLayout from '@/components/layouts/AppThemeLayout';
import dynamic from 'next/dynamic';

const AppDataLayout = dynamic(() => import('@/components/layouts/AppDataLayout'), {
  ssr: false,
})

export default function RootLayout(props: LayoutProps<'/'>) {
  return (
    <html>
      <body>
        <AppThemeLayout>
          <main id='papaya-app'>
            <AppDataLayout>
              {props.children}
            </AppDataLayout>
          </main>
        </AppThemeLayout>
      </body>
    </html>
  )
}
