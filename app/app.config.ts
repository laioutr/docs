export default defineAppConfig({
  socials: {
    linkedin: 'https://www.linkedin.com/company/laioutr/',
    x: 'https://x.com/laioutr',
    youtube: 'https://www.youtube.com/@Laioutr',
    instagram: 'https://www.instagram.com/laioutr/',
  },
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
  assistant: {
    // Show the floating input on documentation pages
    floatingInput: true,
    // Show the "Explain with AI" button in the sidebar
    explainWithAi: true,
    // Keyboard shortcuts
    shortcuts: {
      focusInput: 'meta_k'
    },
    // Custom icons
    icons: {
      trigger: 'i-lucide-sparkles',
      explain: 'i-lucide-brain'
    },
    faqQuestions: [
      {
        category: 'Getting Started',
        items: [
          'How do I create my first section?',
          'How do I connect Laioutr to commercetools?',
          'What is the difference between a Section and a Block?',
        ],
      },
      {
        category: 'Orchestr & Data',
        items: [
          'How does the Orchestr data layer work?',
          'How do I fetch data from multiple backends?',
          'What are Client Entities and how do I use them?',
        ],
      },
      {
        category: 'Studio & Cockpit',
        items: [
          'How do I make a component editable in Studio?',
          'How do I deploy my storefront to Laioutr Cloud?',
        ],
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
