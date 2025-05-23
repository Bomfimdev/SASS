import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const statusColors = {
  DRAFT: 'default',
  SENT: 'primary',
  VIEWED: 'info',
  ACCEPTED: 'success',
  REJECTED: 'danger',
  EXPIRED: 'warning',
};

const statusLabels = {
  DRAFT: 'Rascunho',
  SENT: 'Enviada',
  VIEWED: 'Visualizada',
  ACCEPTED: 'Aprovada',
  REJECTED: 'Rejeitada',
  EXPIRED: 'Expirada',
};

const ProposalCard = ({ proposal, onView, onSend, onDuplicate, className }) => {
  const isExpired = proposal.isExpired || (proposal.expirationDate && new Date(proposal.expirationDate) < new Date());
  const statusColor = isExpired && proposal.status !== 'ACCEPTED' ? 'warning' : statusColors[proposal.status];
  const statusLabel = isExpired && proposal.status !== 'ACCEPTED' ? 'Expirada' : statusLabels[proposal.status];

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

  return (
    <Card 
      variant="bordered" 
      className={`transition-shadow hover:shadow-md ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg text-gray-900">{proposal.title}</h3>
          <p className="text-sm text-gray-500">{proposal.customer?.name || 'Cliente'}</p>
        </div>
        <Badge variant={statusColor}>{statusLabel}</Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Valor total</p>
          <p className="font-medium text-gray-900">{formatCurrency(proposal.totalValue || 0)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Criada em</p>
          <p className="text-gray-900">{formatDate(proposal.creationDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Expira em</p>
          <p className="text-gray-900">{formatDate(proposal.expirationDate)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Última atualização</p>
          <p className="text-gray-900">{formatDate(proposal.lastStatusChange || proposal.updatedAt)}</p>
        </div>
      </div>
      
      {proposal.status === 'VIEWED' && (
        <div className="mb-4 px-3 py-2 bg-blue-50 rounded-md text-sm text-blue-700">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Visualizada pelo cliente há {proposal.viewCount || 1} {proposal.viewCount === 1 ? 'vez' : 'vezes'}
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        <Link to={`/propostas/${proposal.id}`}>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onView && onView(proposal)}
          >
            Ver detalhes
          </Button>
        </Link>
        
        {proposal.status === 'DRAFT' && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onSend && onSend(proposal)}
          >
            Enviar
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDuplicate && onDuplicate(proposal)}
        >
          Duplicar
        </Button>
      </div>
    </Card>
  );
};

ProposalCard.propTypes = {
  proposal: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    totalValue: PropTypes.number,
    creationDate: PropTypes.string,
    expirationDate: PropTypes.string,
    lastStatusChange: PropTypes.string,
    updatedAt: PropTypes.string,
    isExpired: PropTypes.bool,
    viewCount: PropTypes.number,
    customer: PropTypes.shape({
      name: PropTypes.string
    })
  }).isRequired,
  onView: PropTypes.func,
  onSend: PropTypes.func,
  onDuplicate: PropTypes.func,
  className: PropTypes.string
};

export default ProposalCard;