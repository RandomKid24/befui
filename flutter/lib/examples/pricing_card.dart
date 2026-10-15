import 'package:flutter/material.dart';

import '../befui/pricing_card.dart';
import '../befui/segmented.dart';
import '../befui/theme.dart';

Widget example(BuildContext context) => const _Demo();

class _Demo extends StatefulWidget {
  const _Demo();
  @override
  State<_Demo> createState() => _DemoState();
}

class _DemoState extends State<_Demo> {
  String plan = 'monthly';

  @override
  Widget build(BuildContext context) {
    final y = plan == 'yearly';
    return _groups(context, [
      (
        'Billing period',
        BefSegmented<String>(
          value: plan,
          onChanged: (v) => setState(() => plan = v),
          segments: const [
            BefSegment(value: 'monthly', label: 'Monthly'),
            BefSegment(value: 'yearly', label: 'Yearly, save 20%'),
          ],
        ),
      ),
      (
        'Highlighted plan',
        BefPricingCard(
          highlighted: true,
          name: 'Growth',
          description: 'Payroll included.',
          price: y ? 399 : 499,
          features: const [
            'Everything in Starter',
            'Payroll and payslips',
            'Approvals workflow',
            'Priority support',
          ],
          onSelect: () {},
        ),
      ),
      (
        'Plain plan',
        BefPricingCard(
          name: 'Starter',
          description: 'For teams up to 25.',
          price: y ? 239 : 299,
          features: const ['Leave and attendance', 'Employee directory', 'Email support'],
          onSelect: () {},
        ),
      ),
    ]);
  }
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
