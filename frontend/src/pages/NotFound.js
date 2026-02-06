import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="text-center">
        <h1 className="font-serif text-9xl font-bold text-brand-blue mb-4">404</h1>
        <p className="text-2xl text-slate-600 mb-8">Page not found</p>
        <Link to="/">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;