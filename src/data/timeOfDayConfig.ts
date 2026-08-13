export type TimeOfDayPeriod = 'morning' | 'afternoon' | 'sunset' | 'night';

export interface TimeOfDayConfig {
  id: TimeOfDayPeriod;
  name: string;
  sublabel: string;
  hoursRange: string;
  bgImageBoy: string;
  bgImageGirl: string;
  gradientOverlay: string;
  vignetteGradient: string;
  sunlightGlow: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentColor: string;
  skyTint: string;
  rainColor: string;
  dustColor: string;
}

export const TIME_OF_DAY_CONFIGS: Record<TimeOfDayPeriod, TimeOfDayConfig> = {
  morning: {
    id: 'morning',
    name: 'Morning Focus',
    sublabel: 'Dawn Breeze & Soft Golden Sun',
    hoursRange: '05:00 AM - 11:59 AM',
    bgImageBoy: '/src/assets/images/lofi_morning_desk_1786609078280.jpg',
    bgImageGirl: '/src/assets/images/lofi_girl_morning_1786609416097.jpg',
    gradientOverlay: 'from-[#FFB703]/20 via-[#0F172A]/15 to-[#07131F]/80',
    vignetteGradient: 'from-[#07131F]/80 via-[#07131F]/15 to-[#FFB703]/20',
    sunlightGlow: 'bg-[#FFD166]/30',
    badgeBg: 'bg-[#FFB703]/20',
    badgeText: 'text-[#FFD166]',
    badgeBorder: 'border-[#FFB703]/50',
    accentColor: '#FFD166',
    skyTint: 'bg-[#FFB703]/10',
    rainColor: 'rgba(255, 209, 102, 0.4)',
    dustColor: 'rgba(255, 225, 160, 0.6)'
  },
  afternoon: {
    id: 'afternoon',
    name: 'Afternoon Flow',
    sublabel: 'Bright Daylight & Blue Sky Productivity',
    hoursRange: '12:00 PM - 04:59 PM',
    bgImageBoy: '/src/assets/images/lofi_afternoon_desk_1786609097377.jpg',
    bgImageGirl: '/src/assets/images/lofi_girl_afternoon_1786609430866.jpg',
    gradientOverlay: 'from-[#38BDF8]/20 via-[#0F172A]/15 to-[#07131F]/80',
    vignetteGradient: 'from-[#07131F]/80 via-[#07131F]/15 to-[#38BDF8]/20',
    sunlightGlow: 'bg-[#38BDF8]/30',
    badgeBg: 'bg-[#38BDF8]/20',
    badgeText: 'text-[#38BDF8]',
    badgeBorder: 'border-[#38BDF8]/50',
    accentColor: '#38BDF8',
    skyTint: 'bg-[#38BDF8]/10',
    rainColor: 'rgba(56, 189, 248, 0.4)',
    dustColor: 'rgba(224, 242, 254, 0.6)'
  },
  sunset: {
    id: 'sunset',
    name: 'Golden Twilight',
    sublabel: 'Warm Crimson Dusk & Sunset Chill',
    hoursRange: '05:00 PM - 08:59 PM',
    bgImageBoy: '/src/assets/images/lofi_sunset_desk_1786609116447.jpg',
    bgImageGirl: '/src/assets/images/lofi_girl_sunset_1786609443598.jpg',
    gradientOverlay: 'from-[#F43F5E]/20 via-[#8B5CF6]/15 to-[#07131F]/85',
    vignetteGradient: 'from-[#07131F]/85 via-[#07131F]/15 to-[#F43F5E]/20',
    sunlightGlow: 'bg-[#F43F5E]/30',
    badgeBg: 'bg-[#F43F5E]/20',
    badgeText: 'text-[#FB7185]',
    badgeBorder: 'border-[#F43F5E]/50',
    accentColor: '#FB7185',
    skyTint: 'bg-[#F43F5E]/10',
    rainColor: 'rgba(251, 113, 133, 0.4)',
    dustColor: 'rgba(254, 205, 211, 0.6)'
  },
  night: {
    id: 'night',
    name: 'Late Night Lo-Fi',
    sublabel: 'Cozy Midnight & Cyber Ambient',
    hoursRange: '09:00 PM - 04:59 AM',
    bgImageBoy: '/src/assets/images/lofi_night_desk_1786609129053.jpg',
    bgImageGirl: '/src/assets/images/lofi_girl_night_1786609456734.jpg',
    gradientOverlay: 'from-[#22C7F2]/15 via-[#07131F]/30 to-[#030712]/90',
    vignetteGradient: 'from-[#07131F]/90 via-[#07131F]/20 to-[#22C7F2]/15',
    sunlightGlow: 'bg-[#22C7F2]/25',
    badgeBg: 'bg-[#22C7F2]/20',
    badgeText: 'text-[#22C7F2]',
    badgeBorder: 'border-[#22C7F2]/50',
    accentColor: '#22C7F2',
    skyTint: 'bg-[#22C7F2]/10',
    rainColor: 'rgba(34, 199, 242, 0.4)',
    dustColor: 'rgba(217, 249, 157, 0.5)'
  }
};

export function getTimePeriodFromHour(hour: number): TimeOfDayPeriod {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'sunset';
  return 'night';
}
