const msg = require('slackMessage');
const AWS = require('aws-sdk');
const error = require('error.js').error;
const DynamoDB = new AWS.DynamoDB.DocumentClient({
 region: "ap-northeast-1"
});

function getCountryIndexFromCodeName(cn)
{
    switch(cn)
    {
        case "GBR": return 1;
        case "DEU": return 2;
        case "RUS": return 3;
        case "TUR": return 4;
        case "AUT": return 5;
        case "ITA": return 6;
        case "FRA": return 7;
    }
    return 0;
}

function getAreaIndexFronAreaCodeName(an)
{
    switch(an)
    {
        case "ADS": return 101;
        case "AES": return 102;
        case "BAR": return 103;
        case "BAL": return 104;
        case "BLA": return 105;
        case "EMS": return 106;
        case "ENC": return 107;
        case "GOB": return 108;
        case "GOL": return 109;
        case "HEL": return 110;
        case "IOS": return 111;
        case "IRS": return 112;
        case "MAO": return 113;
        case "NAO": return 114;
        case "NTH": return 115;
        case "NWG": return 116;
        case "SKA": return 117;
        case "TYS": return 118;
        case "WMS": return 119;
        
        case "Alb": return 1;
        case "Ank": return 2;
        case "Apu": return 3;
        case "Arm": return 4;
        case "Bel": return 5;
        case "Ber": return 6;
        case "Boh": return 7;
        case "Bre": return 8;
        case "Bud": return 9;
        case "Bul": return 10;
        case "Bur": return 11;
        case "Cly": return 12;
        case "Con": return 13;
        case "Den": return 14;
        case "Edi": return 15;
        case "Fin": return 16;
        case "Gal": return 17;
        case "Gas": return 18;
        case "Gre": return 19;
        case "Hol": return 20;
        case "Kie": return 21;
        case "Liv": return 22;
        case "Lon": return 23;
        case "Lpl": return 24;
        case "Mar": return 25;
        case "Mos": return 26;
        case "Mun": return 27;
        case "NAf": return 28;
        case "Nap": return 29;
        case "Nor": return 30;
        case "Par": return 31;
        case "Pic": return 32;
        case "Pia": return 33;
        case "Por": return 34;
        case "Pru": return 35;
        case "Rom": return 36;
        case "Ruh": return 37;
        case "Rum": return 38;
        case "Ser": return 39;
        case "Sev": return 40;
        case "Sil": return 41;
        case "Smy": return 42;
        case "Spa": return 43;
        case "StP": return 44;
        case "Swe": return 45;
        case "Syr": return 46;
        case "Tri": return 47;
        case "Tun": return 48;
        case "Tus": return 49;
        case "Tyr": return 50;
        case "Ukr": return 51;
        case "Ven": return 52;
        case "Vie": return 53;
        case "Wal": return 54;
        case "War": return 55;
        case "Yor": return 56;
    }
}

async function getUser(userid)
{
    // queryの実行
    var user_data = await DynamoDB.query({
      TableName: "deplomacy_user", 
      KeyConditionExpression: "#ID = :ID",
      ExpressionAttributeNames: {"#ID": "UserId"},
      ExpressionAttributeValues: {":ID": userid }
    }).promise();
    
    if(!user_data) return null;
    //if(user_data.Items.Count != 0) return null;
    return user_data.Items[0];
}

async function getGame(gid)
{
    // queryの実行
    var game_data = await DynamoDB.query({
      TableName: "deplomacy_game", 
      KeyConditionExpression: "#ID = :ID",
      ExpressionAttributeNames: {"#ID": "GameId"},
      ExpressionAttributeValues: {":ID": gid }
    }).promise();
    
    if(!game_data) return null;
    //if(user_data.Items.Count != 0) return null;
    return game_data.Items[0];
}


async function updateGame(game)
{
    // queryの実行
    var result = await DynamoDB.put({
        TableName: "deplomacy_game", 
        Item: game
    }).promise();
}

exports.GetActiveRecord = async (uid) =>
{
    return await getUser(uid);
}

exports.NewGame = async (uid, params) =>
{
    if(!params[1]) return error.result_error(error.GlobalError);
    if(!params[2]) return error.result_error(error.GlobalError);
    if(!params[3]) return error.result_error(error.GlobalError);
    
    var date = new Date();
    var gid = date.getTime();
    
    var hookUri = params[1];
    var timer = params[2];
    var rule = params[3];

    // queryの実行
    var default_army = {
        1: { A:["Lpl"], F:["Lon","Edi"] },
        2: { A:["Ber","Mun"], F:["Kie"] },
        3: { A:["Mos","War"], F:["StP","Sev"] },
        4: { A:["Con","Smy"], F:["Ank"] },
        5: { A:["Vie","Bud"], F:["Tri"] },
        6: { A:["Rom","Ven"], F:["Nap"] },
        7: { A:["Par","Mar"], F:["Bre"] }
    }
    
    var result = await DynamoDB.put({
        TableName: "deplomacy_game", 
        Item: {
            GameId: gid,
            Status: "Pending",
            HostUser: uid,
            Rule: rule,
            TurnTimer: timer,
            Turn: 0,
            JoinCountry : [],
            Army : default_army,
            Users: [uid],
            Recent: []
        }
    }).promise();
    
    // queryの実行
    var result = await DynamoDB.put({
        TableName: "deplomacy_user", 
        Item: {
            UserId: uid,
            JoinGame: gid,
            IsHost: true,
            Acted: false
        }
    }).promise();
    
    //webhook
    await msg.sendMessage({"username":"God","text": "新しい戦争が始まったぞ:" + gid,"icon_emoji":":ghost:"});
    
    return {
        statusCode: 200,
        body: "新しいゲームを作成しました。"
    };
};

exports.GameStart = async (user) =>
{
    if(!user.IsHost)
    {
        return {
            statusCode: 500,
            body: "ホストではないのでゲームは始められません"
        };
    }
    
    var game = await getGame(user.JoinGame);
    if(!game)
    {
        return {
            statusCode: 500,
            body: "そのゲームは終了しました"
        };
    }
    if(game.Status != "Pendind")
    {
        return {
            statusCode: 500,
            body: "既にゲームは始まっています"
        };
    }
    
    // queryの実行
    var result = await DynamoDB.update({
        TableName: "deplomacy_game", 
        Key: { GameId : game.GameId },
        UpdateExpression: 'set #a = :val',
        ExpressionAttributeNames: {'#a' : 'Status'},
        ExpressionAttributeValues: { ':val' : "Voting" }
    }).promise();
    
    return {
        statusCode: 200,
        body: "ゲームが始まりました"
    };
}

exports.Shutdown = async (user) =>
{
    var game = await getGame(user.JoinGame);
    
    // queryの実行
    await DynamoDB.delete({
        TableName: "deplomacy_game", 
        Key: { GameId : game.GameId }
    }).promise();
    
    await DynamoDB.delete({
        TableName: "deplomacy_user", 
        Key: { UserId : user.UserId }
    }).promise();
    
    return {
        statusCode: 200,
        body: "歴史は闇に葬られた"
    };
}

exports.ActiveGameList = async () =>
{
    // queryの実行
    var game_data = await DynamoDB.scan({
      TableName: "deplomacy_game"
    }).promise();
    
    if(!game_data) return null;
    return {
        statusCode: 200,
        body: JSON.stringify(game_data)
    };
}

exports.Join = async (uid, param, uname) =>
{
    if(!param[1]) return error.result_error(error.GlobalError);
    
    var gid = Number(param[1]);
    var game = await getGame(gid);
    if(!game) return error.result_error("そのゲームは存在しないぞ");
    
    //ランダムなら空きを調べてそれを突っ込む
    var cidx = 0;
    if( game.CountryRule == "RND" )
    {
        cidx = Math.floor(Math.random() * 7 - game.JoinCountry.length) + 1;
    }else{
        cidx = getCountryIndexFromCodeName(param[2]);
    }

    // queryの実行
    var result = await DynamoDB.put({
        TableName: "deplomacy_user", 
        Item: {
            UserId: uid,
            Name: uname,
            JoinGame: gid,
            IsHost: false,
            Acted: false
        }
    }).promise();
    
    //webhook
    var res = await msg.sendMessage({"username":"God","text": uname + "がゲームに参加したぞ"});
    
    return {
        statusCode: 200,
        body: "参加を受け付けたぞ"
    };
}

exports.Command = async (user) =>
{
    var game = await getGame(user.JoinGame);
    
    //webhook
    //var res = await sendMessage({"username":"God","text": "指令を受け付けたぞ","icon_emoji":":ghost:"});
    
    return {
        statusCode: 200,
        body: "指令を受け付けました"
    };
}
