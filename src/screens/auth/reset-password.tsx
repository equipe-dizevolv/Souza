import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner@2.0.3';

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidToken(false);
        setIsValidating(false);
        return;
      }

      // Simulate API call to validate token
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock validation - in real app, call backend
      setIsValidToken(true);
      setIsValidating(false);
    };

    validateToken();
  }, [token]);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const getStrengthLabel = (strength: number) => {
    if (strength <= 2) return { label: 'Fraca', color: 'bg-red-500' };
    if (strength <= 4) return { label: 'Média', color: 'bg-yellow-500' };
    return { label: 'Forte', color: 'bg-green-500' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formData.password || !formData.confirmPassword) {
      toast.error('Preencha todos os campos', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    if (formData.password.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    const strength = getPasswordStrength(formData.password);
    if (strength < 3) {
      toast.error('Escolha uma senha mais forte', {
        position: 'top-center',
        duration: 3000,
        description: 'Use letras maiúsculas, minúsculas, números e símbolos',
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setPasswordReset(true);
    toast.success('Senha redefinida com sucesso!', {
      position: 'top-center',
      duration: 3000,
    });

    setIsLoading(false);
  };

  // Loading state while validating token
  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <p className="text-[14px] text-neutral-600 dark:text-neutral-400">
            Validando link de recuperação...
          </p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isValidToken) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mb-3 text-[28px] leading-[39.2px] text-neutral-900 dark:text-white">
            Link inválido ou expirado
          </h2>
          <p className="mb-8 text-[14px] leading-[19.6px] text-neutral-600 dark:text-neutral-400">
            Este link de recuperação não é válido ou já expirou. Solicite um novo
            link de recuperação.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/auth/forgot-password')}
              className="h-12 w-full"
            >
              Solicitar novo link
            </Button>
            <Button
              onClick={() => navigate('/auth/login')}
              variant="outline"
              className="h-12 w-full"
            >
              Voltar para login
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
                Redefinição de senha
              </p>
            </div>
          </div>

          {!passwordReset ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-[28px] leading-[39.2px] text-neutral-900 dark:text-white">
                  Crie sua nova senha
                </h2>
                <p className="mt-2 text-[14px] leading-[19.6px] text-neutral-600 dark:text-neutral-400">
                  Escolha uma senha forte e segura para proteger sua conta
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Nova senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
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
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                          <div
                            className={`h-full transition-all ${
                              getStrengthLabel(getPasswordStrength(formData.password)).color
                            }`}
                            style={{
                              width: `${(getPasswordStrength(formData.password) / 6) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                          {getStrengthLabel(getPasswordStrength(formData.password)).label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Digite a senha novamente"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Match Indicator */}
                  {formData.confirmPassword && (
                    <p
                      className={`text-[12px] ${
                        formData.password === formData.confirmPassword
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {formData.password === formData.confirmPassword
                        ? '✓ As senhas coincidem'
                        : '✗ As senhas não coincidem'}
                    </p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
                  <p className="mb-2 text-[13px] font-medium text-neutral-900 dark:text-white">
                    Sua senha deve conter:
                  </p>
                  <ul className="space-y-1 text-[12px] text-neutral-600 dark:text-neutral-400">
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          formData.password.length >= 8
                            ? 'text-green-600 dark:text-green-400'
                            : ''
                        }
                      >
                        {formData.password.length >= 8 ? '✓' : '○'}
                      </span>
                      Mínimo 8 caracteres
                    </li>
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          /[A-Z]/.test(formData.password)
                            ? 'text-green-600 dark:text-green-400'
                            : ''
                        }
                      >
                        {/[A-Z]/.test(formData.password) ? '✓' : '○'}
                      </span>
                      Uma letra maiúscula
                    </li>
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          /[0-9]/.test(formData.password)
                            ? 'text-green-600 dark:text-green-400'
                            : ''
                        }
                      >
                        {/[0-9]/.test(formData.password) ? '✓' : '○'}
                      </span>
                      Um número
                    </li>
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          /[^a-zA-Z0-9]/.test(formData.password)
                            ? 'text-green-600 dark:text-green-400'
                            : ''
                        }
                      >
                        {/[^a-zA-Z0-9]/.test(formData.password) ? '✓' : '○'}
                      </span>
                      Um caractere especial
                    </li>
                  </ul>
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
                      Redefinindo senha...
                    </>
                  ) : (
                    'Redefinir senha'
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>

                <h2 className="mb-3 text-[28px] leading-[39.2px] text-neutral-900 dark:text-white">
                  Senha redefinida!
                </h2>
                <p className="mb-8 text-[14px] leading-[19.6px] text-neutral-600 dark:text-neutral-400">
                  Sua senha foi alterada com sucesso. Você já pode fazer login com
                  sua nova senha.
                </p>

                <Button
                  onClick={() => navigate('/auth/login')}
                  className="h-12 w-full"
                >
                  Ir para login
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - Image/Branding */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex h-full flex-col justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-12 text-white">
          <div className="mx-auto max-w-lg">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Lock className="h-10 w-10" />
            </div>
            <h2 className="mb-4 text-4xl font-bold">Segurança em primeiro lugar</h2>
            <p className="mb-8 text-lg leading-relaxed text-blue-100">
              Proteja sua conta com uma senha forte e única. Sua segurança é
              nossa prioridade.
            </p>
            <div className="space-y-4 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="font-semibold">Dicas de segurança:</h3>
              <ul className="space-y-3 text-sm text-blue-100">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-lg">🔐</span>
                  <span>Use uma combinação de letras, números e símbolos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-lg">🚫</span>
                  <span>Evite senhas óbvias como datas de aniversário</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-lg">🔄</span>
                  <span>Não reutilize senhas de outros serviços</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-lg">💾</span>
                  <span>Considere usar um gerenciador de senhas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
