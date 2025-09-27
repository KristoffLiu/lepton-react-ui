# lepton-react-ui GitHub 设置指南

## 上传到 GitHub 的步骤

### 1. 在 GitHub 上创建新仓库

1. 访问 [GitHub](https://github.com)
2. 点击 "New repository" 或 "+" 按钮
3. 填写仓库信息：
   - **Repository name**: `lepton-react-ui`
   - **Description**: `Shared React UI component library for MemEcho projects`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了）

### 2. 连接本地仓库到 GitHub

在 `packages/lepton-ui` 目录下运行：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/lepton-react-ui.git

# 推送代码到 GitHub
git branch -M main
git push -u origin main
```

### 3. 更新主项目的 Git Submodule

回到主项目根目录，更新 `.gitmodules` 文件：

```bash
cd ../..
```

编辑 `.gitmodules` 文件，将 URL 更新为你的 GitHub 仓库地址：

```ini
[submodule "packages/lepton-ui"]
	path = packages/lepton-ui
	url = https://github.com/YOUR_USERNAME/lepton-react-ui.git
```

然后提交更改：

```bash
git add .gitmodules
git commit -m "Update lepton-ui submodule URL"
```

### 4. 设置 GitHub Actions（可选）

在 `packages/lepton-ui` 目录下创建 `.github/workflows/ci.yml`：

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Setup pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build library
      run: pnpm run build
      
    - name: Run linting
      run: pnpm run lint
      
    - name: Run type check
      run: pnpm run type-check
```

### 5. 发布到 npm（可选）

如果你想将 lepton-ui 发布到 npm：

1. 在 [npm](https://www.npmjs.com) 上注册账号
2. 登录 npm：
   ```bash
   npm login
   ```
3. 发布包：
   ```bash
   pnpm publish
   ```

## 开发工作流

### 在 lepton-ui 中开发

1. 在 `packages/lepton-ui` 目录下进行开发
2. 提交更改：
   ```bash
   git add .
   git commit -m "feat: add new component"
   git push origin main
   ```

### 在主项目中使用更新

1. 回到主项目根目录
2. 更新 submodule：
   ```bash
   git submodule update --remote packages/lepton-ui
   ```
3. 提交 submodule 更新：
   ```bash
   git add packages/lepton-ui
   git commit -m "Update lepton-ui to latest version"
   ```

## 注意事项

- lepton-react-ui 现在是一个独立的 Git 仓库
- 可以通过 Git Submodules 在主项目中引用
- 支持独立的版本控制和发布
- 可以设置独立的 CI/CD 流程
