'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { MaximizeIcon, PauseIcon, PlayIcon, VolumeIcon, VolumeOffIcon } from './icons';

const time = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00');

/**
 * Video or audio player with its own controls in the theme: play and pause, a seek bar, time, mute and (for video) fullscreen. Space plays
 * and pauses when the player is focused. Set `type="audio"` for a slim bar with no picture.
 */
export function MediaPlayer({ src, type = 'video', poster, title, className }: { src: string; type?: 'video' | 'audio'; poster?: string; title?: string; className?: string }) {
  const el = React.useRef<HTMLVideoElement & HTMLAudioElement>(null);
  const box = React.useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [t, setT] = React.useState(0);
  const [dur, setDur] = React.useState(0);
  const [muted, setMuted] = React.useState(false);
  const toggle = () => { const m = el.current; if (m) m.paused ? void m.play() : m.pause(); };
  const media = {
    ref: el, src, preload: 'metadata', onClick: type === 'video' ? toggle : undefined,
    onPlay: () => setPlaying(true), onPause: () => setPlaying(false),
    onTimeUpdate: () => setT(el.current!.currentTime), onLoadedMetadata: () => setDur(el.current!.duration), onDurationChange: () => setDur(el.current!.duration),
  } as const;
  return (
    <div ref={box} tabIndex={0} role="group" aria-label={title ?? `${type} player`} onKeyDown={(e) => { if (e.key === ' ' && e.target === e.currentTarget) { e.preventDefault(); toggle(); } }} className={cn('overflow-hidden rounded-xl border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}>
      {type === 'video' ? <video {...media} poster={poster} playsInline className="block aspect-video w-full cursor-pointer bg-black" /> : <audio {...media} />}
      {title ? <p className="truncate px-3 pt-2.5 text-sm font-medium">{title}</p> : null}
      <div className="flex items-center gap-3 px-3 py-2.5">
        <button type="button" onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95">
          {playing ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
        </button>
        <span className="w-9 text-xs tabular-nums text-muted-foreground">{time(t)}</span>
        <input type="range" min={0} max={dur || 1} step="any" value={t} aria-label="Seek" onChange={(e) => { el.current!.currentTime = Number(e.target.value); setT(Number(e.target.value)); }} className="h-1 min-w-0 flex-1 cursor-pointer accent-[var(--primary)]" />
        <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{time(dur)}</span>
        <button type="button" onClick={() => { el.current!.muted = !muted; setMuted(!muted); }} aria-label={muted ? 'Unmute' : 'Mute'} className="text-muted-foreground hover:text-foreground">{muted ? <VolumeOffIcon className="size-4" /> : <VolumeIcon className="size-4" />}</button>
        {type === 'video' ? <button type="button" onClick={() => void box.current?.requestFullscreen?.()} aria-label="Fullscreen" className="text-muted-foreground hover:text-foreground"><MaximizeIcon className="size-4" /></button> : null}
      </div>
    </div>
  );
}
