import 'package:flutter/material.dart';

import '../befui/tool_call.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => _groups(context, [
  (
    'Done, open',
    const BefToolCall(
      name: 'get_leave_balance',
      status: BefToolStatus.done,
      duration: '0.4s',
      initiallyOpen: true,
      input: '{\n  "employee": "aarav.mehta",\n  "type": "casual"\n}',
      output: '{\n  "balance": 7,\n  "carry_forward": 12\n}',
    ),
  ),
  (
    'Running',
    const BefToolCall(
      name: 'search_policies',
      status: BefToolStatus.running,
      input: '{ "query": "encashment" }',
    ),
  ),
  (
    'Failed',
    const BefToolCall(
      name: 'send_email',
      status: BefToolStatus.error,
      duration: '1.2s',
      input: '{ "to": "hr@acme.co" }',
      output: 'SMTP 550: mailbox unavailable',
    ),
  ),
]);

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
