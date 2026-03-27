import { useEffect, useMemo, useState } from 'react';
import { AdService } from '../services/adService';

function AdBanner({
  positions = [],
  ratio,
  placeholderLabel = '广告位',
  interval = 5000,
  width = '100%',
  height = 'auto',
}) {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const positionsKey = useMemo(() => JSON.stringify(positions), [positions]);

  useEffect(() => {
    let isActive = true;

    const fetchAds = async () => {
      setLoading(true);
      const results = await Promise.all(positions.map((position) => AdService.fetchAd(position)));
      if (!isActive) {
        return;
      }

      const mergedAds = results.flat().filter((ad) => ad?.adv_url);
      setAds(mergedAds);
      setCurrentIndex(0);
      setLoading(false);
    };

    fetchAds();

    return () => {
      isActive = false;
    };
  }, [positions, positionsKey]);

  useEffect(() => {
    if (ads.length <= 1 || interval <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [ads.length, interval]);

  const currentAd = ads[currentIndex];

  const openTarget = async () => {
    if (!currentAd?.target_url) {
      return;
    }

    if (window.electronAPI?.openExternal) {
      await window.electronAPI.openExternal(currentAd.target_url);
      return;
    }

    window.open(currentAd.target_url, '_blank', 'noopener,noreferrer');
  };

  if (loading || !currentAd) {
    return (
      <div
        className="sidebar-promo-card ad-banner-container"
        style={{
          width,
          height,
          aspectRatio: ratio || undefined,
        }}
      >
        <div className="sidebar-promo-badge">AD</div>
        <div className="sidebar-promo-title">{loading ? '广告加载中' : placeholderLabel}</div>
        <div className="sidebar-promo-subtitle">鲲穹赋能未来</div>
      </div>
    );
  }

  return (
    <div
      className="sidebar-ad-rotator ad-banner-container"
      style={{
        width,
        height,
        aspectRatio: ratio || undefined,
      }}
    >
      <button type="button" className="sidebar-ad-image-btn" onClick={openTarget} title="打开广告链接">
        <img
          src={currentAd.adv_url}
          alt="Advertisement"
          className="sidebar-ad-image"
        />
      </button>

      {ads.length > 1 && (
        <div className="sidebar-ad-dots">
          {ads.map((ad, index) => (
            <button
              key={`${ad.adv_url}-${index}`}
              type="button"
              className={`sidebar-ad-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`切换到第 ${index + 1} 张广告`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdBanner;
