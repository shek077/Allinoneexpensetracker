import React, { useState, useRef } from 'react';
import { Person } from '../types';
import NeumorphicCard from './NeumorphicCard';
import { useTheme } from '../hooks/useTheme';
import { createGlobalRipple } from '../services/rippleEffect';

interface PeopleManagerProps {
  people: Person[];
  onAddPerson: (name: string) => void;
  onUpdatePerson: (person: Person) => void;
  onDeletePerson: (id: string) => void;
  onClose: () => void;
}

const PeopleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);


const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const ThemedNeumorphicInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
    const { theme } = useTheme();
    const themeClasses = {
        light: 'bg-light-bg text-gray-700 shadow-neumorphic-concave focus:ring-primary-mint',
        dark: 'bg-dark-bg text-gray-300 shadow-neumorphic-concave-dark focus:ring-primary-mint',
        lime: 'bg-lime-bg text-lime-text shadow-neumorphic-concave-lime focus:ring-primary-lime',
        rose: 'bg-rose-bg text-rose-text shadow-neumorphic-concave-rose focus:ring-primary-rose',
        ocean: 'bg-ocean-bg text-ocean-text shadow-neumorphic-concave-ocean focus:ring-primary-ocean',
        tangerine: 'bg-tangerine-bg text-tangerine-text shadow-neumorphic-concave-tangerine focus:ring-primary-tangerine',
        lavender: 'bg-lavender-bg text-lavender-text shadow-neumorphic-concave-lavender focus:ring-primary-lavender',
    };
    return (
        <input
            className={`w-full p-3 rounded-xl focus:outline-none focus:ring-2 ${themeClasses[theme]} ${className}`}
            {...props}
        />
    );
};

const PeopleManager: React.FC<PeopleManagerProps> = ({ people, onAddPerson, onUpdatePerson, onDeletePerson, onClose }) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [personToUpdate, setPersonToUpdate] = useState<Person | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && personToUpdate) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
            onUpdatePerson({ ...personToUpdate, iconUrl: loadEvent.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = (person: Person) => {
    setPersonToUpdate(person);
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
        onAddPerson(name.trim());
        setName('');
    }
  };

  const buttonThemeClasses = {
      light: {
          primary: 'bg-primary-mint text-white shadow-neumorphic-convex active:shadow-neumorphic-concave',
          default: 'shadow-neumorphic-convex active:shadow-neumorphic-concave',
      },
      dark: {
          primary: 'bg-primary-mint text-white shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
          default: 'shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark',
      },
      lime: {
          primary: 'bg-primary-lime text-white shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
          default: 'shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime',
      },
      rose: {
          primary: 'bg-primary-rose text-white shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
          default: 'shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose',
      },
      ocean: {
          primary: 'bg-primary-ocean text-white shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
          default: 'shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean',
      },
      tangerine: {
          primary: 'bg-primary-tangerine text-white shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
          default: 'shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine',
      },
      lavender: {
          primary: 'bg-primary-lavender text-white shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
          default: 'shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender',
      }
  };

  return (
    <NeumorphicCard className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
            <PeopleIcon className="w-7 h-7" />
            <h2 className="text-2xl font-bold text-center">Manage People</h2>
        </div>

        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
            {people.length > 0 ? people.map(person => (
                <NeumorphicCard type="concave" key={person.id} className="!p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button onClick={(e) => { createGlobalRipple(e); triggerFileUpload(person); }} className="w-10 h-10 rounded-full flex-shrink-0" title="Upload icon">
                            {person.iconUrl ? 
                                <img src={person.iconUrl} alt={person.name} className="w-10 h-10 rounded-full object-cover" /> :
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center font-bold text-lg">
                                    {person.name.charAt(0).toUpperCase()}
                                </div>
                            }
                        </button>
                        <p className="font-semibold">{person.name}</p>
                    </div>
                    <button onClick={(e) => { createGlobalRipple(e); onDeletePerson(person.id); }} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors" aria-label={`Delete ${person.name}`}>
                       <DeleteIcon className="w-5 h-5 text-red-500" />
                    </button>
                </NeumorphicCard>
            )) : <p className="text-center text-gray-500">No people added yet.</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Add New Person</h3>
            <div>
                <label htmlFor="person-name" className="sr-only">Person's Name</label>
                <ThemedNeumorphicInput 
                    id="person-name"
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="e.g. Jane Doe" 
                    required 
                />
            </div>
            <button type="submit" onClick={createGlobalRipple} className={`w-full font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].primary}`}>Add Person</button>
        </form>
        <div className="pt-4">
            <button type="button" onClick={(e) => { createGlobalRipple(e); onClose(); }} className={`w-full font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].default}`}>Close</button>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
    </NeumorphicCard>
  );
};

export default PeopleManager;