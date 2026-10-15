import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

class BefDateRange {
  const BefDateRange({this.from, this.to});
  final DateTime? from, to;
}

DateTime befDay(DateTime d) => DateTime(d.year, d.month, d.day);

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

/// Month grid for picking a day ([range] false) or a range ([range] true). Set [selected] for a day and [selectedRange] for a range. [disabled] returns true for days that cannot be picked.
class BefCalendar extends StatefulWidget {
  const BefCalendar({
    super.key,
    this.selected,
    this.selectedRange,
    this.onSelect,
    this.onSelectRange,
    this.range = false,
    this.disabled,
    this.weekStartsOn = DateTime.sunday,
    this.initialMonth,
  });
  final DateTime? selected;
  final BefDateRange? selectedRange;
  final ValueChanged<DateTime>? onSelect;
  final ValueChanged<BefDateRange>? onSelectRange;
  final bool range;
  final bool Function(DateTime)? disabled;
  final int weekStartsOn;
  final DateTime? initialMonth;

  @override
  State<BefCalendar> createState() => _BefCalendarState();
}

class _BefCalendarState extends State<BefCalendar> {
  late DateTime _month = () {
    final d = widget.initialMonth ?? widget.selected ?? widget.selectedRange?.from ?? DateTime.now();
    return DateTime(d.year, d.month);
  }();

  void _pick(DateTime d) {
    if (!widget.range) return widget.onSelect?.call(d);
    final r = widget.selectedRange;
    if (r?.from == null || r?.to != null) {
      widget.onSelectRange?.call(BefDateRange(from: d));
    } else if (d.isBefore(r!.from!)) {
      widget.onSelectRange?.call(BefDateRange(from: d));
    } else {
      widget.onSelectRange?.call(BefDateRange(from: r.from, to: d));
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final first = DateTime(_month.year, _month.month);
    final lead = (first.weekday - widget.weekStartsOn + 7) % 7;
    final count = DateTime(_month.year, _month.month + 1, 0).day;
    final cells = ((lead + count) / 7).ceil() * 7;
    final today = befDay(DateTime.now());
    const names = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    final heads = [for (var i = 0; i < 7; i++) names[(widget.weekStartsOn - 1 + i) % 7]];
    final r = widget.selectedRange;

    Widget nav(BefIconData i, int n, String label) => BefPressable(
      semanticLabel: label,
      onPressed: () => setState(() => _month = DateTime(_month.year, _month.month + n)),
      builder: (context, s) => Container(
        width: 32,
        height: 32,
        decoration: BoxDecoration(
          color: s.contains(WidgetState.hovered) || s.contains(WidgetState.pressed)
              ? c.secondary
              : Colors.transparent,
          borderRadius: BorderRadius.circular(BefRadius.md),
        ),
        child: Center(child: BefIcon(i, size: 16)),
      ),
    );

    Widget day(DateTime d) {
      final off = widget.disabled?.call(d) ?? false;
      final isSel = widget.range
          ? (r?.from == d || r?.to == d)
          : widget.selected != null && befDay(widget.selected!) == d;
      final inRange =
          widget.range && r?.from != null && r?.to != null && d.isAfter(r!.from!) && d.isBefore(r.to!);
      return BefPressable(
        semanticLabel: '${d.day} ${_months[d.month - 1]} ${d.year}',
        onPressed: off ? null : () => _pick(d),
        builder: (context, s) => Container(
          margin: const EdgeInsets.all(1),
          decoration: BoxDecoration(
            color: isSel
                ? c.primary
                : inRange
                ? c.accent
                : s.contains(WidgetState.hovered)
                ? c.secondary
                : Colors.transparent,
            borderRadius: BorderRadius.circular(BefRadius.md),
            border: !isSel && d == today ? Border.all(color: c.primary.withValues(alpha: 0.5)) : null,
          ),
          alignment: Alignment.center,
          child: Opacity(
            opacity: off ? 0.35 : 1,
            child: Text(
              '${d.day}',
              style: BefText.style(
                context,
                color: isSel
                    ? c.primaryForeground
                    : inRange
                    ? c.accentForeground
                    : c.foreground,
                weight: isSel || d == today ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
          ),
        ),
      );
    }

    return LayoutBuilder(
      builder: (context, box) {
        final w = box.maxWidth.isFinite ? box.maxWidth : 280.0;
        final cell = w / 7;
        return SizedBox(
          width: w,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  nav(BefIcons.chevronLeft, -1, 'Previous month'),
                  Expanded(
                    child: Text(
                      '${_months[_month.month - 1]} ${_month.year}',
                      textAlign: TextAlign.center,
                      style: BefText.style(context, weight: FontWeight.w600),
                    ),
                  ),
                  nav(BefIcons.chevronRight, 1, 'Next month'),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  for (final h in heads)
                    SizedBox(
                      width: cell,
                      child: Text(
                        h,
                        textAlign: TextAlign.center,
                        style: BefText.style(context, size: 12, color: c.mutedForeground),
                      ),
                    ),
                ],
              ),
              for (var row = 0; row < cells / 7; row++)
                Row(
                  children: [
                    for (var col = 0; col < 7; col++)
                      SizedBox(
                        width: cell,
                        height: cell.clamp(36, 44).toDouble(),
                        child: () {
                          final n = row * 7 + col - lead + 1;
                          if (n < 1 || n > count) return const SizedBox.shrink();
                          return day(DateTime(_month.year, _month.month, n));
                        }(),
                      ),
                  ],
                ),
            ],
          ),
        );
      },
    );
  }
}
