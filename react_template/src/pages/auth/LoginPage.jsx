import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Email ou senha inválidos. Por favor, tente novamente.');
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
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Entrar</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                required
                startAdornment={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                }
              />
              
              <Input
                label="Senha"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Sua senha"
                required
                startAdornment={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                    Lembrar-me
                  </label>
                </div>
                
                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-dark">
                  Esqueceu a senha?
                </Link>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                fullWidth={true}
                isLoading={isLoading}
              >
                Entrar
              </Button>
            </form>
          </Card>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
              Registre-se agora
            </Link>
          </p>
        </div>
      </div>
      
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0">
          <img
            className="object-cover w-full h-full"
            src="/public/assets/images/login-background.jpg"
            alt="Login background"
          />
          <div className="absolute inset-0 bg-primary" style={{ mixBlendMode: 'multiply', opacity: 0.6 }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;