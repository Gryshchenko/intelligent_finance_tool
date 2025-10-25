import Utils from "tenpercent/shared/src/Utils"

export class QueryUtils {
  static buildCursorString(cursor: number): string {
    if (Utils.greaterThen0(cursor)) {
      return
    }
    return ""
  }
}
