// 登录和注册弹窗功能
document.addEventListener('DOMContentLoaded', function() {
    // API配置
    const API_BASE_URL = 'http://127.0.0.1:8080';
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeLoginBtn = document.getElementById('closeLoginModal');
    const closeRegisterBtn = document.getElementById('closeRegisterModal');
    const loginForm = document.querySelector('.login-form');
    const registerForm = document.querySelector('.register-form');

    // 打开登录弹窗或登出
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 检查是否已登录（通过按钮文字判断）
        if (loginBtn.textContent !== '登陆') {
            // 已登录状态，执行登出
            if (confirm('确定要登出吗？')) {
                logout();
            }
        } else {
            // 未登录状态，打开登录弹窗
            loginModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });

    // 登出功能
    function logout() {
        // 清除本地存储
        localStorage.removeItem('rememberedUser');
        
        // 恢复登录按钮状态
        loginBtn.textContent = '登陆';
        loginBtn.classList.remove('logged-in');
        
        // 可以在这里调用登出API
        fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).catch(error => {
            console.error('登出API调用失败:', error);
        });
        
        alert('已登出');
    }

    // 关闭弹窗的通用函数
    function closeModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // 恢复滚动
    }

    // 点击关闭按钮
    closeLoginBtn.addEventListener('click', function() {
        closeModal(loginModal);
    });

    closeRegisterBtn.addEventListener('click', function() {
        closeModal(registerModal);
    });

    // 点击遮罩层关闭弹窗
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeModal(loginModal);
        }
    });

    registerModal.addEventListener('click', function(e) {
        if (e.target === registerModal) {
            closeModal(registerModal);
        }
    });

    // 按ESC键关闭弹窗
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (loginModal.classList.contains('show')) {
                closeModal(loginModal);
            } else if (registerModal.classList.contains('show')) {
                closeModal(registerModal);
            } else if (termsModal.classList.contains('show')) {
                closeModal(termsModal);
            }
        }
    });

    // 处理登录表单提交
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        const remember = document.querySelector('input[name="remember"]').checked;

        // 简单的表单验证
        if (!username.trim()) {
            alert('请输入用户名');
            return;
        }
        
        if (!password.trim()) {
            alert('请输入密码');
            return;
        }

        // 登录过程
        const submitBtn = document.querySelector('.login-submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = '登录中...';
        submitBtn.disabled = true;

        // 调用登录API
        fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: username,
                password: password,
                remember: remember
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('登录响应数据:', data);
            
            // 根据返回的code判断成功或失败
            if (data.code === "0") {
                // 登录成功
                alert(data.message || '登录成功！');
                closeModal(loginModal);
                
                // 重置表单
                loginForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // 更新UI，显示用户名
                loginBtn.textContent = username;
                loginBtn.classList.add('logged-in');
                
                // 保存登录状态到localStorage
                if (remember) {
                    localStorage.setItem('rememberedUser', username);
                }
            } else {
                // 登录失败，显示后端返回的错误信息
                alert(data.message || '登录失败，请重试');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        })
        .catch(error => {
            console.error('登录失败:', error);
            
            // 登录失败
            alert('登录失败，请检查用户名和密码');
            
            // 恢复按钮状态
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });

    // 忘记密码链接
    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        alert('忘记密码功能暂未实现');
    });

    // 注册链接 - 从登录弹窗切换到注册弹窗
    document.querySelector('.register-link').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal(loginModal);
        registerModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // 登录链接 - 从注册弹窗切换到登录弹窗
    document.querySelector('.login-link').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal(registerModal);
        loginModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // 处理注册表单提交
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.querySelector('input[name="agreeTerms"]').checked;

        // 清除所有之前的错误提示
        removeAllErrors();
        
        // 表单验证
        let hasError = false;
        
        if (!username.trim()) {
            showFieldError('registerUsername', '请输入用户名');
            hasError = true;
        }
        
        if (!email.trim()) {
            showFieldError('registerEmail', '请输入邮箱');
            hasError = true;
        } else {
            // 邮箱格式验证
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFieldError('registerEmail', '请输入正确的邮箱格式');
                hasError = true;
            }
        }
        
        if (!password.trim()) {
            showFieldError('registerPassword', '请输入密码');
            hasError = true;
        } else if (password.length < 6) {
            showFieldError('registerPassword', '密码长度至少6位');
            hasError = true;
        }
        
        if (!confirmPassword.trim()) {
            showFieldError('confirmPassword', '请再次输入密码');
            hasError = true;
        } else if (password !== confirmPassword) {
            showPasswordError('两次输入的密码不一致');
            hasError = true;
        }
        
        if (!agreeTerms) {
            alert('请同意用户协议');
            return;
        }
        
        if (hasError) {
            return;
        }

        // 注册过程
        const submitBtn = document.querySelector('.register-submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = '注册中...';
        submitBtn.disabled = true;

        // 调用注册API
        console.log('发送注册请求:', { userName: username, email: email, password: password });
        
        fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: username,
                email: email,
                password: password
            })
        })
        .then(response => {
            console.log('注册响应状态:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('注册响应数据:', data);
            console.log('code类型:', typeof data.code, '值:', data.code);
            
            // 根据返回的code判断成功或失败
            if (data.code === "0") {
                console.log('进入成功分支');
                // 注册成功
                alert(data.message || '注册成功！请登录');
                closeModal(registerModal);
                
                // 重置表单
                registerForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // 自动打开登录弹窗
                setTimeout(() => {
                    loginModal.classList.add('show');
                    document.body.style.overflow = 'hidden';
                }, 500);
            } else {
                console.log('进入失败分支');
                // 注册失败，显示后端返回的错误信息
                alert(data.message || '注册失败，请重试');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        })
        .catch(error => {
            console.error('注册失败详情:', error);
            
            // 根据错误类型显示不同的提示
            let errorMessage = '注册失败，请检查网络连接或稍后重试';
            
            if (error.message.includes('Failed to fetch')) {
                errorMessage = '无法连接到服务器，请检查后端服务是否启动';
            } else if (error.message.includes('404')) {
                errorMessage = '注册接口不存在，请检查后端API';
            } else if (error.message.includes('500')) {
                errorMessage = '服务器内部错误，请稍后重试';
            }
            
            alert(errorMessage);
            
            // 恢复按钮状态
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });

    // 用户协议弹窗功能
    const termsModal = document.getElementById('termsModal');
    const showTermsBtn = document.getElementById('showTerms');
    const closeTermsBtn = document.getElementById('closeTermsModal');

    // 显示用户协议弹窗
    showTermsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    // 关闭用户协议弹窗
    closeTermsBtn.addEventListener('click', function() {
        closeModal(termsModal);
    });

    // 点击遮罩层关闭用户协议弹窗
    termsModal.addEventListener('click', function(e) {
        if (e.target === termsModal) {
            closeModal(termsModal);
        }
    });

    // 邮箱输入框失去焦点时的验证
    const emailInput = document.getElementById('registerEmail');
    
    // 用户重新输入时清除错误提示
    emailInput.addEventListener('input', function() {
        removeEmailError();
        this.style.borderColor = '#ddd';
    });
    
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // 移除之前的错误提示
        removeEmailError();
        
        if (email && !emailRegex.test(email)) {
            this.style.borderColor = '#e74c3c';
            showEmailError('请输入正确的邮箱格式，如：12345678@qq.com');
        } else if (email && emailRegex.test(email)) {
            this.style.borderColor = '#27ae60';
        } else {
            this.style.borderColor = '#ddd';
        }
    });

    // 显示邮箱错误提示
    function showEmailError(message) {
        const emailGroup = emailInput.parentElement;
        const errorDiv = document.createElement('div');
        errorDiv.className = 'email-error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        emailGroup.appendChild(errorDiv);
    }

    // 移除邮箱错误提示
    function removeEmailError() {
        const existingError = document.querySelector('.email-error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    // 密码显示/隐藏功能
    function initPasswordToggle(passwordInputId, toggleId) {
        const passwordInput = document.getElementById(passwordInputId);
        const toggle = document.getElementById(toggleId);
        
        toggle.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggle.classList.add('active');
            } else {
                passwordInput.type = 'password';
                toggle.classList.remove('active');
            }
        });
    }

    // 初始化所有密码输入框的显示/隐藏功能
    initPasswordToggle('loginPassword', 'loginPasswordToggle');
    initPasswordToggle('registerPassword', 'registerPasswordToggle');
    initPasswordToggle('confirmPassword', 'confirmPasswordToggle');

    // 页面加载时检查登录状态
    function checkLoginStatus() {
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            loginBtn.textContent = rememberedUser;
            loginBtn.classList.add('logged-in');
        }
    }

    // 初始化登录状态检查
    checkLoginStatus();
    
    // 密码一致性验证
    function initPasswordValidation() {
        const passwordInput = document.getElementById('registerPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        // 确认密码输入时验证
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            
            // 移除之前的错误提示
            removePasswordError();
            
            if (confirmPassword && password !== confirmPassword) {
                this.style.borderColor = '#e74c3c';
                showPasswordError('两次输入的密码不一致');
            } else if (confirmPassword && password === confirmPassword) {
                this.style.borderColor = '#27ae60';
                passwordInput.style.borderColor = '#27ae60';
            } else {
                this.style.borderColor = '#ddd';
                passwordInput.style.borderColor = '#ddd';
            }
        });
        
        // 密码输入时也验证
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword) {
                if (password !== confirmPassword) {
                    this.style.borderColor = '#e74c3c';
                    confirmPasswordInput.style.borderColor = '#e74c3c';
                    showPasswordError('两次输入的密码不一致');
                } else {
                    this.style.borderColor = '#27ae60';
                    confirmPasswordInput.style.borderColor = '#27ae60';
                    removePasswordError();
                }
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    }
    
    // 显示密码错误提示
    function showPasswordError(message) {
        const confirmPasswordGroup = document.getElementById('confirmPassword').parentElement.parentElement; // 获取form-group
        const errorDiv = document.createElement('div');
        errorDiv.className = 'password-error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        errorDiv.style.fontWeight = '500';
        errorDiv.style.display = 'block';
        errorDiv.style.width = '100%';
        // 在form-group下方添加错误提示
        confirmPasswordGroup.appendChild(errorDiv);
    }
    
    // 移除密码错误提示
    function removePasswordError() {
        const existingError = document.querySelector('.password-error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // 通用错误提示函数
    function showFieldError(fieldId, message) {
        const fieldGroup = document.getElementById(fieldId).parentElement;
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginBottom = '8px';
        errorDiv.style.fontWeight = '500';
        // 在输入框上方插入错误提示
        fieldGroup.insertBefore(errorDiv, fieldGroup.firstChild);
    }
    
    // 移除通用错误提示
    function removeFieldError(fieldId) {
        const fieldGroup = document.getElementById(fieldId).parentElement;
        const existingError = fieldGroup.querySelector('.field-error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // 移除所有错误提示
    function removeAllErrors() {
        const allErrors = document.querySelectorAll('.password-error-message, .field-error-message');
        allErrors.forEach(error => error.remove());
    }
    
    // 初始化密码验证
    initPasswordValidation();
    
    // 添加输入框焦点事件，清除错误提示
    function initFieldFocusEvents() {
        const fields = ['registerUsername', 'registerEmail', 'registerPassword', 'confirmPassword'];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('focus', function() {
                    removeFieldError(fieldId);
                    // 如果是密码相关字段，也清除密码错误提示
                    if (fieldId === 'registerPassword' || fieldId === 'confirmPassword') {
                        removePasswordError();
                    }
                });
            }
        });
    }
    
    // 初始化字段焦点事件
    initFieldFocusEvents();
});

// 文章列表功能
document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://127.0.0.1:8080';
    const articleList = document.getElementById('articleList');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const paginationContainer = document.getElementById('paginationContainer');
    const pageNumbers = document.getElementById('pageNumbers');
    
    // 当前分页状态
    let currentPage = 1;
    const pageSize = 5; // 每页显示5篇文章
    let totalPages = 1;
    
    // 初始化：先获取文章总数，再加载第一页文章
    initArticleList();
    
    // 初始化文章列表
    async function initArticleList() {
        try {
            // 先获取文章总数
            await loadArticleCount();
            // 再加载第一页文章
            loadArticles(currentPage);
        } catch (error) {
            console.error('初始化失败:', error);
            showError('初始化失败，请刷新页面重试');
        }
    }
    
    // 获取文章总数
    function loadArticleCount() {
        return fetch(`${API_BASE_URL}/article/count`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('文章总数响应数据:', data);
            
            // 检查响应码
            if (data.code === "0" || data.code === "200") {
                // 解析返回的数据
                let count = 0;
                if (data.data) {
                    try {
                        count = typeof data.data === 'string' 
                            ? parseInt(data.data) 
                            : data.data;
                    } catch (e) {
                        console.error('解析文章总数失败:', e);
                        count = 0;
                    }
                }
                
                // 计算总页数
                totalPages = Math.max(1, Math.ceil(count / pageSize));
                console.log(`文章总数: ${count}, 总页数: ${totalPages}`);
            } else {
                throw new Error(data.message || '获取文章总数失败');
            }
        })
        .catch(error => {
            console.error('获取文章总数失败:', error);
            // 如果获取总数失败，仍然尝试加载文章，使用原来的逻辑
            totalPages = 1;
        });
    }
    
    // 加载文章列表
    function loadArticles(pageNum) {
        // 显示加载状态
        showLoading();
        
        // 发送请求获取文章列表
        fetch(`${API_BASE_URL}/article/list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pageNum: pageNum,
                pageSize: pageSize
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('文章列表响应数据:', data);
            
            // 检查响应码（接口返回"0"表示成功，"200"也表示成功）
            if (data.code === "0" || data.code === "200") {
                // 解析返回的数据
                let articles = [];
                if (data.data) {
                    try {
                        // data字段是字符串形式的JSON，需要解析
                        articles = typeof data.data === 'string' 
                            ? JSON.parse(data.data) 
                            : data.data;
                    } catch (e) {
                        console.error('解析文章数据失败:', e);
                        articles = [];
                    }
                }
                
                // 渲染文章列表
                renderArticles(articles);
                
                // 更新分页控件（总页数已经在初始化时通过总数接口获取）
                updatePagination();
            } else {
                throw new Error(data.message || '获取文章列表失败');
            }
        })
        .catch(error => {
            console.error('加载文章失败:', error);
            showError(error.message || '加载文章失败，请稍后重试');
        });
    }
    
    // 渲染文章列表
    function renderArticles(articles) {
        // 清空现有文章内容（但保留loadingIndicator的结构）
        // 移除所有文章项、错误消息和空状态
        const itemsToRemove = articleList.querySelectorAll('.article-item, .error-message, .empty-state');
        itemsToRemove.forEach(item => item.remove());
        
        // 隐藏加载状态
        hideLoading();
        
        // 如果没有文章，显示空状态
        if (!articles || articles.length === 0) {
            showEmptyState();
            return;
        }
        
        // 创建文章HTML
        articles.forEach((article, index) => {
            const articleElement = createArticleElement(article);
            articleList.appendChild(articleElement);
        });
    }
    
    // 创建单篇文章HTML
    function createArticleElement(article) {
        const articleItem = document.createElement('article');
        articleItem.className = 'article-item';
        
        // 格式化日期
        const formattedDate = formatDate(article.createTime || article.updateTime);
        
        // 构建HTML
        articleItem.innerHTML = `
            <div class="article-image">
                <img src="${article.cover || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop'}" 
                     alt="${article.title || '文章'}">
            </div>
            <div class="article-content">
                <div class="article-header">
                    <h3 class="article-title">${article.title || '无标题'}</h3>
                    <span class="article-date">${formattedDate}</span>
                </div>
                <p class="article-excerpt">
                    ${article.summary || article.content || '暂无摘要'}
                </p>
                <button class="read-more-btn" data-article-id="${article.id || ''}">Read More</button>
            </div>
        `;
        
        // 为Read More按钮添加点击事件
        const readMoreBtn = articleItem.querySelector('.read-more-btn');
        readMoreBtn.addEventListener('click', function() {
            showArticleDetail(article);
        });
        
        return articleItem;
    }
    
    // 格式化日期
    function formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    }
    
    // 显示加载状态
    function showLoading() {
        loadingIndicator.classList.remove('hidden');
        paginationContainer.style.display = 'none';
    }
    
    // 隐藏加载状态
    function hideLoading() {
        loadingIndicator.classList.add('hidden');
        paginationContainer.style.display = 'flex';
    }
    
    // 显示错误状态
    function showError(message) {
        hideLoading();
        
        // 移除现有的错误消息
        const existingError = articleList.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // 创建错误消息
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <p>${message}</p>
            <button class="error-retry-btn" onclick="location.reload()">重试</button>
        `;
        
        articleList.appendChild(errorDiv);
    }
    
    // 显示空状态
    function showEmptyState() {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.innerHTML = '<p>暂无文章</p>';
        articleList.appendChild(emptyDiv);
        
        paginationContainer.style.display = 'none';
    }
    
    // 更新分页控件
    function updatePagination() {
        // 清空页码按钮
        pageNumbers.innerHTML = '';
        
        // 生成所有页码按钮（1, 2, 3...格式）
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                loadArticles(currentPage);
                // 滚动到顶部
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pageNumbers.appendChild(pageBtn);
        }
    }
});

// 文章详情功能
document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://127.0.0.1:8080';
    const articleDetailModal = document.getElementById('articleDetailModal');
    const closeArticleDetailBtn = document.getElementById('closeArticleDetailModal');
    const articleDetailTitle = document.getElementById('articleDetailTitle');
    const articleDetailContent = document.getElementById('articleDetailContent');
    
    // 显示文章详情
    window.showArticleDetail = function(article) {
        // 设置标题
        articleDetailTitle.textContent = article.title || '文章详情';
        
        // 显示加载状态
        articleDetailContent.innerHTML = `
            <div class="article-detail-loading">
                <div class="loading-spinner"></div>
                <p>加载中...</p>
            </div>
        `;
        
        // 打开模态框
        articleDetailModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // 如果文章有完整内容，直接显示
        if (article.content) {
            renderArticleDetail(article);
        } else if (article.id) {
            // 如果有ID，尝试从API获取详细内容
            loadArticleDetail(article.id);
        } else {
            // 如果没有内容也没有ID，显示可用信息
            renderArticleDetail(article);
        }
    };
    
    // 从API加载文章详情
    function loadArticleDetail(articleId) {
        // 尝试调用文章详情API（如果后端支持）
        fetch(`${API_BASE_URL}/article/detail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: articleId
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.code === "0" || data.code === "200") {
                let articleData = null;
                if (data.data) {
                    try {
                        articleData = typeof data.data === 'string' 
                            ? JSON.parse(data.data) 
                            : data.data;
                    } catch (e) {
                        console.error('解析文章详情失败:', e);
                    }
                }
                if (articleData) {
                    renderArticleDetail(articleData);
                } else {
                    throw new Error('无法获取文章详情');
                }
            } else {
                throw new Error(data.message || '获取文章详情失败');
            }
        })
        .catch(error => {
            console.error('加载文章详情失败:', error);
            // 如果API调用失败，尝试使用列表中的信息
            articleDetailContent.innerHTML = `
                <div class="article-detail-error">
                    <p>无法加载文章详情，请稍后重试</p>
                </div>
            `;
        });
    }
    
    // 渲染文章详情
    function renderArticleDetail(article) {
        const formattedDate = formatArticleDate(article.createTime || article.updateTime);
        
        articleDetailContent.innerHTML = `
            <div class="article-detail-header">
                <div class="article-detail-meta">
                    <span class="article-detail-date">${formattedDate}</span>
                    ${article.author ? `<span class="article-detail-author">作者：${article.author}</span>` : ''}
                    ${article.category ? `<span class="article-detail-category">分类：${article.category}</span>` : ''}
                </div>
                ${article.cover ? `<div class="article-detail-cover">
                    <img src="${article.cover}" alt="${article.title || '文章封面'}">
                </div>` : ''}
            </div>
            <div class="article-detail-text">
                ${formatArticleContent(article.content || article.summary || '暂无内容')}
            </div>
        `;
    }
    
    // 格式化文章日期
    function formatArticleDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    }
    
    // 格式化文章内容（支持换行）
    function formatArticleContent(content) {
        if (!content) return '<p>暂无内容</p>';
        
        // 将换行符转换为<br>标签
        const formatted = content
            .replace(/\n/g, '<br>')
            .replace(/\r\n/g, '<br>');
        
        // 如果内容没有HTML标签，则包装在<p>标签中
        if (!formatted.includes('<') && !formatted.includes('>')) {
            return `<p>${formatted}</p>`;
        }
        
        return formatted;
    }
    
    // 关闭文章详情模态框
    function closeArticleDetailModal() {
        articleDetailModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // 点击关闭按钮
    closeArticleDetailBtn.addEventListener('click', function() {
        closeArticleDetailModal();
    });
    
    // 点击遮罩层关闭模态框
    articleDetailModal.addEventListener('click', function(e) {
        if (e.target === articleDetailModal) {
            closeArticleDetailModal();
        }
    });
    
    // 按ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && articleDetailModal.classList.contains('show')) {
            closeArticleDetailModal();
        }
    });
});
