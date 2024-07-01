import chalk from 'chalk';
let join = chalk.dim('-');
let pad = (str,amt,clr) => (str.length < amt ? clr(str) + join.repeat(amt - str.length) : clr(str));
console.log(pad('Hello',10,chalk.green),
pad('Hello',10,chalk.green));