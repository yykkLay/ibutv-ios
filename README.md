# ibutv 兼容扩展（iOS Safari Web Extension）

这是一个**可以自己签名安装到 iPhone 的 Safari 网页扩展**的完整 Xcode 工程。
它替代的是桌面版 xstree 插件中**能在 Safari 里实现的那部分**。

---

## ⚠️ 先看清楚：它能做什么、不能做什么

| 功能 | 原桌面插件（xstree） | 本扩展 |
| --- | --- | --- |
| 在 ibutv 页面补发"扩展已就绪"信号，解除"需要安装插件"提示 | ✅（靠后台与服务器通信触发） | ✅（直接补发，不需服务器） |
| 在 B 站／芒果／优酷等播放页提供"用 ibutv 播放"跳转入口 | ✅（自动跳转） | ✅（右下角按钮，手动点） |
| 用调试器（debugger）嗅探真实视频流地址 | ✅ | ❌ Safari 没有这个 API |
| 修改网络请求头（防盗链 / User-Agent） | ✅ | ❌ Safari 已取消 webRequest |
| 连接 ibutv 的授权服务器、领取解析规则 | ✅ | ❌ 服务器只授权官方客户端，无法复制 |
| 用你的登录 Cookie 替服务器去官方站取流 | ✅ | ❌ 不做，也不应该做 |

**一句话：这个扩展能解决"网站以为你没装插件"的问题，但解决不了"服务器要求插件取流"的问题。**
如果那些资源在服务器端硬性要求插件，本扩展也播不了——这一点必须提前知道。

---

## 你没有 Mac，所以走这条路

```
你的 Windows 电脑                          云端（免费）                 你的 iPhone
─────────────────                       ──────────────              ──────────────
1. 把本工程上传到 GitHub  ──►  2. GitHub Actions 的 macOS
                                 机器自动编译
                                        │
                                 3. 产出未签名的 ipa
                                        │
4. 下载 ipa 到 Windows  ◄───────────────┘
        │
5. 用 Sideloadly 配你的 Apple ID 签名 ──────────────────────►  6. 装进 iPhone
                                                                     │
                                                            7. 设置里启用扩展
```

全程不需要 Mac、不需要买开发者账号（$99）。
代价：用免费 Apple ID 签的名**每 7 天过期一次**，到期重做第 5 步即可。

---

## 两种做法，选一种

| | 做法 A（你几乎不用动手） | 做法 B（不用给任何凭据） |
| --- | --- | --- |
| 怎么做 | 运行我准备好的脚本 `E:\Harness\deploy-to-github.ps1`，它用你的 GitHub 令牌**自动**建仓库、上传、跑云端编译、把 ipa 下载到 `E:\Harness\build-output` | 按下面第一步、第二步，自己在 GitHub 网页上操作 |
| 你要提供 | 一个 GitHub 令牌（用完即可删除） | 无 |
| 你要做的 | 只有最后签名安装那一步 | 上传 + 点运行 + 下载 |

两种做法之后都要走**第三、四步（签名安装）**——那两步必须你本人操作，原因是苹果要求用**你的** Apple ID 签名，并且要在**你的**手机上点"信任"。

---


## 第一步：把工程传到 GitHub

1. 注册/登录 <https://github.com>（免费）。
2. 右上角 **+ → New repository**，名字随意（例如 `ibutv-ios`），
   可见性选 **Public**（Public 仓库的 macOS 编译时长免费），点 **Create repository**。
3. 在新仓库页面点 **Add file → Upload files**。
4. 打开你电脑上的 `xstree-ios` 文件夹，**把里面的所有文件和文件夹全选，拖进浏览器上传区**
   （要包含 `App`、`Extension`、`scripts`、`.github`、`project.yml` 这些，注意别把外层文件夹本身也拖进去）。
5. 拉到底点 **Commit changes**。

> 如果 `.github/workflows/build.yml` 没上传成功（有时隐藏文件夹会被忽略），
> 就在仓库里点 **Add file → Create new file**，文件名填 `.github/workflows/build.yml`，
> 把本地那个文件的内容整段粘进去，再提交。

---

## 第二步：让云端帮你编译

1. 打开仓库顶部的 **Actions** 标签页。
2. 左侧选 **Build unsigned iOS IPA**，右边点 **Run workflow → Run workflow**。
3. 等 3～6 分钟，出现绿色对勾表示成功。
4. 点进这次运行，页面底部 **Artifacts** 里下载 **XstreeIOS-unsigned-ipa**（是个 zip，解压得到 `XstreeIOS-unsigned.ipa`）。

> 如果红了（失败），把失败步骤的日志展开截图发我，我来改工程。
> 我这边是 Windows，没法预先编译验证，所以第一次可能需要修一两处。

---

## 第三步：在 Windows 上签名并装进 iPhone

1. 电脑上装好 **iTunes**（微软商店版即可，Sideloadly 需要它提供的驱动）。
2. 下载 **Sideloadly**：<https://sideloadly.io>（免费）。
3. 用数据线把 iPhone 连上电脑，iPhone 上点"信任此电脑"。
4. 打开 Sideloadly：
   - **IPA**：选刚下载的 `XstreeIOS-unsigned.ipa`
   - **Apple ID**：填你的 Apple ID（免费账号就行；密码只用于向苹果换取签名，Sideloadly 不会上传到别处。介意的话可以在苹果官网申请一个 App 专用密码）
   - **Device**：应自动识别出你的 iPhone
5. 点 **Start**，输入 Apple ID 密码，等待完成。
   - 如果提示要注册新的 App ID，选**同意**（本工程需要 App + 扩展两个 ID，免费账号每周有 10 个额度）。

---

## 第四步：iPhone 上信任并启用扩展

1. **信任开发者**：手机 → 设置 → 通用 → **VPN 与设备管理** → 开发者 App → 点你的 Apple ID → **信任**。
2. **先打开一次 App**：在桌面上找到刚装好的 **ibutv 兼容**，打开它（系统需要 App 被打开过一次才会注册扩展）。
3. **启用扩展**：设置 → **Safari 浏览器** → **扩展** → 找到 **ibutv 兼容** → 打开开关 →
   点进去，把 **ibutv.com** 等相关网站的访问权限设为"允许"。
4. 回到 Safari，打开 <https://ibutv.com/> 并刷新，再试那些"需要插件"的资源。

---

## 第五步：怎么判断起作用了

- 打开 ibutv.com 后，网站**不再提示"需要安装插件"**，说明补发信号成功。
- 去 B 站／芒果的播放页，页面右下角**出现绿色的「用 ibutv 播放」按钮**，说明跳转入口生效，
  点它会把地址交给 ibutv 打开。
- 如果不再提示插件、但视频仍然黑屏 —— 那就是**服务器端硬性要求插件取流**，
  本扩展无能为力（原因见开头表格）。这种情况只能：用官方 App，或用 Android 手机装原插件。

---

## 常见问题

**Q：7 天后失效了怎么办？**
A：重新执行第三步（Sideloadly 再签一次），不用重新编译。

**Q：设置 → Safari → 扩展里找不到它？**
A：先打开一次 App；确认 App 已"信任"；确认 iOS 版本 ≥ 16。仍不行就把 App 删掉重装一次。

**Q：能不能不用 GitHub、不联网编译？**
A：不能。iOS 的 App 必须由 macOS 上的 Xcode 编译（法律和技术上都是），
GitHub 提供的免费 macOS 机器是最省事的替代。

**Q：以后我有 Mac 了怎么做？**
A：装好 Xcode 和 XcodeGen（`brew install xcodegen`），在工程根目录执行
`bash scripts/build-ipa.sh` 得到 ipa；
或者 `xcodegen generate` 后用 Xcode 打开 `XstreeIOS.xcodeproj`，
在 Signing & Capabilities 里登录你的 Apple ID，选好 Team，直接连手机运行。

**Q：这个扩展会偷我的信息吗？**
A：它的全部代码就在 `Extension/Resources/` 里，只有三个 JS 文件，都可读：
只做两件事——在 ibutv.com 上发一条 `RULES_READY` 消息、在视频页加一个跳转按钮。
不读取 Cookie、不上传任何数据、不连任何第三方服务器。

---

## 文件说明

```
project.yml                              XcodeGen 工程描述（用它生成 .xcodeproj）
App/                                     容器 App（SwiftUI）
  XstreeIOSApp.swift
  ContentView.swift
Extension/                               扩展本体
  SafariWebExtensionHandler.swift        原生消息处理器（最小实现）
  Resources/                             扩展的网页部分
    manifest.json                        扩展清单（权限、内容脚本匹配规则）
    ibutv-compat.js                      在 ibutv 页面补发 RULES_READY 信号
    video-jump.js                        在视频页插入「用 ibutv 播放」按钮
    popup.html / popup.js                点扩展图标时的开关面板
scripts/build-ipa.sh                     有 Mac 时的一键编译脚本
.github/workflows/build.yml              没有 Mac 时用云端编译
```
