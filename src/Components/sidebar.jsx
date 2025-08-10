const Sidebar = ({ isOpen, currentPage, setCurrentPage }) => {
  const { user, hasPermission } = useAuth();
  const { isDark } = useTheme();

  const menuItems = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: Home, 
      permission: 'view_dashboard' 
    },
    { 
      id: 'users', 
      name: 'User Management', 
      icon: Users, 
      permission: 'manage_tenant_users' 
    },
    { 
      id: 'tenants', 
      name: 'Organizations', 
      icon: Building2, 
      permission: 'create_tenant' 
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: BarChart3, 
      permission: 'view_analytics' 
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: Settings, 
      permission: 'tenant_settings' 
    }
  ];

  const visibleItems = menuItems.filter(item => 
    hasPermission(item.permission) || 
    (user?.role === ROLES.USER && item.id === 'dashboard')
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 ${isDark ? 'bg-gray-900' : 'bg-white'} transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex flex-col h-full">
          <div className={`flex items-center justify-between h-16 px-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className={`lg:hidden ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-2">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === item.id
                      ? (isDark ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-700')
                      : (isDark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100')
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* User info */}
          <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`flex items-center space-x-3 p-3 rounded-md ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${isDark ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'} truncate`}>
                  {user?.name}
                </p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} capitalize`}>
                  {user?.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar