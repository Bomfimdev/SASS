import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    segment: '',
    companyName: ''
  });
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  const validateFirstStep = () => {
    if (!formData.name.trim()) {
      setError('Por favor, informe seu nome.');
      return false;
    }
    
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setError('Por favor, informe um email válido.');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    
    if (formData.password !== formData.passwordConfirm) {
      setError('As senhas não coincidem.');
      return false;
    }
    
    return true;
  };
  
  const handleNextStep = () => {
    if (validateFirstStep()) {
      setError(null);
      setStep(2);
    }
  };
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.companyName.trim()) {
      setError('Por favor, informe o nome da sua empresa.');
      return;
    }
    
    if (!formData.segment.trim()) {
      setError('Por favor, selecione um segmento.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        accountName: formData.companyName,
        segment: formData.segment
      });
      
      // Redirect to login for now - in a real app, we might auto-login the user
      navigate('/login?registered=true');
    } catch (err) {
      console.error('Registration error:', err);
      
      // Check for specific error types
      if (err.response && err.response.status === 409) {
        setError('Este email já está em uso. Por favor, tente outro.');
      } else {
        setError('Ocorreu um erro ao registrar. Por favor, tente novamente.');
      }
      
      // Go back to first step if error is related to email
      if (err.response && err.response.data && err.response.data.field === 'email') {
        setStep(1);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const segments = [
    'Agência de Marketing',
    'Consultoria',
    'E-commerce',
    'Educação',
    'Freelancer',
    'Saúde',
    'Tecnologia',
    'Serviços Financeiros',
    'Outros'
  ];
  
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
              <h2 className="text-2xl font-bold text-gray-800">Criar conta</h2>
              <p className="text-sm text-gray-600 mt-1">
                Passo {step} de 2
              </p>
              
              <div className="flex items-center justify-center mt-4">
                <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-primary' : 'bg-gray-300'} mr-2`}></div>
                <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
              </div>
            </div>
            
            {step === 1 ? (
              <form className="space-y-6">
                <Input
                  label="Nome completo"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  required
                />
                
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  required
                  helperText="Você usará este email para fazer login"
                />
                
                <Input
                  label="Senha"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Crie uma senha segura"
                  required
                  helperText="Mínimo de 6 caracteres"
                />
                
                <Input
                  label="Confirmar senha"
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  placeholder="Confirme sua senha"
                  required
                />
                
                <Button
                  type="button"
                  variant="primary"
                  fullWidth={true}
                  onClick={handleNextStep}
                >
                  Próximo
                </Button>
              </form>
            ) : (
              <form className="space-y-6" onSubmit={handleRegisterSubmit}>
                <Input
                  label="Nome da empresa"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Nome da sua empresa"
                  required
                />
                
                <div>
                  <label htmlFor="segment" className="block mb-1 text-sm font-medium text-gray-700">
                    Segmento <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="segment"
                    name="segment"
                    value={formData.segment}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    required
                  >
                    <option value="">Selecione um segmento</option>
                    {segments.map((segment) => (
                      <option key={segment} value={segment}>
                        {segment}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    fullWidth={true}
                    onClick={() => setStep(1)}
                  >
                    Voltar
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth={true}
                    isLoading={isLoading}
                  >
                    Criar conta
                  </Button>
                </div>
              </form>
            )}
          </Card>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              Entrar
            </Link>
          </p>
        </div>
      </div>
      
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0">
          <img
            className="object-cover w-full h-full"
            src="/public/assets/images/register-background.jpg"
            alt="Register background"
          />
          <div className="absolute inset-0 bg-primary" style={{ mixBlendMode: 'multiply', opacity: 0.6 }}></div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;