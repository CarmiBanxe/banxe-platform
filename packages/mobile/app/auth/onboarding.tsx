import { useRef, useState } from 'react'
import { View, Text, Pressable, Dimensions, ScrollView } from 'react-native'
import { router } from 'expo-router'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const SLIDES = [
  {
    title: 'BANXE AI Bank',
    subtitle: 'FCA-authorised EMI for the AI era',
    icon: '🏦',
    color: '#1A2B6B',
  },
  {
    title: 'Instant transfers',
    subtitle: 'Send money via Faster Payments in seconds. PSD2 SCA protected.',
    icon: '⚡',
    color: '#00C6AE',
  },
  {
    title: 'Smart compliance',
    subtitle: 'Real-time safeguarding reconciliation. CASS 7.15 compliant.',
    icon: '✓',
    color: '#1A2B6B',
  },
]

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const scrollX = useSharedValue(0)
  const scrollRef = useRef<ScrollView>(null)

  const goToNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      const next = currentSlide + 1
      scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true })
      setCurrentSlide(next)
    } else {
      router.replace('/auth/login' as never)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1A2B6B' }} accessibilityRole="main">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => { scrollX.value = e.nativeEvent.contentOffset.x }}
      >
        {SLIDES.map((slide, i) => (
          <View
            key={slide.title}
            style={{ width: SCREEN_WIDTH, flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}
            accessible
            accessibilityLabel={`Slide ${i + 1} of ${SLIDES.length}: ${slide.title}`}
          >
            <Text style={{ fontSize: 72, marginBottom: 24 }} accessibilityElementsHidden>{slide.icon}</Text>
            <Text style={{ fontSize: 32, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginBottom: 16 }}>
              {slide.title}
            </Text>
            <Text style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 24 }}>
              {slide.subtitle}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            accessible={false}
            style={{
              width: i === currentSlide ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === currentSlide ? '#00C6AE' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </View>

      <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        <Pressable
          onPress={goToNext}
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#00b09c' : '#00C6AE',
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
          })}
          accessibilityRole="button"
          accessibilityLabel={currentSlide === SLIDES.length - 1 ? 'Get started' : 'Next slide'}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
            {currentSlide === SLIDES.length - 1 ? 'Get started' : 'Next →'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
