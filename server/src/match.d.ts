type Board = (null | "X" | "O")[];
interface TTState {
    board: Board;
    players: string[];
    turn: number;
    finished: boolean;
    winner: null | "X" | "O" | "draw";
    moves: number;
}
export declare const matchInit: (ctx: any, logger: any, nk: any, params: any) => {
    state: TTState;
    tickRate: number;
    label: string;
};
export declare const matchJoinAttempt: (ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: TTState, presence: any) => boolean;
export declare const matchJoin: (ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: TTState, presences: any[]) => TTState;
export declare const matchLeave: (ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: TTState, presences: any[]) => TTState;
export declare const matchHandleState: (ctx: any, logger: any, nk: any, dispatcher: any, tick: number, state: TTState, sender: any, data: string) => TTState;
export {};
//# sourceMappingURL=match.d.ts.map