'use client';

import * as React from 'react';
import { Drawer } from './drawer';

/**
 * Mobile-style sheet that rises from the bottom. Drag the handle down to dismiss; Escape and the backdrop close it too.
 * A bottom Drawer underneath, so it slides out as well as in and reverses smoothly if you close it mid-slide.
 */
export function BottomSheet(props: Omit<React.ComponentProps<typeof Drawer>, 'side' | 'snapPoints'>) {
  return <Drawer {...props} side="bottom" />;
}
