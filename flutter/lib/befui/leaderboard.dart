import 'package:flutter/material.dart';

import 'avatar.dart';
import 'core.dart';
import 'icons.dart';
import 'theme.dart';

class BefLeaderboardItem {
  const BefLeaderboardItem({
    required this.name,
    required this.value,
    this.delta = 0,
    this.subtitle,
    this.src,
  });
  final String name;
  final double value;

  /// Places moved since last time: positive up, negative down.
  final int delta;
  final String? subtitle;
  final String? src;
}

/// A ranked list: gold, silver and bronze numbers, avatars, a bar behind each row and how far each moved.
class BefLeaderboard extends StatelessWidget {
  const BefLeaderboard({super.key, required this.items, this.format, this.limit});
  final List<BefLeaderboardItem> items;
  final String Function(double)? format;
  final int? limit;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final sorted = [...items]..sort((a, b) => b.value.compareTo(a.value));
    final shown = limit == null ? sorted : sorted.take(limit!).toList();
    final mx = shown.first.value;
    final medals = [const Color(0xFFD97706), const Color(0xFF64748B), const Color(0xFFC2410C)];
    String fmt(double v) => format != null ? format!(v) : v.round().toString();
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (var i = 0; i < shown.length; i++) ...[
          if (i > 0) const SizedBox(height: 6),
          Container(
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              color: c.card,
              borderRadius: BorderRadius.circular(BefRadius.lg),
              border: Border.all(color: c.border),
            ),
            child: LayoutBuilder(
              builder: (context, box) {
                return Stack(
                  children: [
                    Positioned(
                      left: 0,
                      top: 0,
                      bottom: 0,
                      child: TweenAnimationBuilder<double>(
                        tween: Tween(begin: befReduceMotion(context) ? 1 : 0, end: 1),
                        duration: Duration(milliseconds: 900 + i * 80),
                        curve: Curves.easeOutCubic,
                        builder: (_, t, _) => Container(
                          width: box.maxWidth * shown[i].value / mx * t,
                          color: c.primary.withValues(alpha: 0.1),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                      child: Row(
                        children: [
                          SizedBox(
                            width: 24,
                            child: Text(
                              '${i + 1}',
                              textAlign: TextAlign.center,
                              style: BefText.style(
                                context,
                                size: 12,
                                weight: FontWeight.w600,
                                color: i < 3 ? medals[i] : c.mutedForeground,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          BefAvatar(name: shown[i].name, src: shown[i].src),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  shown[i].name,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: BefText.style(context, weight: FontWeight.w500, height: 1.2),
                                ),
                                if (shown[i].subtitle != null)
                                  Text(
                                    shown[i].subtitle!,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: BefText.style(
                                      context,
                                      size: 12,
                                      color: c.mutedForeground,
                                      height: 1.3,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          if (shown[i].delta != 0) ...[
                            BefIcon(
                              shown[i].delta > 0 ? BefIcons.arrowUp : BefIcons.arrowDown,
                              size: 12,
                              color: shown[i].delta > 0 ? c.success : c.destructive,
                            ),
                            Text(
                              '${shown[i].delta.abs()}',
                              style: BefText.style(
                                context,
                                size: 12,
                                weight: FontWeight.w500,
                                color: shown[i].delta > 0 ? c.success : c.destructive,
                              ),
                            ),
                            const SizedBox(width: 12),
                          ],
                          Text(
                            fmt(shown[i].value),
                            style: BefText.style(
                              context,
                              weight: FontWeight.w600,
                            ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ],
    );
  }
}
