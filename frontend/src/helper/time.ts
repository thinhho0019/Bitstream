import { DateTime } from "luxon";

export function formatUTCToVN(utcString: string,type_return:number): string {
  return DateTime
    .fromISO(utcString, { zone: "utc" })
    .setZone("Asia/Ho_Chi_Minh")
    .toFormat(type_return == 1 ?"dd/MM/yyyy HH:mm:ss" : "HH:mm");
}
