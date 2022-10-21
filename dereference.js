#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var $RefParser = require('json-schema-ref-parser');
var argv = require('minimist')(process.argv.slice(2));

if (!argv.s || !argv.o) {
  console.log('USAGE: ' + process.argv[1] + ' -s <schema> -o <output> [...]');
  process.exit(1);
}

var input = path.resolve(argv.s.trim());
var output = path.resolve(argv.o.trim());
var directory = path.dirname(output);

if (!output.endsWith('.json')) {
  output = `${output}.json`;
}

(async () => {
  try {
    console.log("Dereferencing schema: " + input);
    var schema = await $RefParser.bundle(input);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    fs.writeFileSync(output, JSON.stringify(schema, null, 4), { encoding: 'utf-8' });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();