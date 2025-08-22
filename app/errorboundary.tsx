"use client"

import React, { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ErrorBoundary({ children, fallback }: Props) {
  const [hasError, setHasError] = useState(false);
  const [_, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error);
      setHasError(true);
      event.preventDefault();
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setError(event.reason);
      setHasError(true);
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return fallback || (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Something went wrong</h3>
        <p>Please refresh the page or try again later.</p>
        <button onClick={() => setHasError(false)}>
          Try Again
        </button>
      </div>
    );
  }

  return <>{children}</>;
}