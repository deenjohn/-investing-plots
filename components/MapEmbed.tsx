/**
 * Google Map for a place, loaded only when scrolled near (loading="lazy"), so it costs nothing on first paint.
 * `query` is what you would type into Google Maps.
 */
export function MapEmbed({ query, title }: { query: string; title: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const open = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  return (
    <figure className="map">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <figcaption>
        <a className="text-link" href={open} target="_blank" rel="noreferrer">
          Open in Google Maps
        </a>
      </figcaption>
    </figure>
  );
}
