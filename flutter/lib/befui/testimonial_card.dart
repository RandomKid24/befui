import 'package:flutter/material.dart';

import 'avatar.dart';
import 'rating.dart';
import 'theme.dart';

/// A customer quote with optional star rating, name and role.
class BefTestimonialCard extends StatelessWidget {
  const BefTestimonialCard({
    super.key,
    required this.quote,
    required this.name,
    this.role,
    this.rating,
    this.width = 360,
  });
  final String quote, name;
  final String? role;
  final int? rating;
  final double width;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Container(
      width: width,
      padding: const EdgeInsets.all(20),
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
          if (rating != null) ...[BefRating(value: rating!, size: 16), const SizedBox(height: 12)],
          Text('“$quote”', style: BefText.style(context, color: c.cardForeground, height: 1.55)),
          const SizedBox(height: 16),
          Row(
            children: [
              BefAvatar(name: name, size: BefAvatarSize.md),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: BefText.style(context, weight: FontWeight.w500, color: c.cardForeground),
                    ),
                    if (role != null)
                      Text(role!, style: BefText.style(context, size: 12, color: c.mutedForeground)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
