/**
 * Themed SVG icons that replace emojis throughout the site.
 * All icons use the site's cyan (#00ffc8) / purple (#7850ff) palette
 * and are rendered as inline SVGs for consistent styling.
 */

const iconBase = {
  display: "inline-block",
  lineHeight: 1,
  verticalAlign: "middle",
};

export const RocketIcon = ({ size = 28, style = {} }) => (
  <span style={{ ...iconBase, ...style }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 7 7 7 13L9 15L12 12L15 15L17 13C17 7 12 2 12 2Z" stroke="url(#rocketGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M7 13L5 17L9 15" stroke="#00ffc8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
      <path d="M17 13L19 17L15 15" stroke="#7850ff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
      <circle cx="12" cy="9" r="1.5" stroke="#00ffc8" strokeWidth="1" fill="none" opacity="0.8"/>
      <path d="M10 20L12 18L14 20" stroke="url(#rocketGrad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
      <defs>
        <linearGradient id="rocketGrad" x1="7" y1="2" x2="17" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ffc8"/>
          <stop offset="1" stopColor="#7850ff"/>
        </linearGradient>
      </defs>
    </svg>
  </span>
);

export const ClockIcon = ({ size = 28, style = {} }) => (
  <span style={{ ...iconBase, ...style }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="url(#clockGrad)" strokeWidth="1.5" fill="none"/>
      <path d="M12 7V12L15 14" stroke="#00ffc8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="1" fill="#7850ff" opacity="0.6"/>
      <defs>
        <linearGradient id="clockGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ffc8"/>
          <stop offset="1" stopColor="#7850ff"/>
        </linearGradient>
      </defs>
    </svg>
  </span>
);

export const BrainIcon = ({ size = 28, style = {} }) => (
  <span style={{ ...iconBase, ...style }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4C10 4 8.5 5.5 8.5 7.5C7 7.5 5.5 9 5.5 10.5C4.5 11 4 12.5 4 14C4 16 5.5 17.5 7.5 17.5C7.5 19 9 20 10.5 20C11 20 11.5 19.8 12 19.5" stroke="#00ffc8" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      <path d="M12 4C14 4 15.5 5.5 15.5 7.5C17 7.5 18.5 9 18.5 10.5C19.5 11 20 12.5 20 14C20 16 18.5 17.5 16.5 17.5C16.5 19 15 20 13.5 20C13 20 12.5 19.8 12 19.5" stroke="#7850ff" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      <path d="M12 4V20" stroke="url(#brainGrad)" strokeWidth="1" strokeDasharray="2 2" opacity="0.5"/>
      <circle cx="9.5" cy="11" r="0.8" fill="#00ffc8" opacity="0.6"/>
      <circle cx="14.5" cy="11" r="0.8" fill="#7850ff" opacity="0.6"/>
      <circle cx="12" cy="14" r="0.8" fill="#00d4ff" opacity="0.6"/>
      <defs>
        <linearGradient id="brainGrad" x1="12" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ffc8"/>
          <stop offset="1" stopColor="#7850ff"/>
        </linearGradient>
      </defs>
    </svg>
  </span>
);

export const BoxIcon = ({ size = 28, style = {} }) => (
  <span style={{ ...iconBase, ...style }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L21 7.5V16.5L12 21L3 16.5V7.5L12 3Z" stroke="url(#boxGrad)" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <path d="M12 12L21 7.5" stroke="#7850ff" strokeWidth="1" opacity="0.5"/>
      <path d="M12 12L3 7.5" stroke="#00ffc8" strokeWidth="1" opacity="0.5"/>
      <path d="M12 12V21" stroke="url(#boxGrad)" strokeWidth="1" opacity="0.5"/>
      <circle cx="12" cy="12" r="1.2" fill="none" stroke="#00ffc8" strokeWidth="0.8" opacity="0.6"/>
      <defs>
        <linearGradient id="boxGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ffc8"/>
          <stop offset="1" stopColor="#7850ff"/>
        </linearGradient>
      </defs>
    </svg>
  </span>
);

export const StarBadgeIcon = ({ size = 28, style = {} }) => (
  <span style={{ ...iconBase, ...style }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 8.5L21 9.5L16.5 14L17.5 21L12 17.5L6.5 21L7.5 14L3 9.5L9.5 8.5L12 2Z" stroke="url(#starGrad)" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <circle cx="12" cy="12" r="3" stroke="#00ffc8" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <circle cx="12" cy="12" r="1" fill="#7850ff" opacity="0.5"/>
      <defs>
        <linearGradient id="starGrad" x1="3" y1="2" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ffc8"/>
          <stop offset="1" stopColor="#7850ff"/>
        </linearGradient>
      </defs>
    </svg>
  </span>
);

export const ChartIcon = ({ size = 28, style = {} }) => (
  <span style={{ ...iconBase, ...style }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="url(#chartGrad)" strokeWidth="1.5" fill="none"/>
      <path d="M7 17V13" stroke="#00ffc8" strokeWidth="2" strokeLinecap="round"/>
      <path d="M11 17V9" stroke="#7850ff" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 17V11" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/>
      <path d="M19 17V7" stroke="#00ffc8" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <defs>
        <linearGradient id="chartGrad" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ffc8"/>
          <stop offset="1" stopColor="#7850ff"/>
        </linearGradient>
      </defs>
    </svg>
  </span>
);

export const GradCapIcon = ({ size = 28, style = {} }) => (
  <span style={{ ...iconBase, ...style }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L2 9L12 15L22 9L12 3Z" stroke="url(#gradGrad)" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <path d="M6 11.5V17C6 17 8 20 12 20C16 20 18 17 18 17V11.5" stroke="#7850ff" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      <path d="M22 9V16" stroke="#00ffc8" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="22" cy="16.5" r="0.8" fill="#00ffc8" opacity="0.6"/>
      <defs>
        <linearGradient id="gradGrad" x1="2" y1="3" x2="22" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ffc8"/>
          <stop offset="1" stopColor="#7850ff"/>
        </linearGradient>
      </defs>
    </svg>
  </span>
);

export const HandSignIcon = ({ size = 28, style = {} }) => (
  <span style={{ ...iconBase, ...style }}>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 14V8C8 7 8.5 6 9.5 6C10.5 6 11 7 11 8V5C11 4 11.5 3 12.5 3C13.5 3 14 4 14 5V7C14 6 14.5 5 15.5 5C16.5 5 17 6 17 7V9C17 8 17.5 7.5 18.5 7.5C19.5 7.5 20 8.5 20 9.5V15C20 19 17 21 14 21C11 21 8 19 7 16" stroke="url(#handGrad)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M4 12L6 10" stroke="#00ffc8" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <path d="M4 16L6 15" stroke="#7850ff" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <defs>
        <linearGradient id="handGrad" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00ffc8"/>
          <stop offset="1" stopColor="#7850ff"/>
        </linearGradient>
      </defs>
    </svg>
  </span>
);
