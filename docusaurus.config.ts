import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import * as dotenv from 'dotenv';
import * as path from 'path';

const DEPLOY_ENV = process.env.DEPLOY_ENV ?? 'prod';
dotenv.config({path: path.resolve(__dirname, `.env.${DEPLOY_ENV}`)});

const siteUrl = process.env.SITE_URL ?? 'https://docs.jellycloud.io';
const consoleUrl = process.env.CONSOLE_URL ?? 'https://console.jellycloud.io';
const docsEditUrl = process.env.DOCS_EDIT_URL;

const urlTokens: Record<string, string> = {
  CONSOLE_URL: consoleUrl,
};

function remarkReplaceUrlTokens() {
  return (tree: import('mdast').Root) => {
    const {visit} = require('unist-util-visit');
    visit(tree, (node: import('unist').Node & {url?: string; value?: string}) => {
      if (node.url) {
        node.url = node.url.replace(/\{\{(\w+)\}\}/g, (_: string, key: string) => urlTokens[key] ?? `{{${key}}}`);
      }
      if (node.type === 'html' && node.value) {
        node.value = node.value.replace(/\{\{(\w+)\}\}/g, (_: string, key: string) => urlTokens[key] ?? `{{${key}}}`);
      }
    });
  };
}

const config: Config = {
  title: 'JellyCloud',
  tagline: 'Cloud infrastructure that just works',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  url: siteUrl,
  baseUrl: '/',

  organizationName: 'jellycloud-io',
  projectName: 'docs',

  customFields: {
    consoleUrl,
  },

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
          editUrl: docsEditUrl,
          routeBasePath: '/',
          remarkPlugins: [remarkReplaceUrlTokens],
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
      title: '',
      logo: {
        alt: 'JellyCloud Logo',
        src: 'img/logo.png',
        srcDark: 'img/logo-dark.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: consoleUrl,
          label: 'Console',
          position: 'right',
          className: 'navbar-console-button',
        },
        {
          href: 'https://discord.gg/6GtvRvSj',
          position: 'right',
          className: 'navbar-icon-discord',
          'aria-label': 'Discord community',
        },
        {
          href: 'https://github.com/jellycloud-io/docs',
          position: 'right',
          className: 'navbar-icon-github',
          'aria-label': 'GitHub repository',
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
            {label: 'Core Concepts - TBD', to: '/core-concepts'},
          ],
        },
        {
          title: 'Platform - TBD',
          items: [
            {label: 'Supported Platforms', to: '/supported-platforms'},
            {label: 'Cloud Providers', to: '/cloud-providers/'},
            {label: 'AI Serving', to: '/ai-serving'},
            {label: 'Policies', to: '/policies'},
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
