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
      type: 'category',
      label: 'Core Concepts - TBD',
      link: {
        type: 'generated-index',
        title: 'Core Concepts',
        description: "Understanding JellyCloud's building blocks will help you design reliable, scalable deployments.",
        slug: '/core-concepts',
      },
      items: [
        'core-concepts/architecture',
        'core-concepts/workloads',
        'core-concepts/networking',
        'core-concepts/storage',
      ],
    },
    {
      type: 'category',
      label: 'Configuration - TBD',
      link: {
        type: 'generated-index',
        title: 'Configuration',
        description: 'JellyCloud is configured through jelly.yaml files committed to your repository.',
        slug: '/configuration',
      },
      items: [
        'configuration/global-settings',
        'configuration/environment-variables',
        'configuration/secrets',
      ],
    },
    {
      type: 'category',
      label: 'AI Serving - TBD',
      link: {
        type: 'generated-index',
        title: 'AI Serving',
        description: 'First-class support for deploying and serving AI and ML models at scale.',
        slug: '/ai-serving',
      },
      items: [
        'ai-serving/overview',
        'ai-serving/deploying-models',
        'ai-serving/scaling',
        'ai-serving/monitoring',
      ],
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
