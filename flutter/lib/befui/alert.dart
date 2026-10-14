import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

enum BefAlertVariant { info, success, warning, danger }

/// An inline message: a tinted box with an icon, a title and optional detail.
class BefAlert extends StatelessWidget {
  const BefAlert({super.key, this.title, this.child, this.variant = BefAlertVariant.info});
  final String? title;
  final Widget? child;
  final BefAlertVariant variant;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final (color, icon, borderAlpha) = switch (variant) {
      BefAlertVariant.info => (c.info, BefIcons.info, 0.2),
      BefAlertVariant.success => (c.success, BefIcons.checkCircle, 0.2),
      BefAlertVariant.warning => (c.warning, BefIcons.alert, 0.25),
      BefAlertVariant.danger => (c.destructive, BefIcons.alertCircle, 0.2),
    };
    return Semantics(
      container: true,
      liveRegion: true,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: befOpacity(color, 0.05),
          borderRadius: BorderRadius.circular(BefRadius.lg),
          border: Border.all(color: befOpacity(color, borderAlpha)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 2),
              child: BefIcon(icon, size: 16, color: color),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (title != null)
                    Text(
                      title!,
                      style: BefText.style(context, size: 13, weight: FontWeight.w500, height: 20 / 13),
                    ),
                  if (child != null)
                    DefaultTextStyle.merge(
                      style: BefText.style(context, size: 13, color: c.mutedForeground),
                      child: child!,
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
