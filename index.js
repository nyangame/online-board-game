var error = require('error.js').error;
var url = require('url');

function result_error(msg)
{
    return {
        statusCode: 500,
        body: msg,
    };
}

async function command(param)
{
    if(!param) return result_error(error.GlobalError);
    if(!param.query) return result_error(error.GlobalError);
    
    var cmd = param.query.command;
    try
    {
        var prms = param.query.text.split(' ');
        if(!prms) return result_error(error.GlobalError);
        
        var exec_cmd = prms[0];
        if( !exec_cmd || exec_cmd == "" || exec_cmd == "Help" ) {
            var help = require('model' + cmd + '_help.js');
            return help.HelpCommand(prms);
        }
        
        var model = require('model' + cmd + '.js');
        var user = await model.GetActiveRecord(param.query.user_id);
        if(user)
        {
            //ゲームに所属しているユーザーが実行可能なコマンドのみを処理
            switch(exec_cmd)
            {
                case "Command":
                    return await model.Command(user, prms);
                    
                case "Contract":
                    return await model.Contract(user, prms);

                case "GameStart":
                    return await model.GameStart(user);
                    
                case "Leave":
                    return await model.Leave(user, user.GameId);
                    
                case "Shutdown":
                    return await model.Shutdown(user);
                    
                case "ActiveGame":
                    return await model.ActiveGameList();
                    
                case "Join":
                    return await model.Join(param.query.user_id, prms, param.query.user_name);
                    
                case "NewGame":
                    return result_error(error.AlreadyJoin);
            }
        }
        else
        {
            //新規ユーザとして扱う
            switch(prms[0])
            {
                case "NewGame":
                    return await model.NewGame(param.query.user_id, prms);
                    
                case "Join":
                    return await model.Join(param.query.user_id, prms, param.query.user_name);
                    
                case "ActiveGame":
                    return await model.ActiveGameList();

                case "GameStart":
                case "Command":
                case "Leave":
                    return result_error(error.GlobalError);
            }
        }
    }
    catch(ex)
    {
        return result_error(ex.message);
    }
}

exports.handler = async (event) => {
    var param = url.parse("http://example.com?" + event.body, true);
    return await command(param);
};
