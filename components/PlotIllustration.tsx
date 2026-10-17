/** Aerial view of a plotted layout. Inline SVG: no image request, sharp at any size. */
export function PlotIllustration({ className }: { className?: string }) {
  const plots: Array<[number, number, string]> = [];
  const fills = ["#e7eef6", "#e7eef6", "#ffe2a8", "#e7eef6", "#d6e8dc", "#e7eef6"];
  let k = 0;
  for (const y of [40, 110]) for (let x = 40; x < 400; x += 60) plots.push([x, y, fills[k++ % fills.length]]);
  for (const y of [230, 300]) for (let x = 40; x < 400; x += 60) plots.push([x, y, fills[(k++ + 3) % fills.length]]);

  return (
    <svg className={className} viewBox="0 0 440 400" role="img" aria-labelledby="plot-ill-t">
      <title id="plot-ill-t">Illustration of a plotted layout with roads, trees and a highlighted plot</title>
      <rect width="440" height="400" rx="18" fill="#f4f7fb" />
      {/* roads */}
      <rect x="0" y="180" width="440" height="40" fill="#c9d4e3" />
      <rect x="0" y="360" width="440" height="40" fill="#c9d4e3" />
      <line x1="0" y1="200" x2="440" y2="200" stroke="#fff" strokeWidth="2" strokeDasharray="12 10" />
      <rect x="10" y="0" width="20" height="400" fill="#c9d4e3" />
      {/* plots */}
      {plots.map(([x, y, fill], i) => (
        <rect key={i} x={x} y={y} width="52" height="62" rx="4" fill={fill} stroke="#9fb0c6" strokeWidth="1.5" />
      ))}
      {/* highlighted plot */}
      <rect x="160" y="110" width="52" height="62" rx="4" fill="#e3941a" />
      <path d="M186 128c-6 0-10 4.6-10 10 0 7.5 10 18 10 18s10-10.5 10-18c0-5.4-4-10-10-10Zm0 13.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2Z" fill="#0d2340" />
      {/* trees */}
      {[60, 150, 250, 340, 420].map((x) => (
        <circle key={x} cx={x} cy={222} r="7" fill="#5fae7d" />
      ))}
      {[90, 210, 330].map((x) => (
        <circle key={x} cx={x} cy={178} r="7" fill="#5fae7d" />
      ))}
    </svg>
  );
}
