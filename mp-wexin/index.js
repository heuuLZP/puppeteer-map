const puppeteer = require('puppeteer');
const Data = require('./data.js');


// 拦截响应
function getResponse(page, url) {
  return new Promise((resolve) => {
      page.on('request', request => {
        // 只监听 和 url 相关的请求
        if (request.url().includes(url)) {
          page.on('response', response => {
            const req = response.request();
            // 只监听和 url 相关的响应
            if (req.url().includes(url)) {
              if (response.status() === 200) {
                resolve()
              }
            }
          });
          request.continue();
        } else { // 其他请求
          request.continue();
        }
      });
  }).catch();
}

// 主程序开始
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: './chrome-mac/Chromium.app/Contents/MacOS/Chromium'
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800
  });
  
  // 打开微信公众平台
  await page.goto('https://mp.weixin.qq.com/', {waitUntil: 'domcontentloaded'});

  // 表单输入
  await page.type('input[name="account"]', Data.account, {
    delay: 0
  });
  await page.type('input[name="password"]', Data.pwd, {
    delay: 0
  });

  await page.waitFor(100);

  // 登录
  await page.click('.btn_login', {
      delay: 0
  });

  let token;

  // 遍历判断是否二维码扫描成功
  while (true) {
    await page.waitForNavigation({
      waitUntil: 'load'
    })
    const url = page.url();
    if (url.includes('https://mp.weixin.qq.com/wxopen/initprofile?action=home')) {
      token = url.split("token=")[1];
      console.log('登录成功:', token);
      break;
    }
  }

  // 跳转到成员管理
  await page.goto(`https://mp.weixin.qq.com/wxopen/authprofile?action=index&use_role=1&token=${token}&lang=zh_CN`, {waitUntil: 'domcontentloaded'});


  let count = 0;
  while (true) {
    // 跳转到添加成员
    await page.goto(`https://mp.weixin.qq.com/wxopen/authprofile?action=search_index&lang=zh_CN&token=${token}&use_role=1`, {waitUntil: 'domcontentloaded'});

    await page.waitFor(200);
    
    // 输入要添加的微信
    await page.type('.frm_input.js_search_input', Data.wechat[count], {
      delay: 0
    });

    await page.waitFor(100);

    // 搜索微信号
    await page.click('.frm_input_append.js_search_btn', {
      delay: 0
    });

    await page.waitFor(300);

    // 运营者权限
    await page.click('label[for="checkbox1"]', {
      delay: 0
    });
    // 开发者权限
    await page.click('label[for="checkbox2"]', {
      delay: 0
    });
    await page.waitFor(100);

    // 确认添加
    await page.click('.btn.btn_primary.js_add', {
      delay: 0
    });

    await page.setRequestInterception(true);
    const res = getResponse(page, 'mp.weixin.qq.com/wxopen/waqrcode?action=ask');
    res.then(async () => {
      await page.click('.btn.btn_primary.js_btn', {
        delay: 0
      });
    })
    
    await page.waitForNavigation({
      waitUntil: 'load'
    })

    count++;

    if (count >= Data.wechat.length) {
      break;
    }
  }

  // 关闭浏览器
  // await browser.close();

})();