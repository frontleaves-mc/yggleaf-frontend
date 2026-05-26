# Project Agent Rules

## Frontend Admin Constraints

### Admin ID Input Restriction (CRITICAL)

**前端管理端禁止任何形式的直接让管理员手动填写资源 ID 的行为。**

- 所有涉及资源关联（皮肤库、披风库、档案等）的操作，必须使用下拉选择器（Select / Combobox）展示可选项供管理员选择
- 如果当前没有可用的列表接口来获取可选项数据，必须暂停并询问用户，指出该缺陷，而非退而求其次使用 Input 手动填写 ID
- 此约束适用于所有管理员操作面板中的资源选择场景

**例外**: 仅当该 ID 是系统内部自动生成且无对应列表接口时（如日志追踪 ID），才允许 Input 输入，但必须在 placeholder 中明确说明格式要求
