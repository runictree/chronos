export interface User {
  /**
   * Internal ID
   */
  id: number,

  /**
   * Permission Token
   */
  permissionToken: number,

  /**
   * Password for verification
   */
  password?: string,

  /**
   * User's name
   */
  name?: string,

  /**
   * Card ID
   */
  cardNo?: number,

  /**
   * User's group
   */
  groupNo: number,

  /**
   * Timezone Flag
   */
  tzFlag: number,

  /**
   * Timezone 1
   */
  tz1: number,

  /**
   * Timezone 2
   */
  tz2: number,

  /**
   * Timezone 3
   */
  tz3: number,

  /**
   * User ID
   *
   * Input via Add User in the device menu
   */
  userId?: string
}
