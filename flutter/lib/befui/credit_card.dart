import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'theme.dart';

enum BefCardTheme { primary, contrast, light }

/// Payment card preview that flips in 3D to show the CVV. Feed it the form values; it formats as you type. Tap to flip, or drive it with [flipped].
class BefCreditCard extends StatefulWidget {
  const BefCreditCard({
    super.key,
    this.number = '',
    this.name = '',
    this.expiry = '',
    this.cvv = '',
    this.mask = false,
    this.flipped,
    this.onFlip,
    this.theme = BefCardTheme.contrast,
    this.width = 320,
  });
  final String number, name, expiry, cvv;
  final bool mask;
  final bool? flipped;
  final ValueChanged<bool>? onFlip;
  final BefCardTheme theme;
  final double width;

  @override
  State<BefCreditCard> createState() => _BefCreditCardState();
}

class _BefCreditCardState extends State<BefCreditCard> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 600),
  );
  bool _own = false;

  bool get _back => widget.flipped ?? _own;

  @override
  void initState() {
    super.initState();
    _c.value = _back ? 1 : 0;
  }

  @override
  void didUpdateWidget(BefCreditCard old) {
    super.didUpdateWidget(old);
    _c.animateTo(_back ? 1 : 0, curve: Curves.easeInOut);
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  void _flip() {
    final next = !_back;
    setState(() => _own = next);
    _c.animateTo(next ? 1 : 0, curve: Curves.easeInOut);
    widget.onFlip?.call(next);
  }

  String get _brand {
    final d = widget.number.replaceAll(RegExp(r'\D'), '');
    if (d.startsWith('4')) return 'VISA';
    if (RegExp(r'^(5[1-5]|2[2-7])').hasMatch(d)) return 'Mastercard';
    if (RegExp(r'^3[47]').hasMatch(d)) return 'AMEX';
    if (RegExp(r'^(60|65|81|82)').hasMatch(d)) return 'RuPay';
    return '';
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final (bg, fg, border) = switch (widget.theme) {
      BefCardTheme.primary => (c.primary, c.primaryForeground, null),
      BefCardTheme.contrast => (c.foreground, c.background, null),
      BefCardTheme.light => (c.card, c.cardForeground, c.border),
    };
    final h = widget.width / 1.586;
    Widget face(Widget child) => Container(
      width: widget.width,
      height: h,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(BefRadius.xl + 4),
        border: border == null ? null : Border.all(color: border),
        boxShadow: BefShadow.md,
      ),
      child: DefaultTextStyle(
        style: BefText.style(context, color: fg),
        child: child,
      ),
    );

    final digits = widget.number.replaceAll(RegExp(r'\D'), '');
    final padded = digits.padRight(16, '•').substring(0, 16);
    var groups = [for (var i = 0; i < 16; i += 4) padded.substring(i, i + 4)];
    if (widget.mask) groups = [for (var i = 0; i < 4; i++) i < 3 ? '••••' : groups[i]];
    final mono = BefText.style(context, size: 18, mono: true, color: fg, letterSpacing: 1.5);
    final small = BefText.style(context, size: 10, color: fg.withValues(alpha: 0.7), letterSpacing: 0.8);

    final front = face(
      Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 36,
                height: 26,
                decoration: BoxDecoration(
                  color: fg.withValues(alpha: 0.25),
                  borderRadius: BorderRadius.circular(5),
                ),
              ),
              Text(
                _brand,
                style: BefText.style(context, weight: FontWeight.w700, color: fg, letterSpacing: 0.5),
              ),
            ],
          ),
          const Spacer(),
          Text(groups.join(' '), style: mono),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('CARDHOLDER', style: small),
                    Text(
                      widget.name.isEmpty ? 'YOUR NAME' : widget.name.toUpperCase(),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: BefText.style(context, size: 13, color: fg),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('EXPIRES', style: small),
                  Text(
                    widget.expiry.isEmpty ? 'MM/YY' : widget.expiry,
                    style: BefText.style(context, size: 13, mono: true, color: fg),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );

    final back = face(
      Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(
            height: 36,
            child: OverflowBox(
              minWidth: widget.width,
              maxWidth: widget.width,
              child: Container(color: fg.withValues(alpha: 0.85)),
            ),
          ),
          const SizedBox(height: 20),
          Align(
            alignment: Alignment.centerRight,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: fg.withValues(alpha: 0.9),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                widget.cvv.isEmpty ? '•••' : widget.cvv,
                style: BefText.style(context, mono: true, color: bg),
              ),
            ),
          ),
          const SizedBox(height: 4),
          Align(
            alignment: Alignment.centerRight,
            child: Text('CVV', style: small),
          ),
        ],
      ),
    );

    return Semantics(
      button: true,
      label: _back ? 'Card back, tap to flip' : 'Card front, tap to flip',
      child: GestureDetector(
        onTap: _flip,
        child: AnimatedBuilder(
          animation: _c,
          builder: (context, _) {
            final a = _c.value * math.pi;
            final showBack = a > math.pi / 2;
            return Transform(
              alignment: Alignment.center,
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.001)
                ..rotateY(a),
              child: showBack
                  ? Transform(alignment: Alignment.center, transform: Matrix4.rotationY(math.pi), child: back)
                  : front,
            );
          },
        ),
      ),
    );
  }
}
