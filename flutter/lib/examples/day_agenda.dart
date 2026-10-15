import 'package:flutter/material.dart';

import '../befui/day_agenda.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) {
  final c = context.bef;
  final events = [
    const BefAgendaEvent(id: '1', title: 'Stand-up', start: '09:00', end: '09:30', location: 'Room 2'),
    BefAgendaEvent(
      id: '2',
      title: 'Design review',
      start: '10:00',
      end: '11:30',
      location: 'Zoom',
      color: c.success,
    ),
    BefAgendaEvent(id: '3', title: '1:1 with Isha', start: '10:30', end: '11:00', color: c.warning),
    BefAgendaEvent(id: '4', title: 'Lunch', start: '13:00', end: '14:00', color: c.info),
    const BefAgendaEvent(
      id: '5',
      title: 'Sprint planning',
      start: '15:00',
      end: '17:00',
      location: 'Main hall',
    ),
  ];
  return _groups(context, [
    (
      'Overlapping events share the width, red line is now',
      BefDayAgenda(events: events, now: '11:20', height: 420, onSelect: (_) {}),
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
