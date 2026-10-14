import 'package:flutter/material.dart';

import 'theme.dart';

enum BefTimelineTone { defaultTone, success, warning, danger, info }

class BefTimelineItem {
  const BefTimelineItem({
    required this.title,
    this.description,
    this.time,
    this.icon,
    this.tone = BefTimelineTone.defaultTone,
  });
  final String title;
  final String? description;
  final String? time;
  final Widget? icon;
  final BefTimelineTone tone;
}

/// Events down a line, newest first or last as you like. Each dot takes a tone and an icon.
class BefTimeline extends StatelessWidget {
  const BefTimeline({super.key, required this.items});
  final List<BefTimelineItem> items;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Column(
      children: [
        for (var i = 0; i < items.length; i++)
          IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                SizedBox(
                  width: 28,
                  child: Column(
                    children: [
                      _dot(c, items[i]),
                      if (i < items.length - 1)
                        Expanded(
                          child: Container(width: 1, margin: const EdgeInsets.only(top: 4), color: c.border),
                        ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Padding(
                    padding: EdgeInsets.only(top: 2, bottom: i < items.length - 1 ? 20 : 0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.baseline,
                          textBaseline: TextBaseline.alphabetic,
                          children: [
                            Expanded(
                              child: Text(
                                items[i].title,
                                style: BefText.style(context, size: 13, weight: FontWeight.w500),
                              ),
                            ),
                            if (items[i].time != null)
                              Text(
                                items[i].time!,
                                style: BefText.style(context, size: 12, color: c.mutedForeground),
                              ),
                          ],
                        ),
                        if (items[i].description != null) ...[
                          const SizedBox(height: 2),
                          Text(
                            items[i].description!,
                            style: BefText.style(context, size: 12, color: c.mutedForeground),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _dot(BefColors c, BefTimelineItem it) {
    final (bg, fg) = switch (it.tone) {
      BefTimelineTone.defaultTone => (c.secondary, c.mutedForeground),
      BefTimelineTone.success => (c.success.withValues(alpha: 0.1), c.success),
      BefTimelineTone.warning => (c.warning.withValues(alpha: 0.1), c.warning),
      BefTimelineTone.danger => (c.destructive.withValues(alpha: 0.1), c.destructive),
      BefTimelineTone.info => (c.info.withValues(alpha: 0.1), c.info),
    };
    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
      alignment: Alignment.center,
      child: it.icon != null
          ? IconTheme.merge(
              data: IconThemeData(size: 14, color: fg),
              child: it.icon!,
            )
          : Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(color: fg, shape: BoxShape.circle),
            ),
    );
  }
}
