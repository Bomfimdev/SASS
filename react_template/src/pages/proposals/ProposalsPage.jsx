import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import ProposalCard from '../../components/proposals/ProposalCard';
import proposalService from '../../api/proposalService';

const ProposalsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [viewMode, setViewMode] = useState(localStorage.getItem('proposalsViewMode') || 'grid');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  });

  // Initialize filters from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');
    if (statusParam) {
      setFilterStatus(statusParam);
    }
  }, [location.search]);

  // Fetch proposals with filters
  useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true);
      try {
        const filters = {
          page: pagination.page,
          size: pagination.size,
          sort: 'createdAt,desc',
        };

        if (filterStatus) {
          filters.status = filterStatus;
        }

        if (searchTerm) {
          filters.search = searchTerm;
        }

        const response = await proposalService.getProposals(filters);
        
        // Handle both paginated and non-paginated response formats
        if (response.content) {
          setProposals(response.content);
          setPagination({
            ...pagination,
            totalPages: response.totalPages,
            totalElements: response.totalElements,
          });
        } else {
          setProposals(response);
          setPagination({
            ...pagination,
            totalElements: response.length,
            totalPages: Math.ceil(response.length / pagination.size),
          });
        }
      } catch (err) {
        console.error('Error fetching proposals:', err);
        setError('Não foi possível carregar as propostas. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, [pagination.page, pagination.size, filterStatus, searchTerm]);

  // Save view mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('proposalsViewMode', viewMode);
  }, [viewMode]);

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleStatusFilterChange = (e) => {
    const newStatus = e.target.value;
    setFilterStatus(newStatus);
    setPagination({ ...pagination, page: 0 }); // Reset to first page
    
    // Update URL query params
    const params = new URLSearchParams(location.search);
    if (newStatus) {
      params.set('status', newStatus);
    } else {
      params.delete('status');
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 0 }); // Reset to first page when searching
  };

  const handleDuplicateProposal = async (proposal) => {
    try {
      await proposalService.duplicateProposal(proposal.id);
      // Refresh proposals list
      const response = await proposalService.getProposals({
        page: pagination.page,
        size: pagination.size,
        sort: 'createdAt,desc',
        status: filterStatus,
        search: searchTerm,
      });
      
      if (response.content) {
        setProposals(response.content);
      } else {
        setProposals(response);
      }
    } catch (err) {
      console.error('Error duplicating proposal:', err);
      setError('Erro ao duplicar proposta. Por favor, tente novamente.');
    }
  };

  const handleSendProposal = (proposal) => {
    navigate(`/propostas/${proposal.id}`);
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'DRAFT': { label: 'Rascunho', variant: 'default' },
      'SENT': { label: 'Enviada', variant: 'primary' },
      'VIEWED': { label: 'Visualizada', variant: 'info' },
      'ACCEPTED': { label: 'Aprovada', variant: 'success' },
      'REJECTED': { label: 'Rejeitada', variant: 'danger' },
      'EXPIRED': { label: 'Expirada', variant: 'warning' }
    };
    
    const statusInfo = statusMap[status] || statusMap.DRAFT;
    
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  // Table columns definition
  const columns = [
    {
      header: 'Proposta',
      accessor: 'title',
      render: (proposal) => (
        <div>
          <Link to={`/propostas/${proposal.id}`} className="font-medium text-gray-900 hover:text-primary">
            {proposal.title}
          </Link>
          <p className="text-sm text-gray-500">{proposal.customer?.name || 'Cliente'}</p>
        </div>
      ),
    },
    {
      header: 'Valor',
      accessor: 'totalValue',
      render: (proposal) => formatCurrency(proposal.totalValue),
    },
    {
      header: 'Data',
      accessor: 'creationDate',
      render: (proposal) => formatDate(proposal.creationDate || proposal.createdAt),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (proposal) => getStatusBadge(proposal.status),
    },
    {
      header: 'Ações',
      render: (proposal) => (
        <div className="flex space-x-2">
          <Link to={`/propostas/${proposal.id}`}>
            <Button variant="outline" size="xs">Ver</Button>
          </Link>
          <Button 
            variant="ghost" 
            size="xs"
            onClick={() => handleDuplicateProposal(proposal)}
          >
            Duplicar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Propostas</h1>
          <p className="text-gray-600">
            Gerencie todas as suas propostas comerciais
          </p>
        </div>

        <Link to="/propostas/nova">
          <Button variant="primary">
            Nova Proposta
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
                    placeholder="Buscar propostas..."
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
              
              <div>
                <select
                  value={filterStatus}
                  onChange={handleStatusFilterChange}
                  className="border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary py-2 px-3"
                >
                  <option value="">Todos os status</option>
                  <option value="DRAFT">Rascunho</option>
                  <option value="SENT">Enviada</option>
                  <option value="VIEWED">Visualizada</option>
                  <option value="ACCEPTED">Aprovada</option>
                  <option value="REJECTED">Rejeitada</option>
                  <option value="EXPIRED">Expirada</option>
                </select>
              </div>
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
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="h-3 bg-gray-100 rounded w-1/2 mb-1"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                        <div>
                          <div className="h-3 bg-gray-100 rounded w-1/2 mb-1"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
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
        ) : proposals.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma proposta encontrada</h3>
            <p className="mt-1 text-gray-500">
              {filterStatus || searchTerm 
                ? 'Nenhuma proposta corresponde aos filtros atuais.'
                : 'Comece a criar suas propostas para apresentar aos seus clientes.'}
            </p>
            <Link to="/propostas/nova" className="mt-4">
              <Button variant="primary">Criar primeira proposta</Button>
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {proposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  onView={() => navigate(`/propostas/${proposal.id}`)}
                  onSend={() => handleSendProposal(proposal)}
                  onDuplicate={() => handleDuplicateProposal(proposal)}
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
              data={proposals}
              onRowClick={(proposal) => navigate(`/propostas/${proposal.id}`)}
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
    </div>
  );
};

export default ProposalsPage;