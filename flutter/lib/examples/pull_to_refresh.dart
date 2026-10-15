import 'package:flutter/material.dart';

import '../befui/pull_to_refresh.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  var items = ['Aarav punched in', 'Diya applied for leave', 'Payroll draft created'];

  Future<void> refresh() async {
    await Future<void>.delayed(const Duration(milliseconds: 1200));
    setState(() => items = ['New update at ${TimeOfDay.now().format(context)}', ...items]);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Container(
      height: 256,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(BefRadius.xl),
        border: Border.all(color: c.border),
      ),
      child: BefPullToRefresh(
        onRefresh: refresh,
        children: [
          for (final t in items)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: c.border)),
              ),
              child: Text(t, style: BefText.style(context, size: 13)),
            ),
        ],
      ),
    );
  }
}
