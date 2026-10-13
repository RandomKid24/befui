import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { afterEach, expect, it } from 'vitest';
import themes from '@/registry/themes.json';
import { ThemesPage, themeCss } from '@/site/themes-page';

const presets = themes as unknown as Record<string, { label: string; light: Record<string, string>; dark: Record<string, string> }>;
const tag = () => document.getElementById('befui-theme');
afterEach(() => tag()?.remove());

it('themeCss writes a light block and a dark block with every token', () => {
  const css = themeCss('rose');
  expect(css).toContain(':root, .light {');
  expect(css).toContain('.dark {');
  for (const mode of ['light', 'dark'] as const)
    for (const [token, value] of Object.entries(presets.rose[mode])) expect(css).toContain(`--${token}: ${value};`);
});

it('shows one card per preset with its install command', () => {
  render(<ThemesPage />);
  expect(screen.getAllByRole('button', { name: /^Apply .* theme$/ })).toHaveLength(10);
  expect(screen.getByText(/init --theme rose/)).toBeInTheDocument();
});

it('Apply swaps one style tag live, marks the active card, and Reset removes it', () => {
  render(<ThemesPage />);
  fireEvent.click(screen.getByRole('button', { name: 'Apply Rose theme' }));
  expect(tag()?.textContent).toContain(`--primary: ${presets.rose.light.primary};`);
  expect(screen.getByRole('button', { name: 'Apply Rose theme' })).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Apply Teal theme' }));
  expect(document.querySelectorAll('#befui-theme')).toHaveLength(1);
  expect(tag()?.textContent).toContain(`--primary: ${presets.teal.light.primary};`);
  expect(screen.getByRole('button', { name: 'Apply Rose theme' })).toHaveAttribute('aria-pressed', 'false');
  fireEvent.click(screen.getByRole('button', { name: 'Reset to default' }));
  expect(tag()).toBeNull();
});

it('passes axe', async () => {
  const { container } = render(<ThemesPage />);
  expect((await axe(container, { rules: { region: { enabled: false }, 'color-contrast': { enabled: false } } })).violations).toEqual([]);
});
