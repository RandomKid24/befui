import 'package:flutter/material.dart';

import '../befui/kanban.dart';
import '../befui/theme.dart';

class _Task {
  const _Task(this.id, this.title, this.tag, this.owner);
  final String id, title, tag, owner;
}

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  var board = <String, List<_Task>>{
    'todo': [
      const _Task('t1', 'Onboarding checklist for new hires', 'Feature', 'Isha Nair'),
      const _Task('t2', 'Fix payslip PDF margins', 'Bug', 'Rohan Das'),
    ],
    'doing': [const _Task('t4', 'Leave balance widget', 'Feature', 'Aarav Mehta')],
    'review': [const _Task('t6', 'Holiday calendar import', 'Feature', 'Kabir Shah')],
    'done': [const _Task('t7', 'Dark mode for dashboards', 'Design', 'Diya Rao')],
  };

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return _groups(context, [
      (
        'Long-press a card, drag it to another column',
        BefKanban<_Task>(
          idOf: (t) => t.id,
          value: board,
          onChanged: (b) => setState(() => board = b),
          columns: const [
            BefKanbanColumn(id: 'todo', title: 'To do'),
            BefKanbanColumn(id: 'doing', title: 'In progress', tone: BefKanbanTone.info),
            BefKanbanColumn(id: 'review', title: 'In review', tone: BefKanbanTone.warning),
            BefKanbanColumn(id: 'done', title: 'Done', tone: BefKanbanTone.success),
          ],
          cardBuilder: (context, t) => Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(t.title, style: BefText.style(context, size: 13, weight: FontWeight.w500)),
              const SizedBox(height: 6),
              Text(
                '${t.tag} · ${t.owner}',
                style: BefText.style(context, size: 12, color: c.mutedForeground),
              ),
            ],
          ),
        ),
      ),
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
