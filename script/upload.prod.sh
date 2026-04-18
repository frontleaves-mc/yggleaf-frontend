#!/usr/bin/env bash
# ============================================
# YggLeaf Frontend - 生产环境部署脚本
# (´∀｀) 使用 gum 交互式界面，美观又好用
# ============================================

set -euo pipefail

# ============================================
# 主题配色 (枫叶主题 💚)
# ============================================
readonly BRAND_PRIMARY='#2d5a27'    # 枫叶绿
readonly BRAND_SECONDARY='#5c8d89'  # 青绿色
readonly BRAND_DARK='#1a1c18'       # 深灰绿
readonly FOREGROUND='#1f2623'       # 前景色
readonly MUTED='#64748b'            # 柔和灰
readonly DESTRUCTIVE='#ef4444'      # 错误红

# 配置项（可通过环境变量覆盖）
DEPLOY_SERVER="${DEPLOY_SERVER:-${DEPLOY_FRONTLEAVES_SERVER:-}}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/1panel/www/sites/yggleaf/index}"
DEPLOY_SSH_KEY="${DEPLOY_SSH_KEY:-}"
LOCAL_DIST_DIR="${LOCAL_DIST_DIR:-./dist}"

# ============================================
# 工具函数 (gum 风格)
# ============================================

log_info() {
    gum style \
        --foreground "$BRAND_PRIMARY" \
        --bold \
        "[INFO] $*"
}

log_warn() {
    gum style \
        --foreground "#f59e0b" \
        --bold \
        "[WARN] $*"
}

log_error() {
    gum style \
        --foreground "$DESTRUCTIVE" \
        --bold \
        "[ERROR] $*"
}

log_success() {
    gum style \
        --foreground "$BRAND_PRIMARY" \
        --bold "✅ $*"
}

# ============================================
# 检查函数
# ============================================

check_gum() {
    if ! command -v gum >/dev/null 2>&1; then
        log_error "缺少必要依赖: gum"
        gum style --foreground "$MUTED" "请安装 gum: brew install gum"
        exit 1
    fi
}

check_prerequisites() {
    if ! command -v rsync >/dev/null 2>&1; then
        log_error "缺少必要依赖: rsync"
        exit 1
    fi

    if [ -z "$DEPLOY_SERVER" ]; then
        log_error "未设置服务器地址！"
        gum style \
            --foreground "$MUTED" \
            --margin "1 0" \
            "请设置环境变量: export DEPLOY_SERVER=your-server.com"
        gum style \
            --foreground "$MUTED" \
            "(兼容旧变量: DEPLOY_FRONTLEAVES_SERVER)"
        exit 1
    fi

    if [ -n "$DEPLOY_SSH_KEY" ] && [ ! -r "$DEPLOY_SSH_KEY" ]; then
        log_error "SSH Key 不存在或不可读: $DEPLOY_SSH_KEY"
        exit 1
    fi

    if [ ! -d "$LOCAL_DIST_DIR" ]; then
        log_error "构建目录不存在: $LOCAL_DIST_DIR"
        gum style \
            --foreground "$MUTED" \
            "请先运行: pnpm build"
        exit 1
    fi
}

# ============================================
# 显示部署信息
# ============================================

print_config() {
    gum style \
        --foreground "$BRAND_PRIMARY" \
        --border normal \
        --border-foreground "$BRAND_SECONDARY" \
        --padding "1 2" \
        --margin "1 0" \
        --align center \
        "$(gum join --vertical \
            "$(gum style --bold "📦 部署配置")" \
            "" \
            "$(gum style --foreground "$MUTED" "服务器:") $(gum style --bold "$DEPLOY_USER@$DEPLOY_SERVER")" \
            "$(gum style --foreground "$MUTED" "目标路径:") $(gum style --bold "$DEPLOY_PATH")" \
            "$(gum style --foreground "$MUTED" "本地目录:") $(gum style --bold "$LOCAL_DIST_DIR")" \
            "$(gum style --foreground "$MUTED" "SSH Key:") $(gum style --bold "${DEPLOY_SSH_KEY:-未设置}")" \
        )"
    echo ""
}

# ============================================
# 执行 rsync 上传
# ============================================

run_rsync() {
    local remote_dest="$DEPLOY_USER@$DEPLOY_SERVER:$DEPLOY_PATH"
    local rsync_cmd=("rsync")

    # 添加 SSH 选项
    if [ -n "$DEPLOY_SSH_KEY" ]; then
        rsync_cmd+=("-e" "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -i $DEPLOY_SSH_KEY")
    else
        rsync_cmd+=("-e" "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null")
    fi

    # 添加 rsync 参数
    rsync_cmd+=(-avz --delete --progress)

    # 源目录和目标目录
    rsync_cmd+=("$LOCAL_DIST_DIR/" "$remote_dest")

    # 使用 gum spin 显示加载动画
    log_info "开始上传到 $DEPLOY_SERVER..."
    gum spin \
        --spinner dot \
        --title "正在同步文件..." \
        --show-output \
        -- "${rsync_cmd[@]}"

    log_success "部署完成！"

    # 显示完成信息
    gum style \
        --foreground "$BRAND_PRIMARY" \
        --border-foreground "$BRAND_SECONDARY" \
        --border double \
        --align center \
        --padding "1 2" \
        --margin "1 0" \
        "✅ 部署成功！" \
        "" \
        "$(gum style --foreground "$MUTED" "服务器: $DEPLOY_SERVER")" \
        "$(gum style --foreground "$MUTED" "路径: $DEPLOY_PATH")"
}

# ============================================
# 确认部署
# ============================================

confirm_deployment() {
    gum style \
        --foreground "$BRAND_PRIMARY" \
        --border normal \
        --border-foreground "$BRAND_SECONDARY" \
        --padding "1 2" \
        --margin "1 0" \
        "$(gum join --vertical \
            "$(gum style --bold "⚡ 即将开始部署")" \
            "" \
            "$(gum style --foreground "$MUTED" "确认要开始部署吗？")" \
        )"

    if ! gum confirm \
        --affirmative "确认部署" \
        --negative "取消" \
        --selected.foreground "$BRAND_PRIMARY" \
        --selected.background "235" \
        --default affirmative; then
        gum style \
            --foreground "$DESTRUCTIVE" \
            --margin "1 0" \
            "✖ 已取消部署"
        exit 0
    fi

    gum style --margin "1 0" ""
}

# ============================================
# 主流程
# ============================================

main() {
    # 检查 gum 是否安装
    check_gum

    # 显示欢迎信息
    gum style \
        --foreground "$BRAND_PRIMARY" \
        --border-foreground "$BRAND_SECONDARY" \
        --border double \
        --align center \
        --padding "2 4" \
        --margin "1 0 2 0" \
        "$(gum style --bold --foreground "$BRAND_PRIMARY" "🍃 YggLeaf Frontend")" \
        "$(gum style --foreground "$MUTED" "生产环境部署工具")"

    # 显示配置信息
    print_config

    # 检查必要条件
    check_prerequisites

    # 确认部署
    confirm_deployment

    # 执行部署
    run_rsync
}

main "$@"
