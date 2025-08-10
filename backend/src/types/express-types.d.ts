import "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: string; // add whatever you store in session
  }
}
