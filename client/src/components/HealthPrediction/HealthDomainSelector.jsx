import React from 'react';

const domainData = {
  diabetes: { icon: '🩸', name: 'Diabetes', color: 'from-purple-100 to-purple-50' },
  cardiovascular: { icon: '❤️', name: 'Cardiovascular', color: 'from-red-100 to-red-50' },
  liver: { icon: '🫁', name: 'Liver', color: 'from-green-100 to-green-50' },
  kidney: { icon: '🩺', name: 'Kidney', color: 'from-blue-100 to-blue-50' },
  mentalhealth: { icon: '🧠', name: 'Mental Health', color: 'from-indigo-100 to-indigo-50' }
};

export default function HealthDomainSelector({ domains, onSelect, selected }) {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {domains.map(domain => (
        <button
          key={domain}
          onClick={() => onSelect(domain)}
          className={`flex flex-col items-center justify-center p-4 w-32 h-32 rounded-xl transition-all duration-300 
            bg-gradient-to-br ${domainData[domain].color}
            ${selected === domain 
              ? 'ring-4 ring-primary shadow-lg transform scale-105' 
              : 'hover:shadow-md hover:scale-102'}`}
        >
          <span className="text-4xl mb-2">{domainData[domain].icon}</span>
          <span className="font-medium text-sm text-center">
            {domainData[domain].name}
          </span>
        </button>
      ))}
    </div>
  );
}