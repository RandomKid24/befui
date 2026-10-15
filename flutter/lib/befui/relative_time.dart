import 'dart:async';

import 'package:flutter/material.dart';

import 'theme.dart';

/// "3 minutes ago" / "in 2 hours" for [date]. Pass [now] to pin the clock (tests, screenshots).
String befRelative(DateTime date, [DateTime? now]) {
  final secs = date.difference(now ?? DateTime.now()).inSeconds;
  final s = secs.abs();
  const units = [
    ('year', 31536000),
    ('month', 2592000),
    ('week', 604800),
    ('day', 86400),
    ('hour', 3600),
    ('minute', 60),
  ];
  for (final (name, size) in units) {
    if (s >= size) {
      final n = (s / size).round();
      if (name == 'day' && n == 1) return secs < 0 ? 'yesterday' : 'tomorrow';
      final label = '$n $name${n == 1 ? '' : 's'}';
      return secs < 0 ? '$label ago' : 'in $label';
    }
  }
  return s < 10
      ? 'just now'
      : secs < 0
      ? '$s seconds ago'
      : 'in $s seconds';
}

/// "3 minutes ago", live. Refreshes every 10 seconds, or every minute once it is older than an hour.
class BefRelativeTime extends StatefulWidget {
  const BefRelativeTime(this.date, {super.key, this.style});
  final DateTime date;
  final TextStyle? style;

  @override
  State<BefRelativeTime> createState() => _BefRelativeTimeState();
}

class _BefRelativeTimeState extends State<BefRelativeTime> {
  Timer? _t;

  @override
  void initState() {
    super.initState();
    final fast = widget.date.difference(DateTime.now()).abs() < const Duration(hours: 1);
    _t = Timer.periodic(Duration(seconds: fast ? 10 : 60), (_) => setState(() {}));
  }

  @override
  void dispose() {
    _t?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Text(
    befRelative(widget.date),
    style: widget.style ?? BefText.style(context, size: 13, color: context.bef.mutedForeground),
  );
}
