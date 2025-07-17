// components/layout/Layout.js
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const router = useRouter();

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/assistiti', label: 'Assistiti', icon: '👥' },
    { href: '/operatori', label: 'Operatori', icon: '🩺' },
    { href: '/fascicolo', label: 'Fascicoli', icon: '📋' },
    { href: '/diario', label: 'Diario', icon: '📝' },
    { href: '/formazione', label: 'Formazione AI', icon: '🧠' },
    { href: '/rischio', label: 'Rischio Clinico', icon: '⚠️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">
            🏥 SanitàDomicilio
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestione Assistenza Domiciliare
          </p>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                router.pathname === item.href ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                {menuItems.find(item => item.href === router.pathname)?.label || 'Dashboard'}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  👤 Dr. Mario Rossi
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  MR
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
