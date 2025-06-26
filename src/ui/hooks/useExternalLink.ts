import { useCallback } from 'react';
import toast from 'react-hot-toast'; // toastライブラリをインポート

const useExternalLink = () => {
  const openLink = useCallback((url: string) => {
    window.backend.openExternalUrl(url)
      .then(result => {
        if (result && result.error) {
          console.error('Failed to open external URL:', result.error);
          toast.error(`URLを開けませんでした: ${result.error}`); // ユーザーに通知
        }
      })
      .catch(error => {
        console.error('Failed to open external URL:', error);
        toast.error(`URLを開けませんでした: ${error.message || error}`); // ユーザーに通知
      });
  }, []);

  return openLink;
};

export default useExternalLink;
