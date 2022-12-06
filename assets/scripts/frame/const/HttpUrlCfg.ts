export interface HttpUrlConfig {
    url: string
    type: "work" | "gameWork" | "cashOut"
    requestType: "POST"| "GET"
    powerTest?
    powerRead?
}
export class HttpUrl {
    
    static getVersion: HttpUrlConfig = {            //获取用户数据版本-优先请求
        url: `/game/compound-ball/member-version`,
        type: "gameWork",
        requestType: "POST"
    }

    static config: HttpUrlConfig = {            //获取配置接口
        url: `/game/compound-ball/config`,
        type: "gameWork",
        requestType: "POST"
    }

    static configIndex: HttpUrlConfig = {      //首页
        url: `/game/compound-ball/index`,
        type: "gameWork",
        requestType: "POST"
    }

    static hecheng: HttpUrlConfig = {            //合成接口1、累积积分2、经验+1
        url: `/game/compound-ball/synthesis-of-the-ball`,
        type: "gameWork",
        requestType: "POST"
    }

    static redAward: HttpUrlConfig = {            //红包掉落奖励+翻倍返回
        url: `/game/compound-ball/hong-bao-drop-out-award`,
        type: "gameWork",
        requestType: "POST"
    }

    static lottery: HttpUrlConfig = {            //抽奖接口（积分满足）
        url: `/game/compound-ball/lottery`,
        type: "gameWork",
        requestType: "POST"
    }
    
    static cashOutRecord: HttpUrlConfig = {            //提现记录
        url: `/game/compound-ball/withdraw-record`,
        type: "gameWork",
        requestType: "GET"
    }

    static cashOutList: HttpUrlConfig = {            //提现列表
        url: `/v2/Withdraw/WithdrawList`,
        type: "cashOut",
        requestType: "GET"
    }

    static cashOutGetMoney: HttpUrlConfig = {       //提现申请
        url: `/v2/Withdraw/Withdraw`,
        type: "cashOut",
        requestType: "GET"
    }

    static doubleGet: HttpUrlConfig = {             //双倍领取
        url: `/api/application/multilpe`,
        type: "work",
        requestType: "POST"
    }

    static get2048: HttpUrlConfig = {               //合成2048球
        url: `/game/compound-ball/synthesis-of-ball-record`,
        type: "gameWork",
        requestType: "POST"
    }

    static getNextCashOut: HttpUrlConfig = {        //金额提示
        url: `/game/compound-ball/next-coin-tip`,
        type: "gameWork",
        requestType: "GET"
    }

    static setUserType: HttpUrlConfig = {        //设置用户特征
        url: `https://nb.qufenqian.vip/v2/Home/SetMemberFlag`,
        type: "gameWork",
        requestType: "POST",
        powerTest: "http://beta.qufenqian-webservice.web-application.sh.vipc.me/v2/Home/SetMemberFlag",
        powerRead: "https://nb.qufenqian.vip/v2/Home/SetMemberFlag",
    }

}


