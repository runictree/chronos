export interface User {
  id: number,
  permissionToken: number,
  password?: string,
  name?: string,
  cardNo?: number,
  groupNo: number,
  tzFlag: number,
  tz1: number,
  tz2: number,
  tz3: number,
  userId?: string
}
