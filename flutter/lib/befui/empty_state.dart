import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

/// Nothing here yet: a dashed box with an icon, a title, a line of help and an optional action.
class BefEmptyState extends StatelessWidget {
  const BefEmptyState({super.key, required this.title, this.description, this.icon, this.action});
  final String title;
  final String? description;
  final Widget? icon;
  final Widget? action;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return BefDashedBorder(
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(color: c.secondary, shape: BoxShape.circle),
                alignment: Alignment.center,
                child: IconTheme.merge(
                  data: IconThemeData(size: 20, color: c.mutedForeground),
                  child: icon!,
                ),
              ),
              const SizedBox(height: 12),
            ],
            Text(
              title,
              textAlign: TextAlign.center,
              style: BefText.style(context, weight: FontWeight.w500),
            ),
            if (description != null) ...[
              const SizedBox(height: 4),
              ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 320),
                child: Text(
                  description!,
                  textAlign: TextAlign.center,
                  style: BefText.style(context, size: 13, color: c.mutedForeground),
                ),
              ),
            ],
            if (action != null) ...[const SizedBox(height: 12), action!],
          ],
        ),
      ),
    );
  }
}
