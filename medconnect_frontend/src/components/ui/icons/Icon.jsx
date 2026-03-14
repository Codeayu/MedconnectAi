/**
 * MedConnect AI — SVG Icon System
 * 
 * RULE: No emojis anywhere in the UI. Use these SVG icon components instead.
 *
 * Usage:
 *   import { Icon } from '@/components/ui/icons/Icon'
 *   <Icon name="stethoscope" size={24} className="text-primary" />
 * 
 * Or import individual icons:
 *   import { Stethoscope, Heart, Shield } from '@/components/ui/icons/Icon'
 * 
 * Props common to all icons:
 *   size      — number, default 24
 *   className — string, extra CSS classes
 *   color     — string, defaults to 'currentColor'
 *   strokeWidth — number, defaults to 1.5
 *   ...rest   — spread onto <svg> for aria-label, role, etc.
 */

const defaultProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  viewBox: '0 0 24 24',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function svgWrapper(paths) {
  return function SvgIcon({
    size = 24,
    color = 'currentColor',
    strokeWidth = 1.5,
    className = '',
    ...rest
  }) {
    return (
      <svg
        {...defaultProps}
        width={size}
        height={size}
        stroke={color}
        strokeWidth={strokeWidth}
        className={className}
        aria-hidden={rest['aria-label'] ? undefined : true}
        role={rest['aria-label'] ? 'img' : 'presentation'}
        focusable="false"
        {...rest}
      >
        {paths}
      </svg>
    )
  }
}

/* ----------------------------------------------------------------
   MEDICAL / DOMAIN ICONS
   ---------------------------------------------------------------- */

export const Stethoscope = svgWrapper(
  <>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </>
)

export const Heart = svgWrapper(
  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
)

export const Activity = svgWrapper(
  <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
)

export const Pill = svgWrapper(
  <>
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </>
)

export const Clipboard = svgWrapper(
  <>
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
  </>
)

export const Shield = svgWrapper(
  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
)

export const Calendar = svgWrapper(
  <>
    <path d="M8 2v4" /><path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </>
)

export const Clock = svgWrapper(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </>
)

export const Ambulance = svgWrapper(
  <>
    <path d="M10 10H6" /><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14" />
    <circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
  </>
)

export const UserDoctor = svgWrapper(
  <>
    <path d="M18 20a6 6 0 0 0-12 0" />
    <circle cx="12" cy="10" r="4" />
    <circle cx="12" cy="12" r="10" />
  </>
)

export const TestTube = svgWrapper(
  <>
    <path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2" />
    <path d="M8.5 2h7" /><path d="M14.5 16h-5" />
  </>
)

/* ----------------------------------------------------------------
   GENERAL UI ICONS
   ---------------------------------------------------------------- */

export const Search = svgWrapper(
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </>
)

export const Bell = svgWrapper(
  <>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </>
)

export const Menu = svgWrapper(
  <>
    <path d="M4 12h16" /><path d="M4 6h16" /><path d="M4 18h16" />
  </>
)

export const X = svgWrapper(
  <>
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </>
)

export const Check = svgWrapper(
  <path d="M20 6 9 17l-5-5" />
)

export const ChevronDown = svgWrapper(
  <path d="m6 9 6 6 6-6" />
)

export const ChevronRight = svgWrapper(
  <path d="m9 18 6-6-6-6" />
)

export const ArrowRight = svgWrapper(
  <>
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </>
)

export const Home = svgWrapper(
  <>
    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
    <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </>
)

export const MessageCircle = svgWrapper(
  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
)

export const Send = svgWrapper(
  <>
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </>
)

export const Upload = svgWrapper(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </>
)

export const Star = svgWrapper(
  <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a.53.53 0 0 0 .398.29l5.163.756a.53.53 0 0 1 .294.904l-3.736 3.638a.53.53 0 0 0-.152.469l.882 5.14a.53.53 0 0 1-.77.56l-4.618-2.428a.53.53 0 0 0-.494 0l-4.618 2.428a.53.53 0 0 1-.77-.56l.882-5.14a.53.53 0 0 0-.152-.469l-3.736-3.638a.53.53 0 0 1 .294-.904l5.163-.756a.53.53 0 0 0 .398-.29z" />
)

export const Filter = svgWrapper(
  <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
)

export const Video = svgWrapper(
  <>
    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" />
    <rect width="14" height="12" x="2" y="6" rx="2" />
  </>
)

export const Phone = svgWrapper(
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
)

export const Settings = svgWrapper(
  <>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </>
)

export const LogOut = svgWrapper(
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </>
)

export const AlertCircle = svgWrapper(
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </>
)

export const CheckCircle = svgWrapper(
  <>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </>
)

export const XCircle = svgWrapper(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" /><path d="m9 9 6 6" />
  </>
)

export const Info = svgWrapper(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" /><path d="M12 8h.01" />
  </>
)

export const BookOpen = svgWrapper(
  <>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </>
)

export const BarChart = svgWrapper(
  <>
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </>
)

export const TrendingUp = svgWrapper(
  <>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </>
)

export const Sparkles = svgWrapper(
  <>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" /><path d="M22 5h-4" />
    <path d="M4 17v2" /><path d="M5 18H3" />
  </>
)

export const Loader = svgWrapper(
  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
)

export const Paperclip = svgWrapper(
  <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
)

export const Image = svgWrapper(
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </>
)

export const Mic = svgWrapper(
  <>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </>
)

export const FileText = svgWrapper(
  <>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
  </>
)

export const ShoppingCart = svgWrapper(
  <>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </>
)

export const Building = svgWrapper(
  <>
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" /><path d="M16 6h.01" />
    <path d="M12 6h.01" /><path d="M12 10h.01" />
    <path d="M12 14h.01" /><path d="M16 10h.01" />
    <path d="M16 14h.01" /><path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </>
)

export const MapPin = svgWrapper(
  <>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </>
)

export const Trash2 = svgWrapper(
  <>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </>
)

export const CreditCard = svgWrapper(
  <>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </>
)

export const Plus = svgWrapper(
  <>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </>
)

export const Minus = svgWrapper(
  <path d="M5 12h14" />
)

export const User = svgWrapper(
  <>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>
)

/* ----------------------------------------------------------------
   ICON MAP — for <Icon name="..." /> lookup
   ---------------------------------------------------------------- */

const iconMap = {
  stethoscope: Stethoscope,
  heart: Heart,
  activity: Activity,
  pill: Pill,
  clipboard: Clipboard,
  shield: Shield,
  calendar: Calendar,
  clock: Clock,
  ambulance: Ambulance,
  'user-doctor': UserDoctor,
  'test-tube': TestTube,
  search: Search,
  bell: Bell,
  menu: Menu,
  x: X,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'arrow-right': ArrowRight,
  home: Home,
  'message-circle': MessageCircle,
  send: Send,
  upload: Upload,
  star: Star,
  filter: Filter,
  video: Video,
  phone: Phone,
  settings: Settings,
  'log-out': LogOut,
  'alert-circle': AlertCircle,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  info: Info,
  'book-open': BookOpen,
  'bar-chart': BarChart,
  'trending-up': TrendingUp,
  sparkles: Sparkles,
  loader: Loader,
  paperclip: Paperclip,
  image: Image,
  mic: Mic,
  'file-text': FileText,
  'shopping-cart': ShoppingCart,
  building: Building,
  'map-pin': MapPin,
  trash2: Trash2,
  'credit-card': CreditCard,
  plus: Plus,
  minus: Minus,
  user: User,
}

/**
 * Generic Icon component — looks up by name.
 * Falls back to a small square if name is unknown.
 */
export function Icon({ name, ...props }) {
  const Component = iconMap[name]
  if (!Component) {
    if (import.meta.env.DEV) {
      console.warn(`[Icon] Unknown icon name: "${name}"`)
    }
    return (
      <svg
        width={props.size || 24}
        height={props.size || 24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="4" y="4" width="16" height="16" rx="3" />
      </svg>
    )
  }
  return <Component {...props} />
}

export default Icon
