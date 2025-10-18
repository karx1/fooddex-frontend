import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder'
import * as Colors from '@tamagui/colors'

const darkPalette = [
  'hsla(260, 40%, 5%, 1)',   // Deep space black with purple tint
  'hsla(260, 35%, 10%, 1)',  // Dark cosmic purple
  'hsla(260, 30%, 15%, 1)',  // Deep nebula
  'hsla(255, 30%, 20%, 1)',  // Space dust
  'hsla(250, 25%, 25%, 1)',  // Cosmic mist
  'hsla(245, 25%, 35%, 1)',  // Star field
  'hsla(240, 30%, 45%, 1)',  // Galaxy spiral
  'hsla(235, 35%, 55%, 1)',  // Nebula glow
  'hsla(230, 40%, 65%, 1)',  // Star cluster
  'hsla(225, 45%, 75%, 1)',  // Bright star
  'hsla(220, 50%, 85%, 1)',  // Supernova
  'hsla(215, 55%, 95%, 1)'   // Stellar burst
]

const lightPalette = [
  'hsla(280, 40%, 97%, 1)',  // Cosmic white
  'hsla(275, 35%, 90%, 1)',  // Nebula pink
  'hsla(270, 30%, 82%, 1)',  // Star dust
  'hsla(265, 30%, 75%, 1)',  // Celestial mist
  'hsla(260, 25%, 68%, 1)',  // Galaxy swirl
  'hsla(255, 25%, 60%, 1)',  // Space cloud
  'hsla(250, 30%, 52%, 1)',  // Cosmic ray
  'hsla(245, 35%, 45%, 1)',  // Deep space
  'hsla(240, 40%, 37%, 1)',  // Event horizon
  'hsla(235, 45%, 30%, 1)',  // Dark matter
  'hsla(230, 50%, 15%, 1)',  // Cosmic void
  'hsla(225, 55%, 8%, 1)'    // Space black
]

const lightShadows = {
  shadow1: 'rgba(88,73,150,0.04)',
  shadow2: 'rgba(88,73,150,0.08)',
  shadow3: 'rgba(88,73,150,0.16)',
  shadow4: 'rgba(88,73,150,0.24)',
  shadow5: 'rgba(88,73,150,0.32)',
  shadow6: 'rgba(88,73,150,0.4)',
}

const darkShadows = {
  shadow1: 'rgba(147,112,219,0.2)',
  shadow2: 'rgba(147,112,219,0.3)',
  shadow3: 'rgba(147,112,219,0.4)',
  shadow4: 'rgba(147,112,219,0.5)',
  shadow5: 'rgba(147,112,219,0.6)',
  shadow6: 'rgba(147,112,219,0.7)',
}

// we're adding some example sub-themes for you to show how they are done, "success" "warning", "error":

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: ['hsla(250, 50%, 35%, 1)','hsla(250, 50%, 38%, 1)','hsla(250, 50%, 41%, 1)','hsla(250, 50%, 43%, 1)','hsla(250, 50%, 46%, 1)','hsla(250, 50%, 49%, 1)','hsla(250, 50%, 52%, 1)','hsla(250, 50%, 54%, 1)','hsla(250, 50%, 57%, 1)','hsla(250, 50%, 60%, 1)','hsla(250, 50%, 90%, 1)','hsla(250, 50%, 95%, 1)'],
      light: ['hsla(250, 50%, 40%, 1)','hsla(250, 50%, 43%, 1)','hsla(250, 50%, 46%, 1)','hsla(250, 50%, 48%, 1)','hsla(250, 50%, 51%, 1)','hsla(250, 50%, 54%, 1)','hsla(250, 50%, 57%, 1)','hsla(250, 50%, 59%, 1)','hsla(250, 50%, 62%, 1)','hsla(250, 50%, 65%, 1)','hsla(250, 50%, 95%, 1)','hsla(250, 50%, 95%, 1)'],
    },
  },

  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },

  // optionally add more, can pass palette or template

  // grandChildrenThemes: {
  //   alt1: {
  //     template: 'alt1',
  //   },
  //   alt2: {
  //     template: 'alt2',
  //   },
  //   surface1: {
  //     template: 'surface1',
  //   },
  //   surface2: {
  //     template: 'surface2',
  //   },
  //   surface3: {
  //     template: 'surface3',
  //   },
  // },
})

export type Themes = typeof builtThemes

// the process.env conditional here is optional but saves web client-side bundle
// size by leaving out themes JS. tamagui automatically hydrates themes from CSS
// back into JS for you, and the bundler plugins set TAMAGUI_ENVIRONMENT. so
// long as you are using the Vite, Next, Webpack plugins this should just work,
// but if not you can just export builtThemes directly as themes:
export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' &&
  process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any)
