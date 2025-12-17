import React from 'react';
import { ModelMode } from '../types';

// --- AGENT AVATARS ---
// These avatars are designed to be symbolic of each agent's role.

export const AnalystAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

export const PersonaAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
    </svg>
);

export const EmpathyMapAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

export const ProblemSynthesizerAvatar: React.FC<{className?: string}> = ({className}) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-1.48 1.48M12 3l1.48 1.48M12 21l-1.48-1.48M12 21l1.48 1.48M3 12h18M3 12l1.48 1.48M3 12l1.48-1.48M21 12l-1.48 1.48M21 12l-1.48-1.48M9 9l-6 6m12 0l6-6m-6 6l6 6m-6-6l-6-6" />
    </svg>
);

export const VisionaryAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-11.25a6.01 6.01 0 00-1.5-11.25m-1.5 11.25a6.01 6.01 0 01-1.5 11.25m1.5-11.25v-5.25m0 5.25a6.01 6.01 0 00-1.5 11.25m3-11.25a6.01 6.01 0 011.5 11.25m0 0a6.01 6.01 0 011.5 11.25m-3-11.25a6.01 6.01 0 00-1.5-11.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75a3 3 0 116 0 3 3 0 01-6 0z" />
    </svg>
);

export const DevilsAdvocateAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
    </svg>
);

export const SteveJobsAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 15.75l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 21l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 24.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 21l1.035-.259a3.375 3.375 0 002.456-2.456L18 15.75z" />
    </svg>
);

export const SolutionSelectorAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ValuePropositionAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25v-8.25M12 4.875A2.625 2.625 0 1014.625 7.5H9.375A2.625 2.625 0 1012 4.875z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v12m0 0l-3-3m3 3l3-3m-3-3v-2.25a2.25 2.25 0 012.25-2.25h1.5a2.25 2.25 0 012.25 2.25V9.75m-6.75 0v-2.25a2.25 2.25 0 00-2.25-2.25h-1.5a2.25 2.25 0 00-2.25 2.25V9.75" />
    </svg>
);

export const ModelerAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2-2H6a2 2 0 01-2-2V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 4v16m4-16v16M4 10h16m-16 4h16" />
    </svg>
);

export const StorytellerAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v18M17 3v18M3 8h18M3 16h18" />
    </svg>
);

export const ForecasterAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h1.5c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125v-6.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.375 9.75c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125V9.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.375c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v13.5c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125V6.375z" />
    </svg>
);

export const StrategistAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12l-3-7-3 7 3 2 3-2z" />
    </svg>
);

export const RiskAvatar: React.FC<{className?: string}> = ({className}) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c2.396 0 4.6-1.004 6.166-2.666C19.796 17.418 21 14.826 21 12c0-2.826-1.204-5.418-2.834-7.084C16.6 3.254 14.396 2.25 12 2.25 9.604 2.25 7.4 3.254 5.834 4.916 4.204 6.582 3 9.174 3 12c0 2.826 1.204 5.418 2.834 7.084C7.4 20.746 9.604 21.75 12 21.75z" />
    </svg>
);

export const BlueprintAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25-2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V12" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12H12m0 0h3.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12V7.5" />
    </svg>
);

export const LaunchAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h9" />
    </svg>
);

export const PitchDeckAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5v-7.5M3.375 12v-7.5m0 7.5h17.25m-17.25 0a1.125 1.125 0 00-1.125 1.125M12 12a1.125 1.125 0 01-1.125-1.125V3.375m1.125 7.5a1.125 1.125 0 011.125-1.125V3.375m0 0a1.125 1.125 0 011.125 1.125m-2.25 0a1.125 1.125 0 01-1.125 1.125m1.125-2.25v7.5m1.125-7.5a1.125 1.125 0 00-1.125-1.125m1.125 1.125a1.125 1.125 0 011.125 1.125m-2.25 0a1.125 1.125 0 01-1.125 1.125m5.625-7.5v11.25a2.25 2.25 0 01-2.25 2.25H4.875a2.25 2.25 0 01-2.25-2.25V3.375a2.25 2.25 0 012.25-2.25h11.25a2.25 2.25 0 012.25 2.25z" />
    </svg>
);

export const EthicsOracleAvatar: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 21v-1.5m8.25-11.25H3.75M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3.75m16.5 0a9 9 0 01-9 9m0-9a9 9 0 00-9 9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const StarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="none" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);

export const DataPacketIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);


export const MagnifyingGlassIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

export const ArrowPathIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691L7.5 5.951m11.667 0l-1.167 1.167M11.25 5.951l-1.167-1.167m0 0L7.5 2.25l-2.5 2.5M16.023 9.348l-2.5-2.5M2.985 19.644l2.5 2.5m0 0l2.5-2.5m-2.5 2.5v-4.992" />
    </svg>
);

export const AdjustmentsHorizontalIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
);


// --- UTILITY ICONS ---
export const FilmIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v16.5h16.5V3.75H3.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6h16.5M8.25 3.75v16.5M15.75 3.75v16.5" />
    </svg>
);

export const DocumentArrowUpIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

export const DocumentArrowDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
);

export const DocumentTextIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
    </svg>
);

export const TableCellsIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h17.25c.621 0 1.125.504 1.125 1.125v12c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0V6.375M3.375 6.375h17.25m0 0V3.375c0-.621-.504-1.125-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125v3M10.5 19.5v-15m0 0h3m-3 0V3.375c0-.621-.504-1.125-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125v3m7.5 15v-15m0 0h3m-3 0V3.375c0-.621-.504-1.125-1.125-1.125h-1.5a1.125 1.125 0 00-1.125 1.125v3" />
    </svg>
);

export const PresentationChartBarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5v-7.5M3.375 12v-7.5m0 7.5h17.25m-17.25 0a1.125 1.125 0 00-1.125 1.125M12 12a1.125 1.125 0 01-1.125-1.125V3.375m1.125 7.5a1.125 1.125 0 011.125-1.125V3.375m-1.125 7.5a1.125 1.125 0 01-1.125 1.125M12 12h5.25m-5.25 0h-5.25m5.25 0v7.5m0-7.5a1.125 1.125 0 00-1.125-1.125V3.375m1.125 7.5a1.125 1.125 0 001.125-1.125V3.375m1.125 7.5a1.125 1.125 0 011.125 1.125m-2.25 0a1.125 1.125 0 01-1.125 1.125v7.5m1.125-7.5a1.125 1.125 0 011.125 1.125v7.5m-1.125-7.5a1.125 1.125 0 01-1.125-1.125V3.375m1.125 7.5a1.125 1.125 0 011.125-1.125V3.375" />
    </svg>
);

// App Title Avatar
export const XinovatesAvatar: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6B0F9C" />   {/* violet */}
                <stop offset="25%" stopColor="#E04595" />  {/* magenta */}
                <stop offset="75%" stopColor="#0047FF" />  {/* blue */}
                <stop offset="100%" stopColor="#00B9E8" /> {/* cyan */}
            </linearGradient>
            <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#logo-glow)">
            <path
                d="M50 45 C 20 45, 20 85, 50 85 C 80 85, 80 45, 50 45 C 20 45, 20 5, 50 5 C 80 5, 80 45, 50 45 Z"
                stroke="url(#logo-gradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            {/* Nodes at the four extreme points of the loops */}
            <circle cx="27" cy="65" r="4" fill="#6B0F9C" />
            <circle cx="73" cy="25" r="4" fill="#00B9E8" />
            <circle cx="27" cy="25" r="4" fill="#E04595" />
            <circle cx="73" cy="65" r="4" fill="#0047FF" />
        </g>
    </svg>
);


// General UI Icons
export const ArrowIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

export const ChevronRightIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);

export const XMarkIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const CheckCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ExclamationTriangleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
    </svg>
);

export const CopyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

export const CheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

export const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const QuestionMarkCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);

export const ArchiveBoxIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

export const ArrowLeftOnRectangleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l-3-3m0 0l-3 3m3-3V9" />
    </svg>
);

export const BookmarkSquareIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
    </svg>
);

export const LightBulbIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-11.25a6.01 6.01 0 00-1.5-11.25m-1.5 11.25a6.01 6.01 0 01-1.5 11.25m1.5-11.25v-5.25m0 5.25a6.01 6.01 0 00-1.5 11.25m3-11.25a6.01 6.01 0 011.5 11.25m0 0a6.01 6.01 0 011.5 11.25m-3-11.25a6.01 6.01 0 00-1.5-11.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75a3 3 0 116 0 3 3 0 01-6 0z" />
    </svg>
);

export const UserCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const BeakerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.038-.502.062-.752.062h-1.5c-1.24 0-2.25-1.01-2.25-2.25S5.26 0 6.5 0h1.5c.25 0 .5.024.752.062M9.75 3.104a2.25 2.25 0 00-2.25 2.25v4.507c0 .374.053.74.156 1.085L7.5 14.5M9.75 9.114c1.018-.124 2.062-.124 3.08 0l2.156 5.39a2.25 2.25 0 001.591.659h.752a2.25 2.25 0 002.25-2.25V6.354a2.25 2.25 0 00-2.25-2.25H16.5M9.75 9.114L12 3.5m0 0l2.25 5.614m-2.25-5.614a2.25 2.25 0 012.25 2.25v2.25" />
    </svg>
);

export const ChartPieIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
    </svg>
);

export const ShieldCheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
    </svg>
);

export const RocketLaunchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a6 6 0 01-5.84 7.38v-4.82m5.84-2.56L17.75 4.5 21.25 8.5 15.59 14.37zM9.75 8.87a6 6 0 01-5.84-2.56L1.25 10.5 4.75 14.5 9.75 8.87z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.04 14.37a6 6 0 01-5.84-7.38v4.82m5.84 2.56a6 6 0 01-5.84-7.38v4.82m5.84 2.56L4.25 21.5 7.75 17.5 6.04 14.37z" />
    </svg>
);

export const PuzzlePieceIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.66.538-1.198 1.197-1.198s1.197.537 1.197 1.198v1.5c0 .66-.538 1.197-1.197 1.197S14.25 8.247 14.25 7.587v-1.5zM14.25 18.087c0-.66.538-1.197 1.197-1.197s1.197.537 1.197 1.197v1.5c0 .66-.538 1.197-1.197 1.197S14.25 20.247 14.25 19.587v-1.5zM9.75 6.087c0-.66.538-1.198 1.197-1.198s1.197.537 1.197 1.198v1.5c0 .66-.538 1.197-1.197 1.197S9.75 8.247 9.75 7.587v-1.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 18.087c0-.66.538-1.197 1.197-1.197s1.197.537 1.197 1.197v1.5c0 .66-.538 1.197-1.197 1.197S9.75 20.247 9.75 19.587v-1.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.18 9.75c-.66 0-1.197.538-1.197 1.197v1.5c0 .66.537 1.197 1.197 1.197s1.197-.537 1.197-1.197v-1.5c0-.66-.537-1.197-1.197-1.197zM18.087 9.75c-.66 0-1.197.538-1.197 1.197v1.5c0 .66.537 1.197 1.197 1.197s1.197-.537 1.197-1.197v-1.5c0-.66-.537-1.197-1.197-1.197z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.18 18.087c-.66 0-1.197.538-1.197 1.197v1.5c0 .66.537 1.197 1.197 1.197s1.197-.537 1.197-1.197v-1.5c0-.66-.537-1.197-1.197-1.197zM18.087 18.087c-.66 0-1.197.538-1.197 1.197v1.5c0 .66.537 1.197 1.197 1.197s1.197-.537 1.197-1.197v-1.5c0-.66-.537-1.197-1.197-1.197z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12.813V3.75a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 3.75v9.063M6 12.813c0 .66-.537 1.197-1.197 1.197H3.75A2.25 2.25 0 011.5 11.25V7.5A2.25 2.25 0 013.75 5.25h1.053c.66 0 1.197.537 1.197 1.197v6.063z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12.813V20.25a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-7.437m12 0c0 .66.537 1.197 1.197 1.197h1.053a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25h-1.053c-.66 0-1.197.537-1.197 1.197v6.063z" />
    </svg>
);

export const UsersIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 00-12 0M6 12.75a5.25 5.25 0 1112 0 5.25 5.25 0 01-12 0zm6 5.25a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
    </svg>
);

export const BookOpenIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

export const ShareIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 100-2.186m0 2.186c-.18-.324-.283-.696-.283-1.093s.103-.77.283-1.093m0 2.186l-9.566-5.314" />
    </svg>
);

export const ChipIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
);

export const CrosshairsIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12m-3 0a3 3 0 106 0 3 3 0 10-6 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 12m-3 0a3 3 0 106 0 3 3 0 10-6 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6m-3 0a3 3 0 106 0 3 3 0 10-6 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18m-3 0a3 3 0 106 0 3 3 0 10-6 0" />
    </svg>
);

export const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 15.75l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 21l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 24.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 21l1.035-.259a3.375 3.375 0 002.456-2.456L18 15.75z" />
    </svg>
);

export const ScaleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.036.243c-2.132 0-4.14-.818-5.62-2.25L12 14.47l-1.22 1.22c-1.48 1.432-3.488 2.25-5.62 2.25a5.988 5.988 0 01-2.036-.243c-.483-.174-.711-.703-.59-1.202L5.25 4.97m13.5 0c-1.01.143-2.01.317-3 .52m3-.52c-1.01-.143-2.01-.317-3-.52m0 0c-2.291 0-4.545.16-6.75.47m11.25 0c-1.472 0-2.882.265-4.185.75M5.25 4.97c-1.472 0-2.882.265-4.185.75M12 4.5c-1.472 0-2.882.265-4.185.75" />
    </svg>
);

export const TrashIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09a2.09 2.09 0 00-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const AcademicCapIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM17.25 15a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    </svg>
);

export const ClockIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CloudIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-2.666-5.113 5.25 5.25 0 00-10.512 0 3 3 0 00-2.666 5.113A4.5 4.5 0 002.25 15z" />
    </svg>
);

export const BoltIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

export const HeartIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

export const FaceSmileIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4.5 4.5 0 01-6.364 0M9 10.5h.008v.008H9v-.008zm6 0h.008v.008H15v-.008z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const IdentificationIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6zM3.75 9h19.5m-16.5 5.25h6m-6 2.25h6m3-3.75l3 3m0 0l3-3m-3 3V1.5m-9 5.25h10.5" />
    </svg>
);

export const TargetIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m-6.75-9H3m15.75 0H21m-6-6.75L6.343 6.343m11.314 11.314L15.657 15.657" />
    </svg>
);

export const KeyIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
);

export const TagIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9h.008v.008H6V9z" />
    </svg>
);

export const TrendingUpIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.291 3.292m3.291-3.292L19.5 3" />
    </svg>
);

export const LinkIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);

export const ThumbsDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H6.5a.75.75 0 01-.75-.75V11.25a.75.75 0 01.75-.75h.133c.291.07.65.141.99.141z" />
    </svg>
);

export const ThumbsUpIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H6.5a.75.75 0 01-.75-.75V11.25a.75.75 0 01.75-.75h.133c.291.07.65.141.99.141z" transform="scale(1, -1) translate(0, -21)" />
    </svg>
);

export const FlagIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
    </svg>
);

export const GiftIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.095c.523-.217 1.13-.341 1.777-.341 3.314 0 6 2.686 6 6 0 .647-.124 1.254-.341 1.777M12.75 3.095a2.25 2.25 0 00-2.223.46c-.712.645-1.09.167-1.12.127-.042-.054-.084-.112-.127-.179a2.25 2.25 0 00-3.182-3.182c-.066.042-.124.084-.179.127-.04.03-.518.412-1.12.127a2.25 2.25 0 00-.46-2.223M12.75 3.095c-.523-.217-1.13-.341-1.777-.341a6 6 0 00-5.656 8.666c.217.523.341 1.13.341 1.777a6 6 0 008.666 5.656c.647 0 1.254-.124 1.777-.341m-1.332-1.332c.523.217 1.13.341 1.777.341a6 6 0 005.656-8.666c-.217-.523-.341-1.13-.341-1.777a6 6 0 00-8.666-5.656c-.647 0-1.254.124-1.777.341M12.75 3.095L11.418 4.427M8.25 6.75L6.918 8.082" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.002 9.002 0 008.666-5.656M12 21a9.002 9.002 0 01-8.666-5.656M12 21v-6.332c0-.523.124-1.037.341-1.5M12 14.668c.217-.463.341-.977.341-1.5V6.332" />
    </svg>
);

export const ChartBarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h1.5c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125v-6.75zM9.375 9.75c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125V9.75zM15.75 6.375c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v13.5c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125V6.375z" />
    </svg>
);

export const CubeTransparentIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
);

export const ExclamationCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
);

export const PaperAirplaneIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L6 12z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h9" />
    </svg>
);

export const ChatBubbleLeftRightIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.372a2.25 2.25 0 01-2.184-2.193v-4.286c0-.97.616-1.813 1.5-2.097m0 0A2.25 2.25 0 0015.75 6H5.25A2.25 2.25 0 003 8.25v4.5A2.25 2.25 0 005.25 15h3.75m0 0c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.372a2.25 2.25 0 01-2.184-2.193v-4.286c0-.97.616-1.813 1.5-2.097m0 0A2.25 2.25 0 005.25 6H15" />
    </svg>
);
