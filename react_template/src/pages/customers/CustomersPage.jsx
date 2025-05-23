import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import CustomerCard from '../../components/customers/CustomerCard';
import customerService from '../../api/customerService';

const CustomersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [viewMode, setViewMode] = useState(localStorage.getItem('customersViewMode') || 'grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch customers with filters
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const filters = {
          page: pagination.page,
          size: pagination.size,
          sort: 'name,asc',
        };

        if (searchTerm) {
          filters.search = searchTerm;
        }

        const response = await customerService.getCustomers(filters);
        
        // Handle both paginated and non-paginated response formats
        if (response.content) {
          setCustomers(response.content);
          setPagination({
            ...pagination,
            totalPages: response.totalPages,
            totalElements: response.totalElements,
          });
        } else {
          setCustomers(response);
          setPagination({
            ...pagination,
            totalElements: response.length,
            totalPages: Math.ceil(response.length / pagination.size),
          });
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Não foi possível carregar os clientes. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [pagination.page, pagination.size, searchTerm]);

  // Save view mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('customersViewMode', viewMode);
  }, [viewMode]);

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 0 }); // Reset to first page when searching
  };

  const handleDeleteCustomer = async (customer) => {
    setConfirmDelete(customer);
  };

  const confirmDeleteCustomer = async () => {
    if (!confirmDelete) return;
    
    try {
      await customerService.deleteCustomer(confirmDelete.id);
      // Refresh customers list
      const updatedCustomers = customers.filter(c => c.id !== confirmDelete.id);
      setCustomers(updatedCustomers);
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Erro ao excluir cliente. Por favor, tente novamente.');
    }
  };

  // Table columns definition
  const columns = [
    {
      header: 'Cliente',
      accessor: 'name',
      render: (customer) => (
        <div>
          <Link to={`/clientes/${customer.id}`} className="font-medium text-gray-900 hover:text-primary">
            {customer.name}
          </Link>
          <p className="text-sm text-gray-500">{customer.company || ''}</p>
        </div>
      ),
    },
    {
      header: 'Contato',
      render: (customer) => (
        <div>
          <div className="text-sm">{customer.email}</div>
          <div className="text-sm text-gray-500">{customer.phone || '-'}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'active',
      render: (customer) => (
        customer.active !== undefined ? (
          <Badge variant={customer.active ? 'success' : 'warning'}>
            {customer.active ? 'Ativo' : 'Inativo'}
          </Badge>
        ) : null
      ),
    },
    {
      header: 'Ações',
      render: (customer) => (
        <div className="flex space-x-2">
          <Link to={`/clientes/${customer.id}`}>
            <Button variant="outline" size="xs">Ver</Button>
          </Link>
          <Link to={`/clientes/${customer.id}/editar`}>
            <Button variant="ghost" size="xs">Editar</Button>
          </Link>
          <Button 
            variant="ghost" 
            size="xs"
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDeleteCustomer(customer)}
          >
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">
            Gerencie seus clientes e contatos
          </p>
        </div>

        <Link to="/clientes/novo">
          <Button variant="primary">
            Novo Cliente
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 justify-between">
            {/* Search and filters */}
            <div className="flex flex-wrap gap-3 flex-1">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative max-w-xs">
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
              </form>
            </div>
            
            {/* View mode toggle */}
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
                  viewMode === 'grid' ? 'bg-gray-100 text-gray-700 border-gray-300' : 'bg-white text-gray-500 border-gray-300'
                }`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button
                type="button"
                className={`px-3 py-2 text-sm font-medium rounded-r-md border ${
                  viewMode === 'list' ? 'bg-gray-100 text-gray-700 border-gray-300' : 'bg-white text-gray-500 border-gray-300'
                }`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse p-6 border border-gray-200 rounded-lg">
                    <div className="h-5 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded-md w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="py-3">
                    <div className="h-5 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/5 mb-4"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : customers.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum cliente encontrado</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm 
                ? 'Nenhum cliente corresponde à busca atual.'
                : 'Comece adicionando seus contatos e clientes.'}
            </p>
            <Link to="/clientes/novo" className="mt-4">
              <Button variant="primary">Adicionar primeiro cliente</Button>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onView={() => navigate(`/clientes/${customer.id}`)}
                  onEdit={() => navigate(`/clientes/${customer.id}/editar`)}
                  onDelete={() => handleDeleteCustomer(customer)}
                />
              ))}
            </div>
            
            {/* Pagination for grid view */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex space-x-1">
                  <button
                    className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                  >
                    Anterior
                  </button>
                  {[...Array(pagination.totalPages).keys()].map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-2 text-sm font-medium rounded-md border ${
                        page === pagination.page
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page + 1}
                    </button>
                  ))}
                  <button
                    className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages - 1}
                  >
                    Próxima
                  </button>
                </nav>
              </div>
            )}
          </div>
        ) : (
          <div className="p-0">
            <Table
              columns={columns}
              data={customers}
              onRowClick={(customer) => navigate(`/clientes/${customer.id}`)}
              hoverable={true}
              stripedRows={true}
            />
            
            {/* Pagination for list view */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-3 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-500">
                  Mostrando <span className="font-medium">{pagination.page * pagination.size + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}
                  </span>{' '}
                  de <span className="font-medium">{pagination.totalElements}</span> resultados
                </div>
                
                <nav className="flex space-x-1">
                  <button
                    className="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                  >
                    Anterior
                  </button>
                  <button
                    className="px-3 py-1 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages - 1}
                  >
                    Próxima
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </Card>
      
      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar exclusão</h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir o cliente <span className="font-medium">{confirmDelete.name}</span>?
              Esta ação não poderá ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={confirmDeleteCustomer}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;