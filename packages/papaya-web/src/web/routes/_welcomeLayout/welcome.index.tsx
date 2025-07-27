import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_welcomeLayout/welcome/')({
  loader: async ({ context }) => {
    // For now, use a simple heuristic - if user has papayaMeta, assume they've started
    // In a real app, you'd check for a specific "hasCompletedWelcome" flag
    const hasStarted = false // Placeholder logic - always show getting-started for now

    if (hasStarted) {
      throw redirect({
        to: '/welcome/start',
      })
    } else {
      throw redirect({
        to: '/welcome/getting-started',
      })
    }
  },
}) 