import { Mail } from 'lucide-react';
import useGarageSettings from '../hooks/useGarageSettings';

interface ContactFormProps {
  motorcycleId?: string;
  motorcycleName?: string;
  partName?: string;
}

const ContactForm = ({ motorcycleId, motorcycleName, partName }: ContactFormProps) => {
  const { settings } = useGarageSettings();
  
  const getSubject = () => {
    if (motorcycleName) {
      return `Demande d'information - ${motorcycleName}`;
    }
    if (partName) {
      return `Demande d'information - ${partName}`;
    }
    return 'Demande d\'information';
  };
  
  const getBody = () => {
    if (motorcycleName) {
      return `Bonjour,\n\nJe suis intéressé(e) par la moto ${motorcycleName}.\n\nMerci de me contacter pour plus d'informations.\n\nCordialement`;
    }
    if (partName) {
      return `Bonjour,\n\nJe suis intéressé(e) par la pièce ${partName}.\n\nMerci de me contacter pour plus d'informations.\n\nCordialement`;
    }
    return `Bonjour,\n\nJe souhaiterais obtenir des informations.\n\nMerci de me contacter.\n\nCordialement`;
  };
  
  const mailtoLink = `mailto:${settings?.email || 'contact@agdemoto.fr'}?subject=${encodeURIComponent(getSubject())}&body=${encodeURIComponent(getBody())}`;

  return (
    <div className="space-y-6">
      {(motorcycleName || partName) && (
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <p className="text-gray-700">
            Vous êtes intéressé(e) par : <span className="font-semibold">{motorcycleName || partName}</span>
          </p>
        </div>
      )}
      
      <div className="text-center">
        <p className="text-gray-600 mb-6">
          Cliquez sur le bouton ci-dessous pour nous contacter directement par email.
        </p>
        
        <a
          href={mailtoLink}
          className="inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300 text-lg"
        >
          <Mail size={24} className="mr-3" />
          Nous contacter par email
        </a>
        
        <p className="text-sm text-gray-500 mt-4">
          Email : {settings?.email || 'contact@agdemoto.fr'}
        </p>
      </div>
    </div>
  );
};

export default ContactForm;