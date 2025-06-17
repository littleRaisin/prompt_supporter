import { useCallback } from 'react';

const useExternalLink = () => {
  const openLink = useCallback((url: string) => {
    window.backend.openExternalUrl(url).catch(error => {
      console.error('Failed to open external URL:', error);
    });
  }, []);

  return openLink;
};

export default useExternalLink;
