import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProposalForm from '../../components/proposals/ProposalForm';
import Alert from '../../components/ui/Alert';
import proposalService from '../../api/proposalService';

const NewProposalPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const newProposal = await proposalService.createProposal(formData);
      navigate(`/propostas/${newProposal.id}`);
    } catch (err) {
      console.error('Error creating proposal:', err);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Erro ao criar proposta: ${err.response.data.message}`);
      } else {
        setError('Erro ao criar proposta. Por favor, verifique os dados e tente novamente.');
      }
      
      // Re-throw to prevent navigation in the form component
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Proposta</h1>
          <p className="text-gray-600">
            Crie uma nova proposta comercial
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <ProposalForm 
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default NewProposalPage;