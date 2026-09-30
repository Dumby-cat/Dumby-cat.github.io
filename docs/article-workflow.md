# 写作、文章时间和本地图标

## 平时怎样写文章

1. 使用 `npx hexo new "文章标题"` 创建文章，或直接在 `source/_posts/` 新建带 YAML 头部的 Markdown 文件。
2. 写作时运行 `npm run server`。保存文章后，Hexo 重新生成页面，同时把缺省时间和更新后的 `updated` 写回文章头部。
3. 没有运行预览服务时，下一次 `npm run build` 或 `npm run deploy` 会自动同步。只想写回时间时运行 `npm run dates:sync`。

这不是常驻系统服务；编辑器单独运行时，必须在之后进行上述同步或构建。文件应使用 UTF-8、标准 YAML front matter 和 `.md` 扩展名。修改已打开的文件后，编辑器通常会自动读取脚本写入的 `updated`；若提示外部文件变化，请先查看差异，不要用旧缓冲区覆盖新内容。

## 日期规则

- `date` 是首次发表时间，已有值不会自动变化，避免改变文章排序和网址。缺省时读取文件创建时间。
- `updated` 缺省时读取文件修改时间。文章正文或其他 YAML 元信息发生变化时，使用此次保存后的文件修改时间更新它。
- 如果同一次编辑中明确手工修改了 `updated`，优先保留手工值。
- 单独修改 `date` / `updated`、重复构建、单纯 touch 文件或仅将 CRLF 转为 LF，都不会自动刷新 `updated`。
- 日期按 `Asia/Shanghai` 格式化、解析和展示，精确到秒。图片等附件单独变化不刷新文章时间，需要修改文章或手工调整 `updated`。
- 包括 `source/_posts/` 和 `source/_drafts/` 中的 Markdown。处理草稿元数据不会改变是否发布草稿的配置。

2026-09-30 首次迁移按本机文件时间为 90 篇文章/草稿补充了 `updated`，为 2 篇缺少 `date` 的草稿补充了创建时间。其余发表时间、正文、文件创建时间和修改时间保留；迁移前的内容和时间记录保存在旁边副本目录的 `_backups/article-times-before-migration/`。

## 实现与维护

- `tools/post-times.cjs`：读取、验证、比较文章内容，写回时间并恢复原文件修改时间。
- `scripts/post-times.js`：接入 Hexo 的 `before_generate`，在模板渲染之前同步模型时间，支持预览期间的文件监听。
- `data/post-times.json`：内容摘要和上次更新时间，**应和文章一起提交到版本库**。它用于区分真实内容变化与重新克隆导致的文件时间变化；不在公开的 `source` 目录内。
- 不要把状态文件当缓存删除。若丢失，下一次运行会保留已有显式日期并重新建立基线，但无法识别丢失期间尚未同步的内容更新。
- `npm test` 覆盖首次补齐、不重复刷新、正文编辑、手工时间覆盖、非法日期拒绝写入，以及真实 Hexo watcher 和模板输出。

## Font Awesome 和 RSS

`@fortawesome/fontawesome-free` 固定为 7.0.0，与迁移前 CDN 版本一致。`source/lib/fontawesome/css/all.min.css` 引用同目录结构下的四个 WOFF2 字体，`_config.next.yml` 用 `vendors.fontawesome` 指向本站路径。其他 CDN 资源不受影响。

RSS 使用 `source/images/rss.png`，并保留 `rss.svg`。图标源自官方包 `svgs/solid/rss.svg`，颜色改为橙色；PNG 采用 128×128 透明画布并留边。字体、代码和图标分别适用许可证见 `source/lib/fontawesome/LICENSE.txt`，来源及改动说明见同目录 `README.txt`。

更新 Font Awesome 包后执行 `npm run assets:sync`，它会复制 CSS、所引用字体和许可证，并通过开发依赖 `@resvg/resvg-js` 重新导出 RSS PNG。导出的资源应一起提交，正常网站构建无需再次下载图标。
