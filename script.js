// 登录和注册弹窗功能
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeLoginBtn = document.getElementById('closeLoginModal');
    const closeRegisterBtn = document.getElementById('closeRegisterModal');
    const loginForm = document.querySelector('.login-form');
    const registerForm = document.querySelector('.register-form');

    // 打开登录弹窗
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    });

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

        // 模拟登录过程
        const submitBtn = document.querySelector('.login-submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = '登录中...';
        submitBtn.disabled = true;

        // 模拟API调用
        setTimeout(() => {
            // 这里可以添加实际的登录逻辑
            console.log('登录信息:', { username, password, remember });
            
            // 登录成功
            alert('登录成功！');
            closeModal(loginModal);
            
            // 重置表单
            loginForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // 可以在这里更新UI，比如显示用户名
            loginBtn.textContent = username;
            loginBtn.style.backgroundColor = '#28a745';
            
        }, 1500);
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

        // 表单验证
        if (!username.trim()) {
            alert('请输入用户名');
            return;
        }
        
        if (!email.trim()) {
            alert('请输入邮箱');
            return;
        }
        
        // 邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('请输入正确的邮箱格式');
            return;
        }
        
        if (!password.trim()) {
            alert('请输入密码');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }
        
        if (password.length < 6) {
            alert('密码长度至少6位');
            return;
        }
        
        if (!agreeTerms) {
            alert('请同意用户协议');
            return;
        }

        // 模拟注册过程
        const submitBtn = document.querySelector('.register-submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = '注册中...';
        submitBtn.disabled = true;

        // 模拟API调用
        setTimeout(() => {
            // 这里可以添加实际的注册逻辑
            console.log('注册信息:', { username, email, password, agreeTerms });
            
            // 注册成功
            alert('注册成功！请登录');
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
            
        }, 1500);
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
});
