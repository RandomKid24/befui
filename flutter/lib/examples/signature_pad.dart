import 'package:flutter/material.dart';

import '../befui/signature_pad.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  int strokes = 0;

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Draw with a finger',
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          BefSignaturePad(onChanged: (s) => setState(() => strokes = s.length)),
          Text(
            strokes == 0 ? 'Nothing signed yet.' : 'Captured $strokes stroke${strokes == 1 ? '' : 's'}.',
            style: BefText.style(context, size: 12, color: context.bef.mutedForeground),
          ),
        ],
      ),
    ),
  ]);
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
