import 'package:flutter/material.dart';

import '../befui/timer.dart';
import '../befui/toast.dart';

Widget example(BuildContext context) => BefTimer(onDone: () => BefToast.success(context, 'Time is up'));
