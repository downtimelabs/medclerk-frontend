import { create } from 'zustand';
import { getPatientAvatarUrl, uploadAvatar } from '../api/upload';

const AVATAR_POLL_INTERVAL = 4 * 60 * 1000; // 4 minutes (before 5 min expiry)

interface AvatarState {
  avatarUrl: string | null;
  loading: boolean;
  uploading: boolean;
  error: Error | null;
  _intervalId: ReturnType<typeof setInterval> | null;
  fetchAvatar: () => Promise<void>;
  upload: (file: File) => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
}

export const useAvatarStore = create<AvatarState>((set, get) => ({
  avatarUrl: null,
  loading: true,
  uploading: false,
  error: null,
  _intervalId: null,

  fetchAvatar: async () => {
    try {
      const url = await getPatientAvatarUrl();
      set({ avatarUrl: url, error: null, loading: false });
    } catch (err) {
      // Don't set error for 404 (no avatar yet)
      if ((err as any)?.response?.status !== 404) {
        set({ error: err as Error, loading: false });
      } else {
        set({ avatarUrl: null, loading: false });
      }
    }
  },

  upload: async (file: File) => {
    set({ uploading: true, error: null });
    try {
      await uploadAvatar(file);
      // Fetch fresh avatar URL after upload
      await get().fetchAvatar();
    } catch (err) {
      set({ error: err as Error });
      throw err;
    } finally {
      set({ uploading: false });
    }
  },

  startPolling: () => {
    const { fetchAvatar, _intervalId } = get();
    
    // Fetch immediately
    fetchAvatar();
    
    // Don't start another interval if one exists
    if (_intervalId) return;
    
    // Poll every 4 minutes
    const id = setInterval(fetchAvatar, AVATAR_POLL_INTERVAL);
    set({ _intervalId: id });
  },

  stopPolling: () => {
    const { _intervalId } = get();
    if (_intervalId) {
      clearInterval(_intervalId);
      set({ _intervalId: null });
    }
  },
}));
