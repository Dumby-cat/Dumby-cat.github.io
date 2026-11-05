# 百度收录与站点验证

本站的规范网址为 `https://dumblog.top/`。提交链接可以帮助百度发现页面，但不保证收录，也没有固定的收录期限。

## 1. 验证网站归属

1. 登录 [百度搜索资源平台](https://ziyuan.baidu.com/site/index)，添加 `https://dumblog.top`。
2. 选择 HTML 标签验证。若平台提供 `<meta name="baidu-site-verification" content="code-示例">`，将完整的 `content` 值填入 `_config.next.yml` 的 `baidu_site_verification`，例如 `baidu_site_verification: "code-示例"`。不要使用示例值，也不要粘贴整个标签。
3. 执行 `npm run build -- --force`，通过当前线上站点的实际发布流程发布。
4. 查看线上首页源代码，确认 `<head>` 内出现平台给出的验证标签，再回百度点击完成验证。验证成功后保留该标签。

NexT 8.27.0 原生支持这个配置，不需要修改主题文件或安装插件。这里填写的是公开的站点验证标识，不是 API 推送 token。

如果使用文件验证，将百度要求的原始验证文件放到 `source/` 根目录，保持文件名和内容不变，构建发布后检查线上同名地址可直接访问，再完成验证。

## 2. 提交站点地图或链接

在已验证站点的 [普通收录](https://ziyuan.baidu.com/linksubmit/index) 中，按账号实际开放的入口操作：

- 提供 Sitemap 提交入口时，提交 `https://dumblog.top/sitemap.xml`。
- 使用手动提交时，打开 `https://dumblog.top/sitemap.txt`，按平台提示的数量限制分批粘贴网址，每行一个。也可以先提交首页和几篇希望优先被发现的原创文章。
- 若启用 API 推送，使用该站点后台显示的接口和配额；token 仅存放在本机环境变量或部署平台的秘密配置中，不写入主题配置、`source/` 或版本库。

两份站点地图均由现有 `hexo-generator-sitemap` 生成，`source/robots.txt` 已声明它们的位置。404 页面、测试文章和标签总览已通过 `sitemap: false` 排除，标签归档通过 `sitemap.tags: false` 排除。文章正文应可直接从 HTML 读取；不要给希望收录的文章设置 `noindex: true`。

## 3. 发布后检查

- 首页、文章、`/robots.txt`、`/sitemap.xml` 和 `/sitemap.txt` 可公开访问，文章返回正常内容。
- `robots.txt` 没有禁止抓取希望收录的文章；文章没有 `noindex` 或禁止索引的响应头。
- 验证标签已在线上出现，站点地图不包含 404 页面、测试文章和标签页面。
- 在百度平台查看抓取诊断、抓取异常和索引量。普通浏览器访问成功不代表百度蜘蛛一定能访问，以平台诊断结果为准。

发布流程已由站点维护者于 2026-11-05 确认：运行 `npm run deploy`，构建结果通过 `hexo deploy` 推送到 GitHub 的 `master` 分支，随后 Vercel 自动更新 `dumblog.top`。命令完成后仍需检查线上首页的验证标签和站点地图，确认 Vercel 已完成部署。

官方说明：[普通收录使用说明](https://ziyuan.baidu.com/linksubmit/index)、[平台工具使用手册](https://ziyuan.baidu.com/college/courseinfo?id=267&page=2)。
