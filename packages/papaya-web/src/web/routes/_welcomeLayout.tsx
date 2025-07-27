import WelcomeLayout from '@/layouts/WelcomeLayout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_welcomeLayout')({
  component: WelcomeLayoutComponent,
})

function WelcomeLayoutComponent() {
  return (
    <WelcomeLayout>
      <Outlet />
    </WelcomeLayout>
  )
} 