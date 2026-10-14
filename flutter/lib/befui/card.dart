import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

/// A bordered surface on the `card` colour. With [onTap] it lifts slightly on hover and press, like `hoverable` in React.
class BefCard extends StatelessWidget {
  const BefCard({super.key, required this.child, this.onTap, this.padding, this.width});
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? padding;
  final double? width;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    Widget box(bool lift) => AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      width: width,
      transform: Matrix4.translationValues(0, lift ? -2 : 0, 0),
      padding: padding,
      decoration: BoxDecoration(
        color: c.card,
        borderRadius: BorderRadius.circular(BefRadius.xl),
        border: Border.all(color: c.border),
        boxShadow: lift
            ? BefShadow.md
            : const [BoxShadow(color: Color(0x08000000), blurRadius: 2, offset: Offset(0, 1))],
      ),
      child: DefaultTextStyle.merge(
        style: BefText.style(context, color: c.cardForeground),
        child: child,
      ),
    );
    if (onTap == null) return box(false);
    return BefPressable(
      pressScale: 1,
      onPressed: onTap,
      builder: (context, s) => box(s.contains(WidgetState.hovered) || s.contains(WidgetState.pressed)),
    );
  }
}

class BefCardHeader extends StatelessWidget {
  const BefCardHeader({super.key, required this.children});
  final List<Widget> children;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.fromLTRB(20, 20, 20, 12),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < children.length; i++) ...[if (i > 0) const SizedBox(height: 4), children[i]],
      ],
    ),
  );
}

class BefCardTitle extends StatelessWidget {
  const BefCardTitle(this.text, {super.key});
  final String text;

  @override
  Widget build(BuildContext context) =>
      Text(text, style: BefText.style(context, weight: FontWeight.w600, letterSpacing: -0.15));
}

class BefCardDescription extends StatelessWidget {
  const BefCardDescription(this.text, {super.key});
  final String text;

  @override
  Widget build(BuildContext context) =>
      Text(text, style: BefText.style(context, size: 13, color: context.bef.mutedForeground));
}

class BefCardContent extends StatelessWidget {
  const BefCardContent({super.key, required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) =>
      Padding(padding: const EdgeInsets.fromLTRB(20, 0, 20, 20), child: child);
}

class BefCardFooter extends StatelessWidget {
  const BefCardFooter({super.key, required this.children, this.alignment = MainAxisAlignment.start});
  final List<Widget> children;
  final MainAxisAlignment alignment;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: BoxDecoration(
        border: Border(top: BorderSide(color: context.bef.border)),
      ),
      child: Row(
        mainAxisAlignment: alignment,
        children: [
          for (var i = 0; i < children.length; i++) ...[if (i > 0) const SizedBox(width: 8), children[i]],
        ],
      ),
    );
  }
}
