export type TimeOfDayPeriod = 'morning' | 'afternoon' | 'sunset' | 'night' | 'rainy_storm' | 'tokyo_cyber' | 'starry_galaxy' | 'cozy_cafe';

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
  },
  rainy_storm: {
    id: 'rainy_storm',
    name: 'Thunder Rain',
    sublabel: 'Heavy Rainfall, Lightning & Foggy City',
    hoursRange: 'Atmospheric Special',
    bgImageBoy: '/src/assets/images/boy_thunder_rain_1786694386540.jpg',
    bgImageGirl: '/src/assets/images/girl_thunder_rain_1786694363539.jpg',
    gradientOverlay: 'from-[#0284C7]/25 via-[#0F172A]/40 to-[#020617]/90',
    vignetteGradient: 'from-[#020617]/90 via-[#07131F]/30 to-[#38BDF8]/20',
    sunlightGlow: 'bg-[#38BDF8]/20',
    badgeBg: 'bg-[#0284C7]/20',
    badgeText: 'text-[#38BDF8]',
    badgeBorder: 'border-[#0284C7]/50',
    accentColor: '#38BDF8',
    skyTint: 'bg-[#0284C7]/15',
    rainColor: 'rgba(125, 211, 252, 0.7)',
    dustColor: 'rgba(186, 230, 253, 0.6)'
  },
  tokyo_cyber: {
    id: 'tokyo_cyber',
    name: 'Cyberpunk Neon',
    sublabel: 'Tokyo Midnight Rain, Synth & Neon Dreams',
    hoursRange: 'Atmospheric Special',
    bgImageBoy: '/src/assets/images/boy_tokyo_cyber_1786694420512.jpg',
    bgImageGirl: '/src/assets/images/girl_tokyo_cyber_1786694402361.jpg',
    gradientOverlay: 'from-[#EC4899]/25 via-[#8B5CF6]/20 to-[#090D16]/90',
    vignetteGradient: 'from-[#090D16]/90 via-[#07131F]/25 to-[#F43F5E]/20',
    sunlightGlow: 'bg-[#EC4899]/30',
    badgeBg: 'bg-[#EC4899]/20',
    badgeText: 'text-[#F472B6]',
    badgeBorder: 'border-[#EC4899]/50',
    accentColor: '#F472B6',
    skyTint: 'bg-[#EC4899]/15',
    rainColor: 'rgba(244, 114, 182, 0.6)',
    dustColor: 'rgba(192, 132, 252, 0.7)'
  },
  starry_galaxy: {
    id: 'starry_galaxy',
    name: 'Starry Aurora',
    sublabel: 'Cosmic Nebula, Galaxy Sky & Deep Focus',
    hoursRange: 'Atmospheric Special',
    bgImageBoy: '/src/assets/images/boy_starry_galaxy_1786694457873.jpg',
    bgImageGirl: '/src/assets/images/girl_starry_galaxy_1786694438602.jpg',
    gradientOverlay: 'from-[#A855F7]/25 via-[#3B82F6]/20 to-[#050814]/90',
    vignetteGradient: 'from-[#050814]/90 via-[#07131F]/20 to-[#C084FC]/20',
    sunlightGlow: 'bg-[#A855F7]/30',
    badgeBg: 'bg-[#A855F7]/20',
    badgeText: 'text-[#C084FC]',
    badgeBorder: 'border-[#A855F7]/50',
    accentColor: '#C084FC',
    skyTint: 'bg-[#A855F7]/15',
    rainColor: 'rgba(192, 132, 252, 0.5)',
    dustColor: 'rgba(233, 213, 255, 0.8)'
  },
  cozy_cafe: {
    id: 'cozy_cafe',
    name: 'Cozy Cafe',
    sublabel: 'Warm Bakery Amber, Rain on Glass & Coffee',
    hoursRange: 'Atmospheric Special',
    bgImageBoy: '/src/assets/images/boy_cozy_cafe_1786694493163.jpg',
    bgImageGirl: '/src/assets/images/girl_cozy_cafe_1786694477397.jpg',
    gradientOverlay: 'from-[#EA580C]/25 via-[#78350F]/20 to-[#120B06]/90',
    vignetteGradient: 'from-[#120B06]/90 via-[#1C120C]/30 to-[#FB923C]/20',
    sunlightGlow: 'bg-[#F97316]/30',
    badgeBg: 'bg-[#EA580C]/20',
    badgeText: 'text-[#FB923C]',
    badgeBorder: 'border-[#EA580C]/50',
    accentColor: '#FB923C',
    skyTint: 'bg-[#EA580C]/15',
    rainColor: 'rgba(251, 146, 60, 0.5)',
    dustColor: 'rgba(254, 215, 170, 0.7)'
  }
};

export function getTimePeriodFromHour(hour: number): TimeOfDayPeriod {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'sunset';
  return 'night';
}
