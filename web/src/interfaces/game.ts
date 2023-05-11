export interface Vector {
  x: number;
  y: number;
}

export interface Players {
  left: number;
  right: number;
}

export interface PlayerMovement {
  isMovement: boolean;
  direction: 'up' | 'down';
}

export type GameMode = 'pvp' | 'pve' | 'online';
export type PlayerType = 'left' | 'right' | 'spectator';
export type AudioPong = 'paddle' | 'point';


export interface GamePlayer {
	login: string;
	username: string;
	avatar: string;
	avatar42: string;
	coallition: string;
	icon: string;
	color: string;
  }
  export interface GameData {
	id: string;
	players: GamePlayer[];
  }