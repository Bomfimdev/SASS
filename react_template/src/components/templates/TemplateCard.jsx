import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const TemplateCard = ({ template, onView, onEdit, onDuplicate, onSelect, className }) => {
  const isPremium = template.isPremium;

  return (
    <Card 
      variant="bordered" 
      className={`transition-shadow hover:shadow-md ${className}`}
      noPadding={true}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {template.thumbnailUrl ? (
          <img 
            src={template.thumbnailUrl} 
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
            </svg>
          </div>
        )}
        
        {/* Category & Premium badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {template.category && (
            <Badge variant="default" className="opacity-90">
              {template.category}
            </Badge>
          )}
          
          {isPremium && (
            <Badge variant="warning" className="opacity-90">
              Premium
            </Badge>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-medium text-lg text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
        </div>
      </div>
      
      {/* Actions */}
      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 flex flex-wrap gap-2">
        {onSelect && (
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onSelect(template)}
            fullWidth={true}
          >
            Selecionar
          </Button>
        )}
        
        {!onSelect && (
          <>
            <Link to={`/modelos/${template.id}`} className="w-full">
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => onView && onView(template)}
                fullWidth={true}
              >
                Ver modelo
              </Button>
            </Link>
            
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit && onEdit(template)}
                fullWidth={true}
              >
                Editar
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDuplicate && onDuplicate(template)}
                fullWidth={true}
              >
                Duplicar
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

TemplateCard.propTypes = {
  template: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    category: PropTypes.string,
    type: PropTypes.string,
    isPremium: PropTypes.bool
  }).isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDuplicate: PropTypes.func,
  onSelect: PropTypes.func,
  className: PropTypes.string
};

export default TemplateCard;