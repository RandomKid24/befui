import 'package:flutter/material.dart';

import 'theme.dart';

/// Swipeable pages with a dot indicator (the active dot stretches). Give every slide the same height with [height].
class BefCarousel extends StatefulWidget {
  const BefCarousel({super.key, required this.children, this.height = 180, this.onChanged});
  final List<Widget> children;
  final double height;
  final ValueChanged<int>? onChanged;

  @override
  State<BefCarousel> createState() => _BefCarouselState();
}

class _BefCarouselState extends State<BefCarousel> {
  final _controller = PageController();
  int _i = 0;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          height: widget.height,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(BefRadius.xl),
            child: PageView(
              controller: _controller,
              onPageChanged: (n) {
                setState(() => _i = n);
                widget.onChanged?.call(n);
              },
              children: widget.children,
            ),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            for (var n = 0; n < widget.children.length; n++)
              GestureDetector(
                onTap: () => _controller.animateToPage(
                  n,
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeOut,
                ),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: n == _i ? 20 : 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: n == _i ? c.primary : c.border,
                    borderRadius: BorderRadius.circular(BefRadius.full),
                  ),
                ),
              ),
          ],
        ),
      ],
    );
  }
}
