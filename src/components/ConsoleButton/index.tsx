import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface ConsoleButtonProps {
  path: string;
  children: React.ReactNode;
}

export default function ConsoleButton({path, children}: ConsoleButtonProps) {
  const {siteConfig} = useDocusaurusContext();
  const consoleUrl = siteConfig.customFields?.consoleUrl as string;
  return (
    <p>
      <a href={`${consoleUrl}${path}`} className="button button--primary button--lg">
        {children}
      </a>
    </p>
  );
}
