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
