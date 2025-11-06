# Smart Read - 博客系统

一个现代化的博客阅读系统，支持用户注册登录和文章动态加载。

## 功能特性

- ✅ 用户注册和登录功能
- ✅ 文章列表动态加载
- ✅ 分页显示
- ✅ 响应式设计
- ✅ 加载状态提示
- ✅ 错误处理和重试机制

## 技术栈

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Fetch API

## 项目结构

```
smart-read/
├── index.html       # 主页面
├── styles.css       # 样式文件
├── script.js        # JavaScript逻辑
└── README.md        # 项目说明
```

## 使用说明

### 本地运行

1. 确保后端服务运行在 `http://127.0.0.1:8080`
2. 直接用浏览器打开 `index.html` 文件

### API接口说明

#### 文章列表接口
- **URL**: `/article/list`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "pageNum": 1,
    "pageSize": 5
  }
  ```
- **Response**:
  ```json
  {
    "code": "200",
    "message": "获取文章列表成功",
    "data": "[{\"title\":\"文章标题1\",\"summary\":\"文章摘要1\",\"cover\":\"https://example.com/cover1.jpg\",\"content\":\"文章内容1...\",\"author\":\"作者1\",\"status\":\"published\",\"category\":\"技术\",\"createTime\":\"2024-01-01 10:00:00\",\"updateTime\":\"2024-01-01 10:00:00\"}]"
  }
  ```

#### 用户登录接口
- **URL**: `/login`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "userName": "用户名",
    "password": "密码",
    "remember": true
  }
  ```

#### 用户注册接口
- **URL**: `/register`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "userName": "用户名",
    "email": "邮箱",
    "password": "密码"
  }
  ```

## 主要功能

### 1. 文章列表

- 自动从接口加载文章列表
- 支持分页浏览
- 显示加载状态
- 空状态和错误状态提示

### 2. 用户系统

- 用户注册（带邮箱验证）
- 用户登录
- 记住登录状态
- 登出功能

### 3. UI/UX

- 现代化设计
- 响应式布局，支持移动端
- 流畅的动画效果
- 友好的错误提示

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 开发说明

### 修改API地址

在 `script.js` 中修改 `API_BASE_URL`:

```javascript
const API_BASE_URL = 'http://127.0.0.1:8080';
```

### 修改分页大小

在 `script.js` 的文章列表部分修改 `pageSize`:

```javascript
const pageSize = 5; // 每页显示5篇文章
```

## 更新日志

### v1.0.0 (2024)
- 初始版本
- 实现用户注册登录
- 实现文章列表动态加载
- 添加分页功能
