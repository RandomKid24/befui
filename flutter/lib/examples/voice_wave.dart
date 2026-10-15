import 'package:flutter/material.dart';

import '../befui/button.dart';
import '../befui/icons.dart';
import '../befui/theme.dart';
import '../befui/voice_wave.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  bool on = true;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return _groups(context, [
      (
        'Tap the mic',
        Row(
          children: [
            BefButton(
              size: BefButtonSize.icon,
              shape: BefButtonShape.pill,
              variant: on ? BefButtonVariant.primary : BefButtonVariant.outline,
              semanticLabel: on ? 'Stop listening' : 'Start listening',
              onPressed: () => setState(() => on = !on),
              child: const BefIcon(BefIcons.mic),
            ),
            const SizedBox(width: 12),
            Expanded(child: BefVoiceWave(active: on, bars: 22)),
            const SizedBox(width: 12),
            Text(
              on ? 'Listening' : 'Paused',
              style: BefText.style(context, size: 12, color: c.mutedForeground),
            ),
          ],
        ),
      ),
      ('Driven by a level (0.7)', const BefVoiceWave(level: 0.7, bars: 28)),
    ]);
  }
}

/// Labelled groups, one per kind of use.
Widget _groups(BuildContext context, List<(String, Widget)> groups) {
  final c = context.bef;
  return Column(
    mainAxisSize: MainAxisSize.min,
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      for (var i = 0; i < groups.length; i++) ...[
        if (i > 0) const SizedBox(height: 24),
        Text(
          groups[i].$1.toUpperCase(),
          style: BefText.style(
            context,
            size: 11,
            weight: FontWeight.w500,
            color: c.mutedForeground,
            letterSpacing: 0.8,
          ),
        ),
        const SizedBox(height: 10),
        groups[i].$2,
      ],
    ],
  );
}
