#!/usr/bin/env bash
# ============================================
# YggLeaf Frontend - 交互式多环境部署脚本
# (´∀｀) 使用 gum 交互式界面，美观又好用
# ============================================

set -euo pipefail

# ============================================
# 环境配置（置顶）
# ============================================
readonly DEPLOY_FRONTLEAVES_SERVER=comprehensive.frontleaves.com
readonly TEST_SERVER=172.16.100.5
readonly TEST_DEPLOY_USER=root
readonly TEST_DEPLOY_PATH=/opt/1panel/www/sites/yggleaf-test/index

# 默认环境配置（可通过环境变量覆盖）
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/1panel/www/sites/yggleaf/index}"
DEPLOY_SSH_KEY="${DEPLOY_SSH_KEY:-}"
LOCAL_DIST_DIR="${LOCAL_DIST_DIR:-./dist}"

# ============================================
# 主题配色 (枫叶主题 💚)
# ============================================
readonly BRAND_PRIMARY='#2d5a27'    # 枫叶绿
readonly BRAND_SECONDARY='#5c8d89'  # 青绿色
readonly SUCCESS='#22c55e'          # 成功绿
readonly WARNING='#f59e0b'          # 警告橙
readonly DESTRUCTIVE='#ef4444'      # 错误红
readonly MUTED='#64748b'            # 柔和灰

# ============================================
# UI 组件（左右分栏布局）
# ============================================

# 状态行：左侧描述（60字符宽），右侧状态（15字符右对齐）
status_row() {
    local desc="$1"
    local state="$2"
    local color="${3:-$SUCCESS}"
    gum join --horizontal \
        "$(gum style --width 60 "$desc")" \
        "$(gum style --width 15 --align right --foreground "$color" "$state")"
}

# 步骤标题：左侧标题（60字符宽），右侧状态（15字符右对齐）
step_header() {
    local num="$1"
    local title="$2"
    local state="${3:-进行中}"
    local color="${4:-$WARNING}"
    gum join --horizontal \
        "$(gum style --width 60 --bold "步骤 $num/5  $title")" \
        "$(gum style --width 15 --align right --foreground "$color" "$state")"
}

# 信息面板（带边框）
info_panel() {
    local title="$1"
    shift
    gum style --border normal --border-foreground "$BRAND_PRIMARY" --padding "0 2" \
        "$(gum style --bold "$title")" "" "$@"
}

# 成功面板（绿色边框）
success_panel() {
    local title="$1"
    shift
    gum style --border normal --border-foreground "$SUCCESS" --padding "0 2" \
        "$(gum style --bold --foreground "$SUCCESS" "$title")" "" "$@"
}

# 错误面板（红色边框）
error_panel() {
    local title="$1"
    shift
    gum style --border normal --border-foreground "$DESTRUCTIVE" --padding "0 2" \
        "$(gum style --bold --foreground "$DESTRUCTIVE" "$title")" "" "$@"
}

# 日志函数
log_info() {
    gum style --foreground "$BRAND_PRIMARY" --bold "[INFO] $*"
}

log_error() {
    gum style --foreground "$DESTRUCTIVE" --bold "[ERROR] $*"
}

log_success() {
    gum style --foreground "$SUCCESS" --bold "✅ $*"
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
        "$(gum style --foreground "$MUTED" "交互式多环境部署工具")"

    # ============================================
    # 步骤 1/5：选择部署环境
    # ============================================
    step_header "1" "选择部署环境"
    echo ""

    SERVER_TYPE=$(gum choose "默认" "测试服务器")

    # 根据选择动态设置部署目标与构建模式
    local BUILD_MODE
    local ENV_FILE
    if [ "$SERVER_TYPE" = "默认" ]; then
        DEPLOY_SERVER="$DEPLOY_FRONTLEAVES_SERVER"
        BUILD_MODE="production"
        ENV_FILE=".env.production"
    elif [ "$SERVER_TYPE" = "测试服务器" ]; then
        DEPLOY_SERVER="$TEST_SERVER"
        DEPLOY_USER="${TEST_DEPLOY_USER:-$DEPLOY_USER}"
        DEPLOY_PATH="${TEST_DEPLOY_PATH:-$DEPLOY_PATH}"
        BUILD_MODE="test"
        ENV_FILE=".env.test"
    fi

    success_panel "环境选择" \
        "部署环境: $SERVER_TYPE" \
        "目标服务器: $DEPLOY_SERVER" \
        "构建模式: $BUILD_MODE" \
        "配置文件: $ENV_FILE"
    echo ""

    # ============================================
    # 步骤 2/5：检查文件与依赖
    # ============================================
    step_header "2" "检查文件与依赖"
    echo ""

    local file_status_rows=()
    local all_passed=true

    # 检查环境配置文件
    if [ -f "$ENV_FILE" ]; then
        file_status_rows+=("$(status_row "环境配置 $ENV_FILE" "✅ 通过" "$SUCCESS")")
    else
        file_status_rows+=("$(status_row "环境配置 $ENV_FILE" "❌ 缺失" "$DESTRUCTIVE")")
        all_passed=false
    fi

    # 检查构建产物
    if [ -d "$LOCAL_DIST_DIR" ]; then
        file_status_rows+=("$(status_row "构建产物 $LOCAL_DIST_DIR/" "✅ 找到" "$SUCCESS")")
    else
        file_status_rows+=("$(status_row "构建产物 $LOCAL_DIST_DIR/" "⚠️ 缺失" "$WARNING")")
    fi

    # 检查 package.json
    if [ -f "package.json" ]; then
        file_status_rows+=("$(status_row "项目文件 package.json" "✅ 找到" "$SUCCESS")")
    else
        file_status_rows+=("$(status_row "项目文件 package.json" "❌ 缺失" "$DESTRUCTIVE")")
        all_passed=false
    fi

    # 检查 rsync
    if command -v rsync >/dev/null 2>&1; then
        file_status_rows+=("$(status_row "依赖工具 rsync" "✅ 已安装" "$SUCCESS")")
    else
        file_status_rows+=("$(status_row "依赖工具 rsync" "❌ 未安装" "$DESTRUCTIVE")")
        all_passed=false
    fi

    # 检查 SSH Key（如果设置了）
    if [ -n "$DEPLOY_SSH_KEY" ]; then
        if [ -r "$DEPLOY_SSH_KEY" ]; then
            file_status_rows+=("$(status_row "SSH Key $DEPLOY_SSH_KEY" "✅ 可读" "$SUCCESS")")
        else
            file_status_rows+=("$(status_row "SSH Key $DEPLOY_SSH_KEY" "❌ 不可读" "$DESTRUCTIVE")")
            all_passed=false
        fi
    fi

    success_panel "检查结果" "${file_status_rows[@]}"
    echo ""

    if [ "$all_passed" = false ]; then
        error_panel "检查失败" "部分必要文件或依赖缺失，部署无法继续。"
        exit 1
    fi

    # ============================================
    # 步骤 3/5：构建项目（按环境选择模式）
    # ============================================
    step_header "3" "构建项目"
    echo ""

    # 构建前确认环境
    info_panel "构建确认" \
        "$(status_row "构建模式" "$BUILD_MODE" "$BRAND_PRIMARY")" \
        "$(status_row "配置文件" "$ENV_FILE" "$BRAND_PRIMARY")" \
        "$(status_row "目标环境" "$SERVER_TYPE" "$BRAND_PRIMARY")"
    echo ""

    if ! gum confirm \
        --affirmative "确认构建" \
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

    echo ""

    if [ ! -d "$LOCAL_DIST_DIR" ]; then
        log_info "未找到构建产物，开始构建 ($BUILD_MODE 模式)..."
        gum spin \
            --spinner dot \
            --title "正在构建项目 ($BUILD_MODE 模式)..." \
            --show-output \
            -- pnpm build --mode "$BUILD_MODE"
        success_panel "构建完成" "模式: $BUILD_MODE" "输出: $LOCAL_DIST_DIR"
    else
        gum style --foreground "$MUTED" "已存在构建产物，是否重新构建？"
        echo ""
        if gum confirm \
            --affirmative "重新构建" \
            --negative "跳过" \
            --default negative; then
            gum spin \
                --spinner dot \
                --title "正在重新构建项目 ($BUILD_MODE 模式)..." \
                --show-output \
                -- pnpm build --mode "$BUILD_MODE"
            success_panel "构建完成" "模式: $BUILD_MODE" "输出: $LOCAL_DIST_DIR"
        else
            success_panel "跳过构建" "使用现有构建产物: $LOCAL_DIST_DIR"
        fi
    fi
    echo ""

    # ============================================
    # 步骤 4/5：测试连接
    # ============================================
    step_header "4" "测试连接"
    echo ""

    local ssh_opts="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
    if [ -n "$DEPLOY_SSH_KEY" ]; then
        ssh_opts="$ssh_opts -i $DEPLOY_SSH_KEY"
    fi

    if gum spin \
        --spinner dot \
        --title "正在测试 SSH 连接 ($DEPLOY_USER@$DEPLOY_SERVER)..." \
        -- ssh $ssh_opts "$DEPLOY_USER@$DEPLOY_SERVER" "echo > /dev/null"; then
        success_panel "连接测试" "SSH 连接成功: $DEPLOY_USER@$DEPLOY_SERVER"
    else
        error_panel "连接失败" "无法通过 SSH 连接到 $DEPLOY_USER@$DEPLOY_SERVER" \
            "请检查网络、SSH 配置及服务器状态。"
        exit 1
    fi
    echo ""

    # ============================================
    # 步骤 5/5：确认并部署
    # ============================================
    step_header "5" "确认并部署"
    echo ""

    info_panel "部署信息" \
        "$(status_row "部署环境" "$SERVER_TYPE" "$BRAND_PRIMARY")" \
        "$(status_row "构建模式" "$BUILD_MODE" "$BRAND_PRIMARY")" \
        "$(status_row "目标服务器" "$DEPLOY_USER@$DEPLOY_SERVER" "$BRAND_PRIMARY")" \
        "$(status_row "目标路径" "$DEPLOY_PATH" "$BRAND_PRIMARY")" \
        "$(status_row "本地目录" "$LOCAL_DIST_DIR" "$BRAND_PRIMARY")"
    echo ""

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

    echo ""

    # 执行 rsync 上传
    local remote_dest="$DEPLOY_USER@$DEPLOY_SERVER:$DEPLOY_PATH"
    local rsync_cmd=(rsync)
    rsync_cmd+=("-e" "ssh $ssh_opts")
    rsync_cmd+=(-avz --delete --progress)
    rsync_cmd+=("$LOCAL_DIST_DIR/" "$remote_dest")

    log_info "开始上传到 $DEPLOY_SERVER..."
    gum spin \
        --spinner dot \
        --title "正在同步文件到 $DEPLOY_SERVER..." \
        --show-output \
        -- "${rsync_cmd[@]}"

    # 显示完成信息
    gum style \
        --foreground "$SUCCESS" \
        --border-foreground "$SUCCESS" \
        --border double \
        --align center \
        --padding "2 4" \
        --margin "1 0" \
        "✅ 部署成功！" \
        "" \
        "$(gum style --foreground "$MUTED" "服务器: $DEPLOY_SERVER")" \
        "$(gum style --foreground "$MUTED" "路径: $DEPLOY_PATH")" \
        "$(gum style --foreground "$MUTED" "环境: $SERVER_TYPE")" \
        "$(gum style --foreground "$MUTED" "构建模式: $BUILD_MODE")"
}

main
