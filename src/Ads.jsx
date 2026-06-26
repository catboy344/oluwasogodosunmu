import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Maximize2 } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { getThemeColors } from './themeColors';
import { sb } from './Site';

const Ads = ({ position = "home", limit = 3 }) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleAds, setVisibleAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null); // For fullscreen view
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);

  // Check if URL is a video
  const isVideo = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    const videoPlatforms = ['youtube.com', 'youtu.be', 'vimeo.com'];
    
    return videoExtensions.some(ext => url.includes(ext)) ||
           videoPlatforms.some(platform => url.includes(platform));
  };

  // Get embed URL for videos
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

  // Fetch ads from Supabase
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
          setVisibleAds(data.map(ad => ({ ...ad, visible: true })));
        }
      } catch (err) {
        console.error("Failed to load ads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [position, limit]);

  // 🔥 Handle ad click - opens the ad in a modal/popup
  const handleAdClick = async (ad) => {
    try {
      // Update click count in Supabase
      await sb
        .from("ads")
        .update({ clicks: ad.clicks + 1 })
        .eq("id", ad.id);

      // Open ad in fullscreen modal
      setSelectedAd(ad);
    } catch (err) {
      console.error("Error recording click:", err);
    }
  };

  // Close fullscreen modal
  const closeFullscreen = () => {
    setSelectedAd(null);
  };

  // Close/dismiss ad
  const dismissAd = (adId) => {
    setVisibleAds(prev => 
      prev.map(ad => 
        ad.id === adId ? { ...ad, visible: false } : ad
      )
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-8 h-8 rounded-full animate-spin" style={{ border: `2px solid ${colors.borderColor}`, borderTopColor: colors.textPrimary }} />
      </div>
    );
  }

  if (ads.length === 0) return null;

  const visible = visibleAds.filter(ad => ad.visible);
  if (visible.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        {visible.map((ad, index) => {
          const videoUrl = ad.video_url || ad.link_url;
          const isVideoAd = videoUrl && isVideo(videoUrl);
          const embedUrl = isVideoAd ? getEmbedUrl(videoUrl) : null;
          const hasLink = ad.link_url || ad.video_url || ad.image_url;
          
          return (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl group"
              style={{
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                border: `1px solid ${colors.borderColor}`,
              }}
            >
              {/* 🔥 ENTIRE CARD IS CLICKABLE */}
              <div 
                className="p-4 cursor-pointer"
                onClick={() => handleAdClick(ad)}
              >
                {/* Image Section - shows FULL image */}
                {ad.image_url && !isVideoAd && (
                  <div className="w-full rounded-xl overflow-hidden mb-3">
                    <img 
                      src={ad.image_url} 
                      alt={ad.title}
                      className="w-full h-auto max-h-[250px] object-contain bg-black/5"
                      style={{ background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)' }}
                    />
                  </div>
                )}

                {/* Video Section */}
                {isVideoAd && (
                  <div className="w-full rounded-xl overflow-hidden mb-3 relative">
                    {embedUrl && embedUrl.match(/\.(mp4|webm|mov)$/i) ? (
                      <video
                        src={embedUrl}
                        className="w-full aspect-video"
                        controls
                        playsInline
                        poster={ad.image_url || undefined}
                      />
                    ) : (
                      <iframe
                        src={embedUrl}
                        className="w-full aspect-video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={ad.title}
                      />
                    )}
                  </div>
                )}

                {/* Text Content */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-body text-[14px] font-semibold" style={{ color: colors.textPrimary }}>
                      {ad.title}
                    </h4>
                    <p className="font-body text-[12px] mt-1" style={{ color: colors.textMuted }}>
                      {hasLink ? '👆 Tap to view' : 'Sponsored'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasLink && (
                      <Maximize2 size={14} style={{ color: colors.textMuted }} />
                    )}
                    <div className="text-xs font-body px-2 py-1 rounded-full" style={{ background: colors.borderColor, color: colors.textMuted }}>
                      Ad
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔥 X button - ONLY closes the ad */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissAd(ad.id);
                }}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors z-10"
                style={{ color: colors.textMuted }}
              >
                <X size={14} />
              </button>

              {/* Hover effect */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" 
                style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }} 
              />
            </motion.div>
          );
        })}
      </div>

      {/* 🔥 FULLSCREEN MODAL - Shows ad in full size */}
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
            {/* Close button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}
            >
              <X size={20} />
            </button>

            {/* Full content */}
            <div className="p-6">
              {/* Image */}
              {selectedAd.image_url && (
                <div className="w-full rounded-xl overflow-hidden mb-4">
                  <img 
                    src={selectedAd.image_url} 
                    alt={selectedAd.title}
                    className="w-full h-auto max-h-[60vh] object-contain"
                  />
                </div>
              )}

              {/* Video */}
              {selectedAd.video_url && isVideo(selectedAd.video_url) && (
                <div className="w-full rounded-xl overflow-hidden mb-4">
                  {selectedAd.video_url.match(/\.(mp4|webm|mov)$/i) ? (
                    <video
                      src={selectedAd.video_url}
                      className="w-full max-h-[60vh]"
                      controls
                      playsInline
                      autoPlay
                    />
                  ) : (
                    <iframe
                      src={getEmbedUrl(selectedAd.video_url)}
                      className="w-full aspect-video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={selectedAd.title}
                    />
                  )}
                </div>
              )}

              {/* Title and description */}
              <h2 className="font-fraunces text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {selectedAd.title}
              </h2>
              
              {/* Link button */}
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
