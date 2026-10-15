import 'package:flutter/material.dart';

import 'date_picker.dart';
import 'time_picker.dart';

/// A date field and a time field side by side. [value] is a local [DateTime]; the time keeps minutes in [minuteStep]s.
class BefDateTimePicker extends StatelessWidget {
  const BefDateTimePicker({
    super.key,
    required this.value,
    required this.onChanged,
    this.minuteStep = 5,
    this.hour12 = true,
  });
  final DateTime? value;
  final ValueChanged<DateTime> onChanged;
  final int minuteStep;
  final bool hour12;

  @override
  Widget build(BuildContext context) {
    final v = value ?? DateTime.now();
    final time = '${v.hour.toString().padLeft(2, '0')}:${v.minute.toString().padLeft(2, '0')}';
    return Row(
      children: [
        Expanded(
          child: BefDatePicker(
            value: value,
            onChanged: (d) =>
                d == null ? null : onChanged(DateTime(d.year, d.month, d.day, v.hour, v.minute)),
          ),
        ),
        const SizedBox(width: 8),
        BefTimePicker(
          value: time,
          hour12: hour12,
          minuteStep: minuteStep,
          onChanged: (t) {
            final p = t.split(':').map(int.parse).toList();
            onChanged(DateTime(v.year, v.month, v.day, p[0], p[1]));
          },
        ),
      ],
    );
  }
}
