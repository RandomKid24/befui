import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'rating.dart';
import 'theme.dart';

/// A shop tile: square [image] area, optional `-N%` badge from [compareAt], wishlist heart, category, name, rating and price.
class BefProductCard extends StatelessWidget {
  const BefProductCard({
    super.key,
    required this.name,
    required this.price,
    this.compareAt,
    this.category,
    this.rating,
    this.image,
    this.wished = false,
    this.onWish,
    this.onTap,
    this.currency = '₹',
    this.width = 240,
  });
  final String name;
  final double price;
  final double? compareAt;
  final int? rating;
  final String? category, currency;
  final Widget? image;
  final bool wished;
  final ValueChanged<bool>? onWish;
  final VoidCallback? onTap;
  final double width;

  String _money(double v) {
    final s = v.round().toString();
    final b = StringBuffer();
    for (var i = 0; i < s.length; i++) {
      if (i > 0 && (s.length - i) % 3 == 0) b.write(',');
      b.write(s[i]);
    }
    return '$currency$b';
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final off = compareAt != null && compareAt! > price ? ((1 - price / compareAt!) * 100).round() : null;
    return BefPressable(
      pressScale: 1,
      onPressed: onTap,
      builder: (context, s) => Container(
        width: width,
        clipBehavior: Clip.antiAlias,
        decoration: BoxDecoration(
          color: c.card,
          borderRadius: BorderRadius.circular(BefRadius.xl),
          border: Border.all(color: c.border),
          boxShadow: BefShadow.sm,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            AspectRatio(
              aspectRatio: 1,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  image ??
                      Container(
                        color: c.muted,
                        child: Center(child: BefIcon(BefIcons.image, size: 32, color: c.mutedForeground)),
                      ),
                  if (off != null)
                    Positioned(
                      left: 10,
                      top: 10,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: c.destructive,
                          borderRadius: BorderRadius.circular(BefRadius.full),
                        ),
                        child: Text(
                          '-$off%',
                          style: BefText.style(
                            context,
                            size: 11,
                            weight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  Positioned(
                    right: 10,
                    top: 10,
                    child: GestureDetector(
                      onTap: onWish == null ? null : () => onWish!(!wished),
                      child: Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: c.background.withValues(alpha: 0.9),
                        ),
                        child: Center(
                          child: BefIcon(
                            BefIcons.heart,
                            size: 16,
                            color: wished ? c.destructive : c.foreground,
                            fill: wished ? c.destructive : null,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (category != null)
                    Text(
                      category!.toUpperCase(),
                      style: BefText.style(context, size: 11, color: c.mutedForeground, letterSpacing: 0.6),
                    ),
                  Text(
                    name,
                    style: BefText.style(context, weight: FontWeight.w500, color: c.cardForeground),
                  ),
                  if (rating != null) ...[const SizedBox(height: 6), BefRating(value: rating!, size: 14)],
                  const SizedBox(height: 8),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        _money(price),
                        style: BefText.style(
                          context,
                          size: 16,
                          weight: FontWeight.w600,
                          color: c.cardForeground,
                        ),
                      ),
                      if (off != null) ...[
                        const SizedBox(width: 6),
                        Text(
                          _money(compareAt!),
                          style: BefText.style(
                            context,
                            size: 13,
                            color: c.mutedForeground,
                          ).copyWith(decoration: TextDecoration.lineThrough),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
