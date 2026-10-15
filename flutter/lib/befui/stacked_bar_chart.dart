import 'package:flutter/material.dart';

import 'core.dart';
import 'theme.dart';

class BefStackSeries {
  const BefStackSeries({required this.name, required this.data, this.color});
  final String name;
  final List<double> data;
  final Color? color;
}

/// Bars split into stacked segments, one series per colour, with a legend. Tap a bar to read its segments. [labels] name the bars.
class BefStackedBarChart extends StatefulWidget {
  const BefStackedBarChart({
    super.key,
    required this.series,
    required this.labels,
    this.height = 180,
    this.format,
  });
  final List<BefStackSeries> series;
  final List<String> labels;
  final double height;
  final String Function(double)? format;

  @override
  State<BefStackedBarChart> createState() => _BefStackedBarChartState();
}

class _BefStackedBarChartState extends State<BefStackedBarChart> {
  int? _sel;

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final palette = [c.primary, c.info, c.success, c.warning, c.destructive];
    final tones = [
      for (var i = 0; i < widget.series.length; i++) widget.series[i].color ?? palette[i % palette.length],
    ];
    final n = widget.labels.length;
    final sums = [
      for (var i = 0; i < n; i++)
        widget.series.fold<double>(0, (s, e) => s + (i < e.data.length ? e.data[i] : 0)),
    ];
    final top = sums.fold<double>(1, (m, v) => v > m ? v : m);
    final fmt = widget.format ?? (double v) => v.round().toString();
    final dur = befReduceMotion(context) ? Duration.zero : const Duration(milliseconds: 700);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          height: widget.height,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              for (var i = 0; i < n; i++)
                Expanded(
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () => setState(() => _sel = _sel == i ? null : i),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        if (_sel == i)
                          Padding(
                            padding: const EdgeInsets.only(bottom: 4),
                            child: Text(
                              fmt(sums[i]),
                              style: BefText.style(context, size: 11, weight: FontWeight.w600),
                            ),
                          ),
                        TweenAnimationBuilder<double>(
                          tween: Tween(end: sums[i] / top),
                          duration: dur,
                          curve: Curves.easeOutCubic,
                          builder: (context, t, _) => Container(
                            width: 28,
                            height: (widget.height - 28) * t,
                            clipBehavior: Clip.antiAlias,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(6),
                              border: _sel == i ? Border.all(color: c.foreground, width: 1.5) : null,
                            ),
                            child: Column(
                              verticalDirection: VerticalDirection.up,
                              children: [
                                for (var s = 0; s < widget.series.length; s++)
                                  if (i < widget.series[s].data.length && widget.series[s].data[i] > 0)
                                    Expanded(
                                      flex: (widget.series[s].data[i] * 1000).round(),
                                      child: Container(
                                        color: tones[s].withValues(
                                          alpha: _sel == null || _sel == i ? 1 : 0.4,
                                        ),
                                      ),
                                    ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          widget.labels[i],
                          style: BefText.style(context, size: 11, color: c.mutedForeground),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 16,
          runSpacing: 6,
          children: [
            for (var s = 0; s < widget.series.length; s++)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(color: tones[s], shape: BoxShape.circle),
                  ),
                  const SizedBox(width: 6),
                  Text(
                    widget.series[s].name + (_sel == null ? '' : '  ${fmt(widget.series[s].data[_sel!])}'),
                    style: BefText.style(context, size: 12, color: c.mutedForeground),
                  ),
                ],
              ),
          ],
        ),
      ],
    );
  }
}
