import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Star } from 'lucide-react';
import { Part } from '../types/Part';

interface PartCardProps {
  part: Part;
}

const PartCard = ({ part }: PartCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getConditionLabel = (condition: string): string => {
    const labels: Record<string, string> = {
      'new': 'Neuf',
      'used_excellent': 'Occasion - Excellent',
      'used_good': 'Occasion - Bon état',
      'used_fair': 'Occasion - État correct',
      'refurbished': 'Reconditionné'
    };
    return labels[condition] || condition;
  };

  const getConditionColor = (condition: string): string => {
    const colors: Record<string, string> = {
      'new': 'bg-green-100 text-green-800',
      'used_excellent': 'bg-blue-100 text-blue-800',
      'used_good': 'bg-yellow-100 text-yellow-800',
      'used_fair': 'bg-orange-100 text-orange-800',
      'refurbished': 'bg-purple-100 text-purple-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  const mainImage = part.images?.[0]?.image || '/images/default-part.jpg';
  const price = parseFloat(part.price);
  const categoryName = part.category?.name || 'Non catégorisé';
  
  return (
    <Link 
      to={`/parts/${part.id}`}
      className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden" style={{ height: '200px' }}>
        <img 
          src={mainImage} 
          alt={part.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/default-part.jpg';
          }}
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {part.is_featured && (
            <div className="bg-red-600 text-white text-xs font-bold uppercase px-2 py-1 rounded flex items-center">
              <Star size={12} className="mr-1" />
              À la une
            </div>
          )}
          <div className={`text-xs font-medium px-2 py-1 rounded ${getConditionColor(part.condition)}`}>
            {getConditionLabel(part.condition)}
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="bg-white bg-opacity-90 text-gray-800 text-xs font-medium px-2 py-1 rounded flex items-center">
            <Package size={12} className="mr-1" />
            Stock: {part.stock}
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {part.name}
          </h3>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-red-600 font-bold text-xl">
            {price.toLocaleString('fr-FR')} €
          </span>
          <span className="text-gray-600 text-sm">
            {part.brand}
          </span>
        </div>
        
        <div className="mb-3">
          <span className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mb-2">
            {categoryName}
          </span>
          <p className="text-gray-600 text-sm">
            Compatible: {part.compatible_models}
          </p>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {part.description}
        </p>
      </div>
    </Link>
  );
};

export default PartCard;
