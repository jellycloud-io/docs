import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Quick Start',
      link: {
        type: 'generated-index',
        title: 'Quick Start',
        description: 'Get your first workload running on JellyCloud in minutes.',
        slug: '/quick-start',
      },
      items: [
        'quick-start/installation',
        'quick-start/first-deployment',
        'quick-start/whats-next',
      ],
    },
    {
      type: 'doc',
      id: 'supported-platforms/index',
      label: 'Supported Platforms',
    },
    {
      type: 'category',
      label: 'Cloud Providers',
      link: {type: 'doc', id: 'cloud-providers/index'},
      items: [
        'cloud-providers/gcp',
        'cloud-providers/civo',
        'cloud-providers/lambda-labs',
        'cloud-providers/crusoe',
      ],
    },
    {
      type: 'doc',
      id: 'core-concepts/index',
      label: 'Core Concepts',
    },
    {
      type: 'doc',
      id: 'configuration/index',
      label: 'Configuration',
    },
    {
      type: 'doc',
      id: 'ai-serving/index',
      label: 'AI Serving',
    },
    {
      type: 'doc',
      id: 'recipes/index',
      label: 'Recipes',
    },
    {
      type: 'doc',
      id: 'support/index',
      label: 'Support',
    },
  ],
};

export default sidebars;
