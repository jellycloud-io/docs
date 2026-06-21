import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'doc',
      id: 'quick-start',
      label: 'Quick Start',
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
        'cloud-providers/hetzner',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      link: {type: 'doc', id: 'core-concepts/index'},
      items: [
        'core-concepts/architecture',
        'core-concepts/jelly-nodes',
        'core-concepts/proxy-pod',
        'core-concepts/persistent-volumes',
        'core-concepts/security',
      ],
    },
    {
      type: 'category',
      label: 'Deployment Options',
      link: {type: 'doc', id: 'deployment-options/index'},
      items: [
        'deployment-options/cluster-deployment',
        'policies/index',
      ],
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
