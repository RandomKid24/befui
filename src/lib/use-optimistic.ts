import * as React from 'react';

/**
 * Optimistic boolean for switches, likes and bookmarks: the UI flips at once, `save` runs in the background,
 * and the value rolls back (with `error` set) if it rejects. Later clicks win: a slow older save never overwrites a newer one.
 *   const [on, set, { error }] = useOptimistic(user.notify, (v) => api.setNotify(v));
 *   <Switch checked={on} onCheckedChange={set} />
 */
export function useOptimistic(initial: boolean, save: (next: boolean) => Promise<unknown>) {
  const [value, setValue] = React.useState(initial);
  const [error, setError] = React.useState<unknown>(null);
  const latest = React.useRef(0);
  const settled = React.useRef(initial); // last value the server confirmed

  const set = React.useCallback(
    async (next: boolean) => {
      const id = ++latest.current;
      setValue(next);
      setError(null);
      try {
        await save(next);
        settled.current = next;
      } catch (e) {
        if (id === latest.current) { setValue(settled.current); setError(e); }
      }
    },
    [save],
  );
  return [value, set, { error }] as const;
}
