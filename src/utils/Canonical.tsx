import React from 'react';
import { Helmet } from 'react-helmet';

interface CanonicalProps {
  path: string;
  title: string;
}

const Canonical: React.FC<CanonicalProps> = ({ path, title }) => {
  const baseUrl = 'http://localhost:3000/theta-wave/app';

  return (
    <Helmet>
      <title>{title}</title>
      <link rel='canonical' href={`${baseUrl}${path}`} />
    </Helmet>
  );
};

export default Canonical;
