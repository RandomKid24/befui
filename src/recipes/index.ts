import { lazy, type ComponentType } from 'react';

// Recipes: whole features built up in steps. Every step is a real, copy-paste component (src/recipes/<slug>/step-N.tsx), so the preview and the code on the page are the same file.

export interface Recipe {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  /** befui components the final step uses (slugs), for the install command. */
  components: string[];
  steps: { title: string; text: string }[];
}

export const recipes: Recipe[] = [
  {
    slug: 'login-form',
    title: 'Sign-in form',
    summary: 'From a bare card to a form with validation, a password field, a loading button and a failed-login message.',
    minutes: 5,
    components: ['card', 'label', 'input', 'password-input', 'checkbox', 'button', 'alert', 'toast'],
    steps: [
      { title: 'The card and two fields', text: 'A Card with Field-wrapped inputs and a full-width Button. Field adds the label, the hint and the error slot for you.' },
      { title: 'Validate and show the password', text: 'Swap in PasswordInput (show and hide built in), add Remember me and a forgot link, check the email as it is typed and keep the button off until the form is complete.' },
      { title: 'Submit, wait, fail or succeed', text: 'A real form: the button shows its loading state, a wrong password shows an Alert, and a good one fires a toast. Replace the timeout with your request.' },
    ],
  },
  {
    slug: 'settings-page',
    title: 'Settings page',
    summary: 'A settings screen with a side menu, a profile form, notification switches and a confirmed delete.',
    minutes: 6,
    components: ['settings-layout', 'avatar', 'button', 'input', 'label', 'switch', 'alert-dialog', 'toast'],
    steps: [
      { title: 'The frame and one section', text: 'SettingsLayout gives you the side menu and the content column. SettingsSection lays out a group: title on the left, fields on the right.' },
      { title: 'A profile you can edit', text: 'Add the Avatar (it follows the name), a Textarea with a live counter and a Save button that confirms with a toast.' },
      { title: 'More sections, one dangerous action', text: 'Each menu item shows its own section. Notifications are Switch rows that toast on change, and deleting the account goes through an AlertDialog.' },
    ],
  },
  {
    slug: 'dashboard-overview',
    title: 'Overview dashboard',
    summary: 'Stat cards, a chart and a table of requests: the screen most admin apps start with.',
    minutes: 4,
    components: ['stat-card', 'charts', 'card', 'table', 'badge', 'avatar'],
    steps: [
      { title: 'Three numbers that matter', text: 'StatCard shows a value, its change and a Sparkline. Give each its own colour with a text class.' },
      { title: 'Add a chart', text: 'Put a BarChart in a Card with a title and a one-line description. It animates in when it scrolls into view.' },
      { title: 'A table beside it', text: 'A compact Table with Avatars and status Badges next to the chart, in a two-column grid that stacks on a phone.' },
    ],
  },
  {
    slug: 'ai-assistant',
    title: 'AI assistant',
    summary: 'A chat from two static messages to a full assistant with starter prompts, thinking and streaming replies.',
    minutes: 6,
    components: ['ai-message', 'prompt-input', 'ai-chat', 'prompt-suggestions', 'streaming-text', 'thinking'],
    steps: [
      { title: 'Messages', text: 'AiMessage draws a user bubble and an assistant answer, with copy and regenerate on the answer.' },
      { title: 'A box to type in', text: 'PromptInput grows with the text and Enter sends. Keep the messages in state and append the reply.' },
      { title: 'The whole chat', text: 'AiChat puts the conversation, starter prompts, a thinking row and the prompt box in one component. Stream the reply with StreamingText and wire Stop.' },
    ],
  },
  {
    slug: 'leave-request',
    title: 'Leave request',
    summary: 'A form for time off: type, date range, a balance that updates as you pick, and a confirmation.',
    minutes: 5,
    components: ['card', 'select', 'date-picker', 'calendar', 'progress', 'input', 'alert', 'toast'],
    steps: [
      { title: 'Type and dates', text: 'A Select for the leave type and a DateRangePicker. The range comes back as { from, to }.' },
      { title: 'Show what is left', text: 'Count the days, show the balance after this request with a Progress bar and turn it red with an error when it goes over.' },
      { title: 'Send it', text: 'A footer Button with a loading state, disabled until the dates are valid, and a success Alert in place of the form once it is sent.' },
    ],
  },
  {
    slug: 'checkout',
    title: 'Checkout',
    summary: 'An order summary, a coupon and a card form with a live card that flips to the CVV.',
    minutes: 6,
    components: ['order-summary', 'coupon-input', 'credit-card', 'input', 'label', 'button', 'toast'],
    steps: [
      { title: 'The summary', text: 'OrderSummary adds up the lines, shipping and tax for you. Pass lines and a taxRate, and put your button in action.' },
      { title: 'A coupon', text: 'CouponInput checks the code (try FESTIVE250) and the summary takes the discount off. It is a child, so it sits above the totals.' },
      { title: 'Pay', text: 'A CreditCard that mirrors the form as you type and flips to the back when the CVV field is focused. The Pay button stays off until every field is valid.' },
    ],
  },
];

const demos = import.meta.glob<{ default: ComponentType }>('/src/recipes/*/step-*.tsx');
const sources = import.meta.glob<string>('/src/recipes/*/step-*.tsx', { query: '?raw', import: 'default' });

const key = (slug: string, n: number) => `/src/recipes/${slug}/step-${n}.tsx`;
export const stepDemo = (slug: string, n: number) => lazy(demos[key(slug, n)]!);
export const loadStepSource = (slug: string, n: number) => sources[key(slug, n)]!();
