import 'package:flutter/material.dart';

import 'bottom_sheet.dart';
import 'calendar.dart';
import 'core.dart';
import 'icons.dart';
import 'theme.dart';

String befFormatDate(DateTime d) {
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return '${d.day.toString().padLeft(2, '0')} ${m[d.month - 1]} ${d.year}';
}

/// A field that opens a calendar sheet. Pass [value] and [onChanged] for one date, or use [BefDateRangePicker].
class BefDatePicker extends StatelessWidget {
  const BefDatePicker({
    super.key,
    this.value,
    required this.onChanged,
    this.placeholder = 'Pick a date',
    this.disabledDays,
    this.clearable = false,
  });
  final DateTime? value;
  final ValueChanged<DateTime?> onChanged;
  final String placeholder;
  final bool Function(DateTime)? disabledDays;
  final bool clearable;

  @override
  Widget build(BuildContext context) => _Field(
    label: value == null ? null : befFormatDate(value!),
    placeholder: placeholder,
    onClear: clearable && value != null ? () => onChanged(null) : null,
    onTap: () => showBefBottomSheet<void>(
      context: context,
      title: 'Pick a date',
      builder: (ctx) => BefCalendar(
        selected: value,
        disabled: disabledDays,
        onSelect: (d) {
          onChanged(d);
          Navigator.of(ctx).pop();
        },
      ),
    ),
  );
}

/// Same as [BefDatePicker] for a start and end date. The sheet closes when the end is chosen.
class BefDateRangePicker extends StatelessWidget {
  const BefDateRangePicker({
    super.key,
    this.value,
    required this.onChanged,
    this.placeholder = 'Pick dates',
    this.disabledDays,
    this.clearable = false,
  });
  final BefDateRange? value;
  final ValueChanged<BefDateRange?> onChanged;
  final String placeholder;
  final bool Function(DateTime)? disabledDays;
  final bool clearable;

  @override
  Widget build(BuildContext context) {
    final v = value;
    final text = v?.from == null
        ? null
        : '${befFormatDate(v!.from!)}${v.to == null ? '' : ' – ${befFormatDate(v.to!)}'}';
    return _Field(
      label: text,
      placeholder: placeholder,
      onClear: clearable && v?.from != null ? () => onChanged(null) : null,
      onTap: () => showBefBottomSheet<void>(
        context: context,
        title: 'Pick dates',
        builder: (ctx) => _RangeSheet(initial: v, disabled: disabledDays, onChanged: onChanged),
      ),
    );
  }
}

class _RangeSheet extends StatefulWidget {
  const _RangeSheet({this.initial, this.disabled, required this.onChanged});
  final BefDateRange? initial;
  final bool Function(DateTime)? disabled;
  final ValueChanged<BefDateRange?> onChanged;
  @override
  State<_RangeSheet> createState() => _RangeSheetState();
}

class _RangeSheetState extends State<_RangeSheet> {
  late BefDateRange? _r = widget.initial;

  @override
  Widget build(BuildContext context) => BefCalendar(
    range: true,
    selectedRange: _r,
    disabled: widget.disabled,
    onSelectRange: (r) {
      setState(() => _r = r);
      widget.onChanged(r);
      if (r.to != null) Navigator.of(context).pop();
    },
  );
}

class _Field extends StatelessWidget {
  const _Field({required this.label, required this.placeholder, required this.onTap, this.onClear});
  final String? label;
  final String placeholder;
  final VoidCallback onTap;
  final VoidCallback? onClear;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return BefPressable(
      semanticLabel: label ?? placeholder,
      pressScale: 1,
      onPressed: onTap,
      builder: (context, s) => Container(
        height: 40,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: c.background,
          borderRadius: BorderRadius.circular(BefRadius.md),
          border: Border.all(
            color: s.contains(WidgetState.hovered) ? c.mutedForeground.withValues(alpha: 0.4) : c.input,
          ),
        ),
        child: Row(
          children: [
            BefIcon(BefIcons.calendar, size: 16, color: c.mutedForeground),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                label ?? placeholder,
                style: BefText.style(context, color: label == null ? c.mutedForeground : c.foreground),
              ),
            ),
            if (onClear != null)
              GestureDetector(
                onTap: onClear,
                child: BefIcon(BefIcons.x, size: 14, color: c.mutedForeground),
              ),
          ],
        ),
      ),
    );
  }
}
