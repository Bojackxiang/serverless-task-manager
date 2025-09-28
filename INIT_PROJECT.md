# 项目初始化指南 (Project Initialization Guide)

## 项目概述

这是一个基于 Node.js + Express 后端和 Next.js 前端的全栈任务管理系统，使用 PostgreSQL 数据库和 Prisma ORM。

## 系统要求

在开始之前，请确保您的系统已安装以下软件：

- Node.js (版本 18.0 或更高)
- npm (通常与 Node.js 一起安装)
- Git
- 一个 PostgreSQL 数据库实例 (本项目使用 Neon 云数据库)

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Bojackxiang/serverless-task-manager.git
cd serverless-task-manager
```

### 2. 后端设置

#### 2.1 进入后端目录

```bash
cd backend
```

#### 2.2 安装依赖

```bash
npm install
```

#### 2.3 环境变量配置

后端目录中已包含 `.env` 文件，包含以下配置：

```
PORT=8000
DATABASE_URL="postgresql://neondb_owner:npg_0Hl9xEWRSofn@ep-late-lake-a7p75j1h-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channelBinding=require"
```

**注意：**

- 如果您想使用自己的数据库，请修改 `DATABASE_URL`
- 确保 PostgreSQL 数据库可以正常连接

#### 2.4 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库架构 (如果数据库是新的)
npm run db:push

# 或者运行迁移 (如果有迁移文件)
npm run db:migrate

# 可选：打开 Prisma Studio 查看数据库内容
npm run db:studio
```

#### 2.5 启动后端服务器

```bash
npm run dev
```

后端服务器将在 `http://localhost:8000` 启动

### 3. 前端设置

#### 3.1 打开新的终端窗口，进入前端目录

```bash
cd frontend
```

#### 3.2 安装依赖

```bash
npm install
```

#### 3.3 启动前端开发服务器

```bash
npm run dev
```

前端应用将在 `http://localhost:3000` 启动

## 项目架构说明

### 后端架构 (Backend)

```
backend/
├── controllers/        # 控制器层，处理 HTTP 请求
├── dao/               # 数据访问对象层，处理数据库操作
├── services/          # 业务逻辑层
├── lib/              # 共享库文件
├── utils/            # 工具函数
├── prisma/           # Prisma 配置和数据库架构
├── app.js           # Express 应用配置
├── index.js         # 服务器入口点
└── package.json     # 后端依赖配置
```

### 前端架构 (Frontend)

```
frontend/
├── src/
│   ├── app/          # Next.js App Router 页面
│   ├── components/   # React 组件
│   ├── hooks/        # 自定义 React hooks
│   └── lib/          # 前端工具库
├── public/           # 静态资源
└── package.json      # 前端依赖配置
```

## 开发流程

### 数据库操作

```bash
# 在 backend 目录下执行以下命令：

# 生成 Prisma 客户端
npm run db:generate

# 创建新的数据库迁移
npx prisma migrate dev --name your-migration-name

# 推送架构变更到数据库
npm run db:push

# 重置数据库 (谨慎使用)
npm run db:reset

# 打开数据库管理界面
npm run db:studio
```

### 前端开发

```bash
# 在 frontend 目录下执行：

# 开发模式启动 (带 Turbopack 加速)
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

### 后端开发

```bash
# 在 backend 目录下执行：

# 开发模式启动
npm run dev
```

## 常见问题解决

### 1. 数据库连接问题

如果遇到数据库连接错误：

- 检查 `.env` 文件中的 `DATABASE_URL` 是否正确
- 确保数据库服务器正在运行
- 检查网络连接和防火墙设置

### 2. 依赖安装问题

如果 `npm install` 失败：

```bash
# 清理依赖并重新安装
npm run clean
# 然后重新安装
npm install
```

### 3. 端口冲突

如果端口 3000 或 8000 被占用：

- 前端：修改 `next.config.ts` 或使用 `npm run dev -- -p 3001`
- 后端：修改 `.env` 文件中的 `PORT` 值

### 4. Prisma 相关问题

```bash
# 重新生成 Prisma 客户端
npx prisma generate

# 检查数据库连接
npx prisma db push --preview-feature
```

## 项目特性

### 技术栈

- **后端**: Node.js + Express + Prisma + PostgreSQL
- **前端**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **UI 组件**: Radix UI + shadcn/ui
- **数据库**: PostgreSQL (Neon Cloud)

### 主要功能

- 任务管理系统
- RESTful API
- 响应式前端界面
- 数据库 ORM 管理

## 部署说明

### 后端部署

1. 设置生产环境的环境变量
2. 运行数据库迁移: `npx prisma migrate deploy`
3. 启动应用: `npm start`

### 前端部署

1. 构建应用: `npm run build`
2. 启动生产服务器: `npm start`

## 开发建议

1. **数据库变更**: 任何数据库架构变更都应该通过 Prisma 迁移进行
2. **代码规范**: 前端使用 ESLint，请在提交前运行 `npm run lint`
3. **环境隔离**: 开发、测试、生产环境使用不同的数据库实例
4. **版本控制**: 不要提交 `.env` 文件到版本控制系统

## 获取帮助

如果在项目初始化过程中遇到问题，请：

1. 检查系统要求是否满足
2. 查看常见问题解决方案
3. 检查项目的 GitHub Issues
4. 联系项目维护者

---

**注意**: 本指南基于项目当前状态编写，如果项目结构发生变化，请相应更新此文档。
