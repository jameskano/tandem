import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

const config: Config = {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		colors: {
              primary: 'var(--color-primary)',
              accent: 'var(--color-accent)',
              highlight: 'var(--color-highlight)',
              secondary: 'var(--color-secondary)',
              bg: 'var(--color-bg)',
              text: 'var(--color-text)',
              muted: 'var(--color-muted)',
              background: 'hsl(var(--background))',
              foreground: 'hsl(var(--foreground))',
              card: 'hsl(var(--card))',
              popover: 'hsl(var(--popover))',
              destructive: 'hsl(var(--destructive))',
              border: 'hsl(var(--border))',
              input: 'hsl(var(--input))',
              ring: 'hsl(var(--ring))',
              chart: {
                  '1': 'hsl(var(--chart-1))',
                  '2': 'hsl(var(--chart-2))',
                  '3': 'hsl(var(--chart-3))',
                  '4': 'hsl(var(--chart-4))',
                  '5': 'hsl(var(--chart-5))'
              }
          },
  		spacing: {
  			'2xs': 'var(--space-2xs)',
  			xs: 'var(--space-xs)',
  			sm: 'var(--space-sm)',
  			md: 'var(--space-md)',
  			lg: 'var(--space-lg)',
  			xl: 'var(--space-xl)',
  			'2xl': 'var(--space-2xl)',
  			'safe-top': 'env(safe-area-inset-top)',
  			'safe-bottom': 'env(safe-area-inset-bottom)',
  			'safe-left': 'env(safe-area-inset-left)',
  			'safe-right': 'env(safe-area-inset-right)'
  		},
  		fontSize: {
  			xs: [
  				'var(--text-xs)',
  				{
  					lineHeight: '1.25rem'
  				}
  			],
  			sm: [
  				'var(--text-sm)',
  				{
  					lineHeight: '1.375rem'
  				}
  			],
  			base: [
  				'var(--text-base)',
  				{
  					lineHeight: '1.5rem'
  				}
  			],
  			lg: [
  				'var(--text-lg)',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			xl: [
  				'var(--text-xl)',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			'2xl': [
  				'var(--text-2xl)',
  				{
  					lineHeight: '2rem'
  				}
  			]
  		},
  		fontWeight: {
  			regular: 'var(--weight-regular)',
  			semibold: 'var(--weight-semibold)',
  			bold: 'var(--weight-bold)'
  		},
  		maxWidth: {
  			container: 'var(--container-max)'
  		},
  		borderRadius: {
  			lg: 'var(--radius-lg)',
  			xl: 'var(--radius-xl)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			card: 'var(--shadow-card)',
  			btn: 'var(--shadow-btn)'
  		},
  		transitionDuration: {
  			fast: 'var(--transition-fast)',
  			normal: 'var(--transition-normal)',
  			slow: 'var(--transition-slow)'
  		},
  		fontFamily: {
  			heading: [
  				'Poppins',
  				'ui-sans-serif',
  				'system-ui'
  			],
  			body: [
  				'Inter',
  				'ui-sans-serif',
  				'system-ui'
  			]
  		},
  		minHeight: {
  			'44': '44px'
  		},
  		minWidth: {
  			'44': '44px'
  		}
  	}
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.rounded-app': { borderRadius: 'var(--radius-xl)' },
        '.p-app': { padding: 'var(--space-md)' },
        '.shadow-app': { boxShadow: 'var(--shadow-card)' },
        '.bg-brand-gradient': {
          backgroundImage:
            'linear-gradient(135deg, var(--color-primary), var(--color-accent), var(--color-highlight))',
        },
      })
    }),
      require("tailwindcss-animate")
],
}

export default config

