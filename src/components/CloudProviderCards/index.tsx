import React from 'react';
import styles from './styles.module.css';

interface CloudProvider {
  id: string;
  displayName: string;
  description: string;
  logo: string;
  color: string;
  href: string;
  badges: string[];
}

const providers: CloudProvider[] = [
  {
    id: 'gcp',
    displayName: 'Google Cloud',
    description:
      "Innovative cloud platform leveraging Google's infrastructure and expertise in data analytics, machine learning, and container orchestration.",
    logo: 'https://cloud.google.com/favicon.ico',
    color: '#4285f4',
    href: './gcp',
    badges: ['General Compute', 'GPU', 'High Performance'],
  },
  {
    id: 'civo',
    displayName: 'Civo',
    description:
      'Cloud-native Kubernetes platform focused on simplicity and speed, with fast deployment times and developer-friendly tools.',
    logo: 'https://www.civo.com/favicon.ico',
    color: '#239dff',
    href: './civo',
    badges: ['General Compute', 'Cost Effective'],
  },
  {
    id: 'lambda',
    displayName: 'Lambda Labs',
    description:
      'GPU cloud platform specialized for AI and ML workloads, offering on-demand access to NVIDIA GPUs at competitive pricing.',
    logo: 'https://lambdalabs.com/favicon.ico',
    color: '#6366f1',
    href: './lambda-labs',
    badges: ['GPU Specialized', 'High Performance'],
  },
  {
    id: 'crusoe',
    displayName: 'Crusoe',
    description:
      'Clean energy-powered GPU cloud built for AI infrastructure, offering NVIDIA H100, H200, A100, and L40S GPUs.',
    logo: 'https://www.crusoe.ai/favicon.ico',
    color: '#00d4aa',
    href: './crusoe',
    badges: ['GPU Specialized', 'High Performance'],
  },
  {
    id: 'hetzner',
    displayName: 'Hetzner',
    description:
      'German cloud provider offering excellent price-to-performance ratio with reliable infrastructure. Popular in Europe for cost-effective hosting solutions.',
    logo: 'https://www.hetzner.com/favicon.ico',
    color: '#d50c2d',
    href: './hetzner',
    badges: ['General Compute', 'Cost Effective', 'High Performance'],
  },
];

export default function CloudProviderCards(): JSX.Element {
  return (
    <div className={styles.grid}>
      {providers.map((provider) => (
        <a key={provider.id} href={provider.href} className={styles.card}>
          <div className={styles.accent} style={{ backgroundColor: provider.color }} />
          <div className={styles.body}>
            <div className={styles.header}>
              <img
                src={provider.logo}
                alt={provider.displayName}
                className={styles.logo}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className={styles.name}>{provider.displayName}</span>
            </div>
            <p className={styles.description}>{provider.description}</p>
            <div className={styles.badges}>
              {provider.badges.map((badge) => (
                <span key={badge} className={styles.badge}>
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
