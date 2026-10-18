import type { FactImage } from '../facts'

type PhotoGridProps = {
  images: FactImage[]
}

// Photos and diagrams under the answer, each with its label and credit.
export function PhotoGrid({ images }: PhotoGridProps) {
  // Wide pictures take a whole row, so only the others decide the column count.
  const inGrid = images.filter((img) => !img.wide).length
  return (
    <div className={`photos photos-${inGrid}`}>
      {images.map((img) => (
        <figure className={`photo ${img.wide ? 'photo-wide' : ''}`} key={img.src}>
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
            className={img.fit === 'contain' ? 'photo-contain' : undefined}
          />
          <figcaption>
            <span className="photo-label">{img.label}</span>
            {img.note && <span className="photo-note">{img.note}</span>}
            <span className="photo-credit">
              <a href={img.source} target="_blank" rel="noreferrer">
                {img.credit}
              </a>
              {img.license && ' · '}
              {img.license && img.licenseUrl ? (
                <a href={img.licenseUrl} target="_blank" rel="noreferrer">
                  {img.license}
                </a>
              ) : (
                img.license
              )}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
