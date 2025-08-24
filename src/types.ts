export type SportsId = number;

export type Sport = {

  id: SportsId;
  name: string;
};

export type Match = {
  id: number;
  stage?: string | null;
  team_a?: string | null;
  team_b?: string | null;
  start_date?: string | null; // ISO
  venue?: string | null;
  status?: string | null;
};

export type Tournament = {
  id: number;
  name: string;
  sport_name?: string;
  tournament_img_url?: string | null;
  level?: "domestic" | "international" | "national" | string | null;
  start_date: string; 
  end_date?: string | null;
  matches?: Match[];
};

export type GroupedTournamentResponse = {
  status: "success";
  msg: string;
  err: null | string;
  data: Array<{
    sport_id: SportsId;
    sport_name: string;
    tournaments: Tournament[];
  }>;
};
