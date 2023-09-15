import { DateTime } from "luxon";

const timeFormats = {
  AR: {
    yearOffset: 387,
    Era: "AR",
    Months: {
      January: "Dynin",
      February: "Dursda",
      March: "Comin",
      April: "Drygal",
      May: "Balmont",
      June: "Stardan",
      July: "Erbin",
      August: "Mesthol",
      September: "Harpal",
      October: "Mynin",
      November: "Kester",
      December: "Lestlinth",
    },
    Weekdays: {
      Monday: "Firstday",
      Tuesday: "Fendmund",
      Wednesday: "Sordday",
      Thursday: "Midweek",
      Friday: "Breftund",
      Saturday: "Restday",
      Sunday: "Godsday",
    },
  },
};

const pr = new Intl.PluralRules("en-US", {
  type: "ordinal",
});
const suffixes = new Map([
  ["one", "st"],
  ["two", "nd"],
  ["few", "rd"],
  ["other", "th"],
]);

function formatOrdinals(n: number): string {
  const rule = pr.select(n);
  const suffix = suffixes.get(rule);
  return `${n}${suffix}`;
}

export function calculateYear(dateTime: DateTime, mode: "AR"): number {
  return dateTime.year + timeFormats[mode].yearOffset;
}

export function formatWorldDateTime(worldTime: DateTime, mode: "AR"): string {
  const format = timeFormats[mode];
  // convert to map to get TS to like indexing config
  const weekday = new Map(Object.entries(format.Weekdays)).get(
    worldTime.weekdayLong!,
  );
  const month = new Map(Object.entries(format.Months)).get(
    worldTime.monthLong!,
  );
  const year = calculateYear(worldTime, mode);
  const time = worldTime.toFormat("hh:mm:ss");
  const era = format.Era;
  const day = formatOrdinals(worldTime.day);
  return `${weekday}, ${day} of ${month}, ${year} ${era} (${time})`;
}

export function formatWorldTime(worldTime: DateTime): string {
  return worldTime.toLocaleString({ ...DateTime.TIME_24_SIMPLE });
}
