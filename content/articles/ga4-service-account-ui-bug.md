---
title: "GA4 Service Account 加不上：别在坏掉的门口刷卡"
date: "2026-05-09"
description: "为了让 AI/CLI 读取 GA4 数据，需要把 Google Cloud Service Account 加进 GA4；如果网页端误报 This email doesn't match a Google Account，直接走 Admin API accessBindings.create。"
tags: ["Google Analytics", "GA4", "Service Account", "AI Agent", "Debugging"]
---

我一开始不是为了研究 Google 的 bug。

我只是想让 `ga-cli` 跑起来。

真正想要的是：以后问一句「这周 UV 多少」「最近 24 小时有没有人看」「哪篇文章有人点」，AI 能直接查，不用我打开 GA 页面、切日期、点 report、截图、复制、再解释一遍。

GA 网页不是给 AI 用的。你不能把一个 agent 塞进 GA 后台让它自己点菜单。人当然可以点，但这件事一旦变成日常就很烦。

CLI 接上以后，GA 数据才变成可交互对象——AI 可以查、汇总、对比，可以在发布文章后做反馈闭环。没有这一步，数据躺在网页里；有了这一步，数据才进工作流。

差别不是一条命令，是一条管道：数据从「网页里躺着」变成「agent 可以调用」。

这条管道的搭法，文档上看起来很普通。

## 正常路径

正常配置三步：Google Cloud 建 Service Account → enable `Google Analytics Data API` / `Google Analytics Admin API` → 下载 JSON key 放到服务器。

然后到 GA4 的 access management 里输入这个 Service Account 邮箱：

```
ga-cli-reader@your-project.iam.gserviceaccount.com
```

给 `Viewer` 或 `Analyst` 权限，保存。前面几步都顺利，最后一步出事了。

## GA4 网页端说：这不是 Google Account

我在 GA4 里试了两个入口——`Account access management` 和 `Property access management`——来回至少二十多遍。取消 notify，重输邮箱，检查空格，确认 Service Account 是 enabled，确认 API 已 enable……结果还是：

```
Unable to add users
This email doesn't match a Google Account
ga-cli-reader@...iam.gserviceaccount.com
Please fix these issues in order to proceed.
```

这句提示很坏。它会诱导你自我怀疑：是不是邮箱格式错了？是不是 Service Account 不算 Google Account？是不是 Google Cloud 和 GA 没连上？是不是刚创建要等几天？

但 `.iam.gserviceaccount.com` 就是 Service Account 的正常格式。

Project 没有 organization 不是根因。API enable 了也不等于 GA4 自动开门。

这里有三层东西，很容易混：

```
Google Cloud Service Account  →  机器身份
Google Cloud enabled APIs     →  允许调用哪些 API
GA4 access management         →  这个身份能不能读某个 GA property
```

前两层绿了，不代表第三层绿。而这一次更恶心：第三层的网页入口可能坏了。

## 这个时候别再自我怀疑

如果一个官方 UI 明确说「邮箱不对」，人会本能地继续在 UI 里试——换入口、换权限、换姿势。这就是浪费时间的地方。

当你确认邮箱格式正常、Service Account 存在、API 已启用，还在同一个错误里打转，下一步不应该是第 21 次粘贴邮箱。下一步应该是往外查：有没有别人遇到同样错误？官方文档有没有另一条路径？底层 API 能不能绕过 UI？

我查到 Google Analytics Community 里不止一个同类报告，其中一个帖子标题就是：[^1]

```
service account email from google cloud is not allowed
```

里面有人贴出的报错和我一样。[^2]另一个 thread 的 search result snippet 也出现了同样的 `This email doesn't match a Google Account`。[^3]还有回复说这个 topic 已经 escalated。[^4]

证据级别是 community evidence，不是 Google 官方 incident 或工程 changelog。但对于排障已经够用：GA4 网页端对 Service Account 邮箱的校验确实有人集中撞墙，不是我一个人的配置玄学。

## 解法：别走坏掉的门，走 Admin API

最后能跑通，是因为我绕开网页端，直接走了 Google Analytics Admin API 的 `accessBindings.create`。

GA4 绑定权限，底层是 `AccessBinding`。官方接口：[^5]

```
POST https://analyticsadmin.googleapis.com/v1alpha/{parent=properties/*}/accessBindings
```

`parent` 可以是 account 或 property：

```
accounts/{account}
properties/{property}
```

我这里只需要让 Service Account 读某个 property，所以填：

```
properties/你的-GA4-property-id
```

Request body：

```json
{
  "user": "ga-cli-reader@your-project.iam.gserviceaccount.com",
  "roles": [
    "predefinedRoles/analyst"
  ]
}
```

这里常用 role 是 `predefinedRoles/viewer` 或 `predefinedRoles/analyst`；完整 role 列表见官方文档。[^6]

最方便的做法不是自己写代码，而是在 Developer Documentation 里直接用 API Explorer。选 `properties.accessBindings.create`，用有 GA4 管理权限的人类账号登录，填 `parent` 和 body，Execute。

注意：执行 API 的是人类管理员账号，不是那个 Service Account。管理员负责把 Service Account 加进 property。

我第一次撞了 `403`：

```json
{
  "error": {
    "code": 403,
    "message": "The caller does not have permission",
    "status": "PERMISSION_DENIED"
  }
}
```

这个 `403` 容易误判。它不是「Service Account 邮箱错了」，而是「当前执行 API 的账号没有权限给 property 添加用户，或者 OAuth scope 不够」。

官方文档要求的 scope：[^7]

```
https://www.googleapis.com/auth/analytics.manage.users
```

所以遇到 403，查三件事：

1. API Explorer 登录的是否是有 GA4 管理权限的主账号。
2. OAuth 授权是否包含 `analytics.manage.users`。
3. `parent` 是否填对——是 `properties/你的-GA4-property-id`，不是只填数字。

这些都对了，再 execute。我这里最终拿到了 `200 OK`。

看到绿色 `200` 那一刻，人会短暂相信世界还有秩序。很短暂，但够了。

## 真正的坑：AI 会陪你重复 happy path

这件事最值得记住的，不只是 GA4 UI 的坑。更大的坑是：AI 很容易陪你重复官方 happy path。

你问 AI：「GA4 加不了 Service Account，怎么回事？」

它会说：检查 API 是否启用、确认 Service Account、取消 notify、换 account access management、换 property access management、再等一等、重新复制邮箱。

每一步单独看都合理。合起来就是让你在坏门口刷二十遍卡。

这不是 AI 蠢。是 AI 默认信任教程——教程说 UI 能用，AI 就假设 UI 能用。教程没说网页入口可能坏了，AI 就想不到让你跳过它。

好的 agent 应该在用户第一次失败后就换角度，而不是在同一个前提下拉长 checklist：

```
Service Account 是否存在？          yes
JSON key 是否可用？                yes
GA API 是否启用？                  yes
GA4 property 已授权它？             no
UI 添加是否失败？                  yes
同类失败记录是否存在？              yes
底层 Admin API 是否可用？           yes
```

走到「同类失败记录是否存在」这一步，问题就变了。它不是「用户还没按教程走完」，它是「教程里的 UI 入口不可信」。继续让用户在网页里点，就是制造噪音。

不然它越勤奋，你越倒霉。

## 最短避坑版

如果你为了 `ga-cli`、脚本、server-side agent 或其他自动化，要把 Google Cloud Service Account 加到 GA4，结果 UI 报：

```
This email doesn't match a Google Account
```

别怀疑 `.iam.gserviceaccount.com`。这是正常格式。别在 `Account access management` 和 `Property access management` 之间反复横跳。

直接去 Admin API 文档找 `properties.accessBindings.create`。

填：

```
parent = properties/你的 GA4 property id
```

Body：

```json
{
  "user": "你的-service-account@你的-project.iam.gserviceaccount.com",
  "roles": ["predefinedRoles/analyst"]
}
```

权限按最小够用来：能给 property 就别给 account，能用 `viewer` 就别上来给 `admin`。

- `200 OK` → 回服务器跑 CLI。
- `403 PERMISSION_DENIED` → 不是 Service Account 邮箱错了。检查三件事：执行 API 的账号有没有 GA4 管理用户权限；OAuth scope 是否包含 `https://www.googleapis.com/auth/analytics.manage.users`；`parent` 是否填成了 `properties/你的-GA4-property-id`。

别在坏掉的门口反复刷卡。

门没认出你，不代表你不是人。也可能只是门坏了。

## 脚注

[^1]: Google Analytics Community thread: "service account email from google cloud is not allowed", URL: `https://support.google.com/analytics/thread/427838065?hl=en&msgid=428703016`。我实际打开页面后看到标题；搜索结果日期显示为 Apr 24, 2026。这个来源是 community evidence，不是正式工程 incident 公告。

[^2]: 同一 Google Analytics Community thread 的页面 embedded data 中可见同类报错文本：`Unable to add users / This email doesn't match a Google Account / <omitted>@<omitted>.iam.gserviceaccount.com / Please fix these issues in order to proceed / to property access management`。这里的 embedded data 指页面源码/渲染数据里可检索到的文本，不是 Google 官方结构化公告。

[^3]: 另一个 Google Analytics Community thread: "I need help with my GA4 property access management", URL: `https://support.google.com/analytics/thread/430840982/i-need-help-with-my-ga4-property-access-management?hl=en`。搜索结果 snippet 显示同类文本：`This email doesn't match a Google Account. example @example.iam.gserviceaccount.com. Please fix these issues in order to proceed.`

[^4]: 第一个 thread 的页面 embedded data 中可见一条回复：`I've escalated the topic. I'll let you know when I have more information.` 这说明问题被社区专家升级反馈，但不等同于 Google 官方 changelog。

[^5]: Google Analytics Admin API 官方文档，`properties.accessBindings.create`: `https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/properties.accessBindings/create`。文档说明该方法用 HTTP POST 创建 account 或 property 上的 access binding，endpoint 为 `https://analyticsadmin.googleapis.com/v1alpha/{parent=properties/*}/accessBindings`，`parent` 格式包括 `accounts/{account}` 和 `properties/{property}`。

[^6]: Google Analytics Admin API 官方 `AccessBinding` 资源文档：`https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1alpha/properties.accessBindings`。文档列出的有效角色包括 `predefinedRoles/viewer`、`predefinedRoles/analyst`、`predefinedRoles/editor`、`predefinedRoles/admin`、`predefinedRoles/no-cost-data`、`predefinedRoles/no-revenue-data`。

[^7]: Google Analytics Admin API `properties.accessBindings.create` 官方文档说明创建 access binding 需要 OAuth scope：`https://www.googleapis.com/auth/analytics.manage.users`。
