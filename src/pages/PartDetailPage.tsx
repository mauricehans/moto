import React from 'react';
import { useParams } from 'react-router-dom';
import SectionTitle from '../components/SectionTitle';

const PartDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle>Détails de la Pièce</SectionTitle>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
              <img
                src="https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg"
                alt="Pièce détachée"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg"
                    alt={`Vue ${index + 1}`}
                    className="object-cover w-full h-full cursor-pointer hover:opacity-75 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Pièce #{id}</h1>
            <div className="border-t border-gray-200 pt-4">
              <dl className="divide-y divide-gray-200">
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">État</dt>
                  <dd className="text-sm text-gray-900">Occasion</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Marque</dt>
                  <dd className="text-sm text-gray-900">Honda</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Modèle compatible</dt>
                  <dd className="text-sm text-gray-900">CBR 600RR</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Année</dt>
                  <dd className="text-sm text-gray-900">2018-2023</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Prix</dt>
                  <dd className="text-xl font-bold text-gray-900">299 €</dd>
                </div>
              </dl>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Description</h2>
              <p className="text-gray-700">
                Description détaillée de la pièce avec ses caractéristiques, son état et toute information pertinente pour l'acheteur potentiel.
              </p>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Contacter le vendeur
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartDetailPage;