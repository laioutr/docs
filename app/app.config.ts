export default defineAppConfig({
  github: {
    url: 'https://github.com/laioutr/docs',
    branch: 'main',
  },
  seo: {
    title: 'Laioutr Documentation',
    titleTemplate: '%s | Laioutr',
    description: 'Documentation for the Laioutr Composable Frontend Management Platform.',
  },
  ui: {
    colors: {
      primary: 'purple',
      neutral: 'slate',
    },
    prose: {
      codeIcon: {
        curl: 'i-lucide-terminal',
      },
    },
  },
  header: {
    title: '',
    to: '/',
    logo: {
      alt: 'Laioutr',
      light: '/logo/logo-dark.svg',
      dark: '/logo/logo-light.svg',
      brandAssetsUrl: 'https://www.laioutr.com/brandkit',
    },
    search: true,
    colorMode: true,
    links: [
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/laioutr',
        target: '_blank',
        'aria-label': 'GitHub',
      },
    ],
  },
  footer: {
    credits: `Copyright © ${new Date().getFullYear()} Laioutr GmbH`,
    colorMode: false,
    links: [
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/laioutr',
        target: '_blank',
        'aria-label': 'Laioutr on GitHub',
      },
      {
        icon: 'simple-icons:appstore',
        to: 'https://apps.laioutr.com',
        target: '_blank',
        'aria-label': 'Appstore by Laioutr',
      },
    ],
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Laioutr',
      edit: 'https://github.com/laioutr/laioutr/edit/main/content',
      links: [
        {
          icon: 'i-lucide-star',
          label: 'Follow us on GitHub',
          to: 'https://github.com/laioutr',
          target: '_blank',
        },
        {
          icon: 'i-lucide-gem',
          label: 'Try Laioutr',
          to: 'https://www.laioutr.com/',
          target: '_blank',
        },
        {
          icon: 'simple-icons:appstore',
          label: 'Visit our Appstore',
          to: 'https://apps.laioutr.com',
          target: '_blank',
        },
        {
          icon: 'simple-icons:homeassistantcommunitystore',
          label: 'Laioutr UI Preview',
          to: 'https://preview.laioutr.com',
          target: '_blank',
        },
      ],
    },
  },
});
