
exports.result_error = (msg) =>
{
    return {
        statusCode: 500,
        body: msg,
    };
}

exports.error = {
    GlobalError : "エラー： なんか通信がうまくいってなさそう。",
    GameNotFound : "エラー： そのゲームは未実装っぽい",
    AlreadyJoin : "エラー： 参加済み",
    CantAction : "エラー： その行動はできない"
};
