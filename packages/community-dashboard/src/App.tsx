import { useState, useEffect } from 'react';
import { Users, Globe, GraduationCap, Cpu } from 'lucide-react';
import MembersPage from './features/members/MembersPage';
import ProjectsPage from './features/projects/ProjectsPage';
import MentorPage from './features/mentor/MentorPage';
import { supabase } from './lib/supabase';
import { DEMO_MEMBERS, DEMO_PROJECTS, DEMO_PROGRESS } from './lib/demo-data';
import type { Member, Project, Progress, View } from './types';
import './styles/theme.css';

const IS_DEMO = !import.meta.env.VITE_SUPABASE_URL;

export default function App() {
  const [view, setView] = useState<View>('members');
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (IS_DEMO) {
      // Demo mode — use static data
      setMembers(DEMO_MEMBERS);
      setProjects(DEMO_PROJECTS);
      setProgress(DEMO_PROGRESS);
      setLoading(false);
      return;
    }

    // Real Supabase mode
    async function fetchAll() {
      setLoading(true);
      const [membersRes, projectsRes, progressRes] = await Promise.all([
        supabase
          .from('imersao_members')
          .select('*')
          .order('joined_at', { ascending: true }),
        supabase
          .from('imersao_projects')
          .select('*, member:imersao_members(name, avatar_url, city)')
          .order('created_at', { ascending: false }),
        supabase
          .from('imersao_progress')
          .select('*, member:imersao_members(name, avatar_url, city, experience)')
          .order('started_at', { ascending: true }),
      ]);
      if (membersRes.data)  setMembers(membersRes.data as Member[]);
      if (projectsRes.data) setProjects(projectsRes.data as Project[]);
      if (progressRes.data) setProgress(progressRes.data as Progress[]);
      setLoading(false);
    }
    void fetchAll();
  }, []);

  const NAV_ITEMS = [
    { id: 'members' as View,  label: 'Membros',  icon: Users,          count: members.length },
    { id: 'projects' as View, label: 'Projetos', icon: Globe,           count: projects.length },
    { id: 'mentor' as View,   label: 'Mentor',   icon: GraduationCap,   count: progress.length },
  ];

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <Cpu size={22} className="brand-icon" />
          <div>
            <h1 className="brand-title">Comunidade IA-PT</h1>
            <p className="brand-sub">Imersão IA Portugal — Dashboard</p>
          </div>
        </div>
        <div className="live-badge">
          <div className="live-dot" />
          {IS_DEMO ? 'Demo Mode' : 'Live Data'}
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav-bar" aria-label="Navegação principal">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-tab ${view === item.id ? 'active' : ''}`}
              onClick={() => setView(item.id)}
              aria-current={view === item.id ? 'page' : undefined}
            >
              <Icon size={15} />
              {item.label}
              <span className="nav-count">{item.count}</span>
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <main className="app-content">
        {view === 'members'  && <MembersPage  members={members}   loading={loading} />}
        {view === 'projects' && <ProjectsPage projects={projects} loading={loading} />}
        {view === 'mentor'   && <MentorPage   progress={progress} loading={loading} />}
      </main>
    </div>
  );
}
