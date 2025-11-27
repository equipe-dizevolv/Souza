import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { toast } from 'sonner@2.0.3';

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Preencha todos os campos', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Validate specific credentials
    if (formData.email === 'admin@email.com' && formData.password === '1234') {
      toast.success('Login realizado com sucesso!', {
        position: 'top-center',
        duration: 3000,
      });
      
      // Store auth token
      if (rememberMe) {
        localStorage.setItem('auth_token', 'mock_token_123');
        localStorage.setItem('user_email', formData.email);
      } else {
        sessionStorage.setItem('auth_token', 'mock_token_123');
        sessionStorage.setItem('user_email', formData.email);
      }

      setTimeout(() => {
        navigate('/');
      }, 500);
    } else {
      toast.error('Credenciais inválidas', {
        position: 'top-center',
        duration: 3000,
        description: 'E-mail ou senha incorretos',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                AI Platform
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Marketing • Vendas • Head Hunter
              </p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[28px] leading-[39.2px] text-neutral-900 dark:text-white">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-[14px] leading-[19.6px] text-neutral-600 dark:text-neutral-400">
              Entre com suas credenciais para continuar
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="cursor-pointer text-[13px] leading-[18.2px] text-neutral-700 dark:text-neutral-300"
                >
                  Lembrar de mim
                </label>
              </div>
              <button
                type="button"
                onClick={() => navigate('/auth/forgot-password')}
                className="text-[13px] leading-[18.2px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-12 w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
            <span className="text-[13px] text-neutral-500">ou</span>
            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-[14px] leading-[19.6px] text-neutral-600 dark:text-neutral-400">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/signup')}
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Criar conta
            </button>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Image/Branding */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex h-full flex-col justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-12 text-white">
          <div className="mx-auto max-w-lg">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Sparkles className="h-10 w-10" />
            </div>
            <h2 className="mb-4 text-4xl font-bold">
              Potencialize seus resultados com IA
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-blue-100">
              Crie campanhas de marketing, automatize vendas e encontre os
              melhores talentos com inteligência artificial.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium">Marketing IA</p>
                  <p className="text-sm text-blue-100">
                    Briefings e campanhas geradas automaticamente
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium">Vendas Online IA</p>
                  <p className="text-sm text-blue-100">
                    Funis de vendas otimizados por IA
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <span className="text-sm">✓</span>
                </div>
                <div>
                  <p className="font-medium">Head Hunter IA</p>
                  <p className="text-sm text-blue-100">
                    Encontre talentos perfeitamente qualificados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}