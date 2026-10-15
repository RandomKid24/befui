import 'package:flutter/material.dart';

import 'theme.dart';

class BefOrderLine {
  const BefOrderLine({
    required this.id,
    required this.name,
    required this.qty,
    required this.price,
    this.detail,
    this.image,
  });
  final String id, name;
  final String? detail;
  final int qty;
  final double price;

  /// A thumbnail; a grey square when null.
  final Widget? image;
}

String _inr(double v, String symbol) {
  final s = v.round().toString();
  if (s.length <= 3) return '$symbol$s';
  final head = s.substring(0, s.length - 3).replaceAllMapped(RegExp(r'\B(?=(\d{2})+(?!\d))'), (_) => ',');
  return '$symbol$head,${s.substring(s.length - 3)}';
}

/// Cart or checkout summary: line items, then subtotal, discount, shipping, tax and total. Totals are computed from [lines]. [discount] is an amount off; [shipping] of 0 shows Free; [taxRate] is 0.18 for 18%.
class BefOrderSummary extends StatelessWidget {
  const BefOrderSummary({
    super.key,
    required this.lines,
    this.discount = 0,
    this.shipping,
    this.taxRate = 0,
    this.symbol = '₹',
    this.title = 'Order summary',
    this.action,
    this.child,
  });
  final List<BefOrderLine> lines;
  final double discount, taxRate;
  final double? shipping;
  final String symbol, title;

  /// Usually a button, shown under the total.
  final Widget? action;

  /// For a coupon field, shown above the totals.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final subtotal = lines.fold<double>(0, (s, l) => s + l.price * l.qty);
    final after = (subtotal - discount).clamp(0, double.infinity).toDouble();
    final tax = after * taxRate;
    final total = after + (shipping ?? 0) + tax;
    Widget row(String l, String v, {Color? color, bool bold = false}) => Padding(
      padding: const EdgeInsets.symmetric(vertical: 3),
      child: Row(
        children: [
          Expanded(
            child: Text(
              l,
              style: BefText.style(
                context,
                size: 13,
                color: bold ? c.cardForeground : c.mutedForeground,
                weight: bold ? FontWeight.w600 : FontWeight.w400,
              ),
            ),
          ),
          Text(
            v,
            style: BefText.style(
              context,
              size: bold ? 16 : 13,
              color: color ?? c.cardForeground,
              weight: bold ? FontWeight.w600 : FontWeight.w400,
            ),
          ),
        ],
      ),
    );
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(BefRadius.xl),
        border: Border.all(color: c.border),
        boxShadow: BefShadow.sm,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            title,
            style: BefText.style(context, weight: FontWeight.w600, color: c.cardForeground),
          ),
          const SizedBox(height: 12),
          for (final l in lines)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    clipBehavior: Clip.antiAlias,
                    decoration: BoxDecoration(
                      color: c.muted,
                      borderRadius: BorderRadius.circular(BefRadius.lg),
                    ),
                    child: l.image,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l.name,
                          style: BefText.style(
                            context,
                            size: 13,
                            weight: FontWeight.w500,
                            color: c.cardForeground,
                          ),
                        ),
                        if (l.detail != null)
                          Text(l.detail!, style: BefText.style(context, size: 12, color: c.mutedForeground)),
                        Text(
                          'Qty ${l.qty}',
                          style: BefText.style(context, size: 12, color: c.mutedForeground),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    _inr(l.price * l.qty, symbol),
                    style: BefText.style(context, size: 13, weight: FontWeight.w500, color: c.cardForeground),
                  ),
                ],
              ),
            ),
          if (child != null) ...[const SizedBox(height: 8), child!],
          Divider(height: 24, color: c.border),
          row('Subtotal', _inr(subtotal, symbol)),
          if (discount > 0) row('Discount', '-${_inr(discount, symbol)}', color: c.success),
          if (shipping != null) row('Shipping', shipping == 0 ? 'Free' : _inr(shipping!, symbol)),
          if (taxRate > 0) row('Tax (${(taxRate * 100).round()}%)', _inr(tax, symbol)),
          Divider(height: 20, color: c.border),
          row('Total', _inr(total, symbol), bold: true),
          if (action != null) ...[const SizedBox(height: 16), action!],
        ],
      ),
    );
  }
}
