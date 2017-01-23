#!/usr/bin/env node

/*
  The shebang (#!) at the start means execute the script with what follows.
  /bin/env looks at your current node environment.
  Any argument to it not in a 'name=value' format is a command to execute.
*/

var command = require('commander');
var prompt = require('inquirer').prompt;
var chalk = require('chalk');
var cloud = require('./cloudClient');

var PASSWORD_MIN_LENGTH = 6;

var userArgs = process.argv.slice(2);

command
  .arguments('<file>')
  .option('-u, --username <username>', 'Enter username:')
  .action(file => prompt({message: 'Enter password:', validate: validator,
                          type: 'password', name: 'password'})
    .then(answer => cloud.upload(file, command.username, answer.password)
      .then(() => {
        console.log('File synced', file);
        process.exit(0);
      })
    )
    .catch(exitWithError)
  )
  .parse(process.argv);

function exitWithError(err) {
  console.error(chalk.red(err.message));
  process.exit(1);
}

function validator(value) {
  if (value.length < PASSWORD_MIN_LENGTH) {
    return ('Password should have length more than ' + PASSWORD_MIN_LENGTH);
  }
  return true;
};
