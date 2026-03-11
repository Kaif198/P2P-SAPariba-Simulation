import React, { useState, useMemo } from 'react';
import { improvementInitiatives } from '../data/improvementData';
import type { ProcessImprovement as ImprovementType, ImprovementStatus } from '../data/types';
import { Target, TrendingUp, Clock, ChevronDown, ChevronUp, User, Activity, ArrowRight, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

const columns: { title: string; status: ImprovementStatus; borderColor: string; bg: string; headerText: string }[] = [
  { title: 'Identified',  status: 'Identified',  borderColor: 'border-t-slate-400',  bg: 'bg-slate-50',  headerText: 'text-slate-700' },
  { title: 'In Progress', status: 'In Progress', borderColor: 'border-t-blue-400',   bg: 'bg-blue-50',   headerText: 'text-blue-700'  },
  { title: 'Piloting',    status: 'Piloting',    borderColor: 'border-t-amber-400',  bg: 'bg-amber-50',  headerText: 'text-amber-700' },
  { title: 'Completed',   status: 'Completed',   borderColor: 'border-t-green-400',  bg: 'bg-green-50',  headerText: 'text-green-700' },
];

const nextStatus: Record<ImprovementStatus, ImprovementStatus | null> = {
  'Identified':  'In Progress',
  'In Progress': 'Piloting',
  'Piloting':    'Completed',
  'Completed':   null,
};

const prevStatus: Record<ImprovementStatus, ImprovementStatus | null> = {
  'Identified':  null,
  'In Progress': 'Identified',
  'Piloting':    'In Progress',
  'Completed':   'Piloting',
};

interface CardProps {
  data: ImprovementType;
  currentStatus: ImprovementStatus;
  onAdvance: () => void;
  onRevert: () => void;
}

const ImprovementCard: React.FC<CardProps> = ({ data, currentStatus, onAdvance, onRevert }) => {
  const [expanded, setExpanded] = useState(false);
  const canAdvance = nextStatus[currentStatus] !== null;
  const canRevert  = prevStatus[currentStatus] !== null;

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border border-[#E2E6EA] mb-3 transition-all duration-200 hover:shadow-md ${expanded ? 'ring-2 ring-[#0069B4]/30' : ''}`}>
      <div
        className="flex justify-between items-start cursor-pointer group"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1 pr-2">
          <h4 className="font-semibold text-[#1A1A2E] leading-tight text-sm group-hover:text-[#0069B4] transition-colors">{data.title}</h4>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-[#5A6478]">
              <User size={11} /> {data.owner}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-green-700">
              <TrendingUp size={11} /> {data.expectedBenefit}
            </span>
          </div>
        </div>
        <div className="text-gray-400 mt-0.5">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#E2E6EA] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <h5 className="text-[10px] font-bold text-[#5A6478] uppercase tracking-wider mb-1">Problem Statement</h5>
            <p className="text-xs text-[#5A6478] leading-relaxed">{data.problemStatement}</p>
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-[#5A6478] uppercase tracking-wider mb-1">Approach</h5>
            <p className="text-xs text-[#5A6478] leading-relaxed">{data.approach}</p>
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-[#5A6478] uppercase tracking-wider mb-1">Impact Statement</h5>
            <p className="text-xs text-[#5A6478] leading-relaxed">{data.impactStatement}</p>
          </div>
          <div className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-[#E2E6EA]">
            <div className="flex-1">
              <span className="block text-[10px] font-bold text-[#5A6478] uppercase tracking-wider">Target Date</span>
              <span className="text-xs font-semibold text-[#1A1A2E] flex items-center gap-1 mt-0.5">
                <Clock size={12} className="text-[#0069B4]" /> {data.targetDate ?? 'TBD'}
              </span>
            </div>
            {data.actualImpact && (
              <div className="flex-1 border-l border-[#E2E6EA] pl-3">
                <span className="block text-[10px] font-bold text-[#5A6478] uppercase tracking-wider">Actual Impact</span>
                <span className="text-xs font-bold text-green-600 flex items-center gap-1 mt-0.5">
                  <Target size={12} /> {data.actualImpact}
                </span>
              </div>
            )}
          </div>

          {/* Stage Move Controls */}
          <div className="flex gap-2 pt-1">
            {canRevert && (
              <button
                onClick={e => { e.stopPropagation(); onRevert(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5A6478] border border-[#E2E6EA] rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw size={12} /> Move Back
              </button>
            )}
            {canAdvance && (
              <button
                onClick={e => { e.stopPropagation(); onAdvance(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0069B4] rounded-lg hover:bg-[#005a9c] transition-colors"
              >
                Advance <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProcessImprovement: React.FC = () => {
  const { improvementStatuses, updateImprovementStatus, addToast } = useApp();

  const getStatus = (item: ImprovementType): ImprovementStatus =>
    improvementStatuses[item.id] ?? item.status;

  const handleAdvance = (item: ImprovementType) => {
    const curr = getStatus(item);
    const next = nextStatus[curr];
    if (next) {
      updateImprovementStatus(item.id, next);
      addToast({ type: 'success', message: `"${item.title}" moved to ${next}`, detail: `Advanced from ${curr} → ${next}.` });
    }
  };

  const handleRevert = (item: ImprovementType) => {
    const curr = getStatus(item);
    const prev = prevStatus[curr];
    if (prev) {
      updateImprovementStatus(item.id, prev);
      addToast({ type: 'info', message: `"${item.title}" moved back to ${prev}` });
    }
  };

  const completedCount = improvementInitiatives.filter(i => getStatus(i) === 'Completed').length;
  const activeCount    = improvementInitiatives.filter(i => { const s = getStatus(i); return s === 'In Progress' || s === 'Piloting'; }).length;

  const columnData = useMemo(() => {
    return columns.map(col => ({
      ...col,
      cards: improvementInitiatives.filter(i => getStatus(i) === col.status),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [improvementStatuses]);

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col gap-4">

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#003B7A] to-[#0069B4] p-6 rounded-xl shadow-md text-white flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transformation Portfolio</h2>
          <p className="text-blue-100 mt-1 max-w-2xl text-sm leading-relaxed">
            Active initiatives driving efficiency across the ALDI SÜD P2P landscape.
            Expand any card to see details and advance it through stages.
          </p>
        </div>
        <div className="flex gap-6 pr-4">
          <div className="text-center">
            <span className="block text-3xl font-bold">{activeCount}</span>
            <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">Active</span>
          </div>
          <div className="w-px bg-blue-400/50" />
          <div className="text-center">
            <span className="block text-3xl font-bold text-green-300">€4M+</span>
            <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">Targeted Savings</span>
          </div>
          <div className="w-px bg-blue-400/50" />
          <div className="text-center">
            <span className="block text-3xl font-bold text-amber-300">{completedCount}</span>
            <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">Completed</span>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-4 h-full min-w-[900px]">
          {columnData.map(column => (
            <div key={column.status} className="flex-1 flex flex-col min-w-[240px] h-full">
              <div className={`px-4 py-3 rounded-t-xl border-t-4 ${column.borderColor} ${column.bg} border-x border-[#E2E6EA] flex justify-between items-center`}>
                <h3 className={`font-bold text-sm flex items-center gap-2 ${column.headerText}`}>
                  {column.status === 'In Progress' && <Activity size={14} />}
                  {column.title}
                </h3>
                <span className="bg-white text-[#5A6478] text-xs font-bold px-2 py-0.5 rounded-full border border-[#E2E6EA]">
                  {column.cards.length}
                </span>
              </div>
              <div className="flex-1 bg-gray-50/60 border-x border-b border-[#E2E6EA] rounded-b-xl p-3 overflow-y-auto">
                {column.cards.map(card => (
                  <ImprovementCard
                    key={card.id}
                    data={card}
                    currentStatus={getStatus(card)}
                    onAdvance={() => handleAdvance(card)}
                    onRevert={() => handleRevert(card)}
                  />
                ))}
                {column.cards.length === 0 && (
                  <div className="h-28 flex items-center justify-center text-xs text-[#5A6478] border-2 border-dashed border-[#E2E6EA] rounded-xl bg-white mt-1">
                    No initiatives in this phase.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessImprovement;
