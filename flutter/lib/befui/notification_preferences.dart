import 'package:flutter/material.dart';

import 'switch.dart';
import 'theme.dart';

class BefPrefEvent {
  const BefPrefEvent({required this.id, required this.label, this.description});
  final String id, label;
  final String? description;
}

class BefPrefChannel {
  const BefPrefChannel({required this.id, required this.label});
  final String id, label;
}

/// Settings list: each event (a row) shows one switch per channel (email, push, SMS...) under it. [value] maps an event id to its enabled channel ids. Controlled.
class BefNotificationPreferences extends StatelessWidget {
  const BefNotificationPreferences({
    super.key,
    required this.events,
    required this.channels,
    required this.value,
    required this.onChanged,
  });
  final List<BefPrefEvent> events;
  final List<BefPrefChannel> channels;
  final Map<String, List<String>> value;
  final ValueChanged<Map<String, List<String>>> onChanged;

  bool _on(String e, String ch) => value[e]?.contains(ch) ?? false;

  void _set(String e, String ch, bool v) {
    final next = {
      for (final k in value.entries) k.key: [...k.value],
    };
    final list = next[e] ?? [];
    list.remove(ch);
    if (v) list.add(ch);
    next[e] = list;
    onChanged(next);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Container(
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(BefRadius.xl),
        border: Border.all(color: c.border),
      ),
      child: Column(
        children: [
          for (var i = 0; i < events.length; i++)
            Container(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
              decoration: BoxDecoration(
                border: i == 0 ? null : Border(top: BorderSide(color: c.border)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    events[i].label,
                    style: BefText.style(context, weight: FontWeight.w500, color: c.cardForeground),
                  ),
                  if (events[i].description != null)
                    Text(
                      events[i].description!,
                      style: BefText.style(context, size: 12, color: c.mutedForeground),
                    ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 20,
                    runSpacing: 10,
                    children: [
                      for (final ch in channels)
                        BefSwitch(
                          value: _on(events[i].id, ch.id),
                          label: ch.label,
                          onChanged: (v) => _set(events[i].id, ch.id, v),
                        ),
                    ],
                  ),
                  const SizedBox(height: 6),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
