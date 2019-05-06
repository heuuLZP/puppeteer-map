## 安装依赖

```
yarn install
```

## 下载 chromium
请到此 [chromium](https://download-chromium.appspot.com/) 下载，解压至项目根目录的 `chrome-mac` 目录中

如有需要，可在 `index.js` 中更换 chromium 路径
```
executablePath: './chrome-mac/Chromium.app/Contents/MacOS/Chromium'
```

## 启动项目

```
yarn start
```

## 必看配置项

请在 `data.js` 中填充相关数据：


说明： 仅针对小程序的成员管理

```
module.exports =  {
  account: "name", // 公众平台登录账号
  pwd: "password",  // 公众平台登录密码
  wechat: ['xxx', 'yyy'] // 需要添加的微信号
}
```