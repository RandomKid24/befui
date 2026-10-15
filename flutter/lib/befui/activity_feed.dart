import 'package:flutter/material.dart';

import 'avatar.dart';
import 'icons.dart';
import 'theme.dart';

class BefActivity {
  const BefActivity({
    required this.actor,
    required this.action,
    required this.at,
    this.target,
    this.detail,
    this.icon,
  });
  final String actor, action;
  final String? target, detail;
  final DateTime at;
  final BefIconData? icon;
}

String _dayLabel(DateTime d, DateTime now) {
  final days = DateTime(now.year, now.month, now.day).difference(DateTime(d.year, d.month, d.day)).inDays;
  if (days == 0) return 'Today';
  if (days == 1) return 'Yesterday';
  const m = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return '${d.day} ${m[d.month - 1]} ${d.year}';
}

String _ago(DateTime d, DateTime now) {
  final m = now.difference(d).inMinutes;
  if (m < 1) return 'just now';
  if (m < 60) return '${m}m ago';
  if (m < 1440) return '${m ~/ 60}h ago';
  return '${m ~/ 1440}d ago';
}

/// Who did what and when, grouped under Today / Yesterday / date headings. Pass items newest first.
class BefActivityFeed extends StatelessWidget {
  const BefActivityFeed({super.key, required this.items, this.now});
  final List<BefActivity> items;

  /// Override "now" for tests and screenshots.
  final DateTime? now;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final n = now ?? DateTime.now();
    final groups = <String, List<BefActivity>>{};
    for (final a in items) {
      groups.putIfAbsent(_dayLabel(a.at, n), () => []).add(a);
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (final g in groups.entries) ...[
          Padding(
            padding: const EdgeInsets.only(bottom: 12, top: 4),
            child: Text(
              g.key.toUpperCase(),
              style: BefText.style(
                context,
                size: 11,
                weight: FontWeight.w500,
                color: c.mutedForeground,
                letterSpacing: 0.8,
              ),
            ),
          ),
          for (var i = 0; i < g.value.length; i++) _row(context, g.value[i], i == g.value.length - 1, n),
          const SizedBox(height: 12),
        ],
      ],
    );
  }

  Widget _row(BuildContext context, BefActivity a, bool last, DateTime n) {
    final c = context.bef;
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(
            width: 32,
            child: Column(
              children: [
                Stack(
                  clipBehavior: Clip.none,
                  children: [
                    BefAvatar(name: a.actor, size: BefAvatarSize.sm),
                    if (a.icon != null)
                      Positioned(
                        right: -4,
                        bottom: -4,
                        child: Container(
                          width: 16,
                          height: 16,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: c.card,
                            border: Border.all(color: c.border),
                          ),
                          child: Center(child: BefIcon(a.icon!, size: 9, color: c.mutedForeground)),
                        ),
                      ),
                  ],
                ),
                if (!last)
                  Expanded(
                    child: Container(
                      width: 1,
                      margin: const EdgeInsets.symmetric(vertical: 4),
                      color: c.border,
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: last ? 0 : 16, top: 4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text.rich(
                    TextSpan(
                      style: BefText.style(context, size: 13, color: c.mutedForeground),
                      children: [
                        TextSpan(
                          text: a.actor,
                          style: TextStyle(fontWeight: FontWeight.w600, color: c.foreground),
                        ),
                        TextSpan(text: ' ${a.action} '),
                        if (a.target != null)
                          TextSpan(
                            text: a.target,
                            style: TextStyle(fontWeight: FontWeight.w600, color: c.foreground),
                          ),
                      ],
                    ),
                  ),
                  Text(_ago(a.at, n), style: BefText.style(context, size: 12, color: c.mutedForeground)),
                  if (a.detail != null)
                    Container(
                      margin: const EdgeInsets.only(top: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: c.muted.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(BefRadius.lg),
                        border: Border.all(color: c.border),
                      ),
                      child: Text(a.detail!, style: BefText.style(context, size: 13, color: c.foreground)),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
