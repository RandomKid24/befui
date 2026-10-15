import 'package:flutter/material.dart';

import '../befui/icons.dart';
import '../befui/toggle_group.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  var format = ['bold'];
  var align = ['left'];
  var range = ['week'];

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Several at once',
      BefToggleGroup(
        multiple: true,
        outline: true,
        value: format,
        onChanged: (v) => setState(() => format = v),
        items: const [
          BefToggleGroupItem(value: 'bold', label: 'Bold', child: BefIcon(BefIcons.bold)),
          BefToggleGroupItem(value: 'italic', label: 'Italic', child: BefIcon(BefIcons.italic)),
          BefToggleGroupItem(value: 'underline', label: 'Underline', child: BefIcon(BefIcons.underline)),
        ],
      ),
    ),
    (
      'One at a time',
      BefToggleGroup(
        value: align,
        onChanged: (v) => setState(() => align = v),
        items: const [
          BefToggleGroupItem(value: 'left', label: 'Align left', child: BefIcon(BefIcons.alignLeft)),
          BefToggleGroupItem(value: 'center', label: 'Align centre', child: BefIcon(BefIcons.alignCenter)),
          BefToggleGroupItem(value: 'right', label: 'Align right', child: BefIcon(BefIcons.alignRight)),
        ],
      ),
    ),
    (
      'With text',
      BefToggleGroup(
        outline: true,
        value: range,
        onChanged: (v) => setState(() => range = v),
        items: const [
          BefToggleGroupItem(value: 'day', label: 'Day', child: Text('Day')),
          BefToggleGroupItem(value: 'week', label: 'Week', child: Text('Week')),
          BefToggleGroupItem(value: 'month', label: 'Month', child: Text('Month')),
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
