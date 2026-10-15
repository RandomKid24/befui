import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

const _months = [
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
const _days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

DateTime _day(DateTime d) => DateTime(d.year, d.month, d.day);

/// One-week date picker for the top of a schedule or booking screen: seven day pills, arrows for the previous and next week and a dot (up to three) under days in [marks] (keyed by date, value = count).
class BefWeekStrip extends StatelessWidget {
  const BefWeekStrip({
    super.key,
    required this.value,
    required this.onChanged,
    this.marks = const {},
    this.weekStartsOn = DateTime.monday,
    this.min,
    this.max,
  });
  final DateTime value;
  final ValueChanged<DateTime> onChanged;
  final Map<DateTime, int> marks;
  final int weekStartsOn;
  final DateTime? min, max;

  bool _off(DateTime d) => (min != null && d.isBefore(_day(min!))) || (max != null && d.isAfter(_day(max!)));

  void _go(int n) {
    final next = _day(value).add(Duration(days: n));
    if (!_off(next)) onChanged(next);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final v = _day(value);
    final start = v.subtract(Duration(days: (v.weekday - weekStartsOn + 7) % 7));
    final today = _day(DateTime.now());
    final week = [for (var i = 0; i < 7; i++) DateTime(start.year, start.month, start.day + i)];
    Widget arrow(BefIconData i, int n, String label) => BefPressable(
      semanticLabel: label,
      onPressed: () => _go(n),
      builder: (context, s) => Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: s.contains(WidgetState.hovered) || s.contains(WidgetState.pressed)
              ? c.secondary
              : Colors.transparent,
          borderRadius: BorderRadius.circular(BefRadius.md),
        ),
        child: Center(child: BefIcon(i, size: 16, color: c.foreground)),
      ),
    );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                '${_months[v.month - 1]} ${v.year}',
                style: BefText.style(context, weight: FontWeight.w600),
              ),
            ),
            arrow(BefIcons.chevronLeft, -7, 'Previous week'),
            const SizedBox(width: 4),
            arrow(BefIcons.chevronRight, 7, 'Next week'),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            for (var i = 0; i < 7; i++) ...[
              if (i > 0) const SizedBox(width: 4),
              Expanded(child: _pill(context, c, week[i], v, today)),
            ],
          ],
        ),
      ],
    );
  }

  Widget _pill(BuildContext context, BefColors c, DateTime d, DateTime sel, DateTime today) {
    final selected = d == sel;
    final off = _off(d);
    final n = (marks[d] ?? 0).clamp(0, 3);
    final fg = selected ? c.primaryForeground : c.foreground;
    return BefPressable(
      semanticLabel: '${_days[d.weekday - 1]} ${d.day} ${_months[d.month - 1]}',
      onPressed: off ? null : () => onChanged(d),
      builder: (context, s) => Opacity(
        opacity: off ? 0.4 : 1,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: selected
                ? c.primary
                : s.contains(WidgetState.hovered)
                ? c.secondary
                : Colors.transparent,
            borderRadius: BorderRadius.circular(BefRadius.lg),
            border: !selected && d == today ? Border.all(color: c.primary.withValues(alpha: 0.5)) : null,
          ),
          child: Column(
            children: [
              Text(
                _days[d.weekday - 1],
                style: BefText.style(
                  context,
                  size: 11,
                  weight: FontWeight.w500,
                  color: selected ? fg.withValues(alpha: 0.8) : c.mutedForeground,
                ),
              ),
              Text(
                '${d.day}',
                style: BefText.style(context, size: 16, weight: FontWeight.w600, color: fg),
              ),
              SizedBox(
                height: 6,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    for (var i = 0; i < n; i++)
                      Container(
                        width: 4,
                        height: 4,
                        margin: const EdgeInsets.symmetric(horizontal: 1),
                        decoration: BoxDecoration(shape: BoxShape.circle, color: selected ? fg : c.primary),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
