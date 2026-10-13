import type { ComponentType } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { GithubIcon, GoogleIcon, brandColors, brandIcons } from '@/components/ui/brand-icons';

const BRANDS = [
  'Google', 'Github', 'Gitlab', 'Apple', 'XBrand', 'Facebook', 'Instagram', 'Youtube', 'Tiktok', 'Reddit', 'Twitch', 'Discord',
  'Whatsapp', 'Telegram', 'Spotify', 'Figma', 'Notion', 'Dropbox', 'GoogleDrive', 'Zoom', 'Atlassian', 'Jira', 'Trello', 'Shopify',
  'Stripe', 'Paypal', 'Visa', 'Mastercard', 'Microsoft', 'Linkedin',
].map((n) => `${n}Icon`);

it('ships exactly the 30 brands in the spec', () => {
  expect(Object.keys(brandIcons).sort()).toEqual([...BRANDS].sort());
});

it('renders one filled path, decorative by default', () => {
  const { container } = render(<GoogleIcon />);
  const svg = container.querySelector('svg')!;
  expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  expect(svg).toHaveAttribute('fill', 'currentColor');
  expect(svg).toHaveAttribute('aria-hidden', 'true');
  expect(svg.querySelectorAll('path').length).toBeGreaterThan(0);
});

it('becomes a labelled image when given aria-label, and keeps className and style', () => {
  render(<GithubIcon aria-label="GitHub" className="size-8" style={{ color: 'red' }} />);
  const img = screen.getByRole('img', { name: 'GitHub' });
  expect(img).toHaveClass('size-8');
  expect(img).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  expect(img).not.toHaveAttribute('aria-hidden');
});

it('every brand draws something and has a hex colour', () => {
  const slug = (n: string) => n.replace(/Icon$/, '').replace(/Brand$/, '').toLowerCase();
  const Icons = brandIcons as unknown as Record<string, ComponentType>;
  const empty = Object.entries(Icons).filter(([, Icon]) => !render(<Icon />).container.querySelector('svg path')).map(([n]) => n);
  const noColour = Object.keys(brandIcons).filter((n) => !/^#[0-9A-F]{6}$/i.test(brandColors[slug(n)] ?? ''));
  expect({ empty, noColour }).toEqual({ empty: [], noColour: [] });
});
