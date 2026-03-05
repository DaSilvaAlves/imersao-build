import { Users, MapPin, Star, ExternalLink } from 'lucide-react';
import type { Member } from '../../types';

interface Props {
  members: Member[];
  loading: boolean;
}

const EXPERIENCE_COLORS: Record<string, string> = {
  iniciante: '#22c55e',
  intermediário: '#eab308',
  avançado: '#6366f1',
};

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
  return <div className="member-avatar">{initials}</div>;
}

export default function MembersPage({ members, loading }: Props) {
  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>A carregar membros...</p>
      </div>
    );
  }

  const mentors = members.filter(m => m.is_mentor);
  const alunos = members.filter(m => !m.is_mentor);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">
          <Users size={20} /> Membros da Comunidade
        </h2>
        <span className="count-badge">{members.length} pessoas</span>
      </div>

      {mentors.length > 0 && (
        <section className="members-section">
          <h3 className="section-label">
            <Star size={14} /> Mentores
          </h3>
          <div className="members-grid">
            {mentors.map(m => (
              <MemberCard key={m.id} member={m} />
            ))}
          </div>
        </section>
      )}

      <section className="members-section">
        <h3 className="section-label">
          <Users size={14} /> Alunos — Imersão #{alunos[0]?.imersao_num ?? 1}
        </h3>
        <div className="members-grid">
          {alunos.map(m => (
            <MemberCard key={m.id} member={m} />
          ))}
        </div>
      </section>

      {members.length === 0 && (
        <div className="empty-state">
          <p>Nenhum membro registado ainda.</p>
        </div>
      )}
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  const expColor = member.experience ? EXPERIENCE_COLORS[member.experience] : '#888';
  const joinDate = new Date(member.joined_at).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <div className={`member-card ${member.is_mentor ? 'mentor-card' : ''}`}>
      {member.is_mentor && <div className="mentor-badge">MENTOR</div>}
      <AvatarPlaceholder name={member.name} />
      <div className="member-info">
        <h4 className="member-name">{member.name}</h4>
        {member.city && (
          <p className="member-city">
            <MapPin size={11} /> {member.city}
          </p>
        )}
        {member.experience && (
          <span className="experience-tag" style={{ borderColor: expColor, color: expColor }}>
            {member.experience}
          </span>
        )}
        <p className="member-date">Inscrito a {joinDate}</p>
      </div>
      {member.linkedin_url && (
        <a
          href={member.linkedin_url}
          target="_blank"
          rel="noreferrer"
          className="member-link"
          aria-label={`LinkedIn de ${member.name}`}
        >
          <ExternalLink size={13} />
        </a>
      )}
    </div>
  );
}
