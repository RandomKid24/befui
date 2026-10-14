import 'package:flutter/material.dart';

import 'theme.dart';

enum BefAvatarSize { xs, sm, md, lg, xl }

enum BefAvatarShape { circle, square }

enum BefPresence { online, away, busy, offline }

// bg-<colour>-500/15 and text-<colour>-600 (dark: -300), one per name
const _tones = [
  (Color(0xFF3B82F6), Color(0xFF2563EB), Color(0xFF93C5FD)),
  (Color(0xFF10B981), Color(0xFF059669), Color(0xFF6EE7B7)),
  (Color(0xFF8B5CF6), Color(0xFF7C3AED), Color(0xFFC4B5FD)),
  (Color(0xFFF59E0B), Color(0xFFD97706), Color(0xFFFCD34D)),
  (Color(0xFFF43F5E), Color(0xFFE11D48), Color(0xFFFDA4AF)),
  (Color(0xFF06B6D4), Color(0xFF0891B2), Color(0xFF67E8F9)),
];

String _initials(String name) =>
    name.split(RegExp(r'\s+')).where((p) => p.isNotEmpty).take(2).map((p) => p[0].toUpperCase()).join();

int _hash(String name) {
  var h = 0;
  for (final r in name.runes) {
    h = (h * 31 + r) & 0xFFFFFFFF;
  }
  return h;
}

/// A person or team: their photo when there is a [src], otherwise coloured initials. The colour comes from the name, so it stays the same everywhere.
class BefAvatar extends StatelessWidget {
  const BefAvatar({
    super.key,
    required this.name,
    this.src,
    this.size = BefAvatarSize.sm,
    this.shape = BefAvatarShape.circle,
    this.status,
    this.ring = false,
  });
  final String name;
  final String? src;
  final BefAvatarSize size;
  final BefAvatarShape shape;
  final BefPresence? status;

  /// A 2px ring in the background colour, used when avatars overlap.
  final bool ring;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final dark = Theme.of(context).brightness == Brightness.dark;
    final (px, font, dot) = switch (size) {
      BefAvatarSize.xs => (24.0, 10.0, 8.0),
      BefAvatarSize.sm => (32.0, 12.0, 10.0),
      BefAvatarSize.md => (40.0, 14.0, 12.0),
      BefAvatarSize.lg => (56.0, 18.0, 14.0),
      BefAvatarSize.xl => (80.0, 24.0, 16.0),
    };
    final tone = _tones[_hash(name) % _tones.length];
    final radius = shape == BefAvatarShape.circle
        ? BorderRadius.circular(BefRadius.full)
        : BorderRadius.circular(BefRadius.lg);
    final face = Container(
      width: px,
      height: px,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: src == null ? tone.$1.withValues(alpha: 0.15) : c.secondary,
        borderRadius: radius,
        border: ring ? Border.all(color: c.background, width: 2) : null,
        image: src == null ? null : DecorationImage(image: NetworkImage(src!), fit: BoxFit.cover),
      ),
      child: src == null
          ? Text(
              _initials(name),
              style: BefText.style(
                context,
                size: font,
                weight: FontWeight.w500,
                color: dark ? tone.$3 : tone.$2,
                height: 1,
              ),
            )
          : null,
    );
    final presence = status;
    return Semantics(
      label: presence == null ? name : '$name, ${presence.name}',
      image: true,
      excludeSemantics: true,
      child: presence == null
          ? face
          : Stack(
              clipBehavior: Clip.none,
              children: [
                face,
                Positioned(
                  right: -1,
                  bottom: -1,
                  child: Container(
                    width: dot,
                    height: dot,
                    decoration: BoxDecoration(
                      color: switch (presence) {
                        BefPresence.online => c.success,
                        BefPresence.away => c.warning,
                        BefPresence.busy => c.destructive,
                        BefPresence.offline => c.mutedForeground.withValues(alpha: 0.5),
                      },
                      shape: BoxShape.circle,
                      border: Border.all(color: c.background, width: 2),
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}

/// Avatars that overlap, with a +N count for the rest.
class BefAvatarGroup extends StatelessWidget {
  const BefAvatarGroup({
    super.key,
    required this.names,
    this.max = 4,
    this.size = BefAvatarSize.sm,
    this.shape = BefAvatarShape.circle,
  });
  final List<String> names;
  final int max;
  final BefAvatarSize size;
  final BefAvatarShape shape;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final px = switch (size) {
      BefAvatarSize.xs => 24.0,
      BefAvatarSize.sm => 32.0,
      BefAvatarSize.md => 40.0,
      BefAvatarSize.lg => 56.0,
      BefAvatarSize.xl => 80.0,
    };
    final shown = names.take(max).toList();
    final hidden = names.length - shown.length;
    final radius = shape == BefAvatarShape.circle
        ? BorderRadius.circular(BefRadius.full)
        : BorderRadius.circular(BefRadius.lg);
    final font = switch (size) {
      BefAvatarSize.xs => 10.0,
      BefAvatarSize.sm => 12.0,
      BefAvatarSize.md => 14.0,
      BefAvatarSize.lg => 18.0,
      BefAvatarSize.xl => 24.0,
    };
    final count = shown.length + (hidden > 0 ? 1 : 0);
    return SizedBox(
      width: px + (count - 1) * (px - 8),
      height: px,
      child: Stack(
        children: [
          for (var i = 0; i < shown.length; i++)
            Positioned(
              left: i * (px - 8),
              child: BefAvatar(name: shown[i], size: size, shape: shape, ring: true),
            ),
          if (hidden > 0)
            Positioned(
              left: shown.length * (px - 8),
              child: Container(
                width: px,
                height: px,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: c.secondary,
                  borderRadius: radius,
                  border: Border.all(color: c.background, width: 2),
                ),
                child: Text(
                  '+$hidden',
                  style: BefText.style(
                    context,
                    size: font,
                    weight: FontWeight.w600,
                    color: c.mutedForeground,
                    height: 1,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// An avatar with a name and a line of detail next to it.
class BefUserInfo extends StatelessWidget {
  const BefUserInfo({
    super.key,
    required this.name,
    this.subtitle,
    this.src,
    this.size = BefAvatarSize.sm,
    this.status,
  });
  final String name;
  final String? subtitle;
  final String? src;
  final BefAvatarSize size;
  final BefPresence? status;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        BefAvatar(name: name, src: src, size: size, status: status),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(name, style: BefText.style(context, size: 13, weight: FontWeight.w500, height: 1.2)),
            if (subtitle != null)
              Text(subtitle!, style: BefText.style(context, size: 12, color: c.mutedForeground, height: 1.3)),
          ],
        ),
      ],
    );
  }
}
