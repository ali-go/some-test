const nodemailer = require("nodemailer");

// 1.创建邮箱发送器
const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 465,
  secure: true,
  // 上面三个需要到node_modules => nodemailer => lib => well-know => services.json => 找需要发送的邮箱类型上的数据
  auth: {
    user: "1161653413@qq.com", // 发送方邮箱
    pass: "bflgnxmynmcbjgcf", // 表示授权码，需要去邮箱设置获取:打开QQ邮箱==>设置==>账户==>开启POP3/SMTP服务，然后根据提示发送短信之后，就可以获取到授权码了
  },
});

// 2.开始发送邮件
transporter.sendMail(
  {
    from: "1161653413@qq.com", //发送发邮箱
    to: "1522871797@qq.com", //收件人邮箱
    subject: "究极追杀令", //邮件标题
    text: "恭喜您成为一号究极追杀令的追杀对象，您的id是dhjhfjdh", //文本内容，和下面超文本内容的模板字符串二选一
    // html: `
		// <h1></h1>
		// <div>下面是超文本协议内容</div>
		// <span>哈哈哈</span>	
		// `, //超文本内容
  },
  (err, info) => {
    if (err) return console.log(err);
    console.log("发送成功：", info);
  }
);
