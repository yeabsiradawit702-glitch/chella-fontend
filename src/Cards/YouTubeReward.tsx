
import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../utilit/axiosInstance';
import { API_PATHS } from '../utilit/apiPath';

function getYouTubeId(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return parsed.pathname.slice(1);
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v');
      }

      const match = parsed.pathname.match(
        /^\/(?:embed|shorts)\/([^/]+)/
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
}) {
  const playerRef = useRef(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let player;
    let cancelled = false;

    const videoId = getYouTubeId(targetUrl);

    if (!videoId) {
      setMessage('This task does not have a valid YouTube URL.');
      return;
    }

    const initPlayer = () => {
      if (cancelled || !window.YT?.Player) return;

      player = new window.YT.Player(
        `youtube-player-${taskId}`,
        {
          videoId,
          playerVars: {
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onStateChange: async (event) => {
              if (
                event.data !== window.YT.PlayerState.ENDED ||
                loading
              ) {
                return;
              }

              setLoading(true);
              setMessage('Video finished. Processing reward...');

              try {
                const response = await axiosInstance.post(
                  API_PATHS.TASKS.CLAIM_VIDEO_REWARD(taskId)
                );

                setMessage(
                  `${response.data.message}. Reward: ${response.data.reward}. New balance: ${response.data.walletBalance}`
                );
              } catch (error) {
                setMessage(
                  error.response?.data?.message ||
                  'Could not process reward.'
                );
              } finally {
                setLoading(false);
              }
            },
          },
        }
      );

      playerRef.current = player;
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      const previousCallback =
        window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        initPlayer();
      };

      if (!document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
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

      {message && (
        <p className="mt-3 text-sm text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
}
