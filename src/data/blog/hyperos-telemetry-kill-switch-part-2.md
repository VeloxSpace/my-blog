---
title: 🚀[实战] HyperOS 终极脱敏续篇：314 个系统包全扫一遍，又卸载 19 个系统包
author: Velox
pubDatetime: 2026-11-06T19:00:00+08:00
slug: hyperos-telemetry-kill-switch-part-2
featured: true
draft: false
tags:
  - 极客防御
  - 脱敏
  - HyperOS
  - ADB实战
description: 第一篇的续篇。Redmi K50 上用 ADB 把 314 个系统包全扒出来，复验第一篇 6 条没复活，再新卸载 6 条，后来又卸 13 条，附每条是干什么的、回显怎么看、回滚。
---

> ⚠️ **极客免责声明**：本方案仅为个人实战记录与网络架构防侧漏技术探讨。系统级“脱敏”存在一定未知风险（如导致依赖该组件的部分系统自带功能闪退）。操作不当导致的数据丢失、系统死机或变砖，本人概不负责。动手前请确保你清楚自己在敲什么代码！

**本文是第一篇的续篇，先看第一篇再看这篇。第一篇：[🚀[实战] HyperOS 2.0 / 3.0 终极脱敏：免 Root 物理封杀小米内置反诈与遥测](https://222382.xyz/posts/hyperos-telemetry-kill-switch)**

**第一篇干的是：UI 关门 + NekoBox 17 条黑洞 + 卸载 4 条、冷冻 1 条。本文干的是：把 314 个系统包全扒出来，复验第一篇有没有复活，再新卸载 6 条，后来又卸 13 条。**

**实测机：Redmi K50，型号 22041211AC，MTK mt6895，HyperOS 2.0.10，Android 14。其他手机 / 型号，包清单会不一样，不要照抄包名逐条卸。**

**冻和卸的区别：`disable-user` 是冷冻，可逆，系统分区里的包还在；`uninstall -k --user 0` 是从当前用户空间移除，可逆，系统分区未动，用 `install-existing` 还能装回来。都不是 Root、不是解 BL、不是动 ROM。**

**OTA 会复活：系统 OTA 升级，极大概率会把卸掉的组件复活。每次大版本更新完，把第一篇 + 本文的指令再跑一次，再用第一节的两条扫包指令复验一遍。**

---

## 一、扫包方法：两条指令

**先说方法，再说结果。两条指令输出到两个文本文件，全文比对，不漏包。**

**在 `platform-tools` 文件夹地址栏输入 `cmd` 呼出命令提示符，连上 K50 后，跑下面两条：**

```cmd
adb shell pm list packages -s > k50-system-packages.txt
adb shell pm list packages -d > k50-disabled-packages.txt
```

**第一条是全部系统包，本文实测 314 个。已经卸载的不会出现，缺席本身就是证据。第二条是已停用 / 冷冻的包，本文实测只有 1 条。**

**这两个 txt 不在手机里，在电脑上，就在你跑命令的那个 `platform-tools` 文件夹里。文件名里的 `k50` 换成你自己的型号。**

![系统包扫描结果](https://pub-65eb3861e8d64d24a3280e55bd221735.r2.dev/blog-img-1793974036827.jpg)
>系统包扫描结果：一次扫出全部系统包，卸掉的包不在里面。

![已停用包扫描结果](https://pub-65eb3861e8d64d24a3280e55bd221735.r2.dev/blog-img-1793974098239.jpg)
>已停用包扫描结果：全机只有 cleanmaster 1 条还冻着。

---

## 二、复验第一篇：6 条，4 条卸载的没复活，垃圾清理还冻着

**第一篇一共 6 条：冷冻 1 条 + 卸载 4 条，高通那条天玑机本来就没有。卸载的 4 条，314 个包里全都不在，没复活：**

- **`com.miui.guardprovider`：安装扫描与云端特征反诈引擎，不在，没回来。**
- **`com.miui.analytics`：系统行为埋点与大数据统计分析，不在，没回来。**
- **`com.miui.daemon`：底层常驻遥测守护引擎，不在，没回来。**
- **`com.mobiletools.systemhelper`：运营商 / 渠道设备管理与应用列表采集探针，不在，没回来。**
- **`com.qualcomm.qti.services.systemhelper`：高通系统辅助进程，不在，但天玑机本来就没有，不算卸掉的证据，别重复算。**

**冻住的 1 条，第二份文件里只有它 1 条，全机唯一一个已停用的包：**

- **`com.miui.cleanmaster`：垃圾清理组件，还冻着。垃圾清理按钮点没反应，是正常的，不是手机坏了。**

---

## 三、新卸载的 6 条

**每条都按第一篇的战术来：先试冷冻 `disable-user`，受保护就换卸载 `uninstall -k --user 0`，逐行复制、逐条回车，别整段粘贴。**

### 1. `com.miui.systemAdSolution`：系统广告底子

**小米系统广告的底子，广告投放、配置下发都走它。广告接口在第一篇 NekoBox 17 条里已经被黑洞拦了，本地这个广告服务还在跑，卸了它，本地广告服务就停了。**

**不能冷冻。先跑 `disable-user` 回的是 `SecurityException: Cannot disable system packages`。改用 `uninstall -k --user 0`，第一次回 `Success`，就是卸掉了；第二次再跑回 `Failure [not installed for 0]`，是第一次已经卸掉了，直接跳过。**

```cmd
adb shell pm uninstall -k --user 0 com.miui.systemAdSolution
```

### 2. `com.miui.bugreport`：Bug 上报

**收集、上传 Bug 报告、崩溃日志。纯上报，没用户功能。**

```cmd
adb shell pm uninstall -k --user 0 com.miui.bugreport
```

**回显 `Success`，就是卸掉了。**

### 3. `com.miui.uireporter`：界面上报

**界面使用情况上报。纯上报，没用户功能。**

```cmd
adb shell pm uninstall -k --user 0 com.miui.uireporter
```

**回显 `Success`，就是卸掉了。**

### 4. `com.miui.yellowpage`：黄页

**黄页，号码识别、企业号码查询。不用黄页查号。**

```cmd
adb shell pm uninstall -k --user 0 com.miui.yellowpage
```

**回显 `Success`，就是卸掉了。**

### 5. `com.miui.personalassistant`：负一屏

**负一屏，左滑出来的快捷助手。不用负一屏，左滑那页就没了。**

```cmd
adb shell pm uninstall -k --user 0 com.miui.personalassistant
```

**回显 `Success`，就是卸掉了。**

### 6. `com.sohu.inputmethod.sogou.xiaomi`：搜狗输入法小米版

**搜狗输入法小米定制版，带云输入、云词库。默认输入法已经是 Gboard 了，卸掉它，系统就不会哪天又切回国内输入法。只要默认是 Gboard 就没事。**

```cmd
adb shell pm uninstall -k --user 0 com.sohu.inputmethod.sogou.xiaomi
```

**回显 `Success`，就是卸掉了。**

![脱敏回显](https://pub-65eb3861e8d64d24a3280e55bd221735.r2.dev/blog-img-1793974486521.jpg)
![脱敏回显](https://pub-65eb3861e8d64d24a3280e55bd221735.r2.dev/blog-img-1793974573046.jpg)

---

## 四、回显说明：三句话

**回 `Success`，就是成功了。回 `Failure [not installed for 0]`，是此前已被移除或本机原生未内置，直接跳过。回 `SecurityException: Cannot disable system packages`，是受保护，`disable-user` 冻不了，换 `uninstall -k --user 0` 再跑一次。跑任何一条都先看回显，再跑下一条。**

---

## 五、还活着的怎么办：别全冻，别批量卸

**还装着 ≠ 正在上传，很多是被第一篇的 UI 关闭 + NekoBox 17 条黑洞压着的，真正有没有在跑，得看 NekoBox 日志里有没有命中。**

**下面这几类别动：`com.miui.securitycenter`、`com.miui.securitycore` 这些安全中心本体；`com.miui.home`、`com.miui.system`、`com.android.systemui`、`com.android.phone`、`com.android.settings` 这些系统底座。**

**想再动的，先按第一节那两条扫一遍，把包名、是干什么的、冻 / 卸了会坏什么，三件事想清楚再动手，一次只动一条，跑完看回显，别批量。**

---

## 六、想彻底不升级：卸载系统更新器（可选）

**这条不算在前面 6 条里，是单独的可选项，只给真不想升级的人。**

**`com.android.updater` 是系统更新器，OTA 全量包下载、静默安装都走它。卸了它，半夜 Wi-Fi 下全量包那条路就断了。**

```cmd
adb shell pm uninstall -k --user 0 com.android.updater
```

**回显 `Success`，就是卸掉了。**

![卸载 - 装回 - 再卸载](https://pub-65eb3861e8d64d24a3280e55bd221735.r2.dev/blog-img-1794208484346.jpg)

> 卸载 - 装回 - 再卸载：三次回显，证明是可逆的卸载，不是冷冻，也不是彻底删除。

**卸掉会坏什么：设置里“我的设备 - 系统版本”会点不进去或闪退，这是预期的，不是手机坏了。以后想升级，先装回来再升：**

```cmd
adb shell cmd package install-existing com.android.updater
```

**装回回显：`Package com.android.updater installed for user: 0`，就是装回去了。**

---

## 七、晚上又卸 13 条：运营商注册、安全键盘、输入法、反馈与广告

**又查又卸，13 条全部回显 `Success`。按截图的三组写，5 条 + 2 条 + 6 条，每条都是先查本机有没有，再逐条卸。**

**先说查过的、没有的，别硬跑：`com.miui.misightservice`、`com.miui.msa.global`，本机 2.0.10 上查不到，跳过。**

### 1. 第一组：5 条

**`com.miui.dmregservice`：设备管理注册服务，运营商上报那路，三家运营商都走它，不是单一家。**

**`com.xiaomi.registration`：小米设备注册服务，设备激活、注册上报那路。**

**`com.xiaomi.security.onetrack`：用户数据收集与统计，配合 MIUI Analytics 上传，Analytics 本人第一篇已卸，这是它的搭档。**

**`com.miui.hybrid`：快应用服务框架，网页链接调用 / 小程序广告平台。**

**`com.miui.securityinputmethod`：小米安全键盘，输密码时自动弹出来那个。防的是第三方输入法偷密码，不防小米自己，密码还得过它手，卸了密码框出 Gboard。**

```cmd
adb shell pm uninstall -k --user 0 com.miui.dmregservice
adb shell pm uninstall -k --user 0 com.xiaomi.registration
adb shell pm uninstall -k --user 0 com.xiaomi.security.onetrack
adb shell pm uninstall -k --user 0 com.miui.hybrid
adb shell pm uninstall -k --user 0 com.miui.securityinputmethod
```

**回显 `Success`，就是卸掉了。**

![卸载回显](https://pub-65eb3861e8d64d24a3280e55bd221735.r2.dev/blog-img-1794672422942.jpg)

> 卸载回显：5 条，全部 Success。

### 2. 第二组：2 条

**`com.baidu.input_mi`：百度输入法小米版。`com.iflytek.inputmethod.miui`：讯飞输入法小米版。它俩不是安全键盘里绑着的，是独立的包，装在 `/data/app` 里，`pm list -s` 扫不到，是 `adb shell ime list -a` 抓到的真包名。默认已经是 Gboard，卸了它俩还有键盘用。**
>注意：这两条用 install-existing 装不回来，无法回滚实现，卸载后如果需要要到应用商店安装普通版。

```cmd
adb shell pm uninstall -k --user 0 com.baidu.input_mi
adb shell pm uninstall -k --user 0 com.iflytek.inputmethod.miui
```

**回显 `Success`，就是卸掉了。卸完输入法管理里只剩 Gboard 一个。**

![卸载回显](https://pub-65eb3861e8d64d24a3280e55bd221735.r2.dev/blog-img-1794672461585.jpg)

> 卸载回显：2 条，全部 Success。

### 3. 第三组：6 条

**`com.miui.miservice`：服务与反馈，后台运行。**

**`com.miui.contentcatcher` / `com.miui.contentextension`：应用扩展服务，与广告有关。**

**`com.miui.thirdappassistant`：第三方应用分析，应用异常分析，常误弹“应用已崩溃”。**

**`com.android.quicksearchbox`：桌面搜索框。**

**`com.miui.wmsvc`：取 Google 广告 ID 发给 MIUI Analytics。**

```cmd
adb shell pm uninstall -k --user 0 com.miui.miservice
adb shell pm uninstall -k --user 0 com.miui.contentcatcher
adb shell pm uninstall -k --user 0 com.miui.contentextension
adb shell pm uninstall -k --user 0 com.miui.thirdappassistant
adb shell pm uninstall -k --user 0 com.android.quicksearchbox
adb shell pm uninstall -k --user 0 com.miui.wmsvc
```

**回显 `Success`，就是卸掉了。**

![卸载回显](https://pub-65eb3861e8d64d24a3280e55bd221735.r2.dev/blog-img-1794672510071.jpg)

> 卸载回显：6 条，全部 Success。

**卸完后系统包应从 314 降到 296，正好少了第二篇 6 条 + 系统更新器 1 条 + 今晚 11 条系统包，百度、讯飞那 2 条不在系统包里，另算。下次重扫复验，没复活的，也没多出来的。**

---

## 附录：本文新卸 19 条的回滚

**上述操作属于用户层面的深度卸载，未破坏系统底层只读分区（ROM）。未来如果手机需要出二手、转给家人使用或恢复原厂完整逻辑，只需连上电脑开启调试，电脑上在 ADB 里逐行复制指令并回车执行（切勿整段一起粘贴）！以下指令即可恢复本文新卸的 17 条系统包，第七节 2 条输入法见下面单独说明：**

```bash
# 1. 恢复系统广告方案
adb shell cmd package install-existing com.miui.systemAdSolution

# 2. 恢复 Bug 上报
adb shell cmd package install-existing com.miui.bugreport

# 3. 恢复界面上报
adb shell cmd package install-existing com.miui.uireporter

# 4. 恢复黄页
adb shell cmd package install-existing com.miui.yellowpage

# 5. 恢复负一屏
adb shell cmd package install-existing com.miui.personalassistant

# 6. 恢复搜狗输入法小米版
adb shell cmd package install-existing com.sohu.inputmethod.sogou.xiaomi

# 7. 恢复设备管理注册服务
adb shell cmd package install-existing com.miui.dmregservice

# 8. 恢复小米设备注册服务
adb shell cmd package install-existing com.xiaomi.registration

# 9. 恢复用户数据收集与统计
adb shell cmd package install-existing com.xiaomi.security.onetrack

# 10. 恢复快应用服务框架
adb shell cmd package install-existing com.miui.hybrid

# 11. 恢复小米安全键盘
adb shell cmd package install-existing com.miui.securityinputmethod

# 12. 恢复服务与反馈
adb shell cmd package install-existing com.miui.miservice

# 13. 恢复应用扩展服务
adb shell cmd package install-existing com.miui.contentcatcher

# 14. 恢复应用扩展服务
adb shell cmd package install-existing com.miui.contentextension

# 15. 恢复第三方应用分析
adb shell cmd package install-existing com.miui.thirdappassistant

# 16. 恢复桌面搜索框
adb shell cmd package install-existing com.android.quicksearchbox

# 17. 恢复取广告 ID 服务
adb shell cmd package install-existing com.miui.wmsvc
```

**百度、讯飞那 2 条不在上面：它俩在 `/data/app` 里，不是系统包，`install-existing` 不一定能装回，要装回来得从应用商店里重新下载，但也不会是之前的小米定制版，还会在桌面多出个APP图标。**

**第一篇那 6 条的回滚，见第一篇附录：[🚀[实战] HyperOS 2.0 / 3.0 终极脱敏：免 Root 物理封杀小米内置反诈与遥测](https://222382.xyz/posts/hyperos-telemetry-kill-switch)，本文不重复贴。**

**回滚回显本文没实测过，不知道会回什么，别硬编。跑完看回显，有 `Success` / 已装回就是成功了，报 `Failure` 再单独看那一条。**

---

> 本文首发于 [Velox 的极客空间](https://222382.xyz)。第一篇见：[🚀[实战] HyperOS 2.0 / 3.0 终极脱敏：免 Root 物理封杀小米内置反诈与遥测](https://222382.xyz/posts/hyperos-telemetry-kill-switch)
