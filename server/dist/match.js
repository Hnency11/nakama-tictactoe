"use strict";
// server/src/match.ts
// Minimal authoritative Tic-Tac-Toe match handler for Nakama (TypeScript).
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchHandleState = exports.matchLeave = exports.matchJoin = exports.matchJoinAttempt = exports.matchInit = void 0;
const matchInit = function (ctx, logger, nk, params) {
    logger.debug("TicTacToe matchInit");
    const state = {
        board: Array(9).fill(null),
        players: [],
        turn: 0,
        finished: false,
        winner: null,
        moves: 0,
    };
    return { state, tickRate: 5, label: "tictactoe" };
};
exports.matchInit = matchInit;
const matchJoinAttempt = function (ctx, logger, nk, dispatcher, tick, state, presence) {
    if (state.players.length >= 2) {
        logger.debug("Room full");
        return false;
    }
    return true;
};
exports.matchJoinAttempt = matchJoinAttempt;
const matchJoin = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    for (const p of presences) {
        if (!state.players.includes(p.user_id)) {
            state.players.push(p.user_id);
        }
    }
    if (state.players.length === 2) {
        dispatcher.broadcastMessage(1, JSON.stringify({
            op: "start",
            players: state.players,
            turn: state.turn,
            board: state.board
        }));
    }
    else {
        dispatcher.broadcastMessage(1, JSON.stringify({
            op: "waiting",
            players: state.players.length
        }));
    }
    return state;
};
exports.matchJoin = matchJoin;
const matchLeave = function (ctx, logger, nk, dispatcher, tick, state, presences) {
    for (const p of presences) {
        const idx = state.players.indexOf(p.user_id);
        if (idx !== -1)
            state.players.splice(idx, 1);
    }
    if (!state.finished && state.players.length < 2 && state.moves > 0) {
        state.finished = true;
        state.winner = "draw";
        dispatcher.broadcastMessage(1, JSON.stringify({ op: "left", state }));
    }
    return state;
};
exports.matchLeave = matchLeave;
function checkWin(board) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.every(c => c !== null))
        return "draw";
    return null;
}
const matchHandleState = function (ctx, logger, nk, dispatcher, tick, state, sender, data) {
    let msg;
    try {
        msg = JSON.parse(data);
    }
    catch {
        return state;
    }
    if (state.finished)
        return state;
    if (msg.op === "move") {
        const index = msg.index;
        const playerId = sender.userId || sender.user_id;
        const expectedPlayer = state.players[state.turn];
        if (playerId !== expectedPlayer) {
            dispatcher.sendToPresence(sender, 1, JSON.stringify({ op: "error", reason: "not your turn" }));
            return state;
        }
        if (index < 0 || index > 8 || state.board[index] !== null) {
            dispatcher.sendToPresence(sender, 1, JSON.stringify({ op: "error", reason: "invalid move" }));
            return state;
        }
        const mark = state.turn === 0 ? "X" : "O";
        state.board[index] = mark;
        state.moves++;
        const result = checkWin(state.board);
        if (result) {
            state.finished = true;
            state.winner = result === "draw" ? "draw" : result;
        }
        else {
            state.turn = 1 - state.turn;
        }
        dispatcher.broadcastMessage(1, JSON.stringify({ op: "state", state }));
    }
    return state;
};
exports.matchHandleState = matchHandleState;
