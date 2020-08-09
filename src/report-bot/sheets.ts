const fs = require("fs");
const readline = require("readline");
import { google } from "googleapis";
import { authorize } from "./auth";
import * as moment from "moment";
import { findLastIndex, uniq } from "lodash";

const credentials = require("../../credentials.json");

export interface Session {
  dm: string;
  date: string;
  players: string[];
  objective: string;
  reporter: string;
}

export function getSessions() {
  return new Promise<Session[]>((resolve, reject) => {
    authorize(credentials, (auth) => {
      const sheets = google.sheets({ version: "v4", auth });
      Promise.all([
        sheets.spreadsheets.values
          .get({
            spreadsheetId: "181biXBsTnyfzUyLGvt3C0_kUlF67H_qtRVOvD0nMFPI",
            range: "History!A:O",
          })
          .then((resp) => resp.data),
        sheets.spreadsheets.values
          .get({
            spreadsheetId: "181biXBsTnyfzUyLGvt3C0_kUlF67H_qtRVOvD0nMFPI",
            range: "Sheet1!A:O",
          })
          .then((resp) => resp.data),
      ])
        .then(([history, recent]) => [...history.values, ...recent.values])
        .then((rows) =>
          rows
            .filter((row) => row[0] || row[6] || row[12])
            .map((row) => ({
              dm: row[0],
              date: row[1].toString(),
              players: row.slice(6, 12).filter((name) => name !== ""),
              objective: row[12],
              reporter: row[13],
            }))
            .filter((session) => session.date !== "Date")
        )
        .then(resolve, reject);
    });
  });
}

export function getOverdueSessions(sessions: Session[]) {
  const unreportedSessions = sessions.filter((session) => !session.reporter);
  const lastIndex = findLastIndex(unreportedSessions, (session: Session) => {
    const today = moment().subtract(7, "days");
    const sessionDate = moment(session.date, "M/D");
    const difference = today.diff(sessionDate, "days");
    return difference > 0;
  });
  return unreportedSessions.slice(0, lastIndex + 1);
}

export function getPlayers(sessions: Session[]): string[] {
  return uniq(
    sessions
      .map((session) => session.players.map((player) => player.split(" ")[0]))
      .reduce((prev, next) => [...prev, ...next], [])
  );
}
