import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AdminAuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/admin/login');
          return;
        }

        const { data: admin } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', user.email)
          .eq('is_active', true)
          .single();

        if (!admin) {
          toast.error('Accès non autorisé');
          navigate('/');
          return;
        }

        setIsAdmin(true);
        
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  return isAdmin ? children : null;
};

export default AdminAuthGuard;