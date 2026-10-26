// Small building blocks the other befui widgets share: a pressable surface with hover, press and keyboard focus states, and a focus ring.
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'theme.dart';

/// Builds the child for the current interaction [states] (hovered, focused, pressed, disabled).
typedef BefPressBuilder = Widget Function(BuildContext context, Set<WidgetState> states);

/// A tappable surface without Material's ink: it reports hover / press / focus and scales slightly while pressed, like `active:scale-(--press)` (0.97) in the CSS.
class BefPressable extends StatefulWidget {
  const BefPressable({
    super.key,
    required this.builder,
    this.onPressed,
    this.onLongPress,
    this.enabled = true,
    this.pressScale = 0.97,
    this.semanticLabel,
    this.focusNode,
    this.autofocus = false,
    this.cursor,
    this.semanticsRole = true,
  });

  final BefPressBuilder builder;
  final VoidCallback? onPressed;
  final VoidCallback? onLongPress;
  final bool enabled;
  final double pressScale;
  final String? semanticLabel;
  final FocusNode? focusNode;
  final bool autofocus;
  final MouseCursor? cursor;

  /// Marks the surface as a button for screen readers. Turn off when a parent already provides the semantics (a checkbox row, a tab).
  final bool semanticsRole;

  @override
  State<BefPressable> createState() => _BefPressableState();
}

class _BefPressableState extends State<BefPressable> {
  bool _hover = false, _focus = false, _down = false;

  bool get _active => widget.enabled && (widget.onPressed != null || widget.onLongPress != null);

  @override
  Widget build(BuildContext context) {
    final states = <WidgetState>{
      if (!_active) WidgetState.disabled,
      if (_hover && _active) WidgetState.hovered,
      if (_focus && _active) WidgetState.focused,
      if (_down && _active) WidgetState.pressed,
    };
    Widget child = AnimatedScale(
      scale: _down && _active ? widget.pressScale : 1,
      duration: const Duration(milliseconds: 120),
      curve: Curves.easeOut,
      child: widget.builder(context, states),
    );
    child = GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTapDown: _active ? (_) => setState(() => _down = true) : null,
      onTapUp: _active ? (_) => setState(() => _down = false) : null,
      onTapCancel: _active ? () => setState(() => _down = false) : null,
      onTap: _active ? widget.onPressed : null,
      onLongPress: _active ? widget.onLongPress : null,
      child: child,
    );
    child = FocusableActionDetector(
      enabled: _active,
      focusNode: widget.focusNode,
      autofocus: widget.autofocus,
      mouseCursor: widget.cursor ?? (_active ? SystemMouseCursors.click : SystemMouseCursors.basic),
      onShowHoverHighlight: (v) => setState(() => _hover = v),
      onShowFocusHighlight: (v) => setState(() => _focus = v),
      actions: {
        ActivateIntent: CallbackAction<ActivateIntent>(
          onInvoke: (_) {
            widget.onPressed?.call();
            return null;
          },
        ),
      },
      shortcuts: const {
        SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
        SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
      },
      child: child,
    );
    if (widget.semanticsRole) {
      child = Semantics(
        button: true,
        enabled: _active,
        label: widget.semanticLabel,
        onTap: _active ? widget.onPressed : null,
        child: child,
      );
    }
    return child;
  }
}

/// The focus ring the CSS draws: `ring-2 ring-ring/50 ring-offset-2 ring-offset-background`.
List<BoxShadow> befFocusRing(BuildContext context) {
  final c = context.bef;
  return [
    BoxShadow(color: c.background, spreadRadius: 2),
    BoxShadow(color: c.ring.withValues(alpha: 0.5), spreadRadius: 4),
  ];
}

/// Spins its child forever (the `animate-spin` of the CSS).
class BefSpin extends StatefulWidget {
  const BefSpin({super.key, required this.child, this.duration = const Duration(seconds: 1)});
  final Widget child;
  final Duration duration;

  @override
  State<BefSpin> createState() => _BefSpinState();
}

class _BefSpinState extends State<BefSpin> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: widget.duration)..repeat();

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => RotationTransition(turns: _c, child: widget.child);
}

/// Colour with an opacity, the `bg-primary/90` of the CSS.
Color befOpacity(Color c, double opacity) => c.withValues(alpha: opacity);

/// Whether animations should be skipped (the `prefers-reduced-motion` of the CSS).
bool befReduceMotion(BuildContext context) => MediaQuery.maybeDisableAnimationsOf(context) ?? false;

/// A dashed rounded border (`border-dashed`), which Flutter has no built-in for.
class BefDashedBorder extends StatelessWidget {
  const BefDashedBorder({
    super.key,
    required this.child,
    this.color,
    this.radius = BefRadius.xl,
    this.dash = 4,
    this.gap = 3,
    this.strokeWidth = 1,
  });
  final Widget child;
  final Color? color;
  final double radius, dash, gap, strokeWidth;

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: _DashedPainter(color ?? context.bef.border, radius, dash, gap, strokeWidth),
      child: child,
    );
  }
}

class _DashedPainter extends CustomPainter {
  _DashedPainter(this.color, this.radius, this.dash, this.gap, this.width);
  final Color color;
  final double radius, dash, gap, width;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = width;
    final path = Path()
      ..addRRect(RRect.fromRectAndRadius((Offset.zero & size).deflate(width / 2), Radius.circular(radius)));
    for (final m in path.computeMetrics()) {
      for (var d = 0.0; d < m.length; d += dash + gap) {
        canvas.drawPath(m.extractPath(d, (d + dash).clamp(0, m.length)), paint);
      }
    }
  }

  @override
  bool shouldRepaint(_DashedPainter old) => old.color != color || old.radius != radius;
}

/// Control height steps, like `data-density` on the web. Wrap a subtree in [BefDensityScope] and buttons follow.
enum BefDensity {
  compact(-4),
  standard(0),
  comfortable(4);

  const BefDensity(this.delta);

  /// Added to a control's standard height, in logical pixels.
  final double delta;

  static BefDensity of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<BefDensityScope>()?.density ?? BefDensity.standard;
}

class BefDensityScope extends InheritedWidget {
  const BefDensityScope({super.key, required this.density, required super.child});
  final BefDensity density;

  @override
  bool updateShouldNotify(BefDensityScope old) => old.density != density;
}
