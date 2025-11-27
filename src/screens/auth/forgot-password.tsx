import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner@2.0.3';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Digite seu e-mail', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Digite um e-mail válido', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setEmailSent(true);
    toast.success('E-mail enviado com sucesso!', {
      position: 'top-center',
      duration: 4000,
      description: 'Verifique sua caixa de entrada',
    });

    setIsLoading(false);
  };

  const handleResend = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('E-mail reenviado!', {
      position: 'top-center',
      duration: 3000,
    });
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate('/auth/login')}
            className="mb-8 flex items-center gap-2 text-[14px] text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para login
          </button>

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
                Recuperação de senha
              </p>
            </div>
          </div>

          {!emailSent ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-[28px] leading-[39.2px] text-neutral-900 dark:text-white">
                  Esqueceu sua senha?
                </h2>
                <p className="mt-2 text-[14px] leading-[19.6px] text-neutral-600 dark:text-neutral-400">
                  Sem problemas! Digite seu e-mail e enviaremos instruções para
                  redefinir sua senha.
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
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
                      Enviando...
                    </>
                  ) : (
                    'Enviar instruções'
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
                  Verifique seu e-mail
                </h2>
                <p className="mb-8 text-[14px] leading-[19.6px] text-neutral-600 dark:text-neutral-400">
                  Enviamos instruções de recuperação para{' '}
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {email}
                  </span>
                </p>

                {/* Instructions */}
                <div className="mb-8 space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-left dark:border-neutral-700 dark:bg-neutral-800/50">
                  <h3 className="text-[15px] font-medium text-neutral-900 dark:text-white">
                    Próximos passos:
                  </h3>
                  <ol className="space-y-2 text-[13px] leading-[18.2px] text-neutral-600 dark:text-neutral-400">
                    <li className="flex gap-2">
                      <span className="font-medium">1.</span>
                      <span>Abra o e-mail que enviamos</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-medium">2.</span>
                      <span>Clique no link de redefinição de senha</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-medium">3.</span>
                      <span>Crie sua nova senha</span>
                    </li>
                  </ol>
                </div>

                {/* Resend Button */}
                <div className="space-y-3">
                  <p className="text-[13px] text-neutral-600 dark:text-neutral-400">
                    Não recebeu o e-mail?
                  </p>
                  <Button
                    onClick={handleResend}
                    variant="outline"
                    className="h-12 w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Reenviando...
                      </>
                    ) : (
                      'Reenviar e-mail'
                    )}
                  </Button>
                  <Button
                    onClick={() => navigate('/auth/login')}
                    variant="ghost"
                    className="h-12 w-full"
                  >
                    Voltar para login
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Help Text */}
          {!emailSent && (
            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
              <p className="text-[13px] leading-[18.2px] text-blue-900 dark:text-blue-100">
                💡 <strong>Dica:</strong> Verifique sua caixa de spam se não
                encontrar o e-mail na caixa de entrada.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - Image/Branding */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="flex h-full flex-col justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-12 text-white">
          <div className="mx-auto max-w-lg">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <Mail className="h-10 w-10" />
            </div>
            <h2 className="mb-4 text-4xl font-bold">
              Recuperação rápida e segura
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-blue-100">
              Seu acesso está protegido. Siga as instruções enviadas para seu
              e-mail para recuperar sua conta com segurança.
            </p>
            <div className="space-y-4 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <h3 className="font-semibold">Segurança garantida</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li className="flex items-center gap-2">
                  <span className="text-lg">🔒</span>
                  <span>Criptografia de ponta a ponta</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">⏱️</span>
                  <span>Link válido por 24 horas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-lg">✉️</span>
                  <span>E-mail de confirmação</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
