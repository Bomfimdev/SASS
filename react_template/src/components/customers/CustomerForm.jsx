import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const CustomerForm = ({ customer = null, onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const isEdit = !!customer;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    notes: ''
  });
  
  const [error, setError] = useState(null);
  
  // Initialize form with customer data when editing
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        position: customer.position || '',
        notes: customer.notes || ''
      });
    }
  }, [customer]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Nome do cliente é obrigatório.');
      return;
    }
    
    if (!formData.email.trim() || !validateEmail(formData.email)) {
      setError('Email inválido.');
      return;
    }
    
    try {
      await onSubmit(formData);
      navigate('/clientes');
    } catch (err) {
      console.error('Error submitting customer:', err);
      setError('Erro ao salvar cliente. Por favor, tente novamente.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Card title={isEdit ? 'Editar Cliente' : 'Novo Cliente'}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Nome completo do cliente"
          />
          
          <Input
            label="E-mail"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="email@exemplo.com"
          />
          
          <Input
            label="Telefone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(00) 00000-0000"
          />
          
          <Input
            label="Empresa"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Nome da empresa"
          />
          
          <Input
            label="Cargo"
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            placeholder="Cargo ou função"
          />
          
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Observações
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
              className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
              placeholder="Informações adicionais sobre o cliente"
            />
          </div>
        </div>
      </Card>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/clientes')}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {isEdit ? 'Atualizar Cliente' : 'Salvar Cliente'}
        </Button>
      </div>
    </form>
  );
};

CustomerForm.propTypes = {
  customer: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default CustomerForm;