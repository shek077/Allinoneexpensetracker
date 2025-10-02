import React, { useEffect } from 'react';
import { Alert } from '../types';
import NeumorphicCard from './NeumorphicCard';

const WarningIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);

const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface AlertsProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

const AlertItem: React.FC<{ alert: Alert; onDismiss: (id: string) => void }> = ({ alert, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(alert.id);
    }, 7000); // Auto-dismiss after 7 seconds

    return () => clearTimeout(timer);
  }, [alert.id, onDismiss]);

  const getAlertDetails = () => {
    switch(alert.type) {
        case 'warning':
            const isSubscriptionWarning = alert.message.toLowerCase().includes('subscription');
            return {
                icon: <WarningIcon className="w-6 h-6" />,
                color: 'text-orange-500',
                title: isSubscriptionWarning ? 'Subscription Due Soon' : 'Budget Warning'
            };
        case 'error':
            return {
                icon: <ErrorIcon className="w-6 h-6" />,
                color: 'text-red-500',
                title: 'Budget Exceeded'
            };
        case 'info':
            return {
                icon: <InfoIcon className="w-6 h-6" />,
                color: 'text-blue-500',
                title: 'Subscription Renewal'
            };
    }
  }

  const details = getAlertDetails();

  return (
    <NeumorphicCard className="w-full max-w-sm p-4 flex items-start gap-4 animate-fade-in-right">
      <div className={`flex-shrink-0 ${details.color}`}>
        {details.icon}
      </div>
      <div className="flex-grow text-sm">
        <p className="font-bold">{details.title}</p>
        <p className="mt-1">{alert.message}</p>
      </div>
      <button onClick={() => onDismiss(alert.id)} className="-mt-2 -mr-2 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
        <CloseIcon className="w-4 h-4" />
      </button>
      <style>{`
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </NeumorphicCard>
  );
};

const Alerts: React.FC<AlertsProps> = ({ alerts, onDismiss }) => {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-4">
      {alerts.map(alert => (
        <AlertItem key={alert.id} alert={alert} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default Alerts;