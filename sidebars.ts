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
      link: {type: 'doc', id: 'quick-start/index'},
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
      label: 'Core Concepts',
      link: {type: 'doc', id: 'core-concepts/index'},
      items: [
        'core-concepts/architecture',
        'core-concepts/workloads',
        'core-concepts/networking',
        'core-concepts/storage',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      link: {type: 'doc', id: 'configuration/index'},
      items: [
        'configuration/global-settings',
        'configuration/environment-variables',
        'configuration/secrets',
      ],
    },
    {
      type: 'category',
      label: 'AI Serving',
      link: {type: 'doc', id: 'ai-serving/index'},
      items: [
        'ai-serving/overview',
        'ai-serving/deploying-models',
        'ai-serving/scaling',
        'ai-serving/monitoring',
      ],
    },
    {
      type: 'category',
      label: 'Recipes',
      link: {type: 'doc', id: 'recipes/index'},
      items: [
        'recipes/deploy-llm',
        'recipes/autoscaling-gpu',
        'recipes/ci-cd-integration',
      ],
    },
    {
      type: 'category',
      label: 'Support',
      link: {type: 'doc', id: 'support/index'},
      items: [
        'support/faq',
        'support/troubleshooting',
        'support/contact',
      ],
    },
  ],
};

export default sidebars;
