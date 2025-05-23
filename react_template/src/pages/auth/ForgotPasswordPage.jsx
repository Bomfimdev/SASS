import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim() || !validateEmail(email)) {
      setError('Por favor, informe um email válido.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-primary">PropostaFácil</h1>
            <p className="mt-3 text-gray-600">Sistema de Propostas Comerciais</p>
          </div>
          
          {error && (
            <Alert variant="error" onClose={() => setError(null)} className="mb-4">
              {error}
            </Alert>
          )}
          
          <Card variant="elevated">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Recuperar senha</h2>
              <p className="mt-2 text-sm text-gray-600">
                Digite seu email e enviaremos instruções para redefinir sua senha.
              </p>
            </div>
            
            {isSubmitted ? (
              <div className="text-center py-6">
                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <h3 className="mt-4 text-lg font-medium text-gray-900">Email enviado</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Enviamos instruções para redefinir sua senha para {email}. Por favor, verifique seu email e siga as instruções.
                </p>
                
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => setIsSubmitted(false)}
                >
                  Tentar novamente
                </Button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  startAdornment={
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth={true}
                  isLoading={isLoading}
                >
                  Enviar instruções
                </Button>
              </form>
            )}
          </Card>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Lembrou sua senha?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              Voltar para o login
            </Link>
          </p>
        </div>
      </div>
      
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0">
          <img
            className="object-cover w-full h-full"
            src="/public/assets/images/forgot-password-background.jpg"
            alt="Forgot password background"
          />
          <div className="absolute inset-0 bg-primary" style={{ mixBlendMode: 'multiply', opacity: 0.6 }}></div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;