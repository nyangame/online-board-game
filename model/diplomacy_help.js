exports.HelpCommand = function(params)
{
    var help = "/diplomacy ";
    var cmd = params[1];
    switch(cmd)
    {
        default:
            help = "[ActiveGame/NewGame/GameStart/Shutdown/Join/Leave/Command/Contract/Help] がコマンドとして使用できます。\n/diplomacy Help [コマンド名]で使い方を確認できます。";
            break;
        
        case "ActiveGame" :
            help = "ActiveGame (オプションなし)\n\n";
            help +="参加受付中のゲームを検索します";
            break;
        
        case "NewGame" :
            help = "NewGame [Webhook URL] [ターン進行にかかる分数。0でに手動進行になります。] [ターン数(省略で20)]\n\n";
            help +="新しくゲームを開始します。\n";
            help +="Webhook URLはSlackのオプションから確認できます。";
            break;
        
        case "Shutdown" :
            help = "Shutdown\n\n";
            help +="ゲームを放棄し、敗北します。";
            break;
        
        case "Country" :
            help = "[国家コード]\n\n";
            help +="　　ランダム RND\n";
            help +="　　イギリス GBR\n";
            help +="　　　ドイツ DEU\n";
            help +="　　　ロシア RUS\n";
            help +="　　　トルコ TUR\n";
            help +="オーストリア AUT\n";
            help +="　　イタリア ITA\n";
            help +="　　フランス FRA\n";
            break;
        
        case "Area" :
            help = "[地域コード]\n\n";
            help +="[海域]\n";
            help +="ADS アドリア海\n";
            help +="AES エーゲ海\n";
            help +="BAR バレンツ海\n";
            help +="BAL バルト海\n";
            help +="BLA 黒海\n";
            help +="EMS 東地中海\n";
            help +="ENC イギリス海峡\n";
            help +="GOB ボスニア湾\n";
            help +="GOL リオン湾\n";
            help +="HEL ヘルゴラント湾\n";
            help +="IOS イオニア海\n";
            help +="IRS アイリッシュ海\n";
            help +="MAO 中大西洋\n";
            help +="NAO 北大西洋\n";
            help +="NTH 北海\n";
            help +="NWG ノルウェー海\n";
            help +="SKA スカゲラク海峡\n";
            help +="TYS ティレニア海\n";
            help +="WMS 西地中海\n";
            help +="[陸地]\n";
            help +="Alb アルバニア\n";
            help +="Ank アンカラ\n";
            help +="Apu アプリア\n";
            help +="Arm アルメニア\n";
            help +="Bel ベルギー\n";
            help +="Ber ベルリン\n";
            help +="Boh ボヘミア\n";
            help +="Bre ブレスト\n";
            help +="Bud ブダペスト\n";
            help +="Bul ブルガリア\n";
            help +="Bur ブルゴーニュ\n";
            help +="Cly クライド\n";
            help +="Con コンスタンティノープル\n";
            help +="Den デンマーク\n";
            help +="Edi エディンバラ\n";
            help +="Fin フィンランド\n";
            help +="Gal ガリツィア\n";
            help +="Gas ガスコーニュ\n";
            help +="Gre ギリシア\n";
            help +="Hol オランダ\n";
            help +="Kie キール\n";
            help +="Liv リヴォニア\n";
            help +="Lon ロンドン\n";
            help +="Lpl リヴァプール\n";
            help +="Mar マルセイユ\n";
            help +="Mos モスクワ\n";
            help +="Mun ミュンヘン\n";
            help +="NAf 北アフリカ\n";
            help +="Nap ナポリ\n";
            help +="Nor ノルウェー\n";
            help +="Par パリ\n";
            help +="Pic ピカルディ\n";
            help +="Pia ピエモンテ\n";
            help +="Por ポルトガル\n";
            help +="Pru プロイセン\n";
            help +="Rom ローマ\n";
            help +="Ruh ルール\n";
            help +="Rum ルーマニア\n";
            help +="Ser セルビア\n";
            help +="Sev セヴァストポリ\n";
            help +="Sil シレジア\n";
            help +="Smy スミルナ\n";
            help +="Spa スペイン\n";
            help +="StP サンクトペテルブルク\n";
            help +="Swe スウェーデン\n";
            help +="Syr シリア\n";
            help +="Tri トリエステ\n";
            help +="Tun チュニス\n";
            help +="Tus トスカーナ\n";
            help +="Tyr ティロル\n";
            help +="Ukr ウクライナ\n";
            help +="Ven ヴェネツィア\n";
            help +="Vie ウィーン\n";
            help +="Wal ウェールズ\n";
            help +="War ワルシャワ\n";
            help +="Yor ヨークシャー\n";
            break;
        
        case "Join" :
            help = "Join [GameID] [国]\n\n";
            help +="ゲームを放棄し、敗北します。";
            break;
        
        case "GameStart" :
            help = "GameStart";
            break;
    }
    
    return {
        statusCode: 200,
        body: help
    };
}
