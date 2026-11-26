import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ChallengeTracker, challengeStats } from '@/components/ui/challenge-tracker';
import { rentalReturn } from '@/components/ui/return-calculator';
import { ReviewInbox } from '@/components/ui/review-inbox';
import { SmartHomeTiles } from '@/components/ui/smart-home-tiles';
import { RevealGroup } from '@/components/ui/reveal';
import { ThemeToggle } from '@/components/ui/theme-toggle';

it('counts streaks, and an unchecked today does not break the current one', () => {
  expect(challengeStats(['kept', 'kept', 'kept', 'missed', 'kept', 'kept', undefined], 7)).toEqual({ streak: 2, best: 3, kept: 5 });
  expect(challengeStats(['kept', 'missed'], 2).streak).toBe(0);
  expect(challengeStats(['kept', undefined, undefined], 3).streak).toBe(0);
});

it('checks in today', () => {
  const onCheckIn = vi.fn();
  render(<ChallengeTracker title="T" days={['kept', undefined]} today={2} onCheckIn={onCheckIn} />);
  fireEvent.click(screen.getByRole('button', { name: 'I kept it today' }));
  expect(onCheckIn).toHaveBeenCalledWith('kept');
});

it('works out a rental year, fee only on rent collected', () => {
  const r = rentalReturn({ price: 1_000_000, monthlyRent: 10_000, monthlyCosts: 1_000, emptyWeeks: 13, agentFee: 10 });
  expect(r).toMatchObject({ fullRent: 120_000, lostToVacancy: 30_000, fee: 9_000, costs: 12_000, kept: 69_000, grossYield: 0.12, netYield: 0.069 });
  expect(rentalReturn({ price: 0, monthlyRent: 0, monthlyCosts: 5, emptyWeeks: 0, agentFee: 0 }).netYield).toBe(0);
});

it('keeps a review draft when sending fails and when you switch reviews', async () => {
  const onReply = vi.fn().mockRejectedValue(new Error('Offline'));
  const base = { rating: 3, body: 'b', date: 'd' };
  render(<ReviewInbox onReply={onReply} reviews={[{ ...base, id: '1', author: 'Ana', title: 'One' }, { ...base, id: '2', author: 'Ben', title: 'Two' }]} />);
  fireEvent.change(screen.getByLabelText('Reply to Ana'), { target: { value: 'Sorry' } });
  fireEvent.click(screen.getByRole('button', { name: /Ben/ }));
  expect(screen.getByLabelText('Reply to Ben')).toHaveValue('');
  fireEvent.click(screen.getByRole('button', { name: /Ana/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Post reply' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Offline');
  await waitFor(() => expect(screen.getByLabelText('Reply to Ana')).toHaveValue('Sorry'));
  expect(onReply).toHaveBeenCalledWith('1', 'Sorry');
});

it('filters devices by room and locks offline ones', () => {
  const onChange = vi.fn();
  render(<SmartHomeTiles onChange={onChange} devices={[{ id: '1', name: 'Lamp', room: 'Hall', on: false }, { id: '2', name: 'Pump', room: 'Yard', on: true, offline: true }]} />);
  expect(screen.getByRole('switch', { name: 'Pump' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Hall' }));
  expect(screen.queryByRole('switch', { name: 'Pump' })).toBeNull();
  fireEvent.click(screen.getByRole('switch', { name: 'Lamp' }));
  expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ id: '1', on: true }));
});

it('RevealGroup keeps the cards in order', () => {
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} });
  const { container } = render(<RevealGroup><p>a</p><p>b</p><p>c</p></RevealGroup>);
  expect([...container.querySelectorAll<HTMLElement>('p')].map((p) => [p.textContent, p.parentElement!.style.transitionDelay])).toEqual([['a', '0ms'], ['b', '60ms'], ['c', '120ms']]);
  vi.unstubAllGlobals();
});

it('ThemeToggle still switches without view transitions, and uses one when there is one', () => {
  document.documentElement.classList.remove('dark');
  render(<ThemeToggle />);
  fireEvent.click(screen.getByRole('button'));
  expect(document.documentElement).toHaveClass('dark');
  const start = vi.fn((update: () => void) => { update(); const done = Promise.resolve(); return { ready: done, finished: done, updateCallbackDone: done }; });
  Object.assign(document, { startViewTransition: start });
  fireEvent.click(screen.getByRole('button'));
  expect(start).toHaveBeenCalled();
  expect(document.documentElement).not.toHaveClass('dark');
  delete (document as { startViewTransition?: unknown }).startViewTransition;
});

it('StretchNav places the highlight from the list item, since a button always reports offset 0', async () => {
  const { StretchNav } = await import('@/components/ui/stretch-nav');
  const at = (value: (el: HTMLElement) => number) => ({ configurable: true, get(this: HTMLElement) { return value(this); } });
  Object.defineProperty(HTMLElement.prototype, 'offsetLeft', at((el) => (el.tagName === 'LI' && el.textContent === 'B' ? 100 : 0)));
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', at((el) => (el.tagName === 'UL' ? 300 : 80)));
  const { container } = render(<StretchNav items={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]} value="b" onChange={() => {}} />);
  expect(container.querySelector<HTMLElement>('[data-highlight]')!.style).toMatchObject({ left: '100px', right: '120px' });
  delete (HTMLElement.prototype as { offsetLeft?: number }).offsetLeft;
  delete (HTMLElement.prototype as { offsetWidth?: number }).offsetWidth;
});
