# YggLeaf Frontend Makefile
# (´∀｀) 项目自动化构建与部署

.PHONY: help dev build preview test lint format check prod-upload

# 默认目标
help:
	@echo "YggLeaf Frontend - 可用命令："
	@echo "  make dev          - 启动开发服务器 (端口 3000)"
	@echo "  make build        - 生产构建"
	@echo "  make preview      - 预览构建结果"
	@echo "  make test         - 运行单元测试"
	@echo "  make lint         - ESLint 检查"
	@echo "  make format       - Prettier 格式化"
	@echo "  make check        - 自动修复 + 格式化"
	@echo "  make prod-upload  - 构建并上传到生产服务器"

# 开发服务器
dev:
	pnpm dev

# 生产构建
build:
	pnpm build

# 预览构建
preview:
	pnpm preview

# 单元测试
test:
	pnpm test

# ESLint 检查
lint:
	pnpm lint

# Prettier 格式化
format:
	pnpm format

# 自动修复 + 格式化
check:
	pnpm check

# 生产环境部署（构建 + 上传）
prod-upload: build
	@echo "＼(^o^)／ 开始上传到生产服务器..."
	@./script/upload.prod.sh
