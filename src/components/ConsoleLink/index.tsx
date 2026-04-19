import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface ConsoleLinkProps {
  path: string;
  children: React.ReactNode;
}

export default function ConsoleLink({path, children}: ConsoleLinkProps) {
  const {siteConfig} = useDocusaurusContext();
  const consoleUrl = siteConfig.customFields?.consoleUrl as string;
  return <a href={`${consoleUrl}${path}`}>{children}</a>;
}
