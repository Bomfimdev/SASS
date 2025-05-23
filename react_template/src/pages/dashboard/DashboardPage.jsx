import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import proposalService from '../../api/proposalService';
import customerService from '../../api/customerService';
import { useAuth } from '../../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    recentProposals: [],
    stats: {
      sent: 0,
      accepted: 0,
      rejected: 0,
      draft: 0,
      totalValue: 0,
    },
    customerCount: 0,
  });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch recent proposals
        const recentProposalsResponse = await proposalService.getProposals({
          page: 0,
          size: 5,
          sort: 'createdAt,desc',
        });

        // Get basic stats
        const counts = {
          sent: 0,
          accepted: 0,
          rejected: 0,
          draft: 0,
          totalValue: 0,
        };
        
        const proposals = recentProposalsResponse.content || recentProposalsResponse;
        
        proposals.forEach(proposal => {
          if (proposal.status === 'SENT' || proposal.status === 'VIEWED') counts.sent += 1;
          if (proposal.status === 'ACCEPTED') counts.accepted += 1;
          if (proposal.status === 'REJECTED') counts.rejected += 1;
          if (proposal.status === 'DRAFT') counts.draft += 1;
        });
        
        // Get customer count
        const customersResponse = await customerService.getCustomers({ size: 1 });
        const customerCount = customersResponse.totalElements || customersResponse.length || 0;
        
        setDashboardData({
          recentProposals: proposals,
          stats: counts,
          customerCount,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Não foi possível carregar os dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
  
  // Skeleton loaders
  const StatSkeleton = () => (
    <div className="animate-pulse flex flex-col p-6 h-full">
      <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
      <div className="h-8 w-16 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 w-24 bg-gray-200 rounded"></div>
    </div>
  );
  
  const ProposalSkeleton = () => (
    <div className="animate-pulse flex justify-between py-4 border-b border-gray-100">
      <div className="space-y-2">
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
        <div className="h-3 w-32 bg-gray-100 rounded"></div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Bem-vindo, {user?.name || 'Usuário'}! Aqui está um resumo da sua conta.
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Card><StatSkeleton /></Card>
            <Card><StatSkeleton /></Card>
            <Card><StatSkeleton /></Card>
            <Card><StatSkeleton /></Card>
          </>
        ) : (
          <>
            <Card className="flex flex-col">
              <div className="p-6">
                <p className="text-sm font-medium text-gray-500">Propostas Enviadas</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData.stats.sent}</p>
                <div className="mt-2 text-xs text-gray-600 flex items-center">
                  <span>No total</span>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col">
              <div className="p-6">
                <p className="text-sm font-medium text-gray-500">Propostas Aceitas</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{dashboardData.stats.accepted}</p>
                <div className="mt-2 text-xs text-gray-600 flex items-center">
                  {dashboardData.stats.sent > 0 ? (
                    <span>Taxa de conversão: {Math.round((dashboardData.stats.accepted / dashboardData.stats.sent) * 100)}%</span>
                  ) : (
                    <span>Nenhuma proposta enviada</span>
                  )}
                </div>
              </div>
            </Card>

            <Card className="flex flex-col">
              <div className="p-6">
                <p className="text-sm font-medium text-gray-500">Em Rascunho</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData.stats.draft}</p>
                <div className="mt-2 text-xs text-gray-600 flex items-center">
                  <Link to="/propostas?status=DRAFT" className="text-primary hover:underline">
                    Ver rascunhos
                  </Link>
                </div>
              </div>
            </Card>

            <Card className="flex flex-col">
              <div className="p-6">
                <p className="text-sm font-medium text-gray-500">Clientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData.customerCount}</p>
                <div className="mt-2 text-xs text-gray-600 flex items-center">
                  <Link to="/clientes" className="text-primary hover:underline">
                    Gerenciar clientes
                  </Link>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card 
          title="Propostas Recentes" 
          className="lg:col-span-2"
          headerAction={
            <Link to="/propostas">
              <Button variant="ghost" size="sm">Ver todas</Button>
            </Link>
          }
        >
          {isLoading ? (
            <div className="divide-y divide-gray-100">
              <ProposalSkeleton />
              <ProposalSkeleton />
              <ProposalSkeleton />
              <ProposalSkeleton />
            </div>
          ) : dashboardData.recentProposals.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma proposta criada</h3>
              <p className="mt-1 text-gray-500">
                Comece a criar suas propostas para apresentar aos seus clientes.
              </p>
              <Link to="/propostas/nova" className="mt-4">
                <Button variant="primary">Criar primeira proposta</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {dashboardData.recentProposals.map((proposal) => (
                <div key={proposal.id} className="flex justify-between py-4">
                  <div>
                    <Link to={`/propostas/${proposal.id}`} className="font-medium text-gray-900 hover:text-primary">
                      {proposal.title}
                    </Link>
                    <p className="text-sm text-gray-500">{proposal.customer?.name || 'Cliente'}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{formatDate(proposal.creationDate || proposal.createdAt)}</span>
                    {getStatusBadge(proposal.status)}
                  </div>
                </div>
              ))}
              
              <div className="pt-4">
                <Link to="/propostas" className="text-sm text-primary hover:underline">
                  Ver todas as propostas →
                </Link>
              </div>
            </div>
          )}
        </Card>

        <Card
          title="Dicas Rápidas"
          variant="flat"
        >
          <div className="space-y-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <h4 className="font-medium text-primary">Personalização</h4>
              <p className="text-sm text-gray-600 mt-1">
                Personalize seus modelos de proposta para refletir sua marca e melhorar a taxa de aprovação.
              </p>
              <Link to="/modelos" className="text-xs text-primary mt-2 hover:underline inline-block">
                Personalizar modelos →
              </Link>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-700">Acompanhamento</h4>
              <p className="text-sm text-gray-600 mt-1">
                Fique de olho nas propostas visualizadas e faça um follow-up para aumentar suas chances de conversão.
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-700">Mantenha seus dados atualizados</h4>
              <p className="text-sm text-gray-600 mt-1">
                Certifique-se de que suas informações de empresa e produtos estejam sempre atualizadas.
              </p>
              <Link to="/conta" className="text-xs text-green-700 mt-2 hover:underline inline-block">
                Atualizar informações →
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;