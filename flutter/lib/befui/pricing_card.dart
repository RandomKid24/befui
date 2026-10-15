import 'package:flutter/material.dart';

import 'button.dart';
import 'icons.dart';
import 'number_ticker.dart';
import 'theme.dart';

/// A plan tile: name, big price that counts to its new value, feature list and a button. [highlighted] adds the primary border.
class BefPricingCard extends StatelessWidget {
  const BefPricingCard({
    super.key,
    required this.name,
    required this.price,
    required this.features,
    this.description,
    this.highlighted = false,
    this.currency = '₹',
    this.period = '/month',
    this.cta = 'Get started',
    this.onSelect,
    this.width = 288,
  });
  final String name, currency, period, cta;
  final String? description;
  final double price;
  final List<String> features;
  final bool highlighted;
  final VoidCallback? onSelect;
  final double width;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Container(
      width: width,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(BefRadius.xl),
        border: Border.all(color: highlighted ? c.primary : c.border, width: highlighted ? 2 : 1),
        boxShadow: highlighted ? BefShadow.md : BefShadow.sm,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            name,
            style: BefText.style(context, weight: FontWeight.w600, color: c.cardForeground),
          ),
          if (description != null)
            Text(description!, style: BefText.style(context, size: 13, color: c.mutedForeground)),
          const SizedBox(height: 16),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              BefNumberTicker(
                value: price,
                prefix: currency,
                style: BefText.style(
                  context,
                  size: 36,
                  weight: FontWeight.w700,
                  color: c.cardForeground,
                  height: 1.1,
                ),
              ),
              const SizedBox(width: 4),
              Text(period, style: BefText.style(context, size: 13, color: c.mutedForeground)),
            ],
          ),
          const SizedBox(height: 20),
          for (final f in features)
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(
                children: [
                  BefIcon(BefIcons.check, size: 16, color: c.primary),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(f, style: BefText.style(context, size: 13, color: c.cardForeground)),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 10),
          BefButton(
            label: cta,
            expand: true,
            variant: highlighted ? BefButtonVariant.primary : BefButtonVariant.outline,
            onPressed: onSelect,
          ),
        ],
      ),
    );
  }
}
