import 'package:flutter/material.dart';

import '../befui/code_block.dart';

Widget example(BuildContext context) => const BefCodeBlock(
  title: 'main.dart',
  lineNumbers: true,
  code: "void main() {\n  runApp(const MyApp());\n}\n",
);
