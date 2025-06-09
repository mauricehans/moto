import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ServiceCard = ({ icon: Icon, title, description }: ServiceCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 text-red-600 rounded-full mb-5">
        <Icon size={24} />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default ServiceCard;