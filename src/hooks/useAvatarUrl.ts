import { useEffect } from 'react';
import { useAvatarStore } from '../store/avatarStore';

export function useAvatarUrl() {
  const avatarUrl = useAvatarStore((state) => state.avatarUrl);
  const loading = useAvatarStore((state) => state.loading);
  const uploading = useAvatarStore((state) => state.uploading);
  const error = useAvatarStore((state) => state.error);
  const fetchAvatar = useAvatarStore((state) => state.fetchAvatar);
  const upload = useAvatarStore((state) => state.upload);
  const startPolling = useAvatarStore((state) => state.startPolling);

  useEffect(() => {
    startPolling();
    
    return () => {
      // Only stop polling when last component unmounts
      // This is handled by Zustand's persistence
    };
  }, [startPolling]);

  return { avatarUrl, loading, error, uploading, refetch: fetchAvatar, upload };
}
