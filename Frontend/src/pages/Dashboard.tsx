import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { getProjects, createProject, updateProject, deleteProject } from '../api/project';
import { syncUser } from '../api/auth';
import type { Project, ProjectsResponse } from '../types/project';
import ProjectModal from '../components/ProjectModal';

const Dashboard: React.FC = () => {
  const { email, accessToken, clearAuth, userId } = useAuthStore();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const username = email ? email.split('@')[0] : 'User';

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const ensureUserSynced = async () => {
    if (userId && email) {
      try {
        await syncUser({
          id: Number(userId),
          email: email
        });
        console.log('User synced to project service');
      } catch (syncErr: any) {
        console.warn('Failed to sync user to project service:', syncErr);
        // Don't block dashboard if sync fails, just log it
      }
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.projects || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      ensureUserSynced().then(() => {
        fetchProjects();
      });
    }
  }, [accessToken]);

  const handleCreateProject = async (data: { title: string; description: string }) => {
    setActionLoading('create');
    try {
      await createProject(data);
      await fetchProjects(); // Refresh the list
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateProject = async (data: { title: string; description: string }) => {
    if (!selectedProject) return;
    setActionLoading('update');
    try {
      await updateProject(selectedProject.id.toString(), data);
      await fetchProjects(); // Refresh the list
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setActionLoading(`delete-${projectId}`);
    try {
      await deleteProject(projectId);
      await fetchProjects(); // Refresh the list
    } finally {
      setActionLoading(null);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedProject(null);
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setModalMode('edit');
    setSelectedProject(project);
    setModalOpen(true);
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'projects', label: '📁 Projects', icon: '📁' },
    { id: 'analytics', label: '📈 Analytics', icon: '📈' },
    { id: 'system', label: '⚙️ System', icon: '⚙️' },
    { id: 'activity', label: '📋 Activity', icon: '📋' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
          <h3 className="text-sm font-medium text-blue-700">Total Projects</h3>
          <p className="text-3xl font-bold text-blue-700">{projects.length}</p>
          <p className="text-sm text-green-600">+12% from last month</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
          <h3 className="text-sm font-medium text-green-700">Active Users</h3>
          <p className="text-3xl font-bold text-green-700">1,234</p>
          <p className="text-sm text-green-600">+5% from yesterday</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
          <h3 className="text-sm font-medium text-yellow-700">System Health</h3>
          <p className="text-3xl font-bold text-yellow-700">99.9%</p>
          <p className="text-sm text-green-600">All systems operational</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl">
          <h3 className="text-sm font-medium text-purple-700">Response Time</h3>
          <p className="text-3xl font-bold text-purple-700">125ms</p>
          <p className="text-sm text-gray-600">+2ms from average</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'New Project', icon: '➕', action: openCreateModal },
            { label: 'Import Data', icon: '📥', action: () => alert('Import Data feature coming soon!') },
            { label: 'Export Report', icon: '📤', action: () => alert('Export Report feature coming soon!') },
            { label: 'Settings', icon: '⚙️', action: () => alert('Settings feature coming soon!') }
          ].map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className="p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-sm font-medium text-gray-700">{action.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Your Projects</h2>
        <button 
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Project
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first project</p>
          <button 
            onClick={openCreateModal}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl border p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {project.description || 'No description available'}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openEditModal(project)}
                    disabled={actionLoading === `edit-${project.id}`}
                    className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id.toString())}
                    disabled={actionLoading === `delete-${project.id}`}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {actionLoading === `delete-${project.id}` ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Analytics</h2>
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">125ms</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">1.2M</div>
            <div className="text-sm text-gray-600">Requests Today</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">System Management</h2>
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🟢</span>
              <div>
                <p className="font-medium">Auth Service</p>
                <p className="text-sm text-gray-600">Port 3001 - Healthy</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🟢</span>
              <div>
                <p className="font-medium">Project Service</p>
                <p className="text-sm text-gray-600">Port 3002 - Healthy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Activity Feed</h2>
      <div className="bg-white rounded-xl border p-6">
        <div className="space-y-4">
          {[
            { message: 'New project "E-commerce Platform" created', time: '5 minutes ago', icon: '📁' },
            { message: 'User john.doe@example.com registered', time: '15 minutes ago', icon: '👤' },
            { message: 'Deployment to production successful', time: '30 minutes ago', icon: '🚀' },
            { message: 'High CPU usage detected', time: '1 hour ago', icon: '⚠️' }
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'projects':
        return renderProjects();
      case 'analytics':
        return renderAnalytics();
      case 'system':
        return renderSystem();
      case 'activity':
        return renderActivity();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Enhanced Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">DevForge</h1>
              <p className="text-xs text-gray-500">Development Platform</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="px-4 py-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{username}</p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            >
              🚪 Log Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Welcome back, {username}! 👋
                </h2>
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your DevForge platform today.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last updated</p>
                  <p className="text-sm font-medium">{new Date().toLocaleTimeString()}</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </main>

      {/* Project Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={modalMode === 'create' ? handleCreateProject : handleUpdateProject}
        project={selectedProject}
        mode={modalMode}
      />
    </div>
  );
};

export default Dashboard;
