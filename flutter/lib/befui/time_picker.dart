import 'package:flutter/material.dart';

import 'bottom_sheet.dart';
import 'button.dart';
import 'core.dart';
import 'icons.dart';
import 'theme.dart';

/// A field that opens iOS-style wheels for hour, minute and AM/PM. The value is always 24-hour "HH:MM", whatever the display.
class BefTimePicker extends StatelessWidget {
  const BefTimePicker({
    super.key,
    required this.value,
    required this.onChanged,
    this.hour12 = true,
    this.minuteStep = 1,
  });
  final String value;
  final ValueChanged<String> onChanged;
  final bool hour12;
  final int minuteStep;

  (int, int) get _hm {
    final p = value.split(':').map(int.parse).toList();
    return (p[0], p[1]);
  }

  String get _label {
    final (h, m) = _hm;
    final mm = m.toString().padLeft(2, '0');
    if (!hour12) return '${h.toString().padLeft(2, '0')}:$mm';
    return '${h % 12 == 0 ? 12 : h % 12}:$mm ${h < 12 ? 'AM' : 'PM'}';
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return BefPressable(
      semanticLabel: 'Time, $_label',
      pressScale: 1,
      onPressed: () => showBefBottomSheet<void>(
        context: context,
        title: 'Pick a time',
        builder: (ctx) => _Wheels(value: value, hour12: hour12, step: minuteStep, onChanged: onChanged),
      ),
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
          mainAxisSize: MainAxisSize.min,
          children: [
            BefIcon(BefIcons.clock, size: 16, color: c.mutedForeground),
            const SizedBox(width: 8),
            Text(_label, style: BefText.style(context)),
          ],
        ),
      ),
    );
  }
}

class _Wheels extends StatefulWidget {
  const _Wheels({required this.value, required this.hour12, required this.step, required this.onChanged});
  final String value;
  final bool hour12;
  final int step;
  final ValueChanged<String> onChanged;
  @override
  State<_Wheels> createState() => _WheelsState();
}

class _WheelsState extends State<_Wheels> {
  late int _h, _m;

  @override
  void initState() {
    super.initState();
    final p = widget.value.split(':').map(int.parse).toList();
    _h = p[0];
    _m = (p[1] / widget.step).round() * widget.step % 60;
  }

  void _emit() => widget.onChanged('${_h.toString().padLeft(2, '0')}:${_m.toString().padLeft(2, '0')}');

  Widget _wheel(
    BuildContext context, {
    required int count,
    required int selected,
    required String Function(int) text,
    required ValueChanged<int> onSelected,
    bool loop = true,
  }) {
    final c = context.bef;
    return SizedBox(
      width: 72,
      child: ListWheelScrollView.useDelegate(
        controller: FixedExtentScrollController(initialItem: selected),
        itemExtent: 40,
        diameterRatio: 1.6,
        perspective: 0.003,
        physics: const FixedExtentScrollPhysics(),
        onSelectedItemChanged: (i) {
          onSelected(i);
          _emit();
        },
        childDelegate: loop
            ? ListWheelChildLoopingListDelegate(
                children: [
                  for (var i = 0; i < count; i++)
                    Center(
                      child: Text(
                        text(i),
                        style: BefText.style(context, size: 20, weight: FontWeight.w500, color: c.foreground),
                      ),
                    ),
                ],
              )
            : ListWheelChildListDelegate(
                children: [
                  for (var i = 0; i < count; i++)
                    Center(
                      child: Text(
                        text(i),
                        style: BefText.style(context, size: 20, weight: FontWeight.w500, color: c.foreground),
                      ),
                    ),
                ],
              ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final steps = 60 ~/ widget.step;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          height: 180,
          child: Stack(
            alignment: Alignment.center,
            children: [
              Container(
                height: 40,
                margin: const EdgeInsets.symmetric(horizontal: 24),
                decoration: BoxDecoration(
                  color: c.secondary,
                  borderRadius: BorderRadius.circular(BefRadius.lg),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (widget.hour12)
                    _wheel(
                      context,
                      count: 12,
                      selected: (_h % 12 == 0 ? 12 : _h % 12) - 1,
                      text: (i) => '${i + 1}',
                      onSelected: (i) => _h = (i + 1) % 12 + (_h >= 12 ? 12 : 0),
                    )
                  else
                    _wheel(
                      context,
                      count: 24,
                      selected: _h,
                      text: (i) => i.toString().padLeft(2, '0'),
                      onSelected: (i) => _h = i,
                    ),
                  Text(':', style: BefText.style(context, size: 20, weight: FontWeight.w600)),
                  _wheel(
                    context,
                    count: steps,
                    selected: _m ~/ widget.step,
                    text: (i) => (i * widget.step).toString().padLeft(2, '0'),
                    onSelected: (i) => _m = i * widget.step,
                  ),
                  if (widget.hour12)
                    _wheel(
                      context,
                      count: 2,
                      selected: _h >= 12 ? 1 : 0,
                      text: (i) => i == 0 ? 'AM' : 'PM',
                      loop: false,
                      onSelected: (i) => _h = _h % 12 + (i == 1 ? 12 : 0),
                    ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        BefButton(label: 'Done', expand: true, onPressed: () => Navigator.of(context).pop()),
      ],
    );
  }
}
