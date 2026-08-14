import boyMorning from '../assets/images/lofi_morning_desk_1786609078280.jpg';
import girlMorning from '../assets/images/lofi_girl_morning_1786609416097.jpg';
import boyAfternoon from '../assets/images/lofi_afternoon_desk_1786609097377.jpg';
import girlAfternoon from '../assets/images/lofi_girl_afternoon_1786609430866.jpg';
import boySunset from '../assets/images/lofi_sunset_desk_1786609116447.jpg';
import girlSunset from '../assets/images/lofi_girl_sunset_1786609443598.jpg';
import boyNight from '../assets/images/lofi_night_desk_1786609129053.jpg';
import girlNight from '../assets/images/lofi_girl_night_1786609456734.jpg';
import boyThunder from '../assets/images/boy_thunder_rain_1786694386540.jpg';
import girlThunder from '../assets/images/girl_thunder_rain_1786694363539.jpg';
import boyTokyo from '../assets/images/boy_tokyo_cyber_1786694420512.jpg';
import girlTokyo from '../assets/images/girl_tokyo_cyber_1786694402361.jpg';
import boyStarry from '../assets/images/boy_starry_galaxy_1786694457873.jpg';
import girlStarry from '../assets/images/girl_starry_galaxy_1786694438602.jpg';
import boyCafe from '../assets/images/boy_cozy_cafe_1786694493163.jpg';
import girlCafe from '../assets/images/girl_cozy_cafe_1786694477397.jpg';

// Dedicated 9:16 Portrait Artwork for Mobile Viewports
import boyMobileNight from '../assets/images/mobile_boy_night_1786708270363.jpg';
import girlMobileNight from '../assets/images/mobile_girl_night_1786708293282.jpg';
import boyMobileDay from '../assets/images/mobile_boy_day_1786708310742.jpg';
import girlMobileDay from '../assets/images/mobile_girl_day_1786708329429.jpg';
import boyMobileRain from '../assets/images/mobile_boy_rain_1786708347186.jpg';
import girlMobileRain from '../assets/images/mobile_girl_rain_1786708368745.jpg';

export type TimeOfDayPeriod = 'morning' | 'afternoon' | 'sunset' | 'night' | 'rainy_storm' | 'tokyo_cyber' | 'starry_galaxy' | 'cozy_cafe';

export interface TimeOfDayConfig {
  id: TimeOfDayPeriod;
  name: string;
  sublabel: string;
  hoursRange: string;
  bgImageBoy: string;
  bgImageGirl: string;
  bgImageBoyMobile: string;
  bgImageGirlMobile: string;
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
    bgImageBoy: boyMorning,
    bgImageGirl: girlMorning,
    bgImageBoyMobile: boyMobileDay,
    bgImageGirlMobile: girlMobileDay,
    gradientOverlay: 'from-[#FFB703]/15 via-transparent to-[#07131F]/60',
    vignetteGradient: 'from-[#07131F]/50 via-transparent to-[#FFB703]/10',
    sunlightGlow: 'bg-[#FFD166]/25',
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
    bgImageBoy: boyAfternoon,
    bgImageGirl: girlAfternoon,
    bgImageBoyMobile: boyMobileDay,
    bgImageGirlMobile: girlMobileDay,
    gradientOverlay: 'from-[#38BDF8]/15 via-transparent to-[#07131F]/60',
    vignetteGradient: 'from-[#07131F]/50 via-transparent to-[#38BDF8]/10',
    sunlightGlow: 'bg-[#38BDF8]/25',
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
    bgImageBoy: boySunset,
    bgImageGirl: girlSunset,
    bgImageBoyMobile: boyMobileNight,
    bgImageGirlMobile: girlMobileNight,
    gradientOverlay: 'from-[#F43F5E]/15 via-transparent to-[#07131F]/65',
    vignetteGradient: 'from-[#07131F]/55 via-transparent to-[#F43F5E]/15',
    sunlightGlow: 'bg-[#F43F5E]/25',
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
    bgImageBoy: boyNight,
    bgImageGirl: girlNight,
    bgImageBoyMobile: boyMobileNight,
    bgImageGirlMobile: girlMobileNight,
    gradientOverlay: 'from-[#22C7F2]/10 via-transparent to-[#030712]/70',
    vignetteGradient: 'from-[#07131F]/60 via-transparent to-[#22C7F2]/10',
    sunlightGlow: 'bg-[#22C7F2]/20',
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
    bgImageBoy: boyThunder,
    bgImageGirl: girlThunder,
    bgImageBoyMobile: boyMobileRain,
    bgImageGirlMobile: girlMobileRain,
    gradientOverlay: 'from-[#0284C7]/20 via-transparent to-[#020617]/75',
    vignetteGradient: 'from-[#020617]/65 via-transparent to-[#38BDF8]/15',
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
    bgImageBoy: boyTokyo,
    bgImageGirl: girlTokyo,
    bgImageBoyMobile: boyMobileRain,
    bgImageGirlMobile: girlMobileRain,
    gradientOverlay: 'from-[#EC4899]/20 via-transparent to-[#090D16]/75',
    vignetteGradient: 'from-[#090D16]/65 via-transparent to-[#F43F5E]/15',
    sunlightGlow: 'bg-[#EC4899]/25',
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
    bgImageBoy: boyStarry,
    bgImageGirl: girlStarry,
    bgImageBoyMobile: boyMobileNight,
    bgImageGirlMobile: girlMobileNight,
    gradientOverlay: 'from-[#A855F7]/20 via-transparent to-[#050814]/75',
    vignetteGradient: 'from-[#050814]/65 via-transparent to-[#C084FC]/15',
    sunlightGlow: 'bg-[#A855F7]/25',
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
    bgImageBoy: boyCafe,
    bgImageGirl: girlCafe,
    bgImageBoyMobile: boyMobileDay,
    bgImageGirlMobile: girlMobileDay,
    gradientOverlay: 'from-[#EA580C]/20 via-transparent to-[#120B06]/75',
    vignetteGradient: 'from-[#120B06]/65 via-transparent to-[#FB923C]/15',
    sunlightGlow: 'bg-[#F97316]/25',
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
