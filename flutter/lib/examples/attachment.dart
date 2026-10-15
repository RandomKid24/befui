import 'package:flutter/material.dart';

import '../befui/attachment.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  var files = ['offer-letter-v3.pdf', 'org-chart.png'];

  @override
  Widget build(BuildContext context) => _groups(context, [
    (
      'Done, tap x to remove',
      Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          for (final f in files)
            BefAttachment(
              name: f,
              size: f.endsWith('pdf') ? '248 KB' : '1.2 MB',
              onRemove: () => setState(() => files = files.where((x) => x != f).toList()),
            ),
        ],
      ),
    ),
    (
      'Uploading',
      const BefAttachment(name: 'payroll-october.xlsx', status: BefAttachmentStatus.uploading, progress: 62),
    ),
    ('Failed', BefAttachment(name: 'scan-0042.png', status: BefAttachmentStatus.error, onRemove: () {})),
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
