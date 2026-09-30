# 主题维护

本站使用 Hexo 6.3.0 与 NexT 8.27.0（Mist）。站点配置位于 `_config.yml`，主题配置位于 `_config.next.yml`。不要直接修改 `node_modules/hexo-theme-next`，安装依赖会覆盖其中的修改。

## 样式入口

`_config.next.yml` 的 `custom_file_path.style` 加载 `source/_data/styles.styl`。样式仍在 NexT 默认样式之后输出，入口按照原来的层叠顺序导入以下文件：

| 文件（均在 `source/_data/styles/`） | 用途 |
| --- | --- |
| `tokens.styl` | 自定义颜色，使用 `$dumblog-` 前缀避免影响主题内部变量 |
| `base.styl` | 文字、链接、页面背景与隐藏页脚 |
| `buttons.styl` | 按钮与按钮内图标 |
| `layout.styl` | 内容宽度、平板和手机断点、移动端菜单 |
| `components.styl` | 标题、菜单、代码复制、分页、标签与分类 |
| `tables.styl` | 表格背景与悬停状态 |
| `utilities.styl` | 滚动条及 KaTeX / MathJax 长公式横向滚动 |

这些模块编译为同一个 `css/main.css`，不会增加浏览器请求。颜色使用编译期变量，不增加浏览器端依赖。`tokens.styl` 在自定义样式层导入，不通过主题的 `variable` 注入点加载，避免改变主题默认规则。

## 保持现有外观的约定

- 保留导入顺序、选择器、响应式断点与 `!important`。调整顺序可能改变覆盖关系。
- 桌面内容宽度仍为 `80%`，内容容器仍为 `calc(100% - 260px)`，手机和平板保留原来的覆盖规则。
- `font.enable: false`、字体大小和粗细保持原值；本次未新增字体请求。
- 侧栏继续关闭，页脚继续由样式隐藏，搜索、代码复制和公式配置保持原值。
- 原有全局 `i` 与 `a:-webkit-any-link` 选择器保留。缩小选择器范围属于外观或兼容性调整，应单独验证后再改。
- 标签云排序在 `_config.next.yml` 的 `tagcloud.orderby` / `tagcloud.order` 设置。CSS 中无效的 `orderby` 已移除；原有有效的 `order: 1` 保留。
- 所有主题配置值仍显式保留，只精简说明与未启用的示例注释。完整选项查阅 <https://theme-next.js.org/docs/>。

## 构建与压缩

运行 `npm run build -- --force` 重新生成所有页面。`_config.yml` 中的 `stylus.compress: true` 通过现有渲染器压缩 CSS，保留独立样式文件的加载方式。

原来的 `hexo-filter-optimize` 0.3.1 不支持配置中的 `minify`，现已移除。CSS 压缩由 Stylus 完成，没有引入 HTML / JS 打包或延迟加载。已同时移除未使用的 Landscape 主题和已弃用的 Jade 渲染器。

`npm run deploy` 现在执行 `npm run build -- --force && hexo deploy`，只有构建成功才会发布。仅预览或验证时运行构建，不运行部署命令。

不要直接编辑 `public/` 中的生成文件。更改源文件后重新构建；部署仍使用原来的部署流程。

## 本次验证

构建前已保存完整 ZIP 备份，以及单独的生成文件基线。验证包括 YAML 解析值对比、全量构建、生成文件路径与内容对比，以及 CSS 规范化对比。

NexT 在 `.links-of-author a::before` 中使用 `random-color()`，所以每次重新编译都可能得到不同的装饰色；这是主题原有行为，当前关闭的侧栏不会显示该元素。比较构建结果时，仅在这个选择器上忽略随机颜色值，其余有效规则需要一致。

### 2026-09-30 构建对比结果

- 主题配置从 901 行整理为 378 行，YAML 解析后的所有键和值完全一致。
- 生成文件仍为 353 个，没有新增或删除页面和资源，其中 351 个逐字节一致。
- 仅 `css/main.css` 和 `css/noscript.css` 因压缩发生变化；在识别上述随机装饰色、两条被覆盖的边框声明和一条无效 `orderby` 声明后，使用 CleanCSS 规范化比较，输出一致。
- 主 CSS：58,485 → 48,908 字节，减少 16.4%；无脚本 CSS：881 → 760 字节，减少 13.7%。这是未压缩传输前的文件大小，实际网络收益取决于服务器的 gzip / Brotli 设置。
- 页面 HTML、JavaScript、搜索索引、订阅及其他生成资源未改变。本次验证基于全量构建及生成物对比，未执行浏览器交互测试。

## 后续配色与工程修正

- 页面背景为纯黑 `#000000`，搜索弹窗为 `#1c1c1c`，搜索输入区为 `#242424`，正文为 `#e8e8e8`。布局、断点和字体配置不变。
- 自定义颜色同步到 NexT 的 CSS 变量，包括弹窗、按钮、表格、引用、代码背景及原生控件的深色模式。代码语法高亮配色方案保留。
- 搜索区单独修正图标高度和背景，避免全局 `i` 规则影响搜索控件。
- RSS 订阅使用本地 `source/images/rss.png`（128×128 透明 PNG），来自 Font Awesome Free 7.0.0 的 RSS 图标；保留橙色 SVG 源图及许可证。
- 文章时间现在自动写回文章头部，使用 Asia/Shanghai 时区；详见 `docs/article-workflow.md`。已有发表时间保留，后续正文或元信息变更会刷新更新时间。
- Font Awesome 7.0.0 已本地托管于 `source/lib/fontawesome/`，包含 CSS、四个 WOFF2 字体及许可证。通过 `vendors.fontawesome` 单独指定路径，其他第三方库的 CDN 配置保持不变。更新版本后运行 `npm run assets:sync` 同步资源和重新导出 RSS 图标。
- 已完成 353 个文件的全量构建、依赖树检查和桌面浏览器搜索验证（“控制”返回 5 条结果）。没有执行线上部署。
