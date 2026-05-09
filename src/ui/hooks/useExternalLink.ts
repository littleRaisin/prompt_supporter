import { useCallback } from 'react';
import toast from 'react-hot-toast'; // toastライブラリをインポート

const useExternalLink = () => {
  const openLink = useCallback((url: string) => {
    window.backend.openExternalUrl(url)
      .then(result => {
        if (result && result.error) {
          // eslint-disable-next-line no-console
          console.error('Failed to open external URL:', result.error);
          toast.error(`URLを開けませんでした: ${result.error}`);
        }
      })
      .catch((error: { message?: string }) => {
        // eslint-disable-next-line no-console
        console.error('Failed to open external URL:', error);
        toast.error(`URLを開けませんでした: ${error.message ?? String(error)}`);
      });
  }, []);

  return openLink;
};

export default useExternalLink;
