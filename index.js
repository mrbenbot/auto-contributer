const { readFileSync } = require("fs");
const shell = require("shelljs");
const { differenceInDays, isBefore, addDays, format } = require("date-fns");
const { letters } = require("./letters");

if (!shell.which("git")) {
  shell.echo("Sorry, this script requires git");
  shell.exit(1);
}

const today = new Date();
const startingSunday = new Date(
  readFileSync(`${__dirname}/startingSunday.txt`, "utf-8")
);

if (isBefore(today, startingSunday)) {
  shell.echo("Not yet at next starting sunday");
  shell.exit(0);
}

shell.exec(`git config user.name "Ben Lee"`);
shell.exec(`git config user.email "benlee.thatsme@gmail.com"`);

const message = "BEN LEE";

const dayIndex = differenceInDays(today, startingSunday);
const commitsPerDay = [...message]
  .flatMap((letter) => letters[letter].flatMap((line) => [...line]))
  .map((item) => (item === "#" ? 10 : 0));

if (dayIndex >= commitsPerDay.length) {
  const daysToNextSunday = 7 - today.getDay() || 7;
  const nextStartingSunday = addDays(new Date(today), daysToNextSunday);

  shell.exec(
    `echo "${format(nextStartingSunday, "yyyy-MM-dd")}"  > startingSunday.txt`
  );
  shell.exec("git add .");
  shell.exec(`git commit -m 'setting next starting sunday'`);
  shell.exit(1);
}

// for (let i = 0; i < commitsPerDay[dayIndex]; i++) {
//   const message = `gh commit #${i + 1} on ${today.toLocaleString()}`;
//   shell.exec(`echo "${message}" >> log.txt`);
//   shell.exec("git add .");
//   shell.exec(`git commit -m '${message}'`);
// }

// shell.exec("git push");
