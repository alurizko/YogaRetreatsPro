import { useTranslation } from 'react-i18next'

// Простой видео-герой, похожий на BookYogaRetreats: фоновое видео, затемнение и CTA
export default function HeroVideo() {
  const { t } = useTranslation()

  // Можно заменить на свой CDN/Storage в будущем
  const videoSrc = 'https://cdn.coverr.co/videos/coverr-woman-practicing-yoga-5178/1080p.mp4'
  const poster = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&h=900&fit=crop'

  return (
    <section className="relative w-full h-[56vh] md:h-[64vh] lg:h-[72vh] overflow-hidden rounded-xl mb-8">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={videoSrc}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 flex h-full items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            {t('home.hero.title')}
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-6">
            {t('home.hero.subtitle')}
          </p>
          {/* CTA intentionally removed per request */}
        </div>
      </div>
    </section>
  )
}
