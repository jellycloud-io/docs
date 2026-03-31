import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// CI pipeline injects SITE_URL and DEPLOY_ENV for each environment.
const siteUrl = process.env.SITE_URL ?? 'https://docs.jellycloud.io';
const isDev = process.env.DEPLOY_ENV === 'dev';

const config: Config = {
  title: 'JellyCloud',
  tagline: 'Cloud infrastructure that just works',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: siteUrl,
  baseUrl: '/',

  organizationName: 'jellycloud-io',
  projectName: 'docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: isDev
            ? 'https://github.com/jellycloud-io/docs/edit/develop/'
            : undefined,
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/jellycloud-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'JellyCloud',
      logo: {
        alt: 'JellyCloud Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/jellycloud-io/docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Introduction', to: '/'},
            {label: 'Quick Start', to: '/quick-start'},
            {label: 'Core Concepts', to: '/core-concepts'},
          ],
        },
        {
          title: 'Platform',
          items: [
            {label: 'Supported Platforms', to: '/supported-platforms'},
            {label: 'AI Serving', to: '/ai-serving'},
            {label: 'Configuration', to: '/configuration'},
          ],
        },
        {
          title: 'Resources',
          items: [
            {label: 'Recipes', to: '/recipes'},
            {label: 'Support', to: '/support'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} JellyCloud. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'yaml', 'json', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
