const { readFileSync } = require("fs");
const shell = require("shelljs");
const { differenceInDays, isBefore, addDays, format } = require("date-fns");
const { letters } = require("./letters");

const NUMBER_OF_COMMITS = 100;
const message = "BEN LEE!!";
const user = { name: "Ben Lee", email: "benlee.thatsme@gmail.com" };

if (!shell.which("git")) {
  shell.echo("Sorry, this script requires git");
  shell.exit(1);
}

const today = new Date();
const startingSunday = new Date(
  readFileSync(`${__dirname}/startingSunday.txt`, "utf-8")
);

if (isBefore(today, startingSunday)) {
  shell.echo(`Cycle starts again on ${format(startingSunday, "yyyy-MM-dd")}`);
  shell.exit(0);
}

shell.exec(`git config user.name "${user.name}"`);
shell.exec(`git config user.email "${user.email}"`);

const dayIndex = differenceInDays(today, startingSunday);
const commitsPerDay = [...message]
  .flatMap((letter) => letters[letter].flatMap((line) => [...line]))
  .map((item) => (item === "#" ? NUMBER_OF_COMMITS : 0));

if (dayIndex >= commitsPerDay.length) {
  const daysToNextSunday = 7 - today.getDay() || 7;
  const nextStartingSunday = addDays(new Date(today), daysToNextSunday);

  shell.echo(
    `Setting new starting sunday to ${format(nextStartingSunday, "yyyy-MM-dd")}`
  );
  shell.exec(
    `echo "${format(nextStartingSunday, "yyyy-MM-dd")}"  > startingSunday.txt`
  );
  shell.exec("git add .");
  shell.exec(`git commit -m 'setting next starting sunday'`);
  shell.exec("git push");
  shell.exit(0);
}

for (let i = 0; i < commitsPerDay[dayIndex]; i++) {
  const message = `commit #${i + 1} on ${format(today, "yyyy-MM-dd")}`;
  shell.exec(`echo "${message}" >> log.txt`);
  shell.exec("git add .");
  shell.exec(`git commit -m '${message}'`);
}

shell.exec("git push");
shell.echo(`Completed commits for today`);
