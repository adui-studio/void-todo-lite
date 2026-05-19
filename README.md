# Void Todo Lite

一个使用 Void、React、TypeScript、D1 和 Drizzle ORM 构建的极简 TodoList 示例项目。

这个项目来自「Void 初体验」系列文章，用一个尽可能小的 TodoList，完整体验 Void 从项目初始化、Pages Routing、D1 数据库、Drizzle schema、loader、actions、migration 到部署上线的全栈开发流程。

## 在线预览

https://void-todo-lite.void.app

## 项目仓库

https://github.com/adui-studio/void-todo-lite

## 技术栈

- Void
- React
- TypeScript
- Void Pages Routing
- D1
- Drizzle ORM
- Zod
- Vite
- pnpm

## 功能特性

- 新增 Todo
- 展示 Todo 列表
- 切换 completed 状态
- 删除 Todo
- 空列表提示
- D1 数据持久化
- Drizzle schema 管理数据库结构
- loader 读取数据
- actions 处理数据修改
- 支持部署到 Void

## 项目结构

```txt
void-todo-lite/
├─ db/
│  ├─ schema.ts
│  └─ migrations/
├─ pages/
│  ├─ index.server.ts
│  └─ index.tsx
├─ routes/
│  └─ api/
│     └─ hello.ts
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ tsconfig.json
├─ vite.config.ts
└─ void.json
````

## 核心文件说明

### `db/schema.ts`

定义数据库表结构。

本项目中主要定义了 `todos` 表：

```txt
todos
├─ id
├─ title
├─ completed
└─ created_at
```

其中：

* `id` 是自增主键
* `title` 是 Todo 内容
* `completed` 表示是否完成
* `created_at` 表示创建时间

### `pages/index.server.ts`

首页对应的服务端逻辑。

主要包含：

* `loader`：读取 Todo 列表
* `actions.create`：新增 Todo
* `actions.toggle`：切换 completed 状态
* `actions.delete`：删除 Todo

### `pages/index.tsx`

首页 React 页面。

主要包含：

* 页面标题
* 新增 Todo 表单
* Todo 列表渲染
* completed 状态切换
* 删除按钮
* 空列表提示
* 页面样式

### `routes/api/hello.ts`

Void 初始化生成的 API route 示例。

它主要用于演示 `routes/` 目录的 API 路由能力。

本项目的 TodoList 主流程使用的是 Pages Routing 的 `loader` 和 `actions`，并没有额外实现 `/api/todos`。

## 安装依赖

```bash
pnpm install
```

如果还没有安装 pnpm，可以先安装：

```bash
npm install -g pnpm
```

## 本地开发

启动开发服务器：

```bash
pnpm dev
```

访问：

```txt
http://localhost:5173
```

## 本地数据库同步

开发阶段可以使用：

```bash
pnpm void db push
```

这个命令会根据 `db/schema.ts` 直接同步本地 D1 数据库结构，适合开发阶段快速迭代。

## 生成 migration

准备部署前，生成数据库 migration：

```bash
pnpm void db generate
```

生成的 SQL 文件会出现在：

```txt
db/migrations/
```

## 执行本地 migration

```bash
pnpm void db migrate
```

如果之前使用过 `db push`，本地数据库里可能已经有表，但没有 migration history。

这种情况下可以执行：

```bash
pnpm void db reset
pnpm void db migrate
```

注意：`db reset` 会重建本地数据库，本地测试数据会被清空。

## 查看 migration 状态

```bash
pnpm void db status
```

## 部署

```bash
pnpm void deploy
```

首次部署时，Void CLI 会提示创建或选择 Void 项目。

本项目部署后的访问地址：

```txt
https://void-todo-lite.void.app
```

## 常用命令

```bash
pnpm dev
```

启动本地开发服务器。

```bash
pnpm build
```

构建项目。

```bash
pnpm void db push
```

开发阶段同步本地 D1 schema。

```bash
pnpm void db generate
```

根据 Drizzle schema 生成 migration 文件。

```bash
pnpm void db migrate
```

本地执行 migration。

```bash
pnpm void db reset
```

重置本地 D1 数据库。

```bash
pnpm void db status
```

查看 migration 状态。

```bash
pnpm void deploy
```

部署到 Void。

## 数据流说明

本项目没有使用传统的 `/api/todos` REST API。

TodoList 的数据流主要基于 Void Pages Routing：

```txt
用户访问首页
↓
执行 pages/index.server.ts 中的 loader
↓
从 D1 查询 todos
↓
todos 作为 props 传给 pages/index.tsx
↓
React 页面渲染 TodoList
```

新增 Todo：

```txt
用户提交表单
↓
useForm('/?create')
↓
执行 actions.create
↓
写入 D1
↓
页面重新获取最新数据
```

切换 completed：

```txt
点击 checkbox
↓
action('/?toggle')
↓
执行 actions.toggle
↓
更新 D1
↓
页面重新同步数据
```

删除 Todo：

```txt
点击删除按钮
↓
action('/?delete')
↓
执行 actions.delete
↓
删除 D1 数据
↓
页面重新同步数据
```

## Pages 和 Routes 的区别

本项目里同时可以看到 `pages/` 和 `routes/`。

简单理解：

| 目录        | 作用    |
| --------- | ----- |
| `pages/`  | 写页面   |
| `routes/` | 写 API |

例如：

```txt
pages/index.tsx
```

对应首页：

```txt
/
```

而：

```txt
routes/api/hello.ts
```

对应 API：

```txt
/api/hello
```

这个 TodoList 项目主要展示的是 Pages Routing，所以核心逻辑放在：

```txt
pages/index.tsx
pages/index.server.ts
```

## 部署踩坑记录

在早期版本中，部署 D1 migration 时遇到过多行 SQL 解析问题。

错误类似：

```txt
D1_EXEC_ERROR: Error in line 1: CREATE TABLE `todos` (: incomplete input: SQLITE_ERROR
```

临时解决方式是把 migration SQL 改成单行，并将 boolean 默认值从 `DEFAULT false` 改为 `DEFAULT 0`。

示例：

```sql
CREATE TABLE todos (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
```

后续 Void 团队反馈该问题已在新版本中修复。升级 Void 后可以重新验证生成的 migration 是否可以直接部署。

## 相关链接

* Void 官网：[https://void.cloud/](https://void.cloud/)
* Void Quickstart：[https://void.cloud/guide/quickstart](https://void.cloud/guide/quickstart)
* Void Pages Routing：[https://void.cloud/guide/pages-routing/overview](https://void.cloud/guide/pages-routing/overview)
* Void D1 文档：[https://void.cloud/guide/database/d1](https://void.cloud/guide/database/d1)
* 在线预览：[https://void-todo-lite.void.app](https://void-todo-lite.void.app)
* GitHub 仓库：[https://github.com/adui-studio/void-todo-lite](https://github.com/adui-studio/void-todo-lite)
