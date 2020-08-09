import { getSessions, getOverdueSessions, getPlayers } from "./sheets";

getSessions()
  .then(getOverdueSessions)
  .then(getPlayers)
  .then((p) => console.log(p));
