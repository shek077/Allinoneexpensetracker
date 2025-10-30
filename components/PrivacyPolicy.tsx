import React from 'react';
import NeumorphicCard from './NeumorphicCard';
import { useTheme } from '../hooks/useTheme';
import { createGlobalRipple } from '../services/rippleEffect';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  const { theme } = useTheme();

  const buttonThemeClasses = {
      light: { default: 'shadow-neumorphic-convex active:shadow-neumorphic-concave' },
      dark: { default: 'shadow-neumorphic-convex-dark active:shadow-neumorphic-concave-dark' },
      lime: { default: 'shadow-neumorphic-convex-lime active:shadow-neumorphic-concave-lime' },
      rose: { default: 'shadow-neumorphic-convex-rose active:shadow-neumorphic-concave-rose' },
      ocean: { default: 'shadow-neumorphic-convex-ocean active:shadow-neumorphic-concave-ocean' },
      tangerine: { default: 'shadow-neumorphic-convex-tangerine active:shadow-neumorphic-concave-tangerine' },
      lavender: { default: 'shadow-neumorphic-convex-lavender active:shadow-neumorphic-concave-lavender' }
  };

  return (
    <NeumorphicCard className="w-full max-w-2xl max-h-[80vh] flex flex-col" glass>
      <h2 className="text-2xl font-bold mb-6 text-center">Privacy Policy</h2>
      <div className="space-y-4 text-sm overflow-y-auto pr-2">
        <p><strong>Effective Date:</strong> {new Date().toLocaleDateString()}</p>
        
        <h3 className="font-bold text-lg pt-2">1. Introduction</h3>
        <p>Welcome to ExpenseTracker. We are committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our web application. By using our service, you agree to the collection and use of information in accordance with this policy.</p>

        <h3 className="font-bold text-lg pt-2">2. Information We Collect</h3>
        <p>This application is designed with your privacy as a top priority. We do not collect, transmit, or store any of your personal information on our servers. All data you enter into the application, including but not limited to:</p>
        <ul className="list-disc list-inside pl-4">
            <li>Transactions (income and expenses)</li>
            <li>Budget goals</li>
            <li>Categories, tags, and people</li>
            <li>Application settings and preferences</li>
        </ul>
        <p>...is stored exclusively on your own device within your web browser's local storage.</p>

        <h3 className="font-bold text-lg pt-2">3. How We Use Your Information</h3>
        <p>Since we do not collect your information, we do not use it for any purpose other than the core functionality of the application on your device. The data stored locally is used to:</p>
        <ul className="list-disc list-inside pl-4">
            <li>Display your financial data to you.</li>
            <li>Calculate summaries, balances, and budget progress.</li>
            <li>Generate charts and reports for your viewing.</li>
            <li>Remember your settings for a personalized experience.</li>
        </ul>
        
        <h3 className="font-bold text-lg pt-2">4. Data Storage and Security</h3>
        <p>Your data is stored in your browser's <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank" rel="noopener noreferrer" className="underline">LocalStorage</a>. This means the data is sandboxed to your browser on your device and is not accessible by us or any other website. The security of this data is dependent on the security of your device and browser. Clearing your browser's cache or storage may permanently delete all your application data.</p>
        
        <h3 className="font-bold text-lg pt-2">5. Data Sharing and Third Parties</h3>
        <p>We do not share your data with any third parties. The application does not include any third-party analytics, advertising trackers, or data collection services.</p>
        
        <h3 className="font-bold text-lg pt-2">6. Your Rights and Data Control</h3>
        <p>You have complete control over your data. You can:</p>
        <ul className="list-disc list-inside pl-4">
            <li><strong>Access and View:</strong> All your data is visible within the app.</li>
            <li><strong>Modify:</strong> You can edit or update any transaction or setting at any time.</li>
            <li><strong>Delete:</strong> You can delete individual transactions or use the "Reset App" feature to permanently erase all your data from your device. This action is irreversible.</li>
        </ul>
        
        <h3 className="font-bold text-lg pt-2">7. Changes to This Privacy Policy</h3>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
        
        <h3 className="font-bold text-lg pt-2">8. Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please note that this is a demonstration application and does not have a dedicated support channel.</p>
      </div>

      <div className="flex justify-center pt-6 mt-auto">
        <button 
          type="button" 
          onClick={(e) => { createGlobalRipple(e); onClose(); }} 
          className={`w-full max-w-xs font-bold py-3 px-4 rounded-xl transform active:scale-95 transition-all duration-200 ${buttonThemeClasses[theme].default}`}
        >
          Close
        </button>
      </div>
    </NeumorphicCard>
  );
};

export default PrivacyPolicy;
