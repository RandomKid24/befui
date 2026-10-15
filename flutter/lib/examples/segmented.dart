import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/segmented.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  return StatefulBuilder(
    builder: (context, set) {
      return _groups(context, [
        (
          'Text options',
          BefSegmented<String>(
            value: _range,
            onChanged: (v) => set(() => _range = v),
            segments: const [
              BefSegment(value: '7d', label: '7 days'),
              BefSegment(value: '30d', label: '30 days'),
              BefSegment(value: '90d', label: '90 days'),
            ],
          ),
        ),
        (
          'With icons',
          BefSegmented<String>(
            value: _view,
            onChanged: (v) => set(() => _view = v),
            segments: const [
              BefSegment(
                value: 'list',
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [BefIcon(BefIcons.list), SizedBox(width: 6), Text('List')],
                ),
              ),
              BefSegment(
                value: 'grid',
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [BefIcon(BefIcons.layoutGrid), SizedBox(width: 6), Text('Grid')],
                ),
              ),
            ],
          ),
        ),
      ]);
    },
  );
}

String _range = '30d', _view = 'list';

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
