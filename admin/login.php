<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вхід в адмін-панель - Перша приватна лікарня</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .login-container {
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            width: 100%;
            max-width: 400px;
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .login-logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #1a73e8, #0d47a1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            color: white;
            font-size: 24px;
        }
        
        .login-title {
            color: #333;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .login-subtitle {
            color: #666;
            font-size: 14px;
        }
        
        .form-group {
            margin-bottom: 20px;
            position: relative;
        }
        
        .form-group i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #666;
            z-index: 1;
        }
        
        .form-control {
            width: 100%;
            padding: 15px 15px 15px 45px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 16px;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.9);
        }
        
        .form-control:focus {
            outline: none;
            border-color: #1a73e8;
            box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
        }
        
        .btn-login {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #1a73e8, #0d47a1);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 20px;
        }
        
        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(26, 115, 232, 0.3);
        }
        
        .alert {
            padding: 12px 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        
        .alert-danger {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
        }
        
        .security-info {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
            text-align: center;
        }
        
        .security-info i {
            color: #3b82f6;
            margin-right: 8px;
        }
        
        .security-info small {
            color: #666;
            font-size: 13px;
        }
        
        .back-to-site {
            text-align: center;
            margin-top: 20px;
        }
        
        .back-to-site a {
            color: #1a73e8;
            text-decoration: none;
            font-size: 14px;
        }
        
        .back-to-site a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <div class="login-logo">
                <i class="fas fa-heartbeat"></i>
            </div>
            <h1 class="login-title">Адмін-панель</h1>
            <p class="login-subtitle">Перша приватна лікарня</p>
        </div>
        
        <?php
        require_once 'includes/auth.php';
        
        $auth = new Auth();
        $error = '';
        
        // Перенаправляем, если уже авторизован
        if ($auth->isLoggedIn()) {
            header('Location: dashboard.php');
            exit();
        }
        
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = trim($_POST['username'] ?? '');
            $password = $_POST['password'] ?? '';
            $csrf_token = $_POST['csrf_token'] ?? '';
            
            if (!$auth->validateCSRFToken($csrf_token)) {
                $error = 'Недійсний CSRF токен';
            } elseif (empty($username) || empty($password)) {
                $error = 'Заповніть всі поля';
            } elseif ($auth->login($username, $password)) {
                header('Location: dashboard.php');
                exit();
            } else {
                $error = 'Невірний логін або пароль';
                sleep(2); // Защита от брутфорса
            }
        }
        
        $csrf_token = $auth->generateCSRFToken();
        ?>
        
        <?php if ($error): ?>
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle"></i>
                <?= escape($error) ?>
            </div>
        <?php endif; ?>
        
        <form method="POST" action="">
            <input type="hidden" name="csrf_token" value="<?= escape($csrf_token) ?>">
            
            <div class="form-group">
                <i class="fas fa-user"></i>
                <input 
                    type="text" 
                    name="username" 
                    class="form-control" 
                    placeholder="Логін"
                    value="<?= escape($_POST['username'] ?? '') ?>"
                    required
                    autocomplete="username"
                >
            </div>
            
            <div class="form-group">
                <i class="fas fa-lock"></i>
                <input 
                    type="password" 
                    name="password" 
                    class="form-control" 
                    placeholder="Пароль"
                    required
                    autocomplete="current-password"
                >
            </div>
            
            <button type="submit" class="btn-login">
                <i class="fas fa-sign-in-alt"></i>
                Увійти
            </button>
        </form>
        
        <div class="security-info">
            <i class="fas fa-shield-alt"></i>
            <small>Захищено SSL шифруванням</small>
        </div>
        
        <div class="back-to-site">
            <a href="../index.html">
                <i class="fas fa-arrow-left"></i>
                Повернутися на сайт
            </a>
        </div>
    </div>
    
    <script>
        // Простая защита от автоматических атак
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.querySelector('form');
            let attempts = 0;
            
            form.addEventListener('submit', function() {
                attempts++;
                if (attempts > 3) {
                    setTimeout(() => {
                        form.style.pointerEvents = 'auto';
                    }, 5000);
                    form.style.pointerEvents = 'none';
                }
            });
        });
    </script>
</body>
</html>