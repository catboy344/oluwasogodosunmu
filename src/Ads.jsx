import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Play, X, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { getThemeColors } from './themeColors';
import { sb } from './Site';

const Ads = ({ position = "home", limit = 3 }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState(null);
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  const videoRefs = useRef({});

  const isVideo = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    const videoPlatforms = ['youtube.com', 'youtu.be', 'vimeo.com'];
    return videoExtensions.some(ext => url.toLowerCase().includes(ext)) ||
           videoPlatforms.some(platform => url.includes(platform));
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const { data, error } = await sb
          .from("ads")
          .select("*")
          .eq("active", true)
          .eq("position", position)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) {
          console.error("Error fetching ads:", error);
          return;
        }

        if (data) {
          setAds(data);
          // Auto-play videos after render
          setTimeout(() => {
            data.forEach(ad => {
              const videoEl = videoRefs.current[ad.id];
              if (videoEl && isVideo(ad.video_url)) {
                try { videoEl.play(); } catch {}
              }
            });
          }, 500);
        }
      } catch (err) {
        console.error("Failed to load ads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [position, limit]);

  const handleAdClick = async (ad) => {
    try {
      await sb
        .from("ads")
        .update({ clicks: ad.clicks + 1 })
        .eq("id", ad.id);
      setSelectedAd(ad);
    } catch (err) {
      console.error("Error recording click:", err);
    }
  };

  const closeFullscreen = () => {
    setSelectedAd(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: `2px solid ${colors.borderColor}`, borderTopColor: colors.textPrimary }} />
      </div>
    );
  }

  if (ads.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ads.map((ad, index) => {
          const hasVideo = ad.video_url && isVideo(ad.video_url);
          const videoUrl = hasVideo ? ad.video_url : null;
          
          return (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              className="group cursor-pointer overflow-hidden rounded-2xl"
              style={{
                aspectRatio: "3/4",
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${colors.borderColor}`,
              }}
              onClick={() => handleAdClick(ad)}
            >
              <div className="w-full h-full flex flex-col">
                <div className="flex-1 overflow-hidden relative">
                  {/* 🔥 VIDEO - WITH DIRECT MP4 SUPPORT */}
                  {hasVideo && videoUrl && (
                    <div className="w-full h-full relative">
                      <video
                        ref={el => { if (el) videoRefs.current[ad.id] = el; }}
                        src={videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        loop
                        preload="auto"
                        onError={(e) => {
                          console.log('Video error for:', ad.title);
                          console.log('URL:', videoUrl);
                          console.log('Error:', e);
                        }}
                      />
                      
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                          <Play className="w-8 h-8 text-white ml-1" fill="white" />
                        </div>
                      </div>
                      
                      {/* Video indicator */}
                      <div className="absolute bottom-2 left-2 text-[8px] font-body px-2 py-0.5 rounded" style={{ background: 'rgba(255,0,0,0.8)', color: 'white' }}>
                        ▶ VIDEO
                      </div>
                    </div>
                  )}

                  {/* IMAGE - ONLY IF NO VIDEO */}
                  {!hasVideo && ad.image_url && (
                    <img 
                      src={ad.image_url} 
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  {/* Ad badge */}
                  <div className="absolute top-2 right-2 text-[10px] font-body px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.7)' }}>
                    Ad
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="font-body text-[13px] font-semibold truncate" style={{ color: colors.textPrimary }}>
                    {ad.title}
                  </h4>
                  <p className="font-body text-[10px] mt-0.5 flex items-center gap-1" style={{ color: colors.textMuted }}>
                    <Maximize2 size={12} />
                    {hasVideo ? '▶️ Tap to watch' : 'Tap to view'}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Modal */}
      {selectedAd && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}
          onClick={closeFullscreen}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-w-4xl w-full max-h-[90vh] rounded-2xl overflow-auto"
            style={{ background: isDark ? '#0E1015' : '#ffffff' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}
            >
              <X size={20} />
            </button>

            <div className="p-6">
              {/* Video in fullscreen */}
              {selectedAd.video_url && isVideo(selectedAd.video_url) && (
                <div className="w-full rounded-xl overflow-hidden mb-4 bg-black">
                  <video
                    src={selectedAd.video_url}
                    className="w-full max-h-[60vh]"
                    controls
                    playsInline
                    autoPlay
                    controlsList="nodownload"
                  />
                </div>
              )}

              {!selectedAd.video_url && selectedAd.image_url && (
                <div className="w-full rounded-xl overflow-hidden mb-4">
                  <img 
                    src={selectedAd.image_url} 
                    alt={selectedAd.title}
                    className="w-full h-auto max-h-[60vh] object-contain"
                  />
                </div>
              )}

              <h2 className="font-fraunces text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {selectedAd.title}
              </h2>
              
              {selectedAd.link_url && (
                <a
                  href={selectedAd.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-3 rounded-xl font-body text-[14px] font-semibold"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#2563EB)', color: 'white' }}
                >
                  Visit Link →
                </a>
              )}

              <p className="font-body text-[12px] mt-4" style={{ color: colors.textMuted }}>
                {selectedAd.clicks || 0} clicks • Sponsored
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Ads;
