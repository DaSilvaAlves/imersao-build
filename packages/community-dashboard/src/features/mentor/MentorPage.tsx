import { GraduationCap, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import type { Progress } from '../../types';

interface Props {
  progress: Progress[];
  loading: boolean;
}

const STEPS = [
  { key: 'step_profiler', label: 'Profiler', short: 'P' },
  { key: 'step_briefing', label: 'Briefing', short: 'B' },
  { key: 'step_starter', label: 'Starter', short: 'S' },
  { key: 'step_optimizer', label: 'Optimizer', short: 'O' },
  { key: 'step_compiler', label: 'Compiler', short: 'C' },
  { key: 'step_deployed', label: 'Deploy', short: 'D' },
] as const;

type StepKey = (typeof STEPS)[number]['key'];

function calcProgress(p: Progress): number {
  const steps: StepKey[] = ['step_profiler', 'step_briefing', 'step_starter', 'step_optimizer', 'step_compiler', 'step_deployed'];
  const done = steps.filter(s => p[s]).length;
  return Math.round((done / steps.length) * 100);
}

export default function MentorPage({ progress, loading }: Props) {
  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>A carregar progresso dos alunos...</p>
      </div>
    );
  }

  const completed = progress.filter(p => p.completed_at !== null).length;
  const inProgress = progress.filter(p => p.completed_at === null).length;
  const withNotes = progress.filter(p => p.notes !== null).length;

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">
          <GraduationCap size={20} /> Dashboard do Mentor
        </h2>
        <span className="count-badge">{progress.length} alunos</span>
      </div>

      {/* Summary stats */}
      <div className="stats-bar mentor-stats">
        <div className="stat-item">
          <span className="stat-num" style={{ color: '#22c55e' }}>{completed}</span>
          <span className="stat-label">Concluíram</span>
        </div>
        <div className="stat-item">
          <span className="stat-num" style={{ color: '#6366f1' }}>{inProgress}</span>
          <span className="stat-label">Em Progresso</span>
        </div>
        <div className="stat-item">
          <span className="stat-num" style={{ color: '#eab308' }}>{withNotes}</span>
          <span className="stat-label">Precisam Ajuda</span>
        </div>
      </div>

      {/* Progress table header */}
      <div className="progress-table">
        <div className="progress-table-header">
          <span className="col-name">Aluno</span>
          <div className="col-steps">
            {STEPS.map(s => (
              <span key={s.key} className="step-header" title={s.label}>
                {s.short}
              </span>
            ))}
          </div>
          <span className="col-pct">%</span>
          <span className="col-status">Estado</span>
        </div>

        {progress.map(p => {
          const pct = calcProgress(p);
          const hasNotes = p.notes !== null;
          return (
            <div key={p.id} className={`progress-row ${hasNotes ? 'has-notes' : ''}`}>
              <div className="col-name">
                <div className="member-avatar-sm">
                  {(p.member?.name ?? '??').split(' ').slice(0, 2).map(n => n[0]).join('')}
                </div>
                <div className="student-info">
                  <span className="student-name">{p.member?.name ?? 'Desconhecido'}</span>
                  {p.member?.city && (
                    <span className="student-city">{p.member.city}</span>
                  )}
                </div>
              </div>

              <div className="col-steps">
                {STEPS.map(s => {
                  const done = p[s.key];
                  return (
                    <span
                      key={s.key}
                      className={`step-dot ${done ? 'done' : 'pending'}`}
                      title={`${s.label}: ${done ? 'Concluído' : 'Pendente'}`}
                      aria-label={`${s.label} ${done ? 'concluído' : 'pendente'}`}
                    >
                      {done ? <CheckCircle size={14} /> : <Circle size={14} />}
                    </span>
                  );
                })}
              </div>

              <div className="col-pct">
                <div className="pct-bar">
                  <div
                    className="pct-fill"
                    style={{
                      width: `${pct}%`,
                      background: pct === 100 ? '#22c55e' : pct > 50 ? '#6366f1' : '#eab308',
                    }}
                  />
                </div>
                <span className="pct-label">{pct}%</span>
              </div>

              <div className="col-status">
                {p.completed_at ? (
                  <span className="status-chip done">
                    <CheckCircle size={11} /> Concluído
                  </span>
                ) : hasNotes ? (
                  <span className="status-chip needs-help">
                    <AlertCircle size={11} /> Precisa ajuda
                  </span>
                ) : (
                  <span className="status-chip in-progress">
                    Em progresso
                  </span>
                )}
              </div>

              {hasNotes && (
                <div className="progress-notes">
                  <AlertCircle size={11} />
                  <span>{p.notes}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {progress.length === 0 && (
        <div className="empty-state">
          <p>Nenhum aluno registado ainda.</p>
        </div>
      )}
    </div>
  );
}
