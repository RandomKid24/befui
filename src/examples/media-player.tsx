import * as React from 'react';
import { MediaPlayer } from '@/components/ui/media-player';

/** A few seconds of a soft tone, generated in the browser so the demo needs no file. Use your own mp3 or mp4 URL. */
function tone(seconds = 12, rate = 8000) {
  const n = seconds * rate, buf = new DataView(new ArrayBuffer(44 + n * 2));
  const w = (o: number, s: string) => [...s].forEach((c, i) => buf.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); buf.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); buf.setUint32(16, 16, true); buf.setUint16(20, 1, true); buf.setUint16(22, 1, true);
  buf.setUint32(24, rate, true); buf.setUint32(28, rate * 2, true); buf.setUint16(32, 2, true); buf.setUint16(34, 16, true); w(36, 'data'); buf.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) buf.setInt16(44 + i * 2, Math.sin((2 * Math.PI * (330 + 110 * Math.floor(i / rate / 3)) * i) / rate) * 3000, true);
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}

export default function MediaPlayerDemo() {
  const src = React.useMemo(() => tone(), []);
  return <MediaPlayer className="w-96 max-w-full" type="audio" title="Morning chime" src={src} />;
}
