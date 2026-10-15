import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

class BefSource {
  const BefSource({required this.id, required this.title, required this.site, this.onTap});
  final String id, title, site;
  final VoidCallback? onTap;
}

/// Small numbered chip to put inside an answer with a [WidgetSpan]: "grew 12% [1]". Tap to open the source.
class BefCite extends StatelessWidget {
  const BefCite({super.key, required this.n, this.onTap});
  final int n;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return BefPressable(
      semanticLabel: 'Source $n',
      onPressed: onTap,
      builder: (context, s) => Container(
        // no alignment or height: inside a WidgetSpan an aligned Container would stretch to the full line
        constraints: const BoxConstraints(minWidth: 18),
        margin: const EdgeInsets.symmetric(horizontal: 2),
        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 3),
        decoration: BoxDecoration(
          color: s.contains(WidgetState.pressed) ? c.primary : c.primary.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(BefRadius.full),
        ),
        child: Text(
          '$n',
          style: BefText.style(
            context,
            size: 10,
            weight: FontWeight.w600,
            color: s.contains(WidgetState.pressed) ? c.primaryForeground : c.primary,
            height: 1,
          ),
        ),
      ),
    );
  }
}

/// The sources under an answer, one numbered card each. Wraps onto new lines.
class BefSourceList extends StatelessWidget {
  const BefSourceList({super.key, required this.sources});
  final List<BefSource> sources;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        for (var i = 0; i < sources.length; i++)
          BefPressable(
            semanticLabel: 'Source ${i + 1}: ${sources[i].title}',
            pressScale: 0.98,
            onPressed: sources[i].onTap,
            builder: (context, s) => Container(
              width: 200,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: s.contains(WidgetState.hovered) ? c.muted.withValues(alpha: 0.6) : c.card,
                borderRadius: BorderRadius.circular(BefRadius.lg),
                border: Border.all(color: c.border),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 20,
                    height: 20,
                    margin: const EdgeInsets.only(top: 1),
                    decoration: BoxDecoration(
                      color: c.primary.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        '${i + 1}',
                        style: BefText.style(
                          context,
                          size: 10,
                          weight: FontWeight.w600,
                          color: c.primary,
                          height: 1,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          sources[i].title,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: BefText.style(context, size: 13, weight: FontWeight.w500, height: 1.3),
                        ),
                        const SizedBox(height: 3),
                        Row(
                          children: [
                            BefIcon(BefIcons.globe, size: 12, color: c.mutedForeground),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                sources[i].site,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: BefText.style(context, size: 12, color: c.mutedForeground),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
