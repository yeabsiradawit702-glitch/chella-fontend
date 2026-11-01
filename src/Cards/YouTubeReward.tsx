
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utilit/axiosInstance';
import { API_PATHS } from '../utilit/apiPath';

interface YouTubePlayer {
  destroy: () => void;
}

interface YouTubePlayerEvent {
  data: number;
}

interface YouTubePlayerError {
  data: number;
}

interface YouTubePlayerOptions {
  videoId: string;
  playerVars?: {
    playsinline?: number;
    origin?: string;
    rel?: number;
  };
  events?: {
    onReady?: () => void;
    onStateChange?: (event: YouTubePlayerEvent) => void;
    onError?: (event: YouTubePlayerError) => void;
  };
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: YouTubePlayerOptions
      ) => YouTubePlayer;
      PlayerState: {
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YouTubeRewardProps {
  taskId: string;
  targetUrl: string;
}

function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    if (host === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] || null;
    }

    if (
      ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)
    ) {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v');
      }

      const match = parsed.pathname.match(
        /^\/(?:embed|shorts|live)\/([^/?]+)/
      );

      return match?.[1] || null;
    }
  } catch {
    return null;
  }

  return null;
}

export default function YouTubeReward({
  taskId,
  targetUrl,
}: YouTubeRewardProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const claimingRef = useRef(false);
  const claimedRef = useRef(false);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let player: YouTubePlayer | null = null;
    let cancelled = false;

    claimingRef.current = false;
    claimedRef.current = false;

    const videoId = getYouTubeId(targetUrl);

    if (!videoId) {
      setMessage('Invalid YouTube video or Shorts URL.');
      return;
    }

    const claimReward = async () => {
      if (
        cancelled ||
        claimingRef.current ||
        claimedRef.current
      ) {
        return;
      }

      claimingRef.current = true;
      setLoading(true);
      setMessage('Video finished. Processing your reward...');

      try {
        const response = await axiosInstance.post(
          API_PATHS.TASKS.CLAIM_VIDEO_REWARD(taskId)
        );

        if (cancelled) return;

        claimedRef.current = true;

        setMessage(
          `${response.data.message || 'Reward claimed successfully'}! ` +
          `Reward: ${response.data.reward ?? 0} ETB. ` +
          `New balance: ${response.data.etbBalance ?? 'updated'} ETB.`
        );
      } catch (error: unknown) {
        if (cancelled) return;

        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message
          : undefined;

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 409
        ) {
          claimedRef.current = true;
        }

        setMessage(errorMessage || 'Could not process your reward.');
      } finally {
        claimingRef.current = false;

        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const initPlayer = () => {
      if (
        cancelled ||
        !window.YT?.Player
      ) {
        return;
      }

      const container = document.getElementById(
        `youtube-player-${taskId}`
      );

      if (!container) return;

      player = new window.YT.Player(
        `youtube-player-${taskId}`,
        {
          videoId,
          playerVars: {
            playsinline: 1,
            origin: window.location.origin,
            rel: 0,
          },
          events: {
            onReady: () => {
              if (!cancelled) {
                setMessage('Play the video to earn your reward.');
              }
            },

            onStateChange: (event: YouTubePlayerEvent) => {
              if (
                event.data === window.YT?.PlayerState.ENDED
              ) {
                claimReward();
              }
            },

            onError: (event: YouTubePlayerError) => {
              if (cancelled) return;

              console.error('YouTube player error:', event.data);

              const errors: Record<number, string> = {
                2: 'Invalid YouTube video ID.',
                5: 'This video cannot be played in the HTML5 player.',
                100: 'This YouTube video was removed or is unavailable.',
                101: 'This video owner does not allow embedded playback.',
                150: 'This video owner does not allow embedded playback.',
              };

              setMessage(
                errors[event.data] ||
                'Unable to play this YouTube video.'
              );
            },
          },
        }
      );

      playerRef.current = player;
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const previousCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        initPlayer();
      };

      if (
        !document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]'
        )
      ) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      player?.destroy();
      playerRef.current = null;
    };
  }, [taskId, targetUrl]);

  return (
    <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-3 font-semibold">
        Watch the full video to earn your reward
      </h3>

      <div className="aspect-video w-full overflow-hidden rounded-lg">
        <div
          id={`youtube-player-${taskId}`}
          className="h-full w-full"
        />
      </div>

      {loading && (
        <p className="mt-3 text-sm text-blue-600">
          Processing reward...
        </p>
      )}

      {message && (
        <p className="mt-3 text-sm text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
}
