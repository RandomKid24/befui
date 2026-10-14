import 'package:flutter/material.dart';

import 'icons.dart';
import 'theme.dart';

/// A full error message: a big code (404) or an alert icon, a title, a line of help and actions.
class BefErrorState extends StatelessWidget {
  const BefErrorState({
    super.key,
    required this.title,
    this.code,
    this.description,
    this.icon,
    this.actions = const [],
  });
  final String title;
  final String? code;
  final String? description;
  final Widget? icon;
  final List<Widget> actions;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Semantics(
      liveRegion: true,
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 448),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 56),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (code != null)
                  Text(
                    code!,
                    style: BefText.style(
                      context,
                      size: 60,
                      weight: FontWeight.w600,
                      color: c.mutedForeground.withValues(alpha: 0.4),
                      height: 1,
                      letterSpacing: -1.5,
                    ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
                  )
                else
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: c.destructive.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    alignment: Alignment.center,
                    child: IconTheme.merge(
                      data: IconThemeData(size: 24, color: c.destructive),
                      child: icon ?? const BefIcon(BefIcons.alertCircle),
                    ),
                  ),
                const SizedBox(height: 12),
                Text(
                  title,
                  textAlign: TextAlign.center,
                  style: BefText.style(context, size: 18, weight: FontWeight.w600, letterSpacing: -0.3),
                ),
                if (description != null) ...[
                  const SizedBox(height: 12),
                  Text(
                    description!,
                    textAlign: TextAlign.center,
                    style: BefText.style(context, size: 13, color: c.mutedForeground),
                  ),
                ],
                if (actions.isNotEmpty) ...[
                  const SizedBox(height: 20),
                  Wrap(alignment: WrapAlignment.center, spacing: 8, runSpacing: 8, children: actions),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
