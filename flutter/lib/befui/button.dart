import 'package:flutter/material.dart';

import 'core.dart';
import 'icons.dart';
import 'theme.dart';

enum BefButtonVariant {
  primary,
  secondary,
  outline,
  ghost,
  destructive,
  link,
  soft,
  dark,
  glow,
  shine,
  brutal,
  raised,
  outlineGlow,
}

enum BefButtonSize { xs, sm, md, lg, icon, iconSm }

enum BefButtonShape { rounded, pill }

/// Where a button sits in a [BefButtonGroup]: the outer corners stay round, the joins are square and share one border.
enum BefButtonJoin { none, start, middle, end }

/// A button with the thirteen variants of the React one. Give it a [label] or any [child]; [leading] and [trailing] are icons or small widgets.
class BefButton extends StatelessWidget {
  const BefButton({
    super.key,
    this.label,
    this.child,
    this.leading,
    this.trailing,
    this.onPressed,
    this.variant = BefButtonVariant.primary,
    this.size = BefButtonSize.md,
    this.shape = BefButtonShape.rounded,
    this.join = BefButtonJoin.none,
    this.loading = false,
    this.expand = false,
    this.semanticLabel,
  }) : assert(label != null || child != null);

  final String? label;
  final Widget? child;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onPressed;
  final BefButtonVariant variant;
  final BefButtonSize size;
  final BefButtonShape shape;
  final BefButtonJoin join;
  final bool loading;

  /// Fill the available width.
  final bool expand;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final enabled = onPressed != null && !loading;
    final (height, padX, fontSize) = switch (size) {
      BefButtonSize.xs => (28.0, 10.0, 12.0),
      BefButtonSize.sm => (32.0, 12.0, 13.0),
      BefButtonSize.md => (36.0, 16.0, 14.0),
      BefButtonSize.lg => (44.0, 24.0, 15.0),
      BefButtonSize.icon => (36.0, 0.0, 14.0),
      BefButtonSize.iconSm => (32.0, 0.0, 14.0),
    };
    final h = height + BefDensity.of(context).delta;
    final isIcon = size == BefButtonSize.icon || size == BefButtonSize.iconSm;
    final r = Radius.circular(shape == BefButtonShape.pill ? BefRadius.full : BefRadius.md);
    final radius = switch (join) {
      BefButtonJoin.none => BorderRadius.all(r),
      BefButtonJoin.start => BorderRadius.horizontal(left: r),
      BefButtonJoin.middle => BorderRadius.zero,
      BefButtonJoin.end => BorderRadius.horizontal(right: r),
    };
    final joined =
        join == BefButtonJoin.middle ||
        join == BefButtonJoin.end; // the neighbour's right border is the shared line

    return BefPressable(
      enabled: enabled,
      onPressed: onPressed,
      semanticLabel: semanticLabel ?? label,
      builder: (context, states) {
        final on = states.contains(WidgetState.hovered) || states.contains(WidgetState.pressed);
        final focused = states.contains(WidgetState.focused);
        final look = _look(c, variant, on);
        final textStyle = BefText.style(context, size: fontSize, weight: FontWeight.w500, color: look.fg)
            .copyWith(
              decoration: variant == BefButtonVariant.link && on
                  ? TextDecoration.underline
                  : TextDecoration.none,
              decorationColor: look.fg,
            );
        final isLink = variant == BefButtonVariant.link;
        final content = Row(
          mainAxisSize: expand ? MainAxisSize.max : MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (loading) ...[
              BefSpin(child: BefIcon(BefIcons.loader, size: 16, color: look.fg)),
              const SizedBox(width: 8),
            ] else if (leading != null) ...[
              IconTheme.merge(
                data: IconThemeData(size: 16, color: look.fg),
                child: leading!,
              ),
              const SizedBox(width: 8),
            ],
            if (child != null)
              Flexible(child: child!)
            else
              Flexible(child: Text(label!, maxLines: 1, overflow: TextOverflow.ellipsis)),
            if (trailing != null) ...[
              const SizedBox(width: 8),
              IconTheme.merge(
                data: IconThemeData(size: 16, color: look.fg),
                child: trailing!,
              ),
            ],
          ],
        );
        return Opacity(
          opacity: onPressed == null || loading ? 0.5 : 1,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            height: isLink ? null : h,
            width: isIcon ? h : null,
            padding: EdgeInsets.symmetric(horizontal: isLink ? 0 : padX),
            decoration: BoxDecoration(
              color: look.bg,
              borderRadius: radius,
              border: look.border == null
                  ? null
                  : Border(
                      top: look.border!,
                      left: joined ? BorderSide.none : look.border!,
                      right: look.border!,
                      bottom: look.borderBottom ?? look.border!,
                    ),
              boxShadow: [...look.shadow, if (focused) ...befFocusRing(context)],
            ),
            transform: look.lift == null
                ? null
                : (Matrix4.identity()..translateByDouble(look.lift!.dx, look.lift!.dy, 0, 1)),
            child: DefaultTextStyle.merge(
              style: textStyle,
              child: IconTheme.merge(
                data: IconThemeData(size: 16, color: look.fg),
                child: content,
              ),
            ),
          ),
        );
      },
    );
  }
}

class _Look {
  const _Look({required this.fg, this.bg, this.border, this.borderBottom, this.shadow = const [], this.lift});
  final Color fg;
  final Color? bg;
  final BorderSide? border;
  final BorderSide? borderBottom;
  final List<BoxShadow> shadow;
  final Offset? lift;
}

_Look _look(BefColors c, BefButtonVariant v, bool on) {
  const sm = BefShadow.sm;
  switch (v) {
    case BefButtonVariant.primary:
      return _Look(fg: c.primaryForeground, bg: on ? befOpacity(c.primary, 0.9) : c.primary, shadow: sm);
    case BefButtonVariant.secondary:
      return _Look(fg: c.secondaryForeground, bg: on ? befOpacity(c.secondary, 0.7) : c.secondary);
    case BefButtonVariant.outline:
      return _Look(
        fg: on ? c.foreground : c.foreground,
        bg: on ? c.muted : c.background,
        border: BorderSide(color: c.border),
      );
    case BefButtonVariant.ghost:
      return _Look(fg: on ? c.foreground : c.mutedForeground, bg: on ? c.secondary : null);
    case BefButtonVariant.destructive:
      return _Look(fg: Colors.white, bg: on ? befOpacity(c.destructive, 0.9) : c.destructive, shadow: sm);
    case BefButtonVariant.link:
      return _Look(fg: c.primary);
    case BefButtonVariant.soft:
      return _Look(fg: c.primary, bg: befOpacity(c.primary, on ? 0.2 : 0.1));
    case BefButtonVariant.dark:
      return _Look(fg: c.background, bg: on ? befOpacity(c.foreground, 0.85) : c.foreground);
    case BefButtonVariant.glow:
      return _Look(
        fg: c.primaryForeground,
        bg: c.primary,
        shadow: on
            ? [BoxShadow(color: befOpacity(c.primary, 0.6), blurRadius: 24, spreadRadius: 2)]
            : const [],
        lift: on ? const Offset(0, -1) : null,
      );
    case BefButtonVariant.shine:
      return _Look(fg: c.background, bg: c.foreground);
    case BefButtonVariant.brutal:
      return _Look(
        fg: Colors.black,
        bg: c.warning,
        border: BorderSide(color: c.foreground, width: 2),
        shadow: [BoxShadow(color: c.foreground, offset: on ? const Offset(2, 2) : const Offset(3, 3))],
        lift: on ? const Offset(1, 1) : null,
      );
    case BefButtonVariant.raised:
      return _Look(
        fg: c.primaryForeground,
        bg: c.primary,
        border: BorderSide.none,
        borderBottom: BorderSide(color: befOpacity(c.primary, 0.6), width: 4),
      );
    case BefButtonVariant.outlineGlow:
      return _Look(
        fg: c.primary,
        bg: on ? befOpacity(c.primary, 0.1) : null,
        border: BorderSide(color: on ? c.primary : befOpacity(c.primary, 0.4)),
        shadow: on ? [BoxShadow(color: befOpacity(c.primary, 0.35), blurRadius: 16)] : const [],
      );
  }
}
