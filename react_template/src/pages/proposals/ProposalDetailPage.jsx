import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Alert from '../../components/ui/Alert';
import proposalService from '../../api/proposalService';
import customerService from '../../api/customerService';

const ProposalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendFormData, setSendFormData] = useState({
    email: '',
    subject: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    const fetchProposal = async () => {
      setIsLoading(true);
      try {
        const proposalData = await proposalService.getProposalById(id);
        setProposal(proposalData);
        
        // Fetch customer details if necessary
        if (proposalData.customerId) {
          const customerData = await customerService.getCustomerById(proposalData.customerId);
          setCustomer(customerData);
          
          // Pre-fill send form with customer email
          setSendFormData(prev => ({
            ...prev,
            email: customerData.email,
            subject: `Proposta: ${proposalData.title}`,
            message: `Prezado(a) ${customerData.name},\n\nSegue a proposta conforme solicitado.\n\nQualquer dúvida estou à disposição.\n\nAtenciosamente,`,
          }));
        }
      } catch (err) {
        console.error('Error fetching proposal details:', err);
        setError('Não foi possível carregar os detalhes da proposta. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  const handleEditProposal = () => {
    navigate(`/propostas/${id}/edit`);
  };

  const handleDuplicateProposal = async () => {
    try {
      const duplicated = await proposalService.duplicateProposal(id);
      navigate(`/propostas/${duplicated.id}`);
    } catch (err) {
      console.error('Error duplicating proposal:', err);
      setError('Erro ao duplicar proposta. Por favor, tente novamente.');
    }
  };

  const handleOpenSendModal = () => {
    setIsSendModalOpen(true);
  };

  const handleCloseSendModal = () => {
    setIsSendModalOpen(false);
    setSendSuccess(false);
  };

  const handleSendInputChange = (e) => {
    const { name, value } = e.target;
    setSendFormData({ ...sendFormData, [name]: value });
  };

  const handleSendProposal = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      await proposalService.sendProposal(id, sendFormData);
      setSendSuccess(true);
      
      // Refresh proposal to get updated status
      const updatedProposal = await proposalService.getProposalById(id);
      setProposal(updatedProposal);
    } catch (err) {
      console.error('Error sending proposal:', err);
      setError('Erro ao enviar proposta. Por favor, tente novamente.');
    } finally {
      setIsSending(false);
    }
  };

  const handleGeneratePdf = async () => {
    try {
      const pdfBlob = await proposalService.generatePdf(id);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(pdfBlob);
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `proposta-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Erro ao gerar PDF. Por favor, tente novamente.');
    }
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

  // Skeleton loaders
  const DetailSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="h-5 bg-gray-200 rounded w-1/4"></div>
      
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-4 bg-gray-100 rounded w-1/4 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div>
          <div className="h-4 bg-gray-100 rounded w-1/4 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {isLoading ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-5 bg-gray-100 rounded w-64"></div>
            </div>
            <div className="animate-pulse flex space-x-2">
              <div className="h-10 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          
          <Card>
            <DetailSkeleton />
          </Card>
        </>
      ) : error ? (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{proposal.title}</h1>
                {getStatusBadge(proposal.status)}
              </div>
              <p className="text-gray-600">
                Proposta para {customer?.name || 'Cliente'} · Criada em {formatDate(proposal.creationDate || proposal.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {proposal.status === 'DRAFT' && (
                <>
                  <Button
                    variant="primary"
                    onClick={handleOpenSendModal}
                  >
                    Enviar Proposta
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleEditProposal}
                  >
                    Editar
                  </Button>
                </>
              )}
              
              {proposal.status !== 'DRAFT' && (
                <Button
                  variant="primary"
                  onClick={handleGeneratePdf}
                >
                  Baixar PDF
                </Button>
              )}
              
              <Button
                variant="ghost"
                onClick={handleDuplicateProposal}
              >
                Duplicar
              </Button>
              
              <Link to="/propostas">
                <Button variant="ghost">
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main proposal details */}
            <div className="md:col-span-2 space-y-6">
              {/* Proposal items */}
              <Card title="Itens da Proposta">
                <div className="space-y-4">
                  {proposal.items && proposal.items.length > 0 ? (
                    <>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Qtd
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Valor Unit.
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Desconto
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {proposal.items.map((item, index) => {
                            const subtotal = item.unitValue * item.quantity;
                            const discountAmount = subtotal * (item.discount / 100);
                            const taxAmount = subtotal * (item.tax / 100);
                            const total = subtotal - discountAmount + taxAmount;
                            
                            return (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                                  {item.description && (
                                    <div className="text-sm text-gray-500">{item.description}</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatCurrency(item.unitValue)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {item.discount > 0 ? `${item.discount}%` : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                  {formatCurrency(total)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                              Valor Total:
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">
                              {formatCurrency(proposal.totalValue)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhum item adicionado a esta proposta.</p>
                  )}
                </div>
              </Card>
              
              {/* Proposal preview */}
              {proposal.previewUrl && (
                <Card title="Prévia da Proposta">
                  <div className="border rounded-md overflow-hidden">
                    <iframe 
                      src={proposal.previewUrl} 
                      className="w-full h-96" 
                      title="Prévia da Proposta"
                    />
                  </div>
                </Card>
              )}
              
              {/* Status history */}
              {proposal.statusHistory && proposal.statusHistory.length > 0 && (
                <Card title="Histórico">
                  <div className="space-y-3">
                    {proposal.statusHistory.map((statusEvent, index) => (
                      <div key={index} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-3 h-3 rounded-full mt-1.5 ${
                            statusEvent.status === 'SENT' ? 'bg-primary' :
                            statusEvent.status === 'VIEWED' ? 'bg-blue-500' :
                            statusEvent.status === 'ACCEPTED' ? 'bg-green-500' :
                            statusEvent.status === 'REJECTED' ? 'bg-red-500' :
                            'bg-gray-400'
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">
                            {statusEvent.status === 'SENT' && 'Proposta enviada'}
                            {statusEvent.status === 'VIEWED' && 'Proposta visualizada pelo cliente'}
                            {statusEvent.status === 'ACCEPTED' && 'Proposta aprovada pelo cliente'}
                            {statusEvent.status === 'REJECTED' && 'Proposta rejeitada pelo cliente'}
                            {statusEvent.status === 'EXPIRED' && 'Proposta expirada'}
                            {statusEvent.status === 'DRAFT' && 'Proposta criada como rascunho'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(statusEvent.date)} {new Date(statusEvent.date).toLocaleTimeString('pt-BR')}
                          </div>
                          {statusEvent.message && (
                            <div className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded-md">
                              {statusEvent.message}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Summary */}
              <Card title="Resumo">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-500">Status</span>
                    <div className="mt-1">{getStatusBadge(proposal.status)}</div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Valor total</span>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(proposal.totalValue)}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Data de criação</span>
                    <p className="text-gray-900">{formatDate(proposal.creationDate || proposal.createdAt)}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-500">Data de expiração</span>
                    <p className="text-gray-900">{formatDate(proposal.expirationDate)}</p>
                  </div>
                  
                  {proposal.lastStatusChange && (
                    <div>
                      <span className="text-sm text-gray-500">Última atualização</span>
                      <p className="text-gray-900">{formatDate(proposal.lastStatusChange)}</p>
                    </div>
                  )}
                </div>
              </Card>
              
              {/* Customer info */}
              <Card title="Cliente">
                {customer ? (
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg text-gray-900">{customer.name}</h3>
                    {customer.company && (
                      <p className="text-gray-700">{customer.position ? `${customer.position}, ` : ''}{customer.company}</p>
                    )}
                    
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                      <a href={`mailto:${customer.email}`} className="text-gray-700 hover:text-primary">
                        {customer.email}
                      </a>
                    </div>
                    
                    {customer.phone && (
                      <div className="flex items-center text-sm">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                        </svg>
                        <a href={`tel:${customer.phone}`} className="text-gray-700 hover:text-primary">
                          {customer.phone}
                        </a>
                      </div>
                    )}
                    
                    <div className="mt-3">
                      <Link to={`/clientes/${customer.id}`}>
                        <Button variant="outline" size="sm" fullWidth={true}>
                          Ver detalhes do cliente
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-2">Informações do cliente não disponíveis.</p>
                )}
              </Card>
              
              {/* Analytics card if proposal has been sent */}
              {proposal.status !== 'DRAFT' && (
                <Card title="Análise de Engajamento">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Visualizações</span>
                      <p className="text-lg font-bold">{proposal.viewCount || 0}</p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-gray-500">Tempo médio de visualização</span>
                      <p className="font-medium">
                        {proposal.averageViewTime ? `${Math.round(proposal.averageViewTime / 60)} min` : 'N/A'}
                      </p>
                    </div>
                    
                    {proposal.firstViewedAt && (
                      <div>
                        <span className="text-sm text-gray-500">Primeira visualização</span>
                        <p>{formatDate(proposal.firstViewedAt)}</p>
                      </div>
                    )}
                    
                    {proposal.lastViewedAt && (
                      <div>
                        <span className="text-sm text-gray-500">Última visualização</span>
                        <p>{formatDate(proposal.lastViewedAt)}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>
          
          {/* Send Proposal Modal */}
          {isSendModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Enviar Proposta</h3>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={handleCloseSendModal}
                    >
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                  
                  {sendSuccess ? (
                    <div className="text-center py-6">
                      <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      
                      <h4 className="mt-4 text-lg font-medium text-gray-900">Proposta enviada com sucesso!</h4>
                      <p className="mt-2 text-gray-600">
                        A proposta foi enviada para o cliente por e-mail.
                      </p>
                      
                      <Button
                        variant="primary"
                        className="mt-6"
                        onClick={handleCloseSendModal}
                      >
                        Fechar
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSendProposal}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email do destinatário
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={sendFormData.email}
                            onChange={handleSendInputChange}
                            required
                            className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assunto
                          </label>
                          <input
                            type="text"
                            name="subject"
                            value={sendFormData.subject}
                            onChange={handleSendInputChange}
                            required
                            className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mensagem
                          </label>
                          <textarea
                            name="message"
                            value={sendFormData.message}
                            onChange={handleSendInputChange}
                            rows="6"
                            className="block w-full rounded-md shadow-sm border-gray-300 focus:ring-primary focus:border-primary"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end space-x-3">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleCloseSendModal}
                        >
                          Cancelar
                        </Button>
                        
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={isSending}
                        >
                          Enviar
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProposalDetailPage;