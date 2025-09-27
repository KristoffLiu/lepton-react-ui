# lepton-ui

共享的 React UI 组件库，用于 MemEcho 项目。

## 安装

```bash
pnpm add @lepton-ui/react
```

## 使用

```tsx
import { Button, Input, Card } from '@lepton-ui/react'

function App() {
  return (
    <Card>
      <Input label="用户名" placeholder="请输入用户名" />
      <Button variant="primary">提交</Button>
    </Card>
  )
}
```

## 组件

### Button

按钮组件，支持多种样式和尺寸。

```tsx
<Button variant="primary" size="lg">主要按钮</Button>
<Button variant="secondary" size="md">次要按钮</Button>
<Button variant="outline" size="sm">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `children`: React.ReactNode

### Input

输入框组件，支持标签、错误信息和帮助文本。

```tsx
<Input 
  label="用户名" 
  placeholder="请输入用户名"
  error="用户名不能为空"
  helperText="用户名长度为3-20个字符"
/>
```

**Props:**
- `label?: string` - 标签文本
- `error?: string` - 错误信息
- `helperText?: string` - 帮助文本

### Card

卡片容器组件。

```tsx
<Card variant="elevated">
  <h3>卡片标题</h3>
  <p>卡片内容</p>
</Card>
```

**Props:**
- `variant`: 'default' | 'outlined' | 'elevated'

## 开发

### 构建

```bash
pnpm run build
```

### 开发模式

```bash
pnpm run dev
```

### 类型检查

```bash
pnpm run type-check
```

### 代码检查

```bash
pnpm run lint
```

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Vite (构建工具)
