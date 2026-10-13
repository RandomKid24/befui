// Behaviour of the page blocks that have logic. Axe over every block lives in examples.a11y.test.tsx.
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import ContactPage from '@/blocks/contact-page';
import FinanceDashboard from '@/blocks/finance-dashboard';
import NotificationsPage from '@/blocks/notifications-page';
import OnboardingWizard from '@/blocks/onboarding-wizard';
import OtpVerify from '@/blocks/otp-verify';
import ServerErrorPage from '@/blocks/server-error-page';
import TeamPage from '@/blocks/team-page';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });
const tick = (ms: number) => act(() => { vi.advanceTimersByTime(ms); });
const press = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));

function typeCode(code: string) {
  [...code].forEach((digit, i) => fireEvent.change(screen.getByLabelText(`Digit ${i + 1}`), { target: { value: digit } }));
}

it('OtpVerify needs six digits, rejects a wrong code and accepts 123456', () => {
  render(<OtpVerify />);
  expect(screen.getByRole('button', { name: 'Verify' })).toBeDisabled();
  typeCode('123450');
  expect(screen.getByRole('button', { name: 'Verify' })).toBeEnabled();
  press('Verify');
  tick(1000);
  expect(screen.getByText(/code is not right/i)).toBeInTheDocument();
  for (let i = 5; i >= 0; i--) fireEvent.keyDown(screen.getByLabelText(`Digit ${i + 1}`), { key: 'Backspace' });
  typeCode('123456');
  press('Verify');
  tick(1000);
  expect(screen.getByText(/you are verified/i)).toBeInTheDocument();
});

it('OtpVerify keeps Resend off until its countdown reaches zero', () => {
  render(<OtpVerify />);
  expect(screen.getByRole('button', { name: /Resend in 30s/ })).toBeDisabled();
  for (let i = 0; i < 29; i++) tick(1000); // the countdown re-arms after each render, so step it like a clock
  expect(screen.getByRole('button', { name: /Resend in 1s/ })).toBeDisabled();
  tick(1000);
  expect(screen.getByRole('button', { name: 'Resend code' })).toBeEnabled();
});

it('OnboardingWizard blocks Next until the step is valid, keeps values going back, and finishes', () => {
  render(<OnboardingWizard />);
  expect(screen.getByText(/Step 1 of 4/)).toBeInTheDocument();
  press('Next');
  expect(screen.getByText(/enter your name/i)).toBeInTheDocument();
  expect(screen.getByText(/Step 1 of 4/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Ada Lovelace' } });
  press('Next');
  expect(screen.getByText(/Step 2 of 4/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Team name'), { target: { value: 'Analytical Engines' } });
  press('Back');
  expect(screen.getByLabelText('Full name')).toHaveValue('Ada Lovelace');
  press('Next');
  expect(screen.getByLabelText('Team name')).toHaveValue('Analytical Engines');
  press('Next');
  expect(screen.getByText(/Step 3 of 4/)).toBeInTheDocument();
  press('Finish');
  expect(screen.getByText(/you are all set/i)).toBeInTheDocument();
});

it('NotificationsPage lists only unread items on the Unread tab and Mark all read empties it', () => {
  render(<NotificationsPage />);
  const all = within(screen.getByRole('list', { name: 'Notifications' })).getAllByRole('listitem').length;
  const unreadTab = screen.getByRole('tab', { name: /Unread/ });
  fireEvent.mouseDown(unreadTab, { button: 0, ctrlKey: false });
  const unread = within(screen.getByRole('list', { name: 'Notifications' })).getAllByRole('listitem').length;
  expect(unread).toBeGreaterThan(0);
  expect(unread).toBeLessThan(all);
  press('Mark all read');
  expect(screen.getByText(/all caught up/i)).toBeInTheDocument();
});

it('ServerErrorPage shows a 500, a retry that loads then reports, and the incident timeline', () => {
  render(<ServerErrorPage />);
  expect(screen.getByText('500')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: /went wrong on our side/i })).toBeInTheDocument();
  press('Try again');
  expect(screen.getByRole('button', { name: /Try again/ })).toBeDisabled();
  tick(1500);
  expect(screen.getByRole('button', { name: 'Try again' })).toBeEnabled();
  expect(screen.getByText(/still not working/i)).toBeInTheDocument();
  for (const stage of ['Investigating', 'Identified', 'Monitoring']) expect(screen.getByText(stage)).toBeInTheDocument();
});

it('ContactPage reports empty fields, confirms a valid message, and expands an FAQ answer', () => {
  render(<ContactPage />);
  press('Send message');
  expect(screen.getByText(/enter your name/i)).toBeInTheDocument();
  expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  expect(screen.queryByText(/message sent/i)).toBeNull();
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello there' } });
  press('Send message');
  tick(1200);
  expect(screen.getByText(/message sent/i)).toBeInTheDocument();
  const [first] = screen.getAllByRole('button', { expanded: false }).filter((b) => b.hasAttribute('aria-controls'));
  fireEvent.click(first);
  expect(first).toHaveAttribute('aria-expanded', 'true');
});

it('TeamPage shows at least six members, each with a name and a role', () => {
  render(<TeamPage />);
  const members = within(screen.getByRole('list', { name: 'Team members' })).getAllByRole('listitem');
  expect(members.length).toBeGreaterThanOrEqual(6);
  for (const member of members) {
    expect(within(member).getByRole('heading')).toBeInTheDocument();
    expect(member.querySelector('p')?.textContent).toMatch(/\S/);
  }
});

it('FinanceDashboard shows the balance and at least five transactions', () => {
  render(<FinanceDashboard />);
  expect(screen.getByText('Balance')).toBeInTheDocument();
  const rows = within(screen.getByRole('table', { name: 'Recent transactions' })).getAllByRole('row');
  expect(rows.length).toBeGreaterThanOrEqual(6); // header + five
});
