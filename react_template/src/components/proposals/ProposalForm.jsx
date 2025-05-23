import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import customerService from '../../api/customerService';
import templateService from '../../api/templateService';
import proposalService from '../../api/proposalService';

const ProposalForm = ({ proposal = null, onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const isEdit = !!proposal;
  
  const [formData, setFormData] = useState({
    title: '',
    customerId: '',
    templateId: '',
    expirationDate: '',
    items: []
  });
  
  const [customers, setCustomers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);
  const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  
  // Initialize form with proposal data when editing
  useEffect(() => {
    if (proposal) {
      setFormData({
        title: proposal.title || '',
        customerId: proposal.customerId || '',
        templateId: proposal.templateId || '',
        expirationDate: proposal.expirationDate ? new Date(proposal.expirationDate).toISOString().split('T')[0] : '',
        items: proposal.items || []
      });
    }
  }, [proposal]);
  
  // Load customers and templates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, templatesData] = await Promise.all([
          customerService.getCustomers(),
          templateService.getTemplates()
        ]);
        
        setCustomers(customersData.content || customersData);
        setTemplates(templatesData.content || templatesData);
      } catch (err) {
        console.error('Error loading form data:', err);
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      }
    };
    
    fetchData();
  }, []);
  
  // Search for customers
  useEffect(() => {
    if (customerSearch.length < 2) return;
    
    const searchCustomers = async () => {
      setIsSearchingCustomers(true);
      try {
        const results = await customerService.searchCustomers(customerSearch);
        setCustomers(results.content || results);
      } catch (err) {
        console.error('Error searching customers:', err);
      } finally {
        setIsSearchingCustomers(false);
      }
    };
    
    const timeout = setTimeout(searchCustomers, 500);
    return () => clearTimeout(timeout);
  }, [customerSearch]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCustomerSearchChange = (e) => {
    setCustomerSearch(e.target.value);
  };
  
  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          type: 'PRODUCT',
          title: '',
          description: '',
          unitValue: 0,
          quantity: 1,
          discount: 0,
          tax: 0
        }
      ]
    });
  };
  
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'unitValue' || field === 'quantity' || field === 'discount' || field === 'tax' 
        ? parseFloat(value) || 0 
        : value
    };
    
    setFormData({
      ...formData,
      items: updatedItems
    });
  };
  
  const handleRemoveItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      items: updatedItems
    });
  };
  
  const calculateItemTotal = (item) => {
    const { unitValue, quantity, discount, tax } = item;
    const subtotal = unitValue * quantity;
    const discountValue = subtotal * (discount / 100);
    const taxValue = subtotal * (tax / 100);
    return subtotal - discountValue + taxValue;
  };
  
  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerId) {
      setError('Por favor, selecione um cliente.');
      return;
    }
    
    if (!formData.templateId) {
      setError('Por favor, selecione um modelo de proposta.');
      return;
    }
    
    if (formData.items.length === 0) {
      setError('Por favor, adicione pelo menos um item à proposta.');
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Error submitting proposal:', err);
      setError('Erro ao salvar proposta. Por favor, tente novamente.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Card title={isEdit ? 'Editar Proposta' : 'Nova Proposta'}>
        <div className="space-y-4">
          <Input
            label="Título da Proposta"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Ex: Proposta de Serviços de Marketing"
          />
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Cliente <span className="ml-1 text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={customerSearch}
                onChange={handleCustomerSearchChange}
                className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
                placeholder="Buscar cliente por nome ou email..."
              />
              {isSearchingCustomers && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
            <div className="mt-2">
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Selecione um cliente</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate('/clientes/novo')}
              >
                + Novo Cliente
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Modelo de Proposta <span className="ml-1 text-red-500">*</span>
            </label>
            <select
              name="templateId"
              value={formData.templateId}
              onChange={handleInputChange}
              className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
              required
            >
              <option value="">Selecione um modelo</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          
          <Input
            label="Data de Expiração"
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            onChange={handleInputChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </Card>
      
      <Card title="Itens da Proposta">
        <div className="space-y-6">
          {formData.items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum item adicionado</p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={handleAddItem}
              >
                Adicionar Item
              </Button>
            </div>
          ) : (
            <>
              {formData.items.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Título
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                        className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Tipo
                      </label>
                      <select
                        value={item.type}
                        onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                        className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
                      >
                        <option value="PRODUCT">Produto</option>
                        <option value="SERVICE">Serviço</option>
                        <option value="SUBSCRIPTION">Assinatura</option>
                        <option value="TEXT">Texto/Seção</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Descrição
                      </label>
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        rows="2"
                        className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Valor Unitário (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unitValue}
                        onChange={(e) => handleItemChange(index, 'unitValue', e.target.value)}
                        className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        step="1"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Desconto (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                        className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Imposto (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.tax}
                        onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
                        className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <div className="md:col-span-2 text-right">
                      <div className="text-sm text-gray-500">
                        Subtotal: 
                        <span className="ml-2 font-medium text-gray-900">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(calculateItemTotal(item))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddItem}
                >
                  + Adicionar outro item
                </Button>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total da Proposta</div>
                  <div className="text-xl font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(calculateTotal())}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/propostas')}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {isEdit ? 'Atualizar Proposta' : 'Criar Proposta'}
        </Button>
      </div>
    </form>
  );
};

ProposalForm.propTypes = {
  proposal: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default ProposalForm;