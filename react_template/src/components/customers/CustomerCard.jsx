import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const CustomerCard = ({ customer, onView, onEdit, onDelete, className }) => {
  return (
    <Card 
      variant="bordered" 
      className={`transition-shadow hover:shadow-md ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-500">{customer.company || 'Empresa não informada'}</p>
        </div>
        {customer.active !== undefined && (
          <Badge variant={customer.active ? 'success' : 'warning'}>
            {customer.active ? 'Ativo' : 'Inativo'}
          </Badge>
        )}
      </div>
      
      <div className="mb-4 space-y-2">
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
        
        {customer.position && (
          <div className="flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path>
            </svg>
            <span className="text-gray-700">
              {customer.position}
            </span>
          </div>
        )}
      </div>
      
      {customer.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
          <div className="font-medium mb-1">Observações:</div>
          <p>{customer.notes}</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        <Link to={`/clientes/${customer.id}`}>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onView && onView(customer)}
          >
            Ver detalhes
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit && onEdit(customer)}
        >
          Editar
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onDelete && onDelete(customer)}
        >
          Excluir
        </Button>
      </div>
    </Card>
  );
};

CustomerCard.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    company: PropTypes.string,
    position: PropTypes.string,
    notes: PropTypes.string,
    active: PropTypes.bool
  }).isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  className: PropTypes.string
};

export default CustomerCard;