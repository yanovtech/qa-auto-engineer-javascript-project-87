#!/usr/bin/env node
import { Command } from 'commander'
import gendiff from '../src/genDiff.js'

const program = new Command()

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2, options) => {
    const result = gendiff(filepath1, filepath2, options.format)
    console.log(result)
  })

program.parse()
