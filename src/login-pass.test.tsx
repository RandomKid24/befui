import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { LoginPass, suggestEmail } from '@/components/ui/login-pass';

it('suggests only known domain typos', () => {
  expect(suggestEmail('ana@gmial.com')).toBe('ana@gmail.com');
  expect(suggestEmail('ana@gmail.con')).toBe('ana@gmail.com');
  expect(suggestEmail('ana@acme.co')).toBeNull();
});

it('validates, shows a refused sign-in, then admits', async () => {
  const onSignIn = vi.fn().mockRejectedValueOnce(new Error('Wrong password')).mockResolvedValue(undefined);
  render(<LoginPass onSignIn={onSignIn} />);
  const submit = screen.getByRole('button', { name: 'Sign in' });
  fireEvent.click(submit);
  expect(onSignIn).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'priya.sharma@acme.com' } });
  expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
  fireEvent.click(submit);
  expect(await screen.findByRole('alert')).toHaveTextContent('Wrong password');
  fireEvent.click(submit);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Signed in' })).toBeDisabled());
  expect(onSignIn).toHaveBeenLastCalledWith({ email: 'priya.sharma@acme.com', password: 'secret', remember: false });
});
