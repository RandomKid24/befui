import 'dart:async';

import 'package:flutter/material.dart';

import 'button.dart';
import 'icons.dart';
import 'theme.dart';

String _fmt(int ms) {
  final m = ms ~/ 60000, s = (ms ~/ 1000) % 60, c = (ms ~/ 10) % 100;
  return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}.${c.toString().padLeft(2, '0')}';
}

/// Start, pause, lap and reset.
class BefStopwatch extends StatefulWidget {
  const BefStopwatch({super.key});

  @override
  State<BefStopwatch> createState() => _BefStopwatchState();
}

class _BefStopwatchState extends State<BefStopwatch> {
  final Stopwatch _sw = Stopwatch();
  Timer? _t;
  final List<int> _laps = [];

  void _toggle() {
    if (_sw.isRunning) {
      _sw.stop();
      _t?.cancel();
    } else {
      _sw.start();
      _t = Timer.periodic(const Duration(milliseconds: 33), (_) => setState(() {}));
    }
    setState(() {});
  }

  void _reset() {
    _sw
      ..stop()
      ..reset();
    _t?.cancel();
    setState(_laps.clear);
  }

  @override
  void dispose() {
    _t?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = context.bef;
    final ms = _sw.elapsedMilliseconds;
    return SizedBox(
      width: 256,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Semantics(
            liveRegion: false,
            label: 'Stopwatch',
            child: Text(
              _fmt(ms),
              style: BefText.style(
                context,
                size: 36,
                weight: FontWeight.w600,
                letterSpacing: -0.9,
                mono: true,
                height: 1.2,
              ).copyWith(fontFeatures: const [FontFeature.tabularFigures()]),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              BefButton(
                variant: _sw.isRunning ? BefButtonVariant.outline : BefButtonVariant.primary,
                leading: BefIcon(_sw.isRunning ? BefIcons.pause : BefIcons.play),
                label: _sw.isRunning ? 'Pause' : (ms > 0 ? 'Resume' : 'Start'),
                onPressed: _toggle,
              ),
              const SizedBox(width: 8),
              BefButton(
                label: 'Lap',
                variant: BefButtonVariant.outline,
                onPressed: _sw.isRunning ? () => setState(() => _laps.insert(0, ms)) : null,
              ),
              const SizedBox(width: 8),
              BefButton(
                size: BefButtonSize.icon,
                variant: BefButtonVariant.ghost,
                semanticLabel: 'Reset',
                onPressed: ms > 0 ? _reset : null,
                child: const BefIcon(BefIcons.refresh),
              ),
            ],
          ),
          if (_laps.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              constraints: const BoxConstraints(maxHeight: 128),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(BefRadius.lg),
                border: Border.all(color: c.border),
              ),
              clipBehavior: Clip.antiAlias,
              child: ListView.separated(
                shrinkWrap: true,
                padding: EdgeInsets.zero,
                itemCount: _laps.length,
                separatorBuilder: (_, _) => Divider(height: 1, color: c.border),
                itemBuilder: (context, i) => Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Lap ${_laps.length - i}',
                        style: BefText.style(context, color: c.mutedForeground),
                      ),
                      Text.rich(
                        TextSpan(
                          children: [
                            TextSpan(text: _fmt(_laps[i]), style: BefText.style(context, mono: true)),
                            if (i < _laps.length - 1)
                              TextSpan(
                                text: '  +${_fmt(_laps[i] - _laps[i + 1])}',
                                style: BefText.style(context, size: 12, color: c.mutedForeground),
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
