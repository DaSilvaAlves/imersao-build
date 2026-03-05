import { Globe, Github, MapPin, Clock, Zap, CheckCircle } from 'lucide-react';
import type { Project } from '../../types';

interface Props {
  projects: Project[];
  loading: boolean;
}

const STATUS_CONFIG = {
  building: { label: 'A construir', color: '#eab308', icon: Clock },
  deployed: { label: 'Deployed', color: '#6366f1', icon: Zap },
  live: { label: 'Online', color: '#22c55e', icon: CheckCircle },
};

const STYLE_LABELS: Record<string, string> = {
  brutalist: '⬛ Brutalista',
  minimal: '⬜ Minimal',
  glass: '🔷 Glassmorphism',
  gastro: '🟫 Neo-Gastro',
  bento: '🟦 Bento',
};

export default function ProjectsPage({ projects, loading }: Props) {
  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>A carregar projetos...</p>
      </div>
    );
  }

  const live = projects.filter(p => p.status === 'live');
  const deployed = projects.filter(p => p.status === 'deployed');
  const building = projects.filter(p => p.status === 'building');

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">
          <Globe size={20} /> Projetos Publicados
        </h2>
        <span className="count-badge">{projects.length} projetos</span>
      </div>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-num" style={{ color: '#22c55e' }}>{live.length}</span>
          <span className="stat-label">Online</span>
        </div>
        <div className="stat-item">
          <span className="stat-num" style={{ color: '#6366f1' }}>{deployed.length}</span>
          <span className="stat-label">Deployed</span>
        </div>
        <div className="stat-item">
          <span className="stat-num" style={{ color: '#eab308' }}>{building.length}</span>
          <span className="stat-label">Em Progresso</span>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map(p => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <p>Nenhum projeto publicado ainda.</p>
          <p className="empty-sub">Os projetos aparecem aqui quando os alunos completam o pipeline.</p>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_CONFIG[project.status];
  const StatusIcon = status.icon;
  const createdDate = new Date(project.created_at).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="project-card">
      {/* Status badge */}
      <div className="project-status" style={{ color: status.color, borderColor: status.color }}>
        <StatusIcon size={11} />
        {status.label}
      </div>

      {/* Screenshot placeholder */}
      {project.screenshot_url ? (
        <img src={project.screenshot_url} alt={project.name} className="project-screenshot" />
      ) : (
        <div className="project-screenshot-placeholder">
          <Globe size={24} />
          <span>Preview em breve</span>
        </div>
      )}

      <div className="project-body">
        <h3 className="project-name">{project.name}</h3>
        {project.description && (
          <p className="project-desc">{project.description}</p>
        )}
        {project.pain_point && (
          <p className="project-pain">
            <span className="pain-label">Dor:</span> "{project.pain_point}"
          </p>
        )}

        {/* Member */}
        {project.member && (
          <div className="project-member">
            <div className="member-avatar-sm">
              {project.member.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
            </div>
            <span>{project.member.name}</span>
            {project.member.city && (
              <span className="project-city">
                <MapPin size={10} /> {project.member.city}
              </span>
            )}
          </div>
        )}

        {/* Tech stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="tech-tags">
            {project.tech_stack.map(t => (
              <span key={t} className="tech-tag">{t}</span>
            ))}
          </div>
        )}

        {/* Style + date */}
        <div className="project-meta">
          {project.ui_style && (
            <span className="style-tag">{STYLE_LABELS[project.ui_style] ?? project.ui_style}</span>
          )}
          <span className="project-date">{createdDate}</span>
        </div>

        {/* Links */}
        <div className="project-links">
          {project.deploy_url && (
            <a
              href={project.deploy_url}
              target="_blank"
              rel="noreferrer"
              className="btn-link btn-live"
              aria-label={`Ver ${project.name} online`}
            >
              <Globe size={13} /> Ver online
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="btn-link btn-github"
              aria-label={`GitHub de ${project.name}`}
            >
              <Github size={13} /> Código
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
