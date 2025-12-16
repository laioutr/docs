export default defineAppConfig({
  github: {
    url: 'https://github.com/laioutr/docs',
    branch: 'main',
  },
  seo: {
    title: 'Laioutr Documentation',
  },
  ui: {
    colors: {
      primary: 'purple',
      neutral: 'slate',
    },
  },
  header: {
    title: '',
    to: '/',
    logo: {
      alt: 'laioutr logo',
      light: '/logo/logo-dark.svg',
      dark: '/logo/logo-light.svg',
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
        'aria-label': 'laioutr on GitHub',
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
          label: 'Purchase a License',
          to: 'https://www.laioutr.com/pricing',
          target: '_blank',
        },
      ],
    },
  },
});
