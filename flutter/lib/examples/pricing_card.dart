import 'package:flutter/material.dart';

import '../befui/pricing_card.dart';
import '../befui/segmented.dart';

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
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        BefSegmented<String>(
          value: plan,
          onChanged: (v) => setState(() => plan = v),
          segments: const [
            BefSegment(value: 'monthly', label: 'Monthly'),
            BefSegment(value: 'yearly', label: 'Yearly, save 20%'),
          ],
        ),
        const SizedBox(height: 24),
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
      ],
    );
  }
}
