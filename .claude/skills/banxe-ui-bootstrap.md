# Skill: banxe-ui-bootstrap
# Generate a new page/screen for banxe-platform

## Trigger
User asks to "add a page", "create a screen", or "scaffold UI for X"

## Web page scaffold
```tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@banxe/shared'

export default function XxxPage() {
  const router = useRouter()
  const { token, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/auth/login'); return }
    // fetch data
  }, [token, isAuthenticated])

  return (
    <main className="min-h-screen bg-bg px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* page content */}
      </div>
    </main>
  )
}
```

## Mobile screen scaffold
```tsx
import { View, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '@banxe/shared'

export default function XxxScreen() {
  const { isAuthenticated } = useAuthStore()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* screen content */}
      </ScrollView>
    </SafeAreaView>
  )
}
```

## Rules
- Always import from @banxe/shared (never hardcode types)
- Always check isAuthenticated
- Always add accessibilityLabel / accessibilityRole
- Never use float for amounts
- Add corresponding test in tests/web/ or tests/mobile/
