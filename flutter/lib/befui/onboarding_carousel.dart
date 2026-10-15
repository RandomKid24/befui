import 'package:flutter/material.dart';

import 'button.dart';
import 'theme.dart';

class BefOnboardingSlide {
  const BefOnboardingSlide({required this.title, required this.description, this.visual});
  final String title, description;

  /// Illustration area: an icon, image or any widget.
  final Widget? visual;
}

/// First-run intro: swipe (or tap Next) through full-width slides with a dot indicator, Skip, and a final Get started button. Give it a height or put it in an Expanded.
class BefOnboardingCarousel extends StatefulWidget {
  const BefOnboardingCarousel({
    super.key,
    required this.slides,
    this.onFinish,
    this.onSkip,
    this.finishLabel = 'Get started',
  });
  final List<BefOnboardingSlide> slides;
  final VoidCallback? onFinish, onSkip;
  final String finishLabel;

  @override
  State<BefOnboardingCarousel> createState() => _BefOnboardingCarouselState();
}

class _BefOnboardingCarouselState extends State<BefOnboardingCarousel> {
  final _page = PageController();
  int _i = 0;

  @override
  void dispose() {
    _page.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final last = _i == widget.slides.length - 1;
    return Column(
      children: [
        Align(
          alignment: Alignment.centerRight,
          child: Opacity(
            opacity: last ? 0 : 1,
            child: BefButton(
              label: 'Skip',
              variant: BefButtonVariant.ghost,
              size: BefButtonSize.sm,
              onPressed: last ? null : widget.onSkip,
            ),
          ),
        ),
        Expanded(
          child: PageView(
            controller: _page,
            onPageChanged: (n) => setState(() => _i = n),
            children: [
              for (final s in widget.slides)
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (s.visual != null)
                        Container(
                          width: 112,
                          height: 112,
                          decoration: BoxDecoration(
                            color: c.primary.withValues(alpha: 0.1),
                            shape: BoxShape.circle,
                          ),
                          child: Center(
                            child: IconTheme(
                              data: IconThemeData(color: c.primary, size: 48),
                              child: s.visual!,
                            ),
                          ),
                        ),
                      const SizedBox(height: 24),
                      Text(
                        s.title,
                        textAlign: TextAlign.center,
                        style: BefText.style(context, size: 20, weight: FontWeight.w600, letterSpacing: -0.3),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        s.description,
                        textAlign: TextAlign.center,
                        style: BefText.style(context, color: c.mutedForeground, height: 1.5),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            for (var n = 0; n < widget.slides.length; n++)
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.symmetric(horizontal: 3),
                width: n == _i ? 20 : 6,
                height: 6,
                decoration: BoxDecoration(
                  color: n == _i ? c.primary : c.border,
                  borderRadius: BorderRadius.circular(BefRadius.full),
                ),
              ),
          ],
        ),
        const SizedBox(height: 20),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: BefButton(
            label: last ? widget.finishLabel : 'Next',
            expand: true,
            size: BefButtonSize.lg,
            onPressed: () => last
                ? widget.onFinish?.call()
                : _page.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeOut),
          ),
        ),
      ],
    );
  }
}
