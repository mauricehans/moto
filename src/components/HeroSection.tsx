import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  buttonText?: string;
  buttonLink?: string;
}

const HeroSection = ({
  title,
  subtitle,
  backgroundImage,
  buttonText,
  buttonLink
}: HeroSectionProps) => {
  return (
    <section 
      className="relative h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      <div className="relative container mx-auto px-4 text-center text-white z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
          {title}
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-200">
          {subtitle}
        </p>
        
        {buttonText && buttonLink && (
          <Link 
            to={buttonLink}
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300"
          >
            {buttonText}
            <ArrowRight size={20} className="ml-2" />
          </Link>
        )}
      </div>
    </section>
  );
};

export default HeroSection;