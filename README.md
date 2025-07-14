# M-nback 记忆训练

🧠 一个基于 N-back 理论的工作记忆训练 Web 应用

**在线体验：** [nback.closeai.moe](https://nback.closeai.moe)

## 📖 项目简介

M-nback 是一个专业的工作记忆训练平台，基于经典的 N-back 认知训练理论设计。通过加法题的形式，训练用户的工作记忆能力、反应速度和注意力集中度。

### 🎯 核心特性

- **科学的训练机制**：基于 N-back 理论，支持 N1-N9 多种难度级别
- **双模式训练**：12题固定模式和无限练习模式
- **智能评分系统**：综合考虑准确率、反应速度和难度的非线性评分
- **详细数据统计**：完整的训练记录和可视化分析
- **响应式设计**：完美适配桌面端和移动端

## 🎮 游戏规则

### 基本玩法

1. **题目形式**：两数相加（A + B = ?）
   - A ∈ [0, 9]，B ∈ [1, 10-A]
   - 答案范围：[1, 10]

2. **N-back 机制**：
   - 前 N 题为记忆积累期，仅需记住答案
   - 从第 N+1 题开始，需要判断当前题的答案是否与 N 步之前的答案相同
   - 通过按钮面板（1-10）进行作答

3. **训练模式**：
   - **12题模式**：固定作答 12 题，适合快速训练
   - **无限模式**：持续训练直到主动退出，挑战极限

### 评分机制

采用科学的综合评分算法：

```
score = [100 × (c/t)^0.8 × r^2] × (1 + (N-1)/5)
```

其中：
- `c`：答对题数
- `t`：总耗时（秒）
- `r`：正确率
- `N`：当前难度级别

## 🚀 技术栈

- **前端框架**：Vue 3 + TypeScript
- **构建工具**：Vite
- **状态管理**：Pinia
- **UI 框架**：Tailwind CSS + DaisyUI
- **图表库**：ECharts + Vue-ECharts
- **包管理**：Bun

## 📊 功能特性

### 训练功能
- ✅ N1-N9 多难度级别选择
- ✅ 12题/无限双模式训练
- ✅ 实时反馈和进度显示
- ✅ 智能题目生成算法
- ✅ 记忆预览阶段

### 数据统计
- ✅ 完整的训练记录保存和历史查看
- ✅ 多维度筛选（模式、N值、时间范围）
- ✅ 概览统计卡片（总训练次数、平均准确率、平均分数、平均用时）
- ✅ 按模式分类的详细统计表格
- ✅ 首错位置分布可视化分析
- ✅ 分页历史记录表格
- ✅ 数据导出功能

### 用户体验
- ✅ 响应式设计，支持移动端
- ✅ 本地数据持久化
- ✅ 游戏规则说明
- ✅ 直观的结果展示

## 🛠️ 本地开发

### 环境要求

- Node.js 18+
- Bun (推荐) 或 npm/yarn

### 安装依赖

```bash
# 使用 Bun (推荐)
bun install

# 或使用 npm
npm install
```

### 开发服务器

```bash
# 启动开发服务器
bun run dev

# 或使用 npm
npm run dev
```

访问 `http://localhost:5173` 查看应用

### 构建部署

```bash
# 构建生产版本
bun run build

# 预览构建结果
bun run preview
```

## 📁 项目结构

```
src/
├── components/          # Vue 组件
│   ├── GameRulesModal.vue      # 游戏规则弹窗
│   ├── MemoryPreview.vue       # 记忆预览组件
│   ├── ResultsDisplay.vue      # 结果展示组件
│   ├── StatisticsView.vue      # 统计分析组件
│   ├── TrainingInterface.vue   # 训练界面组件
│   └── SiteFooter.vue          # 页脚组件
├── stores/              # Pinia 状态管理
│   └── game.ts                 # 游戏状态管理
├── types/               # TypeScript 类型定义
│   └── game.ts                 # 游戏相关类型
├── App.vue              # 根组件
├── main.ts              # 应用入口
└── style.css            # 全局样式
```

## 🎯 核心算法

### 题目生成算法

```typescript
generateQuestion(): QuestionGeneratorResult {
  const a = Math.floor(Math.random() * 10) // 0-9
  const maxB = 10 - a
  const b = Math.floor(Math.random() * maxB) + 1 // 1 to (10-a)
  const answer = a + b
  
  return { a, b, answer }
}
```

### 评分算法

```typescript
get score(): number {
  const elapsedSec = (this.endTime - this.startTime) / 1000
  const answered = this.answers.length - this.nValue
  const c = this.correctCount
  const speedFactor = Math.pow(c / elapsedSec, 0.8)
  const accuracy = c / answered
  const accuracyFactor = Math.pow(accuracy, 2)
  const base = 100 * speedFactor * accuracyFactor
  const nBonus = 1 + (this.nValue - 1) / 5
  
  return Math.round(base * nBonus)
}
```

## 📈 数据分析

应用提供丰富的数据分析功能：

- **训练记录**：完整保存每次训练的详细数据，支持分页浏览
- **筛选分析**：支持按训练模式、N值难度、时间范围进行多维度筛选
- **概览统计**：总训练次数、平均准确率、平均分数、平均用时等关键指标
- **详细统计表格**：按模式分类展示每个N值的详细表现数据
- **数据导出**：支持将筛选后的数据导出为JSON格式，便于进一步分析

### 🎯 首错位置分布分析

这是本应用的核心特色功能之一，通过可视化方式展示用户在12题训练中首次出错的位置分布：

**分析原理**：
- 统计每次12题训练中第一次答错发生在第几题（1-12题）
- 记录完全正确（无错误）的训练次数
- 生成直观的网格化可视图表，显示每个位置的出错次数和百分比

**获得的关键信息**：

1. **注意力衰减模式**：
   - 如果错误主要集中在后半段（第7-12题），说明随着训练进行，注意力逐渐分散
   - 前期错误较多可能表示记忆负荷过重，需要降低N值难度

2. **工作记忆容量评估**：
   - 持续在第3-5题出错，可能表示当前N值接近工作记忆容量上限
   - 大量"无错误"记录说明当前难度偏低，可以尝试更高N值

3. **训练策略优化**：
   - 特定位置的高错误率提示需要针对性练习
   - 错误分布的变化趋势反映训练效果和进步情况

4. **个人认知特征识别**：
   - 早期错误型：可能存在工作记忆编码问题
   - 中期错误型：可能是维持和更新机制的薄弱
   - 后期错误型：通常是注意力持续性的挑战

通过长期观察首错位置分布的变化，用户可以：
- 发现自己的认知弱点和优势
- 制定个性化的训练计划
- 客观评估训练效果
- 选择最适合的难度级别

## 🔧 配置说明

### 本地存储

应用使用浏览器 LocalStorage 保存：
- 用户配置（N值、模式选择）
- 训练记录历史
- 统计数据

### 数据格式

训练记录数据结构：

```typescript
interface TrainingRecord {
  username: string
  mode: '12' | 'unlimited'
  n: number
  question_count: number
  correct_count: number
  total_time_sec: number
  accuracy: number
  score: number
  timestamp: string
  exit_reason: 'completed' | 'abandoned'
  first_error_position?: number
}
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 基于 N-back 认知训练理论
- 使用 Vue 3 生态系统构建
- UI 设计灵感来自现代化训练应用

---

**开始你的记忆训练之旅：** [nback.closeai.moe](https://nback.closeai.moe)
