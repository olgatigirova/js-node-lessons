#!/usr/bin/env node

/*
  The shebang (#!) at the start means execute the script with what follows.
  /bin/env looks at your current node environment.
  Any argument to it not in a 'name=value' format is a command to execute.
*/

let command = require('commander');
let promptly = require('promptly');
let chalk = require('chalk');
let cloud = require('./cloudClient');
let co = require('co');

let PASSWORD_MIN_LENGTH = 6;


command
  .arguments('<file>')
  .option('-u, --username <username>', 'Enter username:')
  .action(file => co(commandAction(file, command.username))
    .then(() => {
      console.log('File synced', file);
      process.exit(0);
    })
    .catch(exitWithError)
  )
  .parse(process.argv);

function exitWithError(err) {
  console.error(chalk.red(err.message));
  process.exit(1);
}

function validator(value) {
  if (value.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Password should have length more than ${PASSWORD_MIN_LENGTH}`);
  }
  return value;
}

function* commandAction(file, username)
{
  let password = yield promptly.prompt('Enter password:', {validator: validator, silent: true});
  return cloud.upload(file, username, password)
}